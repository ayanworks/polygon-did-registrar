import { testDid, updateStringData, privateKey } from "./test.data";
import { registerDID } from '../src/polygon-did-registrar';
import { updateDidDoc } from '../src/polygon-did-update';
import { deleteDidDoc } from '../src/polygon-did-delete';


describe("test register function", () => {

  it("should register polygon DID", res => {
    setTimeout(() => {
      expect(registerDID(testDid, privateKey))
      res();
    }, 5000);
  });

  it("should fail if any is wrong", res => {
    setTimeout(() => {
      expect(registerDID("0x", "")).rejects.toThrow();
      res();
    }, 5000);
  });
});

describe("test update function", () => {

  it("should update polygon DID", res => {
    setTimeout(() => {
      expect(updateDidDoc(testDid, updateStringData, privateKey));
      res();
    }, 5000);
  });

  it("should fail if DID string and DID doc is wrong", res => {
    setTimeout(() => {
      expect(updateDidDoc("did:polygon:notHex", "", "0x")).rejects.toThrow();
      res();
    }, 5000);
  });
});

describe("test delete function", () => {

  it("should delete polygon DID", res => {
    setTimeout(() => {
      expect(deleteDidDoc(testDid, privateKey));
      res();
    }, 5000);
  });

  it("should fail if DID string is wrong", res => {
    setTimeout(() => {
      expect(deleteDidDoc("did:polygon:notHex", "0x")).rejects.toThrow();
      res();
    }, 5000);
  });
});