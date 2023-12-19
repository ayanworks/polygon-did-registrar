import { Wallet } from '@ethersproject/wallet'
import { computeAddress } from '@ethersproject/transactions'
import { computePublicKey } from '@ethersproject/signing-key'
import { BaseResponse } from './base-response'
import { RegistryContractInitialization } from './registry-contract-initialization'
import { getDidFromAddress, parseDid, validateDid } from './utils/did'
import { Base58 } from '@ethersproject/basex'

/**
 * Create DID Document.
 * @param did
 * @param address
 * @returns Returns the DID Document.
 */
export async function wrapDidDocument(
  did: string,
  publicKeyBase58: string,
  serviceEndpoint?: string,
) {
  return {
    '@context': [
      'https://w3id.org/did/v1',
      'https://w3id.org/security/suites/secp256k1-2019/v1',
    ],
    id: did,
    verificationMethod: [
      {
        id: `${did}#key-1`,
        type: 'EcdsaSecp256k1VerificationKey2019', // external (property value)
        controller: did,
        publicKeyBase58: publicKeyBase58,
      },
    ],
    authentication: [
      did,
      {
        id: `${did}#key-1`,
        type: 'EcdsaSecp256k1VerificationKey2019', // external (property value)
        controller: did,
        publicKeyBase58: publicKeyBase58,
      },
    ],
    assertionMethod: [
      did,
      {
        id: `${did}#key-1`,
        type: 'EcdsaSecp256k1VerificationKey2019', // external (property value)
        controller: did,
        publicKeyBase58: publicKeyBase58,
      },
    ],
    ...(serviceEndpoint
      ? {
          service: [
            {
              id: `${did}#linked-domain`,
              type: 'LinkedDomains',
              serviceEndpoint: `${serviceEndpoint}`,
            },
          ],
        }
      : {}),
  }
}

/**
 * Create public and private key and generate address.
 * @param privateKey
 * @returns Returns the address and public key of type base58.
 */
export async function createKeyPair(privateKey: string) {
  try {
    const publicKey = computePublicKey(privateKey, true)

    const bufferPublicKey = Buffer.from(publicKey)
    const publicKeyBase58 = Base58.encode(bufferPublicKey)

    const address = computeAddress(privateKey)

    return { address, publicKeyBase58 }
  } catch (error) {
    console.log(`Error occurred in createKeyPair function ${error}`)
    throw error
  }
}

/**
 * Creates a DID Uri.
 * @param privateKey
 * @returns Returns the address, public key of type base58, private key and DID Uri.
 */
export async function createDID(network: string, privateKey?: string) {
  try {
    let _privateKey: string

    if (privateKey) {
      _privateKey = privateKey
    } else {
      const wallet = Wallet.createRandom()
      _privateKey = wallet.privateKey
    }

    const { address, publicKeyBase58 } = await createKeyPair(_privateKey)

    if (network !== ('testnet' || 'mainnet')) {
      throw new Error('Invalid network provided')
    }

    const did = getDidFromAddress(address, network)

    return BaseResponse.from(
      { address, publicKeyBase58, _privateKey, did },
      'Created DID uri successfully',
    )
  } catch (error) {
    console.log(`Error occurred in createDID function ${error}`)
    throw error
  }
}

/**
 * Registers DID document on matic chain.
 * @param did
 * @param privateKey
 * @param url
 * @param contractAddress
 * @returns Returns DID and transaction hash.
 */
export async function registerDID(
  did: string,
  privateKey: string,
  serviceEndpoint?: string,
) {
  try {
    const registryContractInitialization = new RegistryContractInitialization()

    const isValidDid = validateDid(did)
    if (!isValidDid) {
      throw new Error('invalid did provided')
    }

    const parsedDid = parseDid(did)

    const keyPair = await createKeyPair(privateKey)

    const registry = await registryContractInitialization.instanceCreation(
      privateKey,
      parsedDid.networkUrl,
      parsedDid.contractAddress,
    )

    const resolveDidDoc = await registry.getDIDDoc(parsedDid.didAddress)

    if (!resolveDidDoc) {
      throw new Error('The DID document already registered!')
    }

    // Get DID document
    const didDoc = await wrapDidDocument(
      did,
      keyPair.publicKeyBase58,
      serviceEndpoint,
    )

    const stringDidDoc = JSON.stringify(didDoc)

    const txnHash = await registry.createDID(parsedDid.didAddress, stringDidDoc)

    return BaseResponse.from(
      { did, txnHash },
      'Registered DID document successfully.',
    )
  } catch (error) {
    console.log(`Error occurred in registerDID function  ${error}`)
    throw error
  }
}
