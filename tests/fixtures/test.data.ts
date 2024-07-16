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
  address: '0x4487cB2567De2Ca6dc5F79A7f6ae944522C4b698',
  did: 'did:polygon:testnet:0x4487cB2567De2Ca6dc5F79A7f6ae944522C4b698',
  privateKey:
    '6320c5bcc5edfb1f3324b94a67c0e69916d828d6374ddb1dfeae92c27e3098de', //test key
  publicKeyBase58:
    '7Lnm1Zi2K75KVgHPrHADCpfa9cLAtRRocBgLsFVLw5NRPUgoLBBv1Se8ttjx4P7fXfNS5gazJmKqohNmwEqx8VjDYfPvw',
}

export const testContractDetails = {
  contractAddress: '0xc087766218b885C6283072BA316a2Bc31B5c17db',
  unitTestCaseContractAddess: '0xc087766218b885C6283072BA316a2Bc31B5c17db',
  networkUrl: 'https://rpc-amoy.polygon.technology',
}
