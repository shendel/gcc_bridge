// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IERC20Burnable {
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function burn(uint256 value) external;
    function burnFrom(address account, uint256 value) external;
    function balanceOf(address account) external view returns (uint256);
    function mint(address account, uint256 value) external;
}