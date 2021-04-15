pragma solidity 0.5.1;

contract PolygonDIDRegistry {
    struct PolyDID{
        address controller;
        uint created;
        uint updated;
        string doc;
    }
    modifier onlyController(address _id) {
        require(did[_id].controller == msg.sender, "sender has no control of this DID");
        _;
    }

    mapping(address => PolyDID) did;
    event CreateDID(address id, string doc);
    event UpdateDID(address id, string doc);
    event DeleteDID(address id);

    function createDID(address _id, string memory _doc) public returns(address){

        did[_id].controller = msg.sender;
        did[_id].created = now;
        did[_id].updated = now;
        did[_id].doc = _doc;
        emit CreateDID(_id, _doc);
        return _id;
    }

    function getDID(address _id) public view returns(string memory){
        return did[_id].doc;
    }

    function updateDID(address _id, string memory _doc) public onlyController(_id){
        did[_id].doc = _doc;
        did[_id].updated = now;
        emit UpdateDID(_id, _doc);
    }

    function deleteDID(address _id) public onlyController(_id){
        delete did[_id];
        emit DeleteDID(_id);
    }
}