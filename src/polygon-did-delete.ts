import * as dot from 'dotenv';
import { polygonDIDRegistryABI } from './PolygonDIDRegistryABI';
import * as log4js from "log4js";
var ethers = require('ethers');

dot.config();

const logger = log4js.getLogger();
logger.level = process.env.LOGGER_LEVEL;

const url = process.env.URL;
const DID_ADDRESS = `${process.env.DID_ADDRESS}`;
const provider = new ethers.providers.JsonRpcProvider(url);

let wallet = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);
let registry = new ethers.Contract(DID_ADDRESS, polygonDIDRegistryABI, wallet);


/**
 * Match DID and address and then delete DID to the internal function 
 * @param did 
 * @returns 
 */
export async function deleteDidDoc(did: string): Promise<string> {
    try {

        if (did && (did.match(/^did:polygon:0x[0-9a-fA-F]{40}$/))) {

            if (did.match(/^did:polygon:\w{0,42}$/)) {

                // Delete the DID for deleteDID function
                const deleteDIDDoc = await deleteDID(did.split(':')[2])
                logger.debug(`deleteDIDDoc - ${JSON.stringify(deleteDIDDoc)} \n\n\n`);
                return deleteDIDDoc;

            } else {

                throw new Error("Invalid address has been entered!");
            }
        } else {

            throw new Error("Invalid DID has been entered!");
        }
    }
    catch (error) {
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
        let returnValues = await registry.functions.deleteDID(address)
            .then((resValue) => {
                return resValue;
            })
        return returnValues;
    }
    catch (error) {
        throw error;
    }
}