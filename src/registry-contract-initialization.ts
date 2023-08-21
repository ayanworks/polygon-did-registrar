import { Contract, Wallet, providers } from 'ethers'
import DidRegistryContract from '@ayanworks/polygon-did-registry-contract'

export class RegistryContractInitialization {
  /**
   * Creates an instance of the polygon DID registry smart contract.
   * @param url
   * @param privateKey
   * @param contractAddress
   * @returns Returns the instance created.
   */
  async instanceCreation(
    privateKey: string,
    url: string,
    contractAddress: string,
  ) {
    const provider = new providers.JsonRpcProvider(url)
    const wallet = new Wallet(privateKey, provider)
    const registry = new Contract(
      contractAddress,
      DidRegistryContract.abi,
      wallet,
    )
    return registry
  }
}
