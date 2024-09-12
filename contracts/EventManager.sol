// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {UniqueV2TokenMinter} from "unique-contracts/UniqueV2TokenMinter.sol";
import {UniqueV2CollectionMinter} from "unique-contracts/UniqueV2CollectionMinter.sol";

contract EventManager is UniqueV2CollectionMinter, UniqueV2TokenMinter {
    ///@dev all token properties will be mutable for collection admin
    constructor() payable UniqueV2CollectionMinter(true, false, true) {}
}
