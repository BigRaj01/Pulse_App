// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StreamSettlement {
    event StreamSettled(
        string songId,
        address indexed listener,
        address indexed artist,
        uint256 amount,
        uint256 timestamp
    );

    function recordStream(
        string calldata songId,
        address listener,
        address artist,
        uint256 amount
    ) external {
        emit StreamSettled(songId, listener, artist, amount, block.timestamp);
    }
}