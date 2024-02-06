import {
  DidDocument,
  DidDocumentBuilder,
  DidDocumentService,
} from '@aries-framework/core'

export const arrayHasKeys = (array1: string[], array2: string[]) => {
  const keys1 = Object.keys(array1)
  const keys2 = Object.keys(array2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false
    }
  }

  return true
}

export function buildTestDidDoc(
  did: string,
  publicKeyBase58: string,
  serviceEndpoint?: string,
): DidDocument {
  const verificationMethod = {
    id: `${did}#key-1`,
    type: 'EcdsaSecp256k1VerificationKey2019',
    controller: did,
    publicKeyBase58,
  }

  const didDocumentBuilder = new DidDocumentBuilder(did)
  didDocumentBuilder
    .addContext('ttps://w3id.org/security/suites/secp256k1-2019/v1')
    .addVerificationMethod(verificationMethod)

    .addAuthentication(verificationMethod.id)
    .addAssertionMethod(verificationMethod.id)
    .addCapabilityDelegation(verificationMethod.id)
    .addCapabilityInvocation(verificationMethod.id)
    .addKeyAgreement(verificationMethod.id)

  if (serviceEndpoint) {
    const service = new DidDocumentService({
      id: `${did}#linked-domain`,
      serviceEndpoint,
      type: 'LinkedDomains',
    })

    didDocumentBuilder.addService(service)
  }

  return didDocumentBuilder.build()
}
