pragma solidity ^0.4.11;

contract Calculator {

    event FactorSet(address indexed sender, uint newFactor);

    function calc(uint num) public returns (uint);
    function getFactor() public returns (uint);
    function setFactor(uint newFactor);
}
