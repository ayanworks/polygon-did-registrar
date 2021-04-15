const PolygonDIDRegistry = artifacts.require("PolygonDIDRegistry");

module.exports = function(deployer){
    deployer.deploy(PolygonDIDRegistry);
};