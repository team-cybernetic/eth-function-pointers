var Adder = artifacts.require("./Adder.sol");
var Multiplier = artifacts.require("./Multiplier.sol");
var FunctionPointers = artifacts.require("./FunctionPointers.sol");

module.exports = function(deployer) {
    deployer.deploy([
        Adder,
        Multiplier,
    ]).then(() => {
        deployer.deploy(FunctionPointers, Adder.address, Multiplier.address);
    });
};
