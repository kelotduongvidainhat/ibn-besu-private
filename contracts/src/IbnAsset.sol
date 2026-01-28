// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IbnAsset
 * @dev Generic ERC20 token for tokenizing assets in the IBN private network.
 */
contract IbnAsset is ERC20, ERC20Permit, Ownable {
    constructor(string memory name, string memory symbol, address initialOwner)
        ERC20(name, symbol)
        ERC20Permit(name)
        Ownable(initialOwner)
    {}

    /**
     * @dev Function to mint tokens. Only the owner can call this.
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
