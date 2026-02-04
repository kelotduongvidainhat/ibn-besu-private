// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ImperialMessenger {
    string public lastMessage;
    address public lastSender;
    uint256 public totalMessages;

    event MessageSent(address indexed sender, string message);

    function sendMessage(string memory _message) public {
        lastMessage = _message;
        lastSender = msg.sender;
        totalMessages++;
        
        emit MessageSent(msg.sender, _message);
    }
}
