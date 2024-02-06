import { buildTestDidDoc } from '../utils/array'

export const updateDidDocument = buildTestDidDoc(
  'did:polygon:testnet:0x13cd23928Ae515b86592C630f56C138aE4c7B79a',
  '7Lnm1Zi2K75KVgHPrHADCpfa9cLAtRRocBgLsFVLw5NRPUgoLBBv1Se8ttjx4P7fXfNS5gazJmKqohNmwEqx8VjDYfPvw',
  'https://example.com',
)

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
  address: '0x13cd23928Ae515b86592C630f56C138aE4c7B79a',
  did: 'did:polygon:testnet:0x13cd23928Ae515b86592C630f56C138aE4c7B79a',
  privateKey:
    '3f6254328fa58202094c954d89964119830f85e2f4bfdbabb1d8bcfc008d2fdd', //test key
  publicKeyBase58:
    '7Lnm1Zi2K75KVgHPrHADCpfa9cLAtRRocBgLsFVLw5NRPUgoLBBv1Se8ttjx4P7fXfNS5gazJmKqohNmwEqx8VjDYfPvw',
}

export const testContractDetails = {
  contractAddress: '0x12513116875BB3E4F098Ce74624739Ee51bAf023',
  unitTestCaseContractAddess: '0x55D479D1260Dc7cA907c27292d6F49c1E8B461Af',
  networkUrl: 'https://rpc-mumbai.maticvigil.com',
}
