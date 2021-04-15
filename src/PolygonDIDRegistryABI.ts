export const polygonDIDRegistryABI =[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "id",
        "type": "address"
      },
      {
        "indexed": false,
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
        "name": "id",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "doc",
        "type": "string"
      }
    ],
    "name": "UpdateDID",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "id",
        "type": "address"
      }
    ],
    "name": "DeleteDID",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_id",
        "type": "address"
      },
      {
        "name": "_doc",
        "type": "string"
      }
    ],
    "name": "createDID",
    "outputs": [
      {
        "name": "",
        "type": "address"
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
        "name": "_id",
        "type": "address"
      }
    ],
    "name": "getDID",
    "outputs": [
      {
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
        "name": "_id",
        "type": "address"
      },
      {
        "name": "_doc",
        "type": "string"
      }
    ],
    "name": "updateDID",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
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
]