export const updateDidDocument = {
      "@context": [
          "https://w3id.org/did/v1",
          "https://w3id.org/security/suites/secp256k1-2019/v1"
      ],
      "id": "did:polygon:testnet:0x13cd23928Ae515b86592C630f56C138aE4c7B79a",
      "verificationMethod": [
          {
              "id": "did:polygon:testnet:0x13cd23928Ae515b86592C630f56C138aE4c7B79a#key-1",
              "type": "EcdsaSecp256k1VerificationKey2019",
              "controller": "did:polygon:testnet:0xc0e2083Dd8b8CDbbf8fb29eb47F8d2228B71ABC",
              "publicKeyBase58": "7Lnm1Zi2K75KVgHPrHADCpfa9cLAtRRocBgLsFVLw5NRPUgoLBBv1Se8ttjx4P7fXfNS5gazJmKqohNmwEqx8VjDYfPvw"
          }
      ],
      "authentication": [
          "did:polygon:testnet:0x13cd23928Ae515b86592C630f56C138aE4c7B79a",
          {
              "id": "did:polygon:testnet:0x13cd23928Ae515b86592C630f56C138aE4c7B79a#key-1",
              "type": "EcdsaSecp256k1VerificationKey2019",
              "controller": "did:polygon:testnet:0x13cd23928Ae515b86592C630f56C138aE4c7B79a",
              "publicKeyBase58": "7Lnm1Zi2K75KVgHPrHADCpfa9cLAtRRocBgLsFVLw5NRPUgoLBBv1Se8ttjx4P7fXfNS5gazJmKqohNmwEqx8VjDYfPvw"
          }
      ],
      "assertionMethod": [
          "did:polygon:testnet:0x13cd23928Ae515b86592C630f56C138aE4c7B79a",
          {
              "id": "did:polygon:testnet:0x13cd23928Ae515b86592C630f56C138aE4c7B79a#key-1",
              "type": "EcdsaSecp256k1VerificationKey2019",
              "controller": "did:polygon:testnet:0x13cd23928Ae515b86592C630f56C138aE4c7B79a",
              "publicKeyBase58": "7Lnm1Zi2K75KVgHPrHADCpfa9cLAtRRocBgLsFVLw5NRPUgoLBBv1Se8ttjx4P7fXfNS5gazJmKqohNmwEqx8VjDYfPvw"
          }
      ],
      "service": [
          {
              "id": "did:polygon:testnet:0x13cd23928Ae515b86592C630f56C138aE4c7B79a#linked-domain",
              "type": "LinkedDomains",
              "serviceEndpoint": "https://example.com"
          }
      ]
  }


export const privateKey =
  '3f6254328fa58202094c954d89964119830f85e2f4bfdbabb1d8bcfc008d2fdd'

export const network = 'testnet'

export const resourceJson = {
  resourceURI:
    'did:polygon:testnet:0x13cd23928Ae515b86592C630f56C138aE4c7B79a/resources/398cee0a-efac-4643-9f4c-74c48c72a14b',
  resourceCollectionId: '55dbc8bf-fba3-4117-855c-1e0dc1d3bb47',
  resourceId: '398cee0a-efac-4643-9f4c-74c48c72a14b',
  resourceName: 'Eventbrite1 Logo',
  resourceType: 'image/png',
  mediaType: 'image/svg+xml',
  created: '2022-11-17T08:10:36Z',
  checksum: 'a95380f460e63ad939541a57aecbfd795fcd37c6d78ee86c885340e33a91b559',
  previousVersionId: null,
  nextVersionId: null,
}

export const testResourceId = 'b5db4a5f-2f97-4449-a755-9af0b43119ae' // Add your test resourceId


export const testDidDetails = {
  address:'0x13cd23928Ae515b86592C630f56C138aE4c7B79a',
  did:'did:polygon:testnet:0x13cd23928Ae515b86592C630f56C138aE4c7B79a',
  privateKey:
    '3f6254328fa58202094c954d89964119830f85e2f4bfdbabb1d8bcfc008d2fdd', //test key
  publicKeyBase58:
    '7Lnm1Zi2K75KVgHPrHADCpfa9cLAtRRocBgLsFVLw5NRPUgoLBBv1Se8ttjx4P7fXfNS5gazJmKqohNmwEqx8VjDYfPvw',
}

export const testContractDetails = {
  contractAddress: '0x9bd1A5d2ac2D391AaF7177Ee27A5520C4844f1C3',
  networkUrl: 'https://rpc-mumbai.maticvigil.com',
}
