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

export function saveIndexFromOverflow (index, length) {
  while (index >= length) { index -= length }
  while (index < 0) { index += length }
  return index
}

// TODO: make spherical
export function getBubbleFromWorld (world, center, radius) {
  const worldTileRatio = world.worldTileRatio
  const worldData = world.data

  let width, height, depth
  let offsetX = Math.floor(radius)
  let offsetZ = Math.floor(radius / worldTileRatio)
  width = height = offsetX * 2 + 1
  depth = offsetZ * 2 + 1

  let bubble = dimensionalArr(width, height, depth)
  let worldW = worldData.length
  let worldH = worldData[0].length
  let startWorldX = center.x - offsetX
  let startWorldY = center.y - offsetX
  let startWorldZ = center.z - offsetZ
  let worldX = startWorldX
  let worldY = startWorldY
  let worldZ = startWorldZ
  let x, y, z
  x = y = z = 0

  while (x < width) {
    let safeWorldX = saveIndexFromOverflow(worldX, worldW)
    while (y < height) {
      let safeWorldY = saveIndexFromOverflow(worldY, worldH)
      while (z < depth) {
        bubble[x][y][z] = worldData[safeWorldX][safeWorldY][worldZ]
        z++
        worldZ++
      }
      z = 0
      worldZ = startWorldZ
      y++
      worldY++
    }
    y = 0
    worldY = startWorldY
    x++
    worldX++
  }

  return bubble
}
