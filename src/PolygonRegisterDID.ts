import * as dot from 'dotenv';
import { polygonDIDRegistryABI } from './PolygonDIDRegistryABI';
import { toEthereumAddress } from 'did-jwt';
import * as log4js from "log4js";
const bs58 = require('bs58')
const ethers = require('ethers');
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
            // publicKey: [{
            //     id: `${did}#keys-1`,
            //     type: 'Secp256k1VerificationKey2018',
            //     owner: did,
            //     ethereumAddress: address
            // }]
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
        
        const bufferPublicKey = Buffer.from(publicKey, 'hex');
        const publicKeyBase58 = bs58.encode(bufferPublicKey);

        const bufferPrivateKey = Buffer.from(privateKey, 'hex');
        const privateKeyBase58 = bs58.encode(bufferPrivateKey);
        return { address, publicKeyBase58, privateKeyBase58 };
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
                    logger.debug(`****** [createDid] ****** resHashValue - ${JSON.stringify(resHashValue)} \n\n\n`);
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