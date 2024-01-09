import { ResourcePayload } from '../registrar'

class ValidationError extends Error {
  constructor(message: string | undefined) {
    super(message)
    this.name = 'ValidationError'
  }
}

export const validateResourcePayload = (payload: ResourcePayload) => {
  // Validate that required fields are present
  const {
    resourceCollectionId,
    resourceId,
    resourceName,
    resourceType,
    mediaType,
    created,
    checksum,
    resourceURI,
  } = payload

  if (
    !resourceCollectionId ||
    !resourceId ||
    !resourceName ||
    !resourceType ||
    !mediaType ||
    !created ||
    !checksum
  ) {
    throw new ValidationError('Required fields are missing in the payload')
  }

  // Validate resourceURI format
  const isValidPolygonURI =
    /^did:polygon(:testnet)?:0x[0-9a-fA-F]{40}\/resources\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      resourceURI,
    )

  if (!isValidPolygonURI) {
    throw new ValidationError('Invalid format for resourceURI')
  }

  // Validate resourceType
  const allowedTypes = ['image/png', 'CL-schema', 'URL', 'W3C-schema']
  if (!allowedTypes.includes(resourceType)) {
    throw new ValidationError('Invalid resourceType')
  }
}
