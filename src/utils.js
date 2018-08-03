export function dimensionalArr (...dimensionSizes) {
  let [size, ...rest] = dimensionSizes
  if (size === undefined) return undefined

  let arr = []
  for (let i = 0; i < size; i++) {
    arr[i] = dimensionalArr(...rest)
  }
  return arr
}

export function hexToCss (hex) {
  return '#' + ('00000' + hex.toString(16)).slice(-6)
}