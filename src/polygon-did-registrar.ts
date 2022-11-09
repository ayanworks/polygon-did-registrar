import * as log4js from "log4js";
import * as bs58 from "bs58";
import { ethers, utils } from "ethers";
import { Wallet } from "@ethersproject/wallet";
import { computeAddress } from "@ethersproject/transactions";
import { computePublicKey } from "@ethersproject/signing-key";
import { BaseResponse } from "./base-response";
import { DidUriValidation } from "./did-uri-validation";
import { RegistryContractInitialization } from "./registry-contract-initialization";
const axios = require('axios').default;

const logger = log4js.getLogger();
logger.level = `debug`;

/**
 * Create DID Document.
 * @param did
 * @param address
 * @returns Returns the DID Document.
 */
async function wrapDidDocument(
      did: string,
      publicKeyBase58: string,
      serviceEndpoint?: string

): Promise<object> {
      if(serviceEndpoint){
            return {
                  "@context": "https://w3id.org/did/v1",
                  id: did,
                  verificationMethod: [
                        {
                              id:`${did}#key-1`,
                              type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
                              controller: did,
                              publicKeyBase58: publicKeyBase58,
                        },
                  ],
                  "authentication" : [
                        did,
                        {
                              id:`${did}#key-1`,
                              type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
                              controller: did,
                              publicKeyBase58: publicKeyBase58,
                        }
                  ],
                  "assertionMethod" : [
                        did,
                        {
                              id:`${did}#key-1`,
                              type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
                              controller: did,
                              publicKeyBase58: publicKeyBase58,
                        }
                  ],
                  "service" : [
                        {
                        id:`${did}#linked-domain`,
                        type: "LinkedDomains", 
                        serviceEndpoint: `${serviceEndpoint}`
                      }]
      
            };

      }else {
            return {
                  "@context": "https://w3id.org/did/v1",
                  id: did,
                  verificationMethod: [
                        {
                              id:`${did}#key-1`,
                              type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
                              controller: did,
                              publicKeyBase58: publicKeyBase58,
                        },
                  ],
                  "authentication" : [
                        did,
                        {
                              id:`${did}#key-1`,
                              type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
                              controller: did,
                              publicKeyBase58: publicKeyBase58,
                        }
                  ],
                  "assertionMethod" : [
                        did,
                        {
                              id:`${did}#key-1`,
                              type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
                              controller: did,
                              publicKeyBase58: publicKeyBase58,
                        }
                  ],
      
            };
      }
     
}

/**
 * Create public and private key and generate address.
 * @param privateKey
 * @returns Returns the address and public key of type base58.
 */
async function createKeyPair(privateKey: string): Promise<any> {
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
 * Creates a DID Uri.
 * @param privateKey
 * @returns Returns the address, public key of type base58, private key and DID Uri.
 */
export async function createDID(
      network: string,
      privateKey?: string
): Promise<BaseResponse> {
      try {
            let errorMessage: string;
            let did: string;
            let _privateKey: string;

            if (privateKey) {
                  _privateKey = privateKey;
            } else {
                  const wallet: ethers.Wallet = Wallet.createRandom();
                  _privateKey = wallet.privateKey;
            }

            const { address, publicKeyBase58 } = await createKeyPair(_privateKey);

            if (network === "testnet") {
                  did = `did:polygon:testnet:${address}`;
            } else if (network === "mainnet") {
                  did = `did:polygon:${address}`;
            } else {
                  errorMessage = `Wrong network enter!`;
                  logger.error(errorMessage);
                  throw new Error(errorMessage);
            }

            logger.debug(`[createDID] address - ${JSON.stringify(address)} \n\n\n`);
            logger.debug(`[createDID] did - ${JSON.stringify(did)} \n\n\n`);

            return BaseResponse.from(
                  { address, publicKeyBase58, _privateKey, did },
                  "Created DID uri successfully"
            );
      } catch (error) {
            logger.error(`Error occurred in createDID function ${error}`);
            throw error;
      }
}

/**
 * Registers DID document on matic chain.
 * @param did
 * @param privateKey
 * @param url
 * @param contractAddress
 * @returns Returns DID and transaction hash.
 */
export async function registerDID(
      did: string,
      privateKey: string,
      url?: string,
      contractAddress?: string, 
      serviceEndpoint?: string
): Promise<BaseResponse> {
      try {
            let errorMessage: string;
            let didDoc: object;
            const didUriValidation: DidUriValidation = new DidUriValidation();
            const registryContractInitialization: RegistryContractInitialization = new RegistryContractInitialization();

            const didMethodCheck: Boolean = await didUriValidation.polygonDidMatch(did);
            const didWithTestnet: string = await didUriValidation.splitPolygonDid(did);

            if (didMethodCheck) {
                  const kp: any = await createKeyPair(privateKey);

                  const networkCheckWithUrl: any = await didUriValidation.networkMatch(
                        did,
                        url,
                        contractAddress
                  );

                  if (
                        (did &&
                              didWithTestnet === "testnet" &&
                              did.split(":")[3] === kp.address) ||
                        (did && didWithTestnet === kp.address)
                  ) {
                        const registry: ethers.Contract = await registryContractInitialization.instanceCreation(
                              privateKey,
                              networkCheckWithUrl.url,
                              networkCheckWithUrl.contractAddress
                        );
                        const didAddress: string =
                              didWithTestnet === "testnet" ? did.split(":")[3] : didWithTestnet;

                        let resolveDidDoc: any = await registry.functions
                              .getDIDDoc(didAddress)
                              .then((resValue: any) => {
                                    return resValue;
                              });
                        if (resolveDidDoc.includes("")) {
                              // Get DID document
                              if(serviceEndpoint){
                                     didDoc = await wrapDidDocument(did, kp.publicKeyBase58, serviceEndpoint);  
                              } else{
                                     didDoc = await wrapDidDocument(did, kp.publicKeyBase58);
                              }
                              
                              const stringDidDoc: string = JSON.stringify(didDoc);

                              const txnHash: any = await registry.functions
                                    .createDID( didAddress, stringDidDoc )
                                    .then((resValue: any) => {
                                          return resValue;
                                    });

                              logger.debug(
                                    `[registerDID] txnHash - ${JSON.stringify(txnHash)} \n\n\n`
                              );

                              return BaseResponse.from(
                                    { did, txnHash },
                                    "Registered DID document successfully."
                              );
                        } else {
                              errorMessage = `The DID document already registered!`;
                              logger.error(errorMessage);
                              throw new Error(errorMessage);
                        }
                  } else {
                        errorMessage = `Private key and DID uri do not match!`;
                        logger.error(errorMessage);
                        throw new Error(errorMessage);
                  }
            } else {
                  errorMessage = `DID does not match!`;
                  logger.error(errorMessage);
                  throw new Error(errorMessage);
            }
      } catch (error) {
            logger.error(`Error occurred in registerDID function  ${error}`);
            throw error;
      }
}