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
