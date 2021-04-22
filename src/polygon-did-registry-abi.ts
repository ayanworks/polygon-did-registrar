export const polygonDIDRegistryABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "id",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "doc",
        "type": "string"
      }
    ],
    "name": "CreateDID",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "id",
        "type": "address"
      }
    ],
    "name": "DeleteDID",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "id",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "doc",
        "type": "string"
      }
    ],
    "name": "UpdateDID",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_id",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_doc",
        "type": "string"
      }
    ],
    "name": "createDID",
    "outputs": [
      {
        "internalType": "address",
        "name": "controller",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "created",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "updated",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "did_doc",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "_id",
        "type": "address"
      }
    ],
    "name": "getDID",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_id",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_doc",
        "type": "string"
      }
    ],
    "name": "updateDID",
    "outputs": [
      {
        "internalType": "address",
        "name": "controller",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "created",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "updated",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "did_doc",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_id",
        "type": "address"
      }
    ],
    "name": "deleteDID",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
