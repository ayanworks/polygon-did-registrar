# Polygon DID Method

The polygon DID method library uses Ethereum based addresses as fully functional DID’s or Decentralized identifiers, on the Polygon network. The following allows one to create a key Pair based and facilitates its storage on the registry smart contract, deployed on Polygon chain.
Third party users can use this to create polygon DID identities. It allows the controller to perform actions like resolve, update and delete by encapsulating polygonDID registry and PolygonDID resolver.
The DID identifier allows the controller to resolve DID document for usage in different scenarios.
 
### Example of polygon DID document resolved using PolygonDIDResolver:

```{
    "@context": "https://w3id.org/did/v1",
    "id": "did:polygon:0xdce5306fb5f9ba6797546dcd2e11eb5c5201bfeb",
    "publicKey": [
        {
            "id": "did:polygon:0xdce5306fb5f9ba6797546dcd2e11eb5c5201bfeb#keys-1",
            "type": "EcdsaSecp256k1VerificationKey2019",
            "owner": "did:polygon:0xdce5306fb5f9ba6797546dcd2e11eb5c5201bfeb",
            "ethereumAddress": "0xdce5306fb5f9ba6797546dcd2e11eb5c5201bfeb"
        }
    ]
}
```

# DID Method or DID schema

The DID method is a specific implementation of a DID scheme that will be identified by method name. For this case the method name is “polygon”, and the identifier is an Ethereum address.

## The DID for Polygon looks like:

```
did:polygon:0xdce5306fb5f9ba6797546dcd2e11eb5c5201bfeb
```
## DID On-Chain

Every DID on chain has the same structure, defined as:

```struct PolyDID{
        address controller;
        uint created;
        uint updated;
        string doc;
    }
```
Here, ‘controller’ is the address of the person who creates and manages the DID, ‘created’ holds the timestamp of the block when DID was created, ‘updated’ initially holds the timestamp of when the DID was created, but is updated if the controller updates the DID on chain, and ‘doc’ holds the entire DID document in form of string.

# DID Operations

## Create

Creating a DID refers to generation of a DID uri, based on either a newly generated wallet or user's existing wallet. Note that the wallet should hold Matic tokens.

Can be invoked using 2 methods

Method 1: With user's perosonal privateKey

```
import { createDID } from "polygon-did-registrar";
const txHash = await createDID(privateKey);
```

Method 2: Without a privateKey

```
import { createDID } from "polygon-did-registrar";
const txHash = await createDID();
```
The function returns, address, publicKey (base58 format), privateKey and DID uri.

## Register

Register of DID is done by logging the transaction on the polygon-register smart contract, by invoking

```
import { registerDID } from "polygon-did-registrar";
const txHash = await registerDID(did, privateKey, url?, contractAddress?);
```
The function returns a txhash and DID uri on successful execution.
 


## Update

The DID controller requests for the update functionality, if the controller wishes to edit the did doc store on the ledger using :

```
import { updateDidDoc } from "polygon-did-registrar";
const txHash = await updateDidDoc(did, didDoc, privateKey, url?, contractAddress?);
```

## Delete

To remove the instance of DID from the ledger the above function is used as follows :

```
import { deleteDidDoc } from "polygon-did-registrar";
const txHash = await deleteDidDoc(did, privateKey, url, contractAddress);
```


