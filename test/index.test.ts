import { testDid, updateStringData, privateKey } from "./test.data";
import { registerDID, createDID } from '../src/polygon-did-registrar';
import { updateDidDoc } from '../src/polygon-did-update';
import { deleteDidDoc } from '../src/polygon-did-delete';

jest.setTimeout(30000);

describe("test create did function", () => {

  test("should create polygon DID", async res => {
    try {
      const createDidRes = await createDID(privateKey)
        .then((response) => {
          return response;
        })
      await expect(createDidRes)
      res();
    } catch (error) {
      res(error);
    }
  });
});

describe("test register did function", () => {

  test("should register polygon DID", async res => {
    try {
      const registerDidRes = await registerDID(testDid, privateKey)
        .then((response) => {
          return response;
        })
      await expect(registerDidRes)
      res();
    } catch (error) {
      res(error);
    }
  });
})

describe("test update function", () => {

  test("should update polygon DID", async res => {
    try {
      const updateDidRes = await updateDidDoc(testDid, updateStringData, privateKey)
        .then((response) => {
          return response;
        })
      await expect(updateDidRes)
      res();
    } catch (error) {
      res(error);
    }
  });
});

describe("test delete function", () => {

  test("should delete polygon DID", async res => {
    try {
      const deleteDidRes = await deleteDidDoc(testDid, privateKey)
        .then((response) => {
          return response;
        })
      await expect(deleteDidRes)
      res();
    } catch (error) {
      res(error);
    }
  });
});