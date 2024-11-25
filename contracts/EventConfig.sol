// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Attribute, CrossAddress} from "@unique-nft/contracts/TokenMinter.sol";

struct EventConfig {
    uint256 startTimestamp;
    uint256 endTimestamp;
    uint256 accountLimit;
    string collectionCoverImage;
    string tokenImage;
    bool soulbound;
    Attribute[] attributes;
    CrossAddress owner;
}

using {inProgress} for EventConfig global;

function inProgress(EventConfig memory _eventConfig) view returns (bool) {
    return _eventConfig.startTimestamp <= block.timestamp && _eventConfig.endTimestamp >= block.timestamp;
}
