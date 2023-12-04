import { BaseResponse } from './base-response'
import { RegistryContractInitialization } from './registry-contract-initialization'
import { ethers } from 'ethers'
import { parseDid, validateDid } from './utils/did'

/**
 * Delete DID Document.
 * @param did
 * @param privateKey
 * @param url
 * @param contractAddress
 * @returns Return transaction hash after deleting DID Document on chain.
 */
export async function deleteDidDoc(
  did: string,
  privateKey: string,
): Promise<BaseResponse> {
  try {
    const registryContractInitialization: RegistryContractInitialization =
      new RegistryContractInitialization()

    const isValidDid = validateDid(did)
    if (!isValidDid) {
      throw new Error('invalid did provided')
    }

    const parsedDid = parseDid(did)

    const registry: ethers.Contract =
      await registryContractInitialization.instanceCreation(
        privateKey,
        parsedDid.networkUrl,
        parsedDid.contractAddress,
      )

    const txnHash = await registry.deleteDIDDoc(parsedDid.didAddress)

    return BaseResponse.from(txnHash, 'Delete DID document successfully')
  } catch (error) {
    console.log(`Error occurred in deleteDidDoc function ${error}`)
    throw error
  }
}
