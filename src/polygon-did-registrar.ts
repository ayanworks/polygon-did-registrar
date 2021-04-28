import * as dot from "dotenv";
import * as log4js from "log4js";
import * as bs58 from "bs58";
import { polygonDidRegistryABI } from "./polygon-did-registry-abi";
import { ethers } from "ethers";
import { Wallet } from '@ethersproject/wallet'
import { computeAddress } from "@ethersproject/transactions";
import { computePublicKey } from "@ethersproject/signing-key";
import { BaseResponse } from "./base-response";
import { default as CommonConstants } from "./configuration";

dot.config();

const logger = log4js.getLogger();
logger.level = `${CommonConstants.LOGGER_LEVEL}`;

/**
 * Create DID Document.
 * @param did
 * @param address
 * @returns Returns the DID Document.
 */
async function wrapDidDocument(
    did: string,
    publicKeyBase58: string
): Promise<object> {
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
 * Create public and private key and generate address.
 * @param privateKey
 * @returns Returns the address and public key of type base58.
 */
async function createKeyPair(
    privateKey: string
): Promise<any> {
    try {
        const publicKey: string = computePublicKey(privateKey, true);

        const bufferPublicKey: Buffer = Buffer.from(publicKey);
        const publicKeyBase58: string = bs58.encode(bufferPublicKey);

        const address: string = computeAddress(privateKey);

        return { address, publicKeyBase58 };
    } catch (error) {
        logger.error(`Error occurred in createKeyPair function ${error}`);
        throw error;
    }
}

/**
 * Creates a DID Uri
 * @param privateKey
 * @returns Returns the address, public key of type base58, private key and DID Uri
 */
export async function createDID(
    privateKey?: string
): Promise<BaseResponse> {
    try {

        let did: string;
        let _privateKey: string;

        if (privateKey) {
            _privateKey = privateKey;
        } else {
            const wallet: ethers.Wallet = Wallet.createRandom();
            _privateKey = wallet.privateKey;
        }

        const { address, publicKeyBase58 } = await createKeyPair(_privateKey);
        did = `did:polygon:${address}`;

        logger.debug(`[createDID] address - ${JSON.stringify(address)} \n\n\n`);
        logger.debug(`[createDID] did - ${JSON.stringify(did)} \n\n\n`);

        return BaseResponse.from({ address, publicKeyBase58, _privateKey, did }, 'Created DID uri successfully');
    } catch (error) {
        logger.error(`Error occurred in createDID function ${error}`);
        throw error;
    }
}

/**
 * Registers DID document on matic chain
 * @param did
 * @param privateKey
 * @param url
 * @param contractAddress
 * @returns Returns DID and transaction hash
 */
export async function registerDID(
    did: string,
    privateKey: string,
    url?: string,
    contractAddress?: string
): Promise<BaseResponse> {
    try {
        const URL: string = url || `${CommonConstants.URL}`;
        const CONTRACT_ADDRESS: string = contractAddress || `${CommonConstants.CONTRACT_ADDRESS}`;

        const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(
            URL
        );
        const wallet: ethers.Wallet = new ethers.Wallet(privateKey, provider);
        const registry: ethers.Contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            polygonDidRegistryABI,
            wallet
        );

        const kp: any = await createKeyPair(privateKey);

        // Get DID document
        const didDoc: object = await wrapDidDocument(did, kp.publicKeyBase58);
        const stringDidDoc: string = JSON.stringify(didDoc);

        // Calling smart contract with register DID document on matic chain
        const txnHash: any = await registry.functions
            .createDID(did.split(":")[2], stringDidDoc)
            .then((resValue: any) => {
                return resValue;
            });

        logger.debug(`[registerDID] txnHash - ${JSON.stringify(txnHash)} \n\n\n`);

        return BaseResponse.from({ did, txnHash }, 'Registered DID document successfully.');
    } catch (error) {
        logger.error(`Error occurred in registerDID function  ${error}`);
        throw error;
    }
}
