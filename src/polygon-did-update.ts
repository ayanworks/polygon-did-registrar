import { BaseResponse } from './base-response'
import { RegistryContractInitialization } from './registry-contract-initialization'
import { parseDid, validateDid } from './utils/did'

/**
 * Update DID document on matic chain.
 * @param did
 * @param didDocJson
 * @param privateKey
 * @param url
 * @param contractAddress
 * @returns Returns transaction hash after updating DID Document on chain.
 */
export async function updateDidDoc(
  did: string,
  didDoc: string,
  privateKey: string, // Todo: look for better way to address private key passing mechanism
): Promise<BaseResponse> {
  try {
    const registryContractInitialization = new RegistryContractInitialization()

    const isValidDid = validateDid(did)
    if (!isValidDid) {
      throw new Error('invalid did provided')
    }

    const parsedDid = parseDid(did)

    const registry = await registryContractInitialization.instanceCreation(
      privateKey,
      parsedDid.networkUrl,
      parsedDid.contractAddress,
    )

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
    const txnHash = await registry.functions.updateDIDDoc(
      parsedDid.didAddress,
      didDocJson,
    )

    return BaseResponse.from(txnHash, 'Update DID document successfully')
  } catch (error) {
    console.log(`Error occurred in updateDidDoc function ${error}`)
    throw error
  }
}
