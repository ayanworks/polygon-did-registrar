import { testDid, updateDidDocument, privateKey, url, contractAddress } from "./test.data";
import { registerDID, createDID } from '../src/polygon-did-registrar';
import { updateDidDoc } from '../src/polygon-did-update';
import { deleteDidDoc } from '../src/polygon-did-delete';

jest.setTimeout(30000);

describe("test create did function", () => {

  test("should create polygon DID without private key", async res => {
    try {

      const createDidRes = await createDID()
        .then((response) => {
          return response;
        })

      // output address
      await expect(createDidRes.data.address).not.toBeNull();
      await expect(createDidRes.data.address).not.toBe('');
      await expect(createDidRes.data.address.slice(0, 2)).toMatch('0x');
      await expect(createDidRes.data.address.length).toBe(42);

      // output publicKeyBase58
      await expect(createDidRes.data.publicKeyBase58).not.toBeNull();
      await expect(createDidRes.data.publicKeyBase58).not.toBe('');

      // output did
      await expect(createDidRes.data.did).not.toBeNull();
      await expect(createDidRes.data.did).not.toBe('');
      await expect(createDidRes.data.did.slice(0, 12)).toMatch('did:polygon:');
      await expect(createDidRes.data.did.slice(12, 14)).toMatch('0x');
      await expect(createDidRes.data.did.split(":")[2].length).toBe(42);

      res();
    } catch (error) {
      res(error);
    }
  });


  test("should create polygon DID with private key", async res => {
    try {

      // input privateKey
      await expect(privateKey).not.toBeNull();
      await expect(privateKey).not.toBe('');
      await expect(privateKey.length).toBe(66);
      await expect(privateKey.slice(0, 2)).toMatch('0x');

      const createDidRes = await createDID(privateKey)
        .then((response) => {
          return response;
        })

      // output address 
      await expect(createDidRes.data.address).not.toBeNull();
      await expect(createDidRes.data.address).not.toBe('');
      await expect(createDidRes.data.address.slice(0, 2)).toMatch('0x');
      await expect(createDidRes.data.address.length).toBe(42);
      await expect(createDidRes.data.address).toMatch('0x25F52Bc8FBE73c80A57f4887E467EBd969C87ec4');

      // output publicKeyBase58
      await expect(createDidRes.data.publicKeyBase58).not.toBeNull();
      await expect(createDidRes.data.publicKeyBase58).not.toBe('');
      await expect(createDidRes.data.publicKeyBase58).toMatch('7Lnm1ZkYs8SuoinG7uXckFP99o6KCoHTKHyJ6BqgvA6Mto3rqZiS1mWxrWeKT2Y7pBuJcufhStKZuVRtWFYAizATu7tXA');

      // output did
      await expect(createDidRes.data.did).not.toBeNull();
      await expect(createDidRes.data.did).not.toBe('');
      await expect(createDidRes.data.did.slice(0, 12)).toMatch('did:polygon:');
      await expect(createDidRes.data.did.slice(12, 14)).toMatch('0x');
      await expect(createDidRes.data.did.split(":")[2].length).toBe(42);
      await expect(createDidRes.data.did).toMatch('did:polygon:0x25F52Bc8FBE73c80A57f4887E467EBd969C87ec4');

      res();
    } catch (error) {
      res(error);
    }
  });
})

