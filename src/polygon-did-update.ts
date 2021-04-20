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
 * Update DID document on matic chain
 * @returns 
 */
export async function updateDidDoc(did: string, stringDIDDoc: string): Promise<object> {

    try {
        if (did && (did.match(/^did:polygon:0x[0-9a-fA-F]{40}$/))) {

            if (did.match(/^did:polygon:\w{0,42}$/)) {

                const returnAddress = await updateDID(did.split(':')[2], stringDIDDoc)
                    .then((resData) => {
                        return resData;
                    })

                logger.debug(`returnAddress - ${JSON.stringify(returnAddress)} \n\n\n`);
                return returnAddress;
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
 * Update DID document on matic chain  
 * @param address 
 * @param DidDoc 
 * @returns 
 */
async function updateDID(address: string, DidDoc: string) {
    try {

        // Calling smart contract with update DID document on matic chain
        let returnValues = await registry.functions.updateDID(address, DidDoc)
            .then((resValue) => {
                return resValue;
            })
        return returnValues;
    }
    catch (error) {
        throw error;
    }
}