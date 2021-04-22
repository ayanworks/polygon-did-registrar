import * as dot from "dotenv";
import { polygonDIDRegistryABI } from "./polygon-did-registry-abi";
import * as log4js from "log4js";
import { ethers } from "ethers";

dot.config();

const logger = log4js.getLogger();
logger.level = process.env.LOGGER_LEVEL;

let registry;

/**
 * Match DID and address and then delete DID to the internal function
 * @param did
 * @returns
 */
export async function deleteDidDoc(did: string, privateKey: string, url?: string, contractAddress?: string): Promise<string> {
    try {

        const URL = url || process.env.URL;
        const CONTRACT_ADDRESS = contractAddress || process.env.CONTRACT_ADDRESS;
        const PRIVATE_KEY = privateKey;
        const provider = new ethers.providers.JsonRpcProvider(URL);

        let wallet = new ethers.Wallet(`${PRIVATE_KEY}`, provider);
        registry = new ethers.Contract(CONTRACT_ADDRESS, polygonDIDRegistryABI, wallet);

        if (did && did.match(/^did:polygon:0x[0-9a-fA-F]{40}$/)) {

            if (did.match(/^did:polygon:\w{0,42}$/)) {

                // Delete the DID for deleteDID function
                const txnHash = await deleteDID(did.split(":")[2]);
                logger.debug(`[deleteDidDoc] - txnHash - ${JSON.stringify(txnHash)} \n\n\n`);
                return txnHash;

            } else {
                throw new Error("Invalid address has been entered!");
            }
        } else {
            throw new Error("Invalid DID has been entered!");
        }
    } catch (error) {
        logger.error(`Error occurred in deleteDidDoc function ${error}`);
        throw error;
    }
}

/**
 * Delete DID document on matic chain
 * @param address
 * @param DidDoc
 * @returns
 */
async function deleteDID(address: string) {
    try {
        // Calling smart contract with delete DID document on matic chain
        let returnValues = await registry.functions
            .deleteDID(address)
            .then((resValue) => {
                return resValue;
            });
        return returnValues;
    } catch (error) {
        logger.error(`Error occurred in deleteDID function ${error}`);
        throw error;
    }
}
