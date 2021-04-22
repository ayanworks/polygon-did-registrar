import * as dot from "dotenv";
import { polygonDIDRegistryABI } from "./polygon-did-registry-abi";
import { ethers } from "ethers";
import * as log4js from "log4js";
import { computeAddress } from '@ethersproject/transactions'
import { computePublicKey } from '@ethersproject/signing-key'
import { Wallet } from '@ethersproject/wallet'

const bs58 = require("bs58");
dot.config();

const logger = log4js.getLogger();
logger.level = process.env.LOGGER_LEVEL;

let registry;

/**
 * Create and return DID Document
 * @param did
 * @param address
 * @returns
 */
async function wrapDidDocument(did: string, publicKeyBase58: string): Promise<object> {
    return {
        "@context": "https://w3id.org/did/v1",
        id: did,
        verificationMethod: [
            {
                id: did,
                type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
                controller: did,
                publicKeyBase58: publicKeyBase58,
            },
        ],
    };
}

/**
 * Create public and private key and generate address
 * @returns
 */
async function createKeyPair(privateKey: string): Promise<any> {
    try {

        const publicKey = computePublicKey(privateKey, true);

        const bufferPublicKey = Buffer.from(publicKey);
        const publicKeyBase58 = bs58.encode(bufferPublicKey);

        const address = computeAddress(privateKey);

        return { address, publicKeyBase58 };

    } catch (error) {
        logger.error(`Error occurred in createKeyPair function ${error}`);
        throw error;
    }
}

/**
 * Create DID 
 * @param privateKey 
 * @returns 
 */
export async function createDID(privateKey?: string): Promise<any> {
    try {

        if (privateKey) {

            const { address } = await createKeyPair(privateKey);
            const did = `did:polygon:${address}`;
            return did;

        } else {

            const wallet = Wallet.createRandom();
            const privateKey = wallet.privateKey;
            const { address, publicKeyBase58 } = await createKeyPair(privateKey);
            const did = `did:polygon:${address}`;

            return { address, publicKeyBase58, privateKey, did };
        }

    } catch (error) {
        logger.error(`Error occurred in createDID function ${error}`);
        throw error;
    }
}

/**
 * Register DID document on matic chain
 * @returns
 */
export async function registerDID(did: string, privateKey: string, url?: string, contractAddress?: string): Promise<object> {
    try {

        const PRIVATE_KEY = privateKey;

        const URL = url || process.env.URL;
        const CONTRACT_ADDRESS = contractAddress || process.env.CONTRACT_ADDRESS;
        const provider = new ethers.providers.JsonRpcProvider(URL);

        let wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        registry = new ethers.Contract(CONTRACT_ADDRESS, polygonDIDRegistryABI, wallet);

        const kp = await createKeyPair(PRIVATE_KEY);
        // Get DID document
        const didDoc = await wrapDidDocument(did, kp.publicKeyBase58);

        const stringDIDDoc = JSON.stringify(didDoc);

        // Calling createDID with Create DID and register on match chain
        const txnHash = await registrarDid(did.split(":")[2], stringDIDDoc);

        logger.debug(`[registerDID] txnHash - ${JSON.stringify(txnHash)} \n\n\n`);
        return { did, txnHash };
    } catch (error) {
        logger.error(`Error occurred in registerDID function  ${error}`);
        throw error;
    }
}

/**
 * Register DID document on matic chain
 * @param address
 * @param DidDoc
 * @returns
 */
async function registrarDid(address: string, DidDoc: string) {
    try {

        // Calling smart contract with register DID document on matic chain
        let returnHashValues = await registry.functions.createDID(address, DidDoc)
            .then((resHashValue) => {
                return resHashValue;
            });
        return returnHashValues;
    } catch (error) {
        logger.error(`Error occurred in createDid function  ${error}`);
        throw error;
    }
}
