var Marketplace = artifacts.require("./Marketplace.sol");
var Ownable = artifacts.require("./zeppelin_library/Ownable");
var Pausable = artifacts.require("./zeppelin_library/Pausable");
var SafeMath = artifacts.require("./zeppelin_library/SafeMath");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Pausable);
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, Marketplace);
  deployer.deploy(Marketplace);
};
