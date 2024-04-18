import {
  testDidDetails,
  resourceJson,
  updateDidDocument,
  testContractDetails,
} from './fixtures/test.data'
import { describe, it, before } from 'node:test'
import assert from 'node:assert'
import { arrayHasKeys, buildTestDidDoc } from './utils/array'
import { PolygonDID } from '../src/registrar'
import { SigningKey } from 'ethers'

const NETWORK_URL = testContractDetails.networkUrl
const CONTRACT_ADDRESS = testContractDetails.contractAddress //Can add external smart contract address

describe('Registrar', () => {
  let polygonDidRegistrar: PolygonDID
  let polygonDID: string
  let keyPair: {
    address: string
    privateKey: string
    publicKeyBase58: string
    did: string
  } = {
    address: '',
    privateKey: '',
    publicKeyBase58: '',
    did: '',
  }

  before(async () => {
    keyPair.address = testDidDetails.address
    keyPair.did = testDidDetails.did
    keyPair.privateKey = testDidDetails.privateKey //test key
    keyPair.publicKeyBase58 = testDidDetails.publicKeyBase58
    polygonDID = testDidDetails.did

    if (!keyPair.address && !keyPair.did) {
      keyPair = PolygonDID.createKeyPair('testnet')
      polygonDID = keyPair.did
    }

    polygonDidRegistrar = new PolygonDID({
      contractAddress: CONTRACT_ADDRESS,
      rpcUrl: NETWORK_URL,
      signingKey: new SigningKey(`0x${keyPair.privateKey}`),
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
      const builtTestDidDoc = buildTestDidDoc(
        polygonDID,
        keyPair.publicKeyBase58,
        'https://example.com',
      )

      registerDidRes = await polygonDidRegistrar.create(
        polygonDID,
        builtTestDidDoc,
      )
    })

    it('should get transaction hash after DID register ', () => {
      assert.ok(registerDidRes.txnHash)
      assert.equal(
        arrayHasKeys(Object.keys(registerDidRes.txnHash), [
          'provider',
          'blockNumber',
          'blockHash',
          'index',
          'hash',
          'type',
          'to',
          'from',
          'nonce',
          'gasLimit',
          'gasPrice',
          'maxPriorityFeePerGas',
          'maxFeePerGas',
          'maxFeePerBlobGas',
          'data',
          'value',
          'chainId',
          'signature',
          'accessList',
          'blobVersionedHashes'
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

    it('should have a valid updateDidRes object', () => {
      assert.notStrictEqual(updateDidRes?.txnHash?.hash, '')
      assert.notStrictEqual(updateDidRes?.txnHash?.nonce, '')
    })
  })

  describe('test register DID linked-resource function', () => {
    let addedResource: any

    before(async () => {
      addedResource = await polygonDidRegistrar.addResource(
        polygonDID,
        resourceJson,
      )
    })

    it('should get transaction hash after register DID document', async () => {
      assert.ok(addedResource.txnHash)
      assert.equal(
        arrayHasKeys(Object.keys(addedResource.txnHash), [
          'provider',
          'blockNumber',
          'blockHash',
          'index',
          'hash',
          'type',
          'to',
          'from',
          'nonce',
          'gasLimit',
          'gasPrice',
          'maxPriorityFeePerGas',
          'maxFeePerGas',
          'data',
          'value',
          'chainId',
          'signature',
          'accessList',
        ]),
        true,
      )
    })
  })

  describe('test resolve DID linked-resource by DID and resourceId function', () => {
    let resolveResourceByDidAndId: any

    before(async () => {
      resolveResourceByDidAndId =
        await polygonDidRegistrar.getResourceByDidAndResourceId(
          polygonDID,
          '9c64d7c6-5678-4bc2-91e2-d4a0688e8a76',
        )
    })

    it('should match correct resource details after resolving linked resource with valid DID', async () => {
      const expectedKeys = [
        'resourceURI',
        'resourceCollectionId',
        'resourceId',
        'resourceName',
        'resourceType',
        'mediaType',
        'created',
        'checksum',
        'previousVersionId',
        'nextVersionId',
      ]

      assert.deepStrictEqual(
        Object.keys(resolveResourceByDidAndId.linkedResource),
        expectedKeys,
      )
    })
  })

  describe('test resolve all DID linked-resource by DID function', () => {
    let resolveResourceByDid: any

    before(async () => {
      resolveResourceByDid =
        await polygonDidRegistrar.getResourcesByDid(polygonDID)
    })

    it('should match correct resource details after resolving linked resource with valid DID', async () => {
      const expectedKeys = [
        'resourceURI',
        'resourceCollectionId',
        'resourceId',
        'resourceName',
        'resourceType',
        'mediaType',
        'created',
        'checksum',
        'previousVersionId',
        'nextVersionId',
      ]

      resolveResourceByDid?.linkedResource?.forEach((resource: any) => {
        assert.deepStrictEqual(Object.keys(resource), expectedKeys)
      })
    })
  })

  describe('test estimate transaction', () => {
    let transactionDetails: any

    before(async () => {
      transactionDetails = await polygonDidRegistrar.estimateTxFee(
        'createDID',
        [
          '0x13cd23928Ae515b86592C630f56C138aE4c7B79a',
          '68768734687ytruwytuqyetrywqt',
        ],
      )
    })

    it('should have non-empty values for transaction details', () => {
      assert.ok(transactionDetails)

      assert.ok(transactionDetails.transactionFee)
      assert.notStrictEqual(
        transactionDetails.transactionFee,
        '' || null || undefined,
      )

      assert.ok(transactionDetails.gasLimit)
      assert.notStrictEqual(
        transactionDetails.gasLimit,
        '' || null || undefined,
      )

      assert.ok(transactionDetails.gasPrice)
      assert.notStrictEqual(
        transactionDetails.gasPrice,
        '' || null || undefined,
      )

      assert.ok(transactionDetails.network)
      assert.notStrictEqual(transactionDetails.network, '' || null || undefined)

      assert.ok(transactionDetails.chainId)
      assert.notStrictEqual(transactionDetails.chainId, '' || null || undefined)

      assert.ok(transactionDetails.method)
      assert.notStrictEqual(transactionDetails.method, '' || null || undefined)
    })
  })
})
