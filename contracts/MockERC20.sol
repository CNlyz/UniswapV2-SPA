// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockERC20 is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    // 允许任何人铸造代币（仅用于测试目的）
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    // 允许任何人销毁自己的代币
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
} 