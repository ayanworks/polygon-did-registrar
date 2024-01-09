import { Contract, JsonRpcProvider, Wallet, computeAddress } from 'ethers'
import { wrapDidDocument } from './polygon-did-registrar'
import { parseDid, validateDid } from './utils/did'
import { validateResourcePayload } from './utils/linkedResource'
import DidRegistryContract from '@ayanworks/polygon-did-registry-contract'
import { Base58 } from '@ethersproject/basex'
import { computePublicKey } from '@ethersproject/signing-key'
import { v4 as uuidv4 } from 'uuid'

export type PolygonDidInitOptions = {
  contractAddress: string
  rpcUrl: string
  privateKey: string
}

export type PolygonDidRegisterOptions = {
  did: string
  publicKeyBase58: string
  serviceEndpoint?: string
}

export type ResourcePayload = {
  resourceURI: string
  resourceCollectionId: string
  resourceId: string
  resourceName: string
  resourceType: string
  mediaType: string
  created: string
  checksum: string
  previousVersionId: string | null
  nextVersionId: string | null
}

export class PolygonDID {
  private registry: Contract

  public constructor({
    contractAddress,
    rpcUrl,
    privateKey,
  }: PolygonDidInitOptions) {
    const provider = new JsonRpcProvider(rpcUrl)
    const wallet = new Wallet(privateKey, provider)
    this.registry = new Contract(
      contractAddress,
      DidRegistryContract.abi,
      wallet,
    )
  }

  static createKeyPair(network: string) {
    let did: string = ''
    const wallet = Wallet.createRandom()
    const privateKey = wallet.privateKey
    const address = computeAddress(privateKey)

    const publicKey = computePublicKey(privateKey, true)

    const bufferPublicKey = Buffer.from(publicKey)
    const publicKeyBase58 = Base58.encode(bufferPublicKey)

    if (network !== 'testnet' && network !== 'mainnet') {
      throw new Error('Invalid network provided')
    }
    if (network === 'mainnet') {
      did = `did:polygon:${address}`
    } else {
      did = `did:polygon:${network}:${address}`
    }
    return { address, privateKey, publicKeyBase58, did }
  }

  public async create({
    did,
    publicKeyBase58,
    serviceEndpoint,
  }: PolygonDidRegisterOptions) {
    try {
      const isValidDid = validateDid(did)
      if (!isValidDid) {
        throw new Error('invalid did provided')
      }

      const parsedDid = parseDid(did)

      const resolveDidDoc = await this.registry.getDIDDoc(parsedDid.didAddress)

      if (resolveDidDoc[0]) {
        throw new Error('The DID document already registered!')
      }

      // Get DID document
      const didDoc = await wrapDidDocument(
        did,
        publicKeyBase58,
        serviceEndpoint,
      )

      const stringDidDoc = JSON.stringify(didDoc)

      const txnHash = await this.registry.createDID(
        parsedDid.didAddress,
        stringDidDoc,
      )

      return {
        did,
        txnHash,
        didDoc,
      }
    } catch (error) {
      console.log(`Error occurred in registerDID function ${error} `)
      throw error
    }
  }

  public async update(did: string, didDoc: object) {
    try {
      const isValidDid = validateDid(did)
      if (!isValidDid) {
        throw new Error('Invalid did provided')
      }

      const parsedDid = parseDid(did)

      if (!didDoc && !JSON.parse(didDoc)) {
        throw new Error('Invalid DID has been entered!')
      }

      // Calling smart contract with update DID document on matic chain
      const txnHash = await this.registry.updateDIDDoc(
        parsedDid.didAddress,
        JSON.stringify(didDoc),
      )
      return {
        did,
        didDoc,
        txnHash,
      }
    } catch (error) {
      console.log(`Error occurred in update ${error} `)
      throw error
    }
  }

  public async addResource(did: string, resourcePayload: ResourcePayload) {
    try {
      const isValidDid = validateDid(did)
      if (!isValidDid) {
        throw new Error('Invalid did provided')
      }

      const parsedDid = parseDid(did)

      validateResourcePayload(resourcePayload)

      const resolveDidDoc = await this.registry.getDIDDoc(parsedDid.didAddress)

      if (!resolveDidDoc[0]) {
        throw new Error(`The DID document for the given DID was not found!`)
      }

      const stringDidDoc = JSON.stringify(resourcePayload)
      const resourceId = uuidv4()

      const txnHash = await this.registry.addResource(
        parsedDid.didAddress,
        resourceId,
        stringDidDoc,
      )

      return {
        did,
        resourceId,
        txnHash,
      }
    } catch (error) {
      console.log(`Error occurred in addResource function ${error} `)
      throw error
    }
  }

  public async updateResource(
    did: string,
    resourceId: string,
    resourcePayload: ResourcePayload,
  ) {
    try {
      const isValidDid = validateDid(did)
      if (!isValidDid && resourceId) {
        throw new Error('Invalid DID or resourceId provided!')
      }

      const parsedDid = parseDid(did)

      validateResourcePayload(resourcePayload)

      const resolveDidDoc = await this.registry.getDIDDoc(parsedDid.didAddress)

      if (!resolveDidDoc[0]) {
        throw new Error(`The DID document for the given DID was not found!`)
      }

      const stringDidDoc = JSON.stringify(resourcePayload)

      const txnHash = await this.registry.addResource(
        parsedDid.didAddress,
        resourceId,
        stringDidDoc,
      )

      return {
        did,
        resourceId,
        txnHash,
      }
    } catch (error) {
      console.log(`Error occurred in addResource function ${error} `)
      throw error
    }
  }

  public async getResourceByDidAndResourceId(did: string, resourceId: string) {
    try {
      const isValidDid = validateDid(did)

      if (!isValidDid) {
        throw new Error('Invalid did provided')
      }

      const parsedDid = parseDid(did)

      const resolveDidDoc = await this.registry.getDIDDoc(parsedDid.didAddress)

      if (!resolveDidDoc[0]) {
        throw new Error(`The DID document for the given DID was not found!`)
      }

      const linkedResource = await this.registry.getResource(
        parsedDid.didAddress,
        resourceId,
      )

      return {
        did,
        linkedResource: JSON.parse(linkedResource),
      }
    } catch (error) {
      console.log(
        `Error occurred in getResourcesByDidAndResourceId function ${error} `,
      )
      throw error
    }
  }

  public async getResourcesByDid(did: string) {
    try {
      const isValidDid = validateDid(did)
      if (!isValidDid) {
        throw new Error('invalid did provided')
      }

      const parsedDid = parseDid(did)

      const resolveDidDoc = await this.registry.getDIDDoc(parsedDid.didAddress)

      if (!resolveDidDoc[0]) {
        throw new Error(`The DID document for the given DID was not found!`)
      }

      const listLinkedResource = await this.registry.getAllResources(
        parsedDid.didAddress,
      )

      return {
        did,
        linkedResources: listLinkedResource.map((element: string) => {
          return JSON.parse(element) as ResourcePayload
        }),
      }
    } catch (error) {
      console.log(`Error occurred in getResourcesByDid function ${error} `)
      throw error
    }
  }
}
