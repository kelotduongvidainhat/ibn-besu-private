// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AccountAllowlist
 * @dev Implements Hyperledger Besu on-chain account permissioning.
 * Only whitelisted accounts are allowed to send transactions to the network.
 */
contract AccountAllowlist is Ownable {
    mapping(address => bool) public isAllowed;

    event AccountStatusChanged(address indexed account, bool status);

    constructor(address initialOwner) Ownable(initialOwner) {
        // Owner (Backend Admin Wallet) should be allowed by default to manage the list
        isAllowed[initialOwner] = true;
        emit AccountStatusChanged(initialOwner, true);
    }

    /**
     * @dev Add or remove an account from the allowlist.
     */
    function setAccountStatus(address account, bool status) public onlyOwner {
        isAllowed[account] = status;
        emit AccountStatusChanged(account, status);
    }

    /**
     * @dev Mandatory interface for Hyperledger Besu on-chain permissioning.
     * Besu calls this function to decide if a transaction should be accepted.
     */
    function transactionAllowed(
        address sender,
        address, // target
        uint256, // value
        uint256, // gasPrice
        uint256, // gasLimit
        bytes calldata // payload
    ) external view returns (bool) {
        return isAllowed[sender];
    }
}
