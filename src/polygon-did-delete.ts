import * as dot from "dotenv";
import * as log4js from "log4js";
import * as networkConfiguration from './configuration.json';
import { ethers } from "ethers";
import { BaseResponse } from "./base-response";
const DidRegistryContract = require('@ayanworks/polygon-did-registry-contract');

dot.config();

const logger = log4js.getLogger();
logger.level = `debug`;

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
        let errorMessage: string;

        if (url && url === `${networkConfiguration[0].testnet?.URL}` && did && did.split(':')[2] === 'testnet') {

            url = `${networkConfiguration[0].testnet?.URL}`;
            contractAddress = `${networkConfiguration[0].testnet?.CONTRACT_ADDRESS}`;

        } else if (!url && did && did.split(':')[2] === 'testnet') {

            url = `${networkConfiguration[0].testnet?.URL}`;
            contractAddress = `${networkConfiguration[0].testnet?.CONTRACT_ADDRESS}`;

        } else if (!url && did && did.split(':')[2] !== 'testnet') {

            url = `${networkConfiguration[1].mainnet?.URL}`;
            contractAddress = `${networkConfiguration[1].mainnet?.CONTRACT_ADDRESS}`;

        } else {
            errorMessage = `The DID and url did not match!`;
            logger.error(errorMessage);
            throw new Error(errorMessage);
        }

        if (did && did.split(':')[2] === 'testnet' && did.match(/^did:polygon:testnet:0x[0-9a-fA-F]{40}$/) ||
            did && did.match(/^did:polygon:0x[0-9a-fA-F]{40}$/)
        ) {
            if (did.split(':')[2] === 'testnet' && did.match(/^did:polygon:testnet:\w{0,42}$/) ||
                did.match(/^did:polygon:\w{0,42}$/)
            ) {

                const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(
                    url
                );
                const wallet: ethers.Wallet = new ethers.Wallet(privateKey, provider);
                const registry: ethers.Contract = new ethers.Contract(
                    contractAddress,
                    DidRegistryContract.abi,
                    wallet
                );

                const didAddress = did.split(":")[2] === 'testnet' ? did.split(":")[3] : did.split(":")[2];
                let txnHash: any = await registry.functions
                    .deleteDID(didAddress)
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