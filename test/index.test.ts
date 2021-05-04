import { testDid, updateDidDocument, privateKey, network } from "./test.data";
import { registerDID, createDID } from '../src/polygon-did-registrar';
import { updateDidDoc } from '../src/polygon-did-update';
import { deleteDidDoc } from '../src/polygon-did-delete';
import { BaseResponse } from "../src/base-response";

jest.setTimeout(30000);
let polygonDID: string;

describe("test create did function", () => {

  let createDidRes: BaseResponse;

  it('should be privateKey for create DID', async () => {

    await expect(privateKey).not.toBeNull();
    await expect(privateKey).not.toBe('');
    await expect(privateKey.length).toBe(66);
    await expect(privateKey.slice(0, 2)).toMatch('0x');

    if (network === 'testnet') {
      await expect(network).not.toBeNull();
      await expect(network).not.toBe('');
      await expect(network).toMatch('testnet');
    } else {
      await expect(network).not.toBeNull();
      await expect(network).not.toBe('');
      await expect(network).toMatch('mainnet');
    }
  })

  beforeAll(async () => {
    createDidRes = await createDID(network, privateKey);
    return true;
  })

  it('should get address', async () => {
    await expect(createDidRes.data.address).toBeDefined();
    await expect(createDidRes.data.address).not.toBeNull();
    await expect(createDidRes.data.address).not.toBe('');
    await expect(createDidRes.data.address.slice(0, 2)).toMatch('0x');
    await expect(createDidRes.data.address.length).toBe(42);
  })

  it('should get public key base58', async () => {
    await expect(createDidRes.data.publicKeyBase58).toBeDefined();
    await expect(createDidRes.data.publicKeyBase58).not.toBeNull();
    await expect(createDidRes.data.publicKeyBase58).not.toBe('');
  })

  it('should get polygon DID', async () => {

    if (createDidRes && createDidRes.data && createDidRes.data.did.split(':')[2] === 'testnet') {

      await expect(createDidRes.data.did).toBeDefined();
      await expect(createDidRes.data.did).not.toBeNull();
      await expect(createDidRes.data.did).not.toBe('');
      await expect(createDidRes.data.did.slice(0, 19)).toMatch('did:polygon:testnet');
      await expect(createDidRes.data.did.slice(20, 22)).toMatch('0x');
      await expect(createDidRes.data.did.split(":")[3].length).toBe(42);

      polygonDID = createDidRes.data.did;
    } else {
      await expect(createDidRes.data.did).toBeDefined();
      await expect(createDidRes.data.did).not.toBeNull();
      await expect(createDidRes.data.did).not.toBe('');
      await expect(createDidRes.data.did.slice(0, 12)).toMatch('did:polygon');
      await expect(createDidRes.data.did.slice(12, 14)).toMatch('0x');
      await expect(createDidRes.data.did.split(":")[2].length).toBe(42);

      polygonDID = createDidRes.data.did;
    }
  })
})


