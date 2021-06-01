const SimpleStorage = artifacts.require("SimpleStorage");
const BankDapp = artifacts.require("BankDapp");

module.exports = function (deployer) {
  deployer.deploy(BankDapp);
  deployer.deploy(SimpleStorage);
};