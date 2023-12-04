import { updateDidDocument } from './fixtures/test.data'
import { describe, it, before } from 'node:test'
import assert from 'node:assert'
import { arrayHasKeys } from './utils/array'
import { PolygonDID } from '../src/registrar'

const NETWORK_URL = 'https://rpc-mumbai.maticvigil.com'
const CONTRACT_ADDRESS = '0x8B335A167DA81CCef19C53eE629cf2F6291F2255'

describe('Registrar', () => {
  let polygonDidRegistrar: PolygonDID
  let polygonDID: string
  let keyPair: {
    address: string
    privateKey: string
    publicKeyBase58: string
    did: string
  }

  before(async () => {
    keyPair = PolygonDID.createKeyPair('testnet')
    polygonDID = keyPair.did
    polygonDidRegistrar = new PolygonDID({
      contractAddress: CONTRACT_ADDRESS,
      rpcUrl: NETWORK_URL,
      privateKey: keyPair.privateKey,
    })
    await new Promise((r) => setTimeout(r, 5000))
  })

  describe('test create did function', () => {
    it('should get address', async () => {
      assert.ok(keyPair.address)
      assert.strictEqual(keyPair.address.slice(0, 2), '0x')
      assert.strictEqual(keyPair.address.length, 42)
    })

    it('should get public key base58', async () => {
      assert.ok(keyPair.publicKeyBase58)
    })

    it('should get polygon DID', async () => {
      if (keyPair && keyPair.did.split(':')[2] === 'testnet') {
        assert.ok(keyPair.did)
        assert.strictEqual(keyPair.did.slice(0, 19), 'did:polygon:testnet')
        assert.strictEqual(keyPair.did.slice(20, 22), '0x')
        assert.strictEqual(keyPair.did.split(':')[3].length, 42)
      } else {
        assert.ok(keyPair.did)
        assert.strictEqual(keyPair.did.slice(0, 19), 'did:polygon')
        assert.strictEqual(keyPair.did.slice(20, 22), '0x')
        assert.strictEqual(keyPair.did.split(':')[3].length, 42)
      }
    })
  })

  describe('test register DID function', () => {
    let registerDidRes: any

    before(async () => {
      registerDidRes = await polygonDidRegistrar.create({
        did: polygonDID,
        publicKeyBase58: keyPair.publicKeyBase58,
        serviceEndpoint: 'https://example.com',
      })
      console.log('first registerDidRes', registerDidRes)
    })

    it('should get transaction hash after DID register ', () => {
      assert.ok(registerDidRes.txnHash)
      assert.equal(
        arrayHasKeys(Object.keys(registerDidRes.txnHash), [
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
    let updateDidRes: any

    before(async () => {
      updateDidRes = await polygonDidRegistrar.update(
        polygonDID,
        updateDidDocument,
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
      if (updateDidRes && updateDidRes.txnHash) {
        assert.ok(updateDidRes.txnHash)
        assert.equal(
          arrayHasKeys(Object.keys(updateDidRes.txnHash), [
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
    let deleteDidRes: any

    before(async () => {
      deleteDidRes = await polygonDidRegistrar.deactivate(polygonDID)
    })

    it('should get transaction hash after delete DID document', async () => {
      assert.ok(deleteDidRes.txnHash)
      assert.equal(
        arrayHasKeys(Object.keys(deleteDidRes.txnHash), [
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
