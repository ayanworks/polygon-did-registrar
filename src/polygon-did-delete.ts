import * as log4js from "log4js";
import { DidUriValidation } from "./did-uri-validation";
import { BaseResponse } from "./base-response";
import { RegistryContractInitialization } from "./registry-contract-initialization";
import { ethers } from "ethers";

const logger = log4js.getLogger();
logger.level = `debug`;

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
      url?: string,
      contractAddress?: string
): Promise<BaseResponse> {
      try {
            let errorMessage: string;
            const didUriValidation: DidUriValidation = new DidUriValidation();
            const registryContractInitialization: RegistryContractInitialization = new RegistryContractInitialization();

            const didMethodCheck: Boolean = await didUriValidation.polygonDidMatch(did);
            const didWithTestnet: string = await didUriValidation.splitPolygonDid(did);

            if (didMethodCheck) {
                  const networkCheckWithUrl: any = await didUriValidation.networkMatch(
                        did,
                        url,
                        contractAddress
                  );

                  const registry: ethers.Contract = await registryContractInitialization.instanceCreation(
                        privateKey,
                        networkCheckWithUrl.url,
                        networkCheckWithUrl.contractAddress
                  );
                  const didAddress: string =
                        didWithTestnet === "testnet" ? did.split(":")[3] : didWithTestnet;

                  let txnHash: any = await registry.functions
                        .deleteDIDDoc(didAddress)
                        .then((resValue: any) => {
                              return resValue;
                        });

                  logger.debug(
                        `[deleteDidDoc] txnHash - ${JSON.stringify(txnHash)} \n\n\n`
                  );

                  return BaseResponse.from(txnHash, "Delete DID document successfully");
            } else {
                  errorMessage = `DID does not match!`;
                  logger.error(errorMessage);
                  throw new Error(errorMessage);
            }
      } catch (error) {
            logger.error(`Error occurred in deleteDidDoc function ${error}`);
            throw error;
      }
}
