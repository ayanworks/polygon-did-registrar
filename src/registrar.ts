import {
  Contract,
  JsonRpcProvider,
  Network,
  SigningKey,
  Wallet,
  computeAddress,
} from 'ethers'
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
  signingKey: SigningKey
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

export type EstimatedTxDetails = {
  transactionFee: string
  gasLimit: string
  gasPrice: string
  maxFeePerGas: number
  maxPriorityFeePerGas: number
  network: string
  chainId: string
  method: string
}

export class PolygonDID {
  private registry: Contract
  private contractAddress: string
  private rpcUrl: string

  public constructor({
    contractAddress,
    rpcUrl,
    signingKey,
  }: PolygonDidInitOptions) {
    this.contractAddress = contractAddress
    this.rpcUrl = rpcUrl
    const provider = new JsonRpcProvider(rpcUrl)
    const wallet = new Wallet(signingKey, provider)
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
    if (network) {
      if (network !== 'testnet' && network !== 'mainnet') {
        throw new Error('Invalid network provided')
      }
      if (network === 'mainnet') {
        did = `did:polygon:${address}`
      } else {
        did = `did:polygon:${network}:${address}`
      }
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
      if (!txnHash) {
        throw new Error('Error while creating DID in registry!')
      }
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
      if (!txnHash) {
        throw new Error('Error while updating DID in registry!')
      }
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
      if (!txnHash) {
        throw new Error('Error while adding DID resource in registry!')
      }
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

      if (!txnHash) {
        throw new Error('Error while updating DID resource in registry!')
      }

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

      if (!linkedResource) {
        throw new Error(`Invalid parameters or resource does not exists!`)
      }

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

      if (!listLinkedResource) {
        throw new Error(`Invalid parameters or resource does not exists!`)
      }
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

  public async estimateTxFee(
    method: string,
    argument: string[],
  ): Promise<EstimatedTxDetails | null> {
    try {
      const provider = new JsonRpcProvider(this.rpcUrl)
      const contract = new Contract(
        this.contractAddress,
        DidRegistryContract.abi,
        provider,
      )

      // Encode function data
      const encodedFunction = await contract.interface.encodeFunctionData(
        method,
        argument,
      )

      // Check if encodedFunction is null or empty
      if (!encodedFunction) {
        throw new Error('Error while getting encoded function details')
      }

      // Estimate gas limit
      const gasLimit = await provider.estimateGas({
        to: this.contractAddress,
        data: encodedFunction,
      })

      // Convert gas limit to Gwei
      const gasLimitGwei = parseFloat(String(gasLimit)) / 1e9

      // Get gas price details
      const gasPriceDetails = await provider.getFeeData()

      // Check if gas price details are available
      if (!gasPriceDetails || !gasPriceDetails.gasPrice) {
        throw new Error('Gas price details not found!')
      }

      // Convert gas price to Gwei
      const gasPriceGwei = parseFloat(String(gasPriceDetails.gasPrice)) / 1e9

      // Get network details
      const networkDetails: Network = await provider.getNetwork()

      // Check if network details are available
      if (!networkDetails) {
        throw new Error('Network details not found!')
      }

      // Calculate transaction fee
      const transactionFee = gasLimitGwei * gasPriceGwei

      // Create EstimatedTxDetails object
      const estimatedTxDetails: EstimatedTxDetails = {
        transactionFee: String(transactionFee),
        gasLimit: String(gasLimitGwei),
        gasPrice: String(gasPriceGwei),
        maxFeePerGas: parseFloat(String(gasPriceDetails.maxFeePerGas)) / 1e9,
        maxPriorityFeePerGas:
          parseFloat(String(gasPriceDetails.maxPriorityFeePerGas)) / 1e9,
        network: String(networkDetails.name),
        chainId: String(networkDetails.chainId),
        method,
      }
      return estimatedTxDetails
    } catch (error) {
      console.error('Error calculating transaction fee:', error)
      return null
    }
  }
}
