// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MockERC20.sol";

contract MockUSDC is MockERC20 {
    uint8 private constant DECIMALS = 6;  // USDC 使用 6 位小数

    constructor(uint256 initialSupply) MockERC20("USD Coin", "USDC", initialSupply) {
    }

    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }
} 