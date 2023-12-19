import { Contract, JsonRpcProvider, Wallet, computeAddress } from 'ethers'
import { wrapDidDocument } from './polygon-did-registrar'
import { parseDid, validateDid } from './utils/did'
import DidRegistryContract from '@ayanworks/polygon-did-registry-contract'
import { Base58 } from '@ethersproject/basex'
import { computePublicKey } from '@ethersproject/signing-key'

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
    const wallet = Wallet.createRandom()
    const privateKey = wallet.privateKey
    const address = computeAddress(privateKey)

    const publicKey = computePublicKey(privateKey, true)

    const bufferPublicKey = Buffer.from(publicKey)
    const publicKeyBase58 = Base58.encode(bufferPublicKey)

    if (network !== ('testnet' || 'mainnet')) {
      throw new Error('Invalid network provided')
    }

    const did = `did:polygon:${network}:${address}`

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

      if (resolveDidDoc) {
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
      console.log(`Error occurred in registerDID function  ${error}`)
      throw error
    }
  }

  public async update(did: string, didDoc: string) {
    try {
      const isValidDid = validateDid(did)
      if (!isValidDid) {
        throw new Error('invalid did provided')
      }

      const parsedDid = parseDid(did)

      if (!didDoc && !JSON.parse(didDoc)) {
        throw new Error('Invalid DID has been entered!')
      }
      const didDocJson = JSON.parse(didDoc)

      if (
        !didDocJson['@context'] ||
        !didDocJson['id'] ||
        !didDocJson['verificationMethod']
      ) {
        throw new Error('Invalid DID doc')
      }

      // Calling smart contract with update DID document on matic chain
      const txnHash = await this.registry.updateDIDDoc(
        parsedDid.didAddress,
        didDoc,
      )

      return {
        did,
        didDoc,
        txnHash,
      }
    } catch (error) {
      console.log(`Error occurred in update ${error}`)
      throw error
    }
  }

  public async deactivate(did: string) {
    try {
      const isValidDid = validateDid(did)
      if (!isValidDid) {
        throw new Error('invalid did provided')
      }

      const parsedDid = parseDid(did)

      const txnHash = await this.registry.deleteDIDDoc(parsedDid.didAddress)

      return {
        did,
        txnHash,
      }
    } catch (error) {
      console.log(`Error occurred in deactivate ${error}`)
      throw error
    }
  }
}
