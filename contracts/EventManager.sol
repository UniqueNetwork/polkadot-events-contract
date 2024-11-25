// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {TokenMinter, Attribute, CrossAddress, UniqueNFT} from "@unique-nft/contracts/TokenMinter.sol";
import {CollectionMinter} from "@unique-nft/contracts/CollectionMinter.sol";
import {Property, CollectionMode, TokenPropertyPermission, CollectionLimitValue, CollectionLimitField, CollectionNestingAndPermission} from "@unique-nft/solidity-interfaces/contracts/CollectionHelpers.sol";
import {SponsoringModeT} from "@unique-nft/solidity-interfaces/contracts/ContractHelpers.sol";
import {EventConfig} from "./EventConfig.sol";
import {IEventManager} from "./IEventManager.sol";

contract EventManager is CollectionMinter, TokenMinter, IEventManager {
    uint256 private s_collectionCreationFee;
    mapping(address collection => EventConfig) private s_eventConfigOf;

    ///@dev all token properties will be mutable for collection admin
    constructor(uint256 _collectionCreationFee) payable CollectionMinter(true, true, false) {
        s_collectionCreationFee = _collectionCreationFee;
    }

    function createCollection(
        string memory _name,
        string memory _description,
        string memory _symbol,
        EventConfig memory _eventConfig
    ) external payable {
        if (msg.value != s_collectionCreationFee) revert InvalidCreationFee();

        uint256 limitCount = _eventConfig.soulbound ? 2 : 1;
        CollectionLimitValue[] memory collectionLimits = new CollectionLimitValue[](limitCount);

        collectionLimits[0] = CollectionLimitValue({
            field: CollectionLimitField.AccountTokenOwnership,
            value: _eventConfig.accountLimit
        });

        // if soulbound transfers are not allowed
        if (_eventConfig.soulbound) {
            collectionLimits[1] = CollectionLimitValue({field: CollectionLimitField.TransferEnabled, value: 0});
        }

        address collectionAddress = _createCollection(
            _name,
            _description,
            _symbol,
            _eventConfig.collectionCoverImage,
            CollectionNestingAndPermission({token_owner: false, collection_admin: false, restricted: new address[](0)}),
            collectionLimits,
            new Property[](0),
            new TokenPropertyPermission[](0)
        );

        UniqueNFT collection = UniqueNFT(collectionAddress);

        // Set collection sponsorship
        // All transaction fees will be covered by the EventManager (this) contract
        collection.setCollectionSponsorCross(CrossAddress({eth: address(this), sub: 0}));
        collection.confirmCollectionSponsorship();

        // Save collection config
        EventConfig storage eventConfig = s_eventConfigOf[collectionAddress];

        eventConfig.startTimestamp = _eventConfig.startTimestamp;
        eventConfig.endTimestamp = _eventConfig.endTimestamp;
        eventConfig.tokenImage = _eventConfig.tokenImage;

        for (uint i = 0; i < _eventConfig.attributes.length; i++) {
            eventConfig.attributes.push(_eventConfig.attributes[i]);
        }

        emit EventCreated(COLLECTION_HELPERS.collectionId(collectionAddress), collectionAddress);
    }

    function createToken(address _collectionAddress, CrossAddress memory _owner) external {
        EventConfig memory collectionEvent = s_eventConfigOf[_collectionAddress];

        // 1. Check if the event has started and not finished yet
        if (!collectionEvent.inProgress()) revert EventIsNotInProgress();

        // 2. Create NFT
        uint256 tokenId = _createToken(
            _collectionAddress,
            collectionEvent.tokenImage,
            collectionEvent.attributes,
            _owner
        );

        emit TokenClaimed(_owner, COLLECTION_HELPERS.collectionId(_collectionAddress), tokenId);
    }

    function getCollectionCreationFee() external view returns (uint256) {
        return s_collectionCreationFee;
    }

    function getEventConfig(address _collectionAddress) external view returns (EventConfig memory) {
        return s_eventConfigOf[_collectionAddress];
    }
}