describe("test register did function", () => {

  test("should register polygon DID without url and contact address", async res => {
    try {

      // input testDid
      await expect(testDid).not.toBeNull();
      await expect(testDid).not.toBe('');
      await expect(testDid.slice(0, 12)).toMatch('did:polygon:');
      await expect(testDid.slice(12, 14)).toMatch('0x');
      await expect(testDid.split(":")[2].length).toBe(42);

      // input privateKey
      await expect(privateKey).not.toBeNull();
      await expect(privateKey).not.toBe('');
      await expect(privateKey.length).toBe(66);
      await expect(privateKey.slice(0, 2)).toMatch('0x');

      const registerDidRes = await registerDID(testDid, privateKey)
        .then((response) => {
          return response;
        })

      // output did
      await expect(registerDidRes.data.did).not.toBeNull();
      await expect(registerDidRes.data.did).not.toBe('');
      await expect(registerDidRes.data.did.slice(0, 12)).toMatch('did:polygon:');
      await expect(registerDidRes.data.did.slice(12, 14)).toMatch('0x');
      await expect(registerDidRes.data.did.split(":")[2].length).toBe(42);

      // output txnHash
      await expect(registerDidRes.data.txnHash).not.toBeNull();


      if (registerDidRes.data.txnHash) {

        await expect(registerDidRes.data.txnHash).not.toBe('');
        await expect(Object.keys(registerDidRes.data.txnHash))
          .toEqual(expect.arrayContaining(['nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'chainId', 'v', 'r', 's', 'from', 'hash', 'type', 'wait']));
      } else {

        await expect(registerDidRes.data.txnHash).toBeFalsy();
      }



      res();
    } catch (error) {
      res(error);
    }
  });

  test("should register polygon DID with url and contact address", async res => {
    try {

      // input testDid
      await expect(testDid).not.toBeNull();
      await expect(testDid).not.toBe('');
      await expect(testDid.slice(0, 12)).toMatch('did:polygon:');
      await expect(testDid.slice(12, 14)).toMatch('0x');
      await expect(testDid.split(":")[2].length).toBe(42);

      // input privateKey
      await expect(privateKey).not.toBeNull();
      await expect(privateKey).not.toBe('');
      await expect(privateKey.length).toBe(66);
      await expect(privateKey.slice(0, 2)).toMatch('0x');

      // input url
      await expect(url).not.toBeNull();
      await expect(url).not.toBe('');
      await expect(url.slice(0, 8)).toMatch('https://');

      // input contractAddress
      await expect(contractAddress).not.toBeNull();
      await expect(contractAddress).not.toBe('');
      await expect(contractAddress.length).toBe(42);
      await expect(contractAddress.slice(0, 2)).toMatch('0x');

      const registerDidRes = await registerDID(testDid, privateKey, url, contractAddress)
        .then((response) => {
          return response;
        })


      // output did
      await expect(registerDidRes.data.did).not.toBeNull();
      await expect(registerDidRes.data.did).not.toBe('');
      await expect(registerDidRes.data.did.slice(0, 12)).toMatch('did:polygon:');
      await expect(registerDidRes.data.did.slice(12, 14)).toMatch('0x');
      await expect(registerDidRes.data.did.split(":")[2].length).toBe(42);

      // output txnHash
      if (registerDidRes.data.txnHash) {

        await expect(registerDidRes.data.txnHash).not.toBeNull();
        await expect(registerDidRes.data.txnHash).not.toBe('');
        await expect(Object.keys(registerDidRes.data.txnHash))
          .toEqual(expect.arrayContaining(['nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'chainId', 'v', 'r', 's', 'from', 'hash', 'type', 'wait']));
      } else {

        await expect(registerDidRes.data.txnHash).toBeFalsy();
      }

      res();
    } catch (error) {
      res(error);
    }
  });
})

describe("test update function", () => {

  test("should update polygon DID without url and contact address", async res => {
    try {

      // input testDid
      await expect(testDid).not.toBeNull();
      await expect(testDid).not.toBe('');
      await expect(testDid.slice(0, 12)).toMatch('did:polygon:');
      await expect(testDid.slice(12, 14)).toMatch('0x');
      await expect(testDid.split(":")[2].length).toBe(42);

      // input updateDidDocument
      await expect(updateDidDocument).not.toBeNull();
      await expect(updateDidDocument).not.toBe('');
      const updateDidDocumentJson = JSON.parse(updateDidDocument);
      await expect(Object.keys(updateDidDocumentJson)).toEqual(expect.arrayContaining(['@context', 'id', 'verificationMethod']));

      // input privateKey
      await expect(privateKey).not.toBeNull();
      await expect(privateKey).not.toBe('');
      await expect(privateKey.length).toBe(66);
      await expect(privateKey.slice(0, 2)).toMatch('0x');

      const updateDidRes = await updateDidDoc(testDid, updateDidDocument, privateKey)
        .then((response) => {
          return response;
        })



      // output txnHash
      if (updateDidRes.data.txnHash) {

        await expect(updateDidRes.data.txnHash).not.toBeNull();
        await expect(updateDidRes.data.txnHash).not.toBe('');
        await expect(Object.keys(updateDidRes.data.txnHash))
          .toEqual(expect.arrayContaining(['nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'chainId', 'v', 'r', 's', 'from', 'hash', 'type', 'wait']));
      } else {

        await expect(updateDidRes.data.txnHash).toBeFalsy();
      }

      res();
    } catch (error) {
      res(error);
    }
  });


  test("should update polygon DID with url and contact address", async res => {
    try {
      // input testDid
      await expect(testDid).not.toBeNull();
      await expect(testDid).not.toBe('');
      await expect(testDid.slice(0, 12)).toMatch('did:polygon:');
      await expect(testDid.slice(12, 14)).toMatch('0x');
      await expect(testDid.split(":")[2].length).toBe(42);

      // input updateDidDocument
      await expect(updateDidDocument).not.toBeNull();
      await expect(updateDidDocument).not.toBe('');

      // input privateKey
      await expect(privateKey).not.toBeNull();
      await expect(privateKey).not.toBe('');
      await expect(privateKey.length).toBe(66);
      await expect(privateKey.slice(0, 2)).toMatch('0x');

      // input url
      await expect(url).not.toBeNull();
      await expect(url).not.toBe('');
      await expect(url.slice(0, 8)).toMatch('https://');

      // input contractAddress
      await expect(contractAddress).not.toBeNull();
      await expect(contractAddress).not.toBe('');
      await expect(contractAddress.length).toBe(42);
      await expect(contractAddress.slice(0, 2)).toMatch('0x');

      const updateDidRes = await updateDidDoc(testDid, updateDidDocument, privateKey, url, contractAddress)
        .then((response) => {
          return response;
        })


      // output txnHash
      if (updateDidRes.data.txnHash) {

        await expect(updateDidRes.data.txnHash).not.toBeNull();
        await expect(updateDidRes.data.txnHash).not.toBe('');
        await expect(Object.keys(updateDidRes.data.txnHash))
          .toEqual(expect.arrayContaining(['nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'chainId', 'v', 'r', 's', 'from', 'hash', 'type', 'wait']));
      } else {

        await expect(updateDidRes.data.txnHash).toBeFalsy();
      }

      res();
    } catch (error) {
      res(error);
    }
  });
});

describe("test delete function", () => {

  test("should delete polygon DID without url and contact address", async res => {
    try {

      // input testDid
      await expect(testDid).not.toBeNull();
      await expect(testDid).not.toBe('');
      await expect(testDid.slice(0, 12)).toMatch('did:polygon:');
      await expect(testDid.slice(12, 14)).toMatch('0x');
      await expect(testDid.split(":")[2].length).toBe(42);

      // input privateKey
      await expect(privateKey).not.toBeNull();
      await expect(privateKey).not.toBe('');
      await expect(privateKey.length).toBe(66);
      await expect(privateKey.slice(0, 2)).toMatch('0x');

      const deleteDidRes = await deleteDidDoc(testDid, privateKey)
        .then((response) => {
          return response;
        })


      // output txnHash
      if (deleteDidRes.data.txnHash) {

        await expect(deleteDidRes.data.txnHash).not.toBeNull();
        await expect(deleteDidRes.data.txnHash).not.toBe('');
        await expect(Object.keys(deleteDidRes.data.txnHash))
          .toEqual(expect.arrayContaining(['nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'chainId', 'v', 'r', 's', 'from', 'hash', 'type', 'wait']));
      } else {

        await expect(deleteDidRes.data.txnHash).toBeFalsy();
      }

      res();
    } catch (error) {
      res(error);
    }
  });

  test("should delete polygon DID with url and contact address", async res => {
    try {

      // input testDid
      await expect(testDid).not.toBeNull();
      await expect(testDid).not.toBe('');
      await expect(testDid.slice(0, 12)).toMatch('did:polygon:');
      await expect(testDid.slice(12, 14)).toMatch('0x');
      await expect(testDid.split(":")[2].length).toBe(42);

      // input privateKey
      await expect(privateKey).not.toBeNull();
      await expect(privateKey).not.toBe('');
      await expect(privateKey.length).toBe(66);
      await expect(privateKey.slice(0, 2)).toMatch('0x');

      // input url
      await expect(url).not.toBeNull();
      await expect(url).not.toBe('');
      await expect(url.slice(0, 8)).toMatch('https://');

      // input contractAddress
      await expect(contractAddress).not.toBeNull();
      await expect(contractAddress).not.toBe('');
      await expect(contractAddress.length).toBe(42);
      await expect(contractAddress.slice(0, 2)).toMatch('0x');

      const deleteDidRes = await deleteDidDoc(testDid, privateKey, url, contractAddress)
        .then((response) => {
          return response;
        })


      // output txnHash
      if (deleteDidRes.data.txnHash) {

        await expect(deleteDidRes.data.txnHash).not.toBeNull();
        await expect(deleteDidRes.data.txnHash).not.toBe('');
        await expect(Object.keys(deleteDidRes.data.txnHash))
          .toEqual(expect.arrayContaining(['nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'chainId', 'v', 'r', 's', 'from', 'hash', 'type', 'wait']));
      } else {

        await expect(deleteDidRes.data.txnHash).toBeFalsy();
      }

      res();
    } catch (error) {
      res(error);
    }
  });
});