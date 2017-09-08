pragma solidity ^0.4.11;

import "./Calculator.sol";

contract FunctionPointers {
    bool private add = true;

    uint private num = 0;

    Calculator private adder;
    Calculator private multiplier;
    Calculator private callback;

    event Swapped(address indexed sender);
    event Calculated(address indexed sender, uint numIn, bool added, uint numOut);
    event FactorSet(address indexed sender, uint newFactor);

    function FunctionPointers(address _adder, address _multiplier) {
        adder = Calculator(_adder);
        multiplier = Calculator(_multiplier);

        callback = adder;
    }

    function doIt(uint _num) public returns (uint) {
        num += callback.calc(_num);
        Calculated(msg.sender, _num, add, num);
        return (num);
    }

    function swapIt() public {
        if (add) {
            callback = multiplier;
        } else {
            callback = adder;
        }
        add = !add;
        Swapped(msg.sender);
    }

    function getNum() public returns (uint) {
        return (num);
    }

    function getAdd() public returns (bool) {
        return (add);
    }

    function getFactor() public returns (uint) {
        return (callback.getFactor());
    }

    function setFactor(uint newFactor) public {
        callback.setFactor(newFactor);
        FactorSet(msg.sender, newFactor);
    }
}
