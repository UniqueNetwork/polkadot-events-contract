// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {CrossAddress} from "@unique-nft/contracts/TokenMinter.sol";
import {EventConfig} from "./EventConfig.sol";

interface IEventManager {
    event EventCreated(uint256 collectionId, address collectionAddress);
    event TokenClaimed(CrossAddress indexed owner, uint256 indexed collectionId, uint256 tokenId);

    error InvalidCreationFee();
    error EventIsNotInProgress();

    function createCollection(
        string memory _name,
        string memory _description,
        string memory _symbol,
        EventConfig memory _eventConfig
    ) external payable;

    function createToken(address _collectionAddress, CrossAddress memory _owner) external;

    function getCollectionCreationFee() external view returns (uint256);

    function getEventConfig(address _collectionAddress) external view returns (EventConfig memory);
}
