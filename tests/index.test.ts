import { updateDidDocument, privateKey, network } from './fixtures/test.data'
import { registerDID, createDID } from '../src/polygon-did-registrar'
import { updateDidDoc } from '../src/polygon-did-update'
import { deleteDidDoc } from '../src/polygon-did-delete'
import { BaseResponse } from '../src/base-response'
import { describe, it, before } from 'node:test'
import assert from 'node:assert'
import { arrayHasKeys } from './utils/array'

describe('Polygon-did-registrar', () => {
  let createDidRes: BaseResponse
  let polygonDID: string

  before(async () => {
    createDidRes = await createDID(network, privateKey)
    polygonDID = createDidRes.data.did
  })

  describe('test create did function', () => {
    it('should get address', async () => {
      assert.ok(createDidRes.data.address)
      assert.strictEqual(createDidRes.data.address.slice(0, 2), '0x')
      assert.strictEqual(createDidRes.data.address.length, 42)
    })

    it('should get public key base58', async () => {
      assert.ok(createDidRes.data.publicKeyBase58)
    })

    it('should get polygon DID', async () => {
      if (
        createDidRes &&
        createDidRes.data &&
        createDidRes.data.did.split(':')[2] === 'testnet'
      ) {
        assert.ok(createDidRes.data.did)
        assert.strictEqual(
          createDidRes.data.did.slice(0, 19),
          'did:polygon:testnet',
        )
        assert.strictEqual(createDidRes.data.did.slice(20, 22), '0x')
        assert.strictEqual(createDidRes.data.did.split(':')[3].length, 42)
      } else {
        assert.ok(createDidRes.data.did)
        assert.strictEqual(createDidRes.data.did.slice(0, 19), 'did:polygon')
        assert.strictEqual(createDidRes.data.did.slice(20, 22), '0x')
        assert.strictEqual(createDidRes.data.did.split(':')[3].length, 42)
      }
    })
  })

  describe('test register DID function', () => {
    let registerDidRes: BaseResponse

    before(async () => {
      registerDidRes = await registerDID(polygonDID, privateKey)
    })

    it('should get transaction hash after DID register ', () => {
      assert.ok(registerDidRes.data.txnHash)
      assert.equal(
        arrayHasKeys(Object.keys(registerDidRes.data.txnHash), [
          'nonce',
          'gasPrice',
          'gasLimit',
          'to',
          'value',
          'data',
          'chainId',
          'v',
          'r',
          's',
          'from',
          'hash',
          'type',
          'wait',
        ]),
        true,
      )
    })
  })

  describe('test update DID doc function', () => {
    let updateDidRes: BaseResponse

    before(async () => {
      updateDidRes = await updateDidDoc(
        polygonDID,
        updateDidDocument,
        privateKey,
      )
    })

    it('should be updated DID Document for update DID document', async () => {
      assert.ok(updateDidRes)
      assert.equal(Object.keys(JSON.parse(updateDidDocument)), [
        '@context',
        'id',
        'verificationMethod',
      ])
    })

    it('should get transaction hash after update DID document', async () => {
      if (updateDidRes && updateDidRes.data && updateDidRes.data.txnHash) {
        assert.ok(updateDidRes.data.txnHash)
        assert.equal(
          arrayHasKeys(Object.keys(updateDidRes.data.txnHash), [
            'nonce',
            'gasPrice',
            'gasLimit',
            'to',
            'value',
            'data',
            'chainId',
            'v',
            'r',
            's',
            'from',
            'hash',
            'type',
            'wait',
          ]),
          true,
        )
      } else {
        assert.fail('updateDidRes is not valid')
      }
    })
  })

  describe('test delete function', () => {
    let deleteDidRes: BaseResponse

    before(async () => {
      deleteDidRes = await deleteDidDoc(polygonDID, privateKey)
    })

    it('should get transaction hash after delete DID document', async () => {
      assert.ok(deleteDidRes.data.txnHash)
      assert.equal(
        arrayHasKeys(Object.keys(deleteDidRes.data.txnHash), [
          'nonce',
          'gasPrice',
          'gasLimit',
          'to',
          'value',
          'data',
          'chainId',
          'v',
          'r',
          's',
          'from',
          'hash',
          'type',
          'wait',
        ]),
        true,
      )
    })
  })
})