describe("test register DID function", () => {

  let registerDidRes: BaseResponse;

  it('should be polygon DID for register DID', async () => {

    await expect(polygonDID).not.toBeNull();
    await expect(polygonDID).not.toBe('');
    await expect(polygonDID.slice(0, 12)).toMatch('did:polygon:');
  })

  it('should be privateKey for register DID', async () => {

    await expect(privateKey).not.toBeNull();
    await expect(privateKey).not.toBe('');
    await expect(privateKey.length).toBe(66);
    await expect(privateKey.slice(0, 2)).toMatch('0x');
  })

  beforeAll(async () => {
    registerDidRes = await registerDID(polygonDID, privateKey);
  })

  it('should get register polygon DID for register DID', async () => {

    if (registerDidRes && registerDidRes.data && registerDidRes.data.did) {
      if (registerDidRes.data.did.split(':')[2] === 'testnet') {

        await expect(registerDidRes.data.did).toBeDefined();
        await expect(registerDidRes.data.did).not.toBeNull();
        await expect(registerDidRes.data.did).not.toBe('');
        await expect(registerDidRes.data.did.slice(0, 19)).toMatch('did:polygon:testnet');
        await expect(registerDidRes.data.did.slice(20, 22)).toMatch('0x');
        await expect(registerDidRes.data.did.split(":")[3].length).toBe(42);
      } else {

        await expect(registerDidRes.data.did).toBeDefined();
        await expect(registerDidRes.data.did).not.toBeNull();
        await expect(registerDidRes.data.did).not.toBe('');
        await expect(registerDidRes.data.did.slice(0, 12)).toMatch('did:polygon');
        await expect(registerDidRes.data.did.slice(12, 14)).toMatch('0x');
        await expect(registerDidRes.data.did.split(":")[2].length).toBe(42);
      }
    } else {
      await expect(registerDidRes).toBeFalsy();
    }
  })

  it('should get transaction hash after DID register ', async () => {

    if (registerDidRes && registerDidRes.data && registerDidRes.data.txnHash) {
      await expect(registerDidRes.data.txnHash).toBeDefined();
      await expect(registerDidRes.data.txnHash).not.toBeNull();
      await expect(registerDidRes.data.txnHash).not.toBe('');
      await expect(Object.keys(registerDidRes.data.txnHash))
        .toEqual(expect.arrayContaining(['nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'chainId', 'v', 'r', 's', 'from', 'hash', 'type', 'wait']));
    } else {
      await expect(registerDidRes).toBeFalsy();
    }
  })
})

describe("test update DID doc function", () => {

  let updateDidRes: BaseResponse;

  it('should be polygon DID for update DID document', async () => {

    if (polygonDID && polygonDID.split(':')[2] === 'testnet') {

      await expect(polygonDID).toBeDefined();
      await expect(polygonDID).not.toBeNull();
      await expect(polygonDID).not.toBe('');
      await expect(polygonDID.slice(0, 19)).toMatch('did:polygon:testnet');
      await expect(polygonDID.slice(20, 22)).toMatch('0x');
      await expect(polygonDID.split(":")[3].length).toBe(42);
    } else {

      await expect(polygonDID).toBeDefined();
      await expect(polygonDID).not.toBeNull();
      await expect(polygonDID).not.toBe('');
      await expect(polygonDID.slice(0, 12)).toMatch('did:polygon');
      await expect(polygonDID.slice(12, 14)).toMatch('0x');
      await expect(polygonDID.split(":")[2].length).toBe(42);
    }
  })

  it('should be updated DID Document for update DID document', async () => {

    await expect(updateDidDocument).not.toBeNull();
    await expect(updateDidDocument).not.toBe('');
    const updateDidDocumentJson = JSON.parse(updateDidDocument);
    await expect(Object.keys(updateDidDocumentJson)).toEqual(expect.arrayContaining(['@context', 'id', 'verificationMethod']));
  })

  it('should be private key for update DID document', async () => {

    await expect(privateKey).not.toBeNull();
    await expect(privateKey).not.toBe('');
    await expect(privateKey.length).toBe(66);
    await expect(privateKey.slice(0, 2)).toMatch('0x');
  })

  beforeAll(async () => {
    updateDidRes = await updateDidDoc(polygonDID, updateDidDocument, privateKey);
  })

  it('should get transaction hash after update DID document', async () => {

    if (updateDidRes && updateDidRes.data && updateDidRes.data.txnHash) {
      await expect(updateDidRes.data.txnHash).toBeDefined();
      await expect(updateDidRes.data.txnHash).not.toBeNull();
      await expect(updateDidRes.data.txnHash).not.toBe('');
      await expect(Object.keys(updateDidRes.data.txnHash))
        .toEqual(expect.arrayContaining(['nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'chainId', 'v', 'r', 's', 'from', 'hash', 'type', 'wait']));
    } else {
      await expect(updateDidRes.data.txnHash).toBeFalsy();
    }
  })
})

describe("test delete function", () => {

  let deleteDidRes: BaseResponse;

  it('should be polygon DID for delete DID document', async () => {

    if (polygonDID && polygonDID.split(':')[2] === 'testnet') {

      await expect(polygonDID).toBeDefined();
      await expect(polygonDID).not.toBeNull();
      await expect(polygonDID).not.toBe('');
      await expect(polygonDID.slice(0, 19)).toMatch('did:polygon:testnet');
      await expect(polygonDID.slice(20, 22)).toMatch('0x');
      await expect(polygonDID.split(":")[3].length).toBe(42);
    } else {

      await expect(polygonDID).toBeDefined();
      await expect(polygonDID).not.toBeNull();
      await expect(polygonDID).not.toBe('');
      await expect(polygonDID.slice(0, 12)).toMatch('did:polygon');
      await expect(polygonDID.slice(12, 14)).toMatch('0x');
      await expect(polygonDID.split(":")[2].length).toBe(42);
    }
  })

  it('should be private key for delete DID document', async () => {

    await expect(privateKey).not.toBeNull();
    await expect(privateKey).not.toBe('');
    await expect(privateKey.length).toBe(66);
    await expect(privateKey.slice(0, 2)).toMatch('0x');
  })

  beforeAll(async () => {
    deleteDidRes = await deleteDidDoc(polygonDID, privateKey);
  })

  it('should get transaction hash after delete DID document', async () => {

    if (deleteDidRes && deleteDidRes.data && deleteDidRes.data.txnHash) {

      await expect(deleteDidRes.data.txnHash).toBeDefined();
      await expect(deleteDidRes.data.txnHash).not.toBeNull();
      await expect(deleteDidRes.data.txnHash).not.toBe('');
      await expect(Object.keys(deleteDidRes.data.txnHash))
        .toEqual(expect.arrayContaining(['nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'chainId', 'v', 'r', 's', 'from', 'hash', 'type', 'wait']));
    } else {
      await expect(deleteDidRes.data.txnHash).toBeFalsy();
    }
  })
})