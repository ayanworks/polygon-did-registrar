import { testDid, updateStringData } from "./test.data";
import { registerDID } from '../src/polygon-did-registrar';
import { updateDidDoc } from '../src/polygon-did-update';
import { deleteDidDoc } from '../src/polygon-did-delete';


describe("test register function", () => {

  it("should register polygon DID", async () => {
    await expect(registerDID());
  });

  it("should fail if any is wrong", async () => {
    await expect(registerDID()).rejects.toThrow();
  });
});

describe("test update function", () => {

  it("should update polygon DID", async () => {
    await expect(updateDidDoc(testDid, updateStringData));
  });

  it("should fail if DID string and DID doc is wrong", async () => {
    await expect(updateDidDoc("did:polygon:notHex", "")).rejects.toThrow();
  });
});

describe("test delete function", () => {

  it("should delete polygon DID", async () => {
    await expect(deleteDidDoc(testDid));
  });

  it("should fail if DID string is wrong", async () => {
    await expect(deleteDidDoc("did:polygon:notHex")).rejects.toThrow();
  });
});