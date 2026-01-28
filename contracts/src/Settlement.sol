// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IbnAsset.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Settlement
 * @dev Handles specialized asset settlements and transfers for the MVP.
 */
contract Settlement is Ownable {
    IbnAsset public asset;

    event SettlementProcessed(address indexed sender, address indexed receiver, uint256 amount);

    constructor(address assetAddress, address initialOwner) Ownable(initialOwner) {
        asset = IbnAsset(assetAddress);
    }

    /**
     * @dev Simple settlement function: transfers assets from sender to receiver.
     * Note: Sender must have approved this contract.
     */
    function processSettlement(address receiver, uint256 amount) public {
        require(asset.transferFrom(msg.sender, receiver, amount), "Settlement: Transfer failed");
        emit SettlementProcessed(msg.sender, receiver, amount);
    }
}
