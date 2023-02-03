import * as log4js from "log4js";
import * as networkConfiguration from "./configuration.json";

const logger = log4js.getLogger();
logger.level = `debug`;

export class DidUriValidation {
      /**
       * fvm DID match or not.
       * @param did
       * @returns Returns true after fvm DID match successfully.
       */
      async fvmDidMatch(did: string): Promise<Boolean> {
            let errorMessage: string;
            const didWithTestnet: string = await this.splitfvmDid(did);

            if (
                  (did &&
                        didWithTestnet === "testnet" &&
                        did.match(/^did:fvm:testnet:0x[0-9a-fA-F]{40}$/)) ||
                  (did && did.match(/^did:fvm:0x[0-9a-fA-F]{40}$/))
            ) {
                  if (
                        (didWithTestnet === "testnet" &&
                              did.match(/^did:fvm:testnet:\w{0,42}$/)) ||
                        did.match(/^did:fvm:\w{0,42}$/)
                  ) {
                        return true;
                  } else {
                        errorMessage = `Invalid method-specific identifier has been entered!`;
                        logger.error(errorMessage);
                        throw new Error(errorMessage);
                  }
            } else {
                  errorMessage = `Invalid DID has been entered!`;
                  logger.error(errorMessage);
                  throw new Error(errorMessage);
            }
      }

      /**
       * fvm DID and Network match or not.
       * @param did
       * @param url
       * @param contractAddress
       * @returns Returns network url and contract address.
       */
      async networkMatch(
            did: string,
            url?: string,
            contractAddress?: string
      ): Promise<any> {
            let errorMessage: string;
            const didWithTestnet: string = await this.splitfvmDid(did);
            if (
                  url &&
                  url === `${networkConfiguration[0].testnet?.URL}` &&
                  did &&
                  didWithTestnet === "testnet"
            ) {
                  url = `${networkConfiguration[0].testnet?.URL}`;
                  contractAddress = `${networkConfiguration[0].testnet?.CONTRACT_ADDRESS}`;

                  return {
                        url,
                        contractAddress
                  };
            } else if (!url && did && didWithTestnet === "testnet") {
                  url = `${networkConfiguration[0].testnet?.URL}`;
                  contractAddress = `${networkConfiguration[0].testnet?.CONTRACT_ADDRESS}`;
                  return {
                        url,
                        contractAddress
                  };
            } else if (!url && did && didWithTestnet !== "testnet") {
                  errorMessage = `Mainnet not supported yet!`;
                  logger.error(errorMessage);
                  throw new Error(errorMessage);
            } else {
                  errorMessage = `The DID and url do not match!`;
                  logger.error(errorMessage);
                  throw new Error(errorMessage);
            }
      }

      /**
       * Split fvm DID.
       * @param did
       * @returns Returns Split data value to fvm DID.
       */
      async splitfvmDid(did: string): Promise<string> {
            const splitDidValue: string = did.split(":")[2];
            return splitDidValue;
      }
}
