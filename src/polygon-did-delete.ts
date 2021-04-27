import * as dot from "dotenv"; 
import * as log4js from "log4js"; 
import { polygonDidRegistryABI } from "./polygon-did-registry-abi"; 
import { ethers } from "ethers"; 
import { BaseResponse } from "./common-response"; 

dot.config();

const logger = log4js.getLogger();
logger.level = process.env.LOGGER_LEVEL;

/**
 * Delete DID Document
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
        const URL: string = url || process.env.URL;
        const CONTRACT_ADDRESS: string = contractAddress || process.env.CONTRACT_ADDRESS;

        const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(
            URL
        );
        const wallet: ethers.Wallet = new ethers.Wallet(privateKey, provider);
        const registry: ethers.Contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            polygonDidRegistryABI,
            wallet
        );

        let errorMessage: string;

        if (did && did.match(/^did:polygon:0x[0-9a-fA-F]{40}$/)) {
            if (did.match(/^did:polygon:\w{0,42}$/)) {
                let txnHash: any = await registry.functions
                    .deleteDID(did.split(":")[2])
                    .then((resValue: any) => {
                        return resValue;
                    });

                logger.debug(
                    `[deleteDidDoc] txnHash - ${JSON.stringify(txnHash)} \n\n\n`
                );

                return BaseResponse.from(txnHash, 'Delete DID document successfully');
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
    } catch (error) {
        logger.error(`Error occurred in deleteDidDoc function ${error}`);
        throw error;
    }
}
