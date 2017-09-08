pragma solidity ^0.4.11;

import "./Calculator.sol";

contract Adder is Calculator {
    uint private factor = 3;

    function calc(uint num) public returns (uint) {
        return (num + factor);
    }

    function setFactor(uint newFactor) public {
        factor = newFactor;
        FactorSet(msg.sender, factor);
    }

    function getFactor() public returns (uint) {
        return (factor);
    }
}


