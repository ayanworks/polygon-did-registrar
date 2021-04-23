import * as dot from "dotenv"; // Loads environment variables from .env file.
import * as log4js from "log4js"; // Logging Services.
import { polygonDidRegistryABI } from "./polygon-did-registry-abi"; // Polygon DID Registry ABI json data.
import { ethers } from "ethers"; // Ethereum wallet implementation and utilities.

dot.config();

const logger = log4js.getLogger();
logger.level = process.env.LOGGER_LEVEL;

/**
 * Update DID document on matic chain
 * @param did
 * @param stringDIDDoc
 * @param privateKey
 * @param url
 * @param contractAddress
 * @returns Returns transaction hash after updating DID Document on chain.
 */
export async function updateDidDoc(
    did: string,
    stringDidDoc: string,
    privateKey: string,
    url?: string,
    contractAddress?: string
): Promise<object> {
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
                // Calling smart contract with update DID document on matic chain
                let txnHash: any = await registry.functions
                    .updateDID(did.split(":")[2], stringDidDoc)
                    .then((resValue) => {
                        return resValue;
                    });

                logger.debug(
                    `[updateDidDoc] txnHash - ${JSON.stringify(txnHash)} \n\n\n`
                );
                return txnHash;
            } else {
                errorMessage = `Invalid address has been entered!`;
                logger.error(errorMessage);
                throw new Error(errorMessage);
            }
        } else {
            errorMessage = `Invalid DID has been entered!!`;
            logger.error(errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error) {
        logger.error(`Error occurred in updateDidDoc function ${error}`);
        throw error;
    }
}
