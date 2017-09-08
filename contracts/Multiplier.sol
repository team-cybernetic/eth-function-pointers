pragma solidity ^0.4.11;

import "./Calculator.sol";

contract Multiplier is Calculator {
    uint private factor = 2;

    function calc(uint num) public returns (uint) {
        return (num * factor);
    }

    function setFactor(uint newFactor) public {
        factor = newFactor;
        FactorSet(msg.sender, factor);
    }

    function getFactor() public returns (uint) {
        return (factor);
    }
}


