import * as dot from 'dotenv';
import { polygonDIDRegistryABI } from './PolygonDIDRegistryABI';
import { toEthereumAddress } from 'did-jwt';
import * as log4js from "log4js";
const bs58 = require('bs58')
const ethers = require('ethers');
const multibase = require('multibase');
const EC = require('elliptic').ec;

dot.config();

const secp256k1 = new EC('secp256k1');

const url = process.env.URL;
const DID_ADDRESS = `${process.env.DID_ADDRESS}`;
const provider = new ethers.providers.JsonRpcProvider(url);

let wallet = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);
let registry = new ethers.Contract(DID_ADDRESS, polygonDIDRegistryABI, wallet);

const logger = log4js.getLogger();
logger.level = process.env.LOGGER_LEVEL;

export class PolyGonDIDRegistry {

    constructor() { }

    /**
     * Create and return DID Document
     * @param did 
     * @param address 
     * @returns 
     */
    async wrapDidDocument(did: string, publicKeyBase58: string, address: string): Promise<object> {
        return {
            '@context': 'https://w3id.org/did/v1',
            id: did,
            "verificationMethod": [
                {
                    "id": did,
                    "type": "EcdsaSecp256k1VerificationKey2019", // external (property value)
                    "controller": did,
                    "publicKeyBase58": publicKeyBase58,
                }
            ]
        }
    }

    /**
     * Create public and private key and generate address
     * @returns 
     */
    async createKeyPair(): Promise<any> {

        const kp = secp256k1.genKeyPair()
        const publicKey = kp.getPublic('hex');
        const privateKey = kp.getPrivate('hex');
        const address = toEthereumAddress(publicKey);

        logger.debug(`*********** [createKeyPair] ******* publicKey Hex - ${JSON.stringify(publicKey)} \n\n\n`);
        logger.debug(`*********** [createKeyPair] ******* privateKey Hex - ${JSON.stringify(privateKey)}`);

        const bufferPublicKey = Buffer.from(publicKey, 'hex');
        logger.debug(`*********** [createKeyPair] ******** bufferPublicKey Buffer - ${JSON.stringify(bufferPublicKey)} \n\n\n`);

        const publicKeyBase58 = bs58.encode(bufferPublicKey);
        logger.debug(`*********** [createKeyPair] ******** publicKeyBase58 - ${JSON.stringify(publicKeyBase58)} \n\n\n`)

        const bufferPrivateKey = Buffer.from(privateKey, 'hex');
        logger.debug(`*********** [createKeyPair] ******** bufferPrivateKey Buffer - ${JSON.stringify(bufferPrivateKey)} \n\n\n`);

        const privateKeyBase58 = bs58.encode(bufferPrivateKey);
        logger.debug(`*********** [createKeyPair] ********* privateKeyBase58 - ${JSON.stringify(privateKeyBase58)} \n\n\n`);

        return { address, publicKeyBase58, privateKeyBase58 };
    }

    /**
     * Message Sign 
     * @param privateKeyBase58 
     * @param message 
     */
    async sign(privateKeyBase58: string, message: any): Promise<any> {

        const privateKey = bs58.decode(privateKeyBase58);
        logger.debug(`*********** [sign] ******** privateKey - ${JSON.stringify(privateKey)} \n\n\n`);

        const hexPrivateKey = privateKey.toString('hex');
        logger.debug(`*********** [sign] ******** hexPrivateKey - ${JSON.stringify(hexPrivateKey)} \n\n\n`)

        const kp = secp256k1.keyFromPrivate(hexPrivateKey);

        const signature = kp.sign(message);
        logger.debug(`*********** [sign] ******** signature - ${JSON.stringify(signature)} \n\n\n`);

        return signature;
    }

    /**
     * Signature verification
     * @param publicKeyBase58 
     * @param message 
     * @param signature 
     */
    async verify(publicKeyBase58: string, message: any, signature: any) {

        logger.info("************ verify ********************");

        const publicKey = bs58.decode(publicKeyBase58);
        logger.debug(`*********** [verify] ********** publicKey - ${JSON.stringify(publicKey)} \n\n\n`);

        const hexPublicKey = publicKey.toString('hex');
        logger.debug(`*********** [verify] ********** hexPublicKey - ${JSON.stringify(hexPublicKey)} \n\n\n`);

        const kp = secp256k1.keyFromPublic(hexPublicKey, 'hex');
        const verify = kp.verify(message, signature);
        logger.debug(`*********** [verify] ********** verify - ${JSON.stringify(verify)} \n\n\n`);

        return verify;
    }

    /**
     * Register DID document on matic chain
     * @returns 
     */
    async registerDID(): Promise<object> {

        try {
            logger.info("*************** registerDid *******************");

            const { address, publicKeyBase58, privateKeyBase58 } = await this.createKeyPair();

            // DID format
            const did = `did:polygon:${address}`;

            // Get DID document
            const didDoc = await this.wrapDidDocument(did, publicKeyBase58, address);

            // message format
            const message = "Shashank Kulkarni";

            // Sign
            const messageHex = Buffer.from(message, 'hex');
            logger.debug(`***** [registerDID] ****** messageHex - ${JSON.stringify(messageHex)}`);
            const signature = await this.sign(privateKeyBase58, messageHex);

            // Verified signature
            const verifiedSignature = await this.verify(publicKeyBase58, messageHex, signature);
            logger.debug(`******* [registerDID] ****** verifiedSignature - ${verifiedSignature}`);

            const stringDIDDoc = JSON.stringify(didDoc);
            logger.debug(`****** [registerDID] ****** address - ${JSON.stringify(address)} \n\n\n`);
            logger.debug(`****** [registerDID] ****** stringDIDDoc - ${JSON.stringify(stringDIDDoc)} \n\n\n`);

            // Calling createDID with Create DID and register on match chain 
            const returnAddress = await this.createDid(address, stringDIDDoc);

            logger.debug(`****** [registerDID] ****** returnAddress - ${JSON.stringify(returnAddress)} \n\n\n`);
            return { did, returnAddress };
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * Register DID document on matic chain  
     * @param address 
     * @param DidDoc 
     * @returns 
     */
    async createDid(address: string, DidDoc: string) {
        try {

            // Calling smart contract with register DID document on matic chain
            let returnHashValues = await registry.functions.createDID(address, DidDoc)
                .then((resHashValue) => {
                    return resHashValue;
                })
            return returnHashValues;
        }
        catch (error) {
            throw error;
        }
    }
}

const polyGonDIDUpdate = new PolyGonDIDRegistry();
polyGonDIDUpdate.registerDID();