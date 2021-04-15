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

const did = process.argv[2];
const stringDIDDoc = process.argv[3];

export class PolyGonDIDUpdate {
    
    constructor(
        ) { }
        
        
        /**
         * Update DID document on matic chain
         * @returns 
         */
        async updateDidDoc(did: string, stringDIDDoc: string): Promise<object> {
            
            try {
                
            logger.debug(`****** [updateDidDoc] ****** did - ${JSON.stringify(did)} \n\n\n`);
            logger.debug(`****** [updateDidDoc] ****** stringDIDDoc - ${JSON.stringify(stringDIDDoc)} \n\n\n`);

            if (did && (did.match(/^did:polygon:0x[0-9a-fA-F]{40}$/))) {

                if (did.match(/^did:polygon:\w{0,42}$/)) {

                    const returnAddress = await this.updateDID(did.split(':')[2], stringDIDDoc)
                        .then((resData) => {
                            return resData;
                        })

                    logger.debug(`****** [updateDidDoc] ****** returnAddress - ${JSON.stringify(returnAddress)} \n\n\n`);
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
    async updateDID(address: string, DidDoc: string) {
        try {

            // Calling smart contract with update DID document on matic chain
            let returnValues = await registry.functions.updateDID(address, DidDoc)
                .then((resValue) => {
                    logger.debug(`****** [updateDID] ****** resValue - ${JSON.stringify(resValue)} \n\n\n`);
                    return resValue;
                })
            return returnValues;
        }
        catch (error) {
            throw error;
        }
    }
}

const polyGonDIDUpdate = new PolyGonDIDUpdate();
polyGonDIDUpdate.updateDidDoc(did, stringDIDDoc);