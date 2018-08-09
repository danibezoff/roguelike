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

export function worldDistance (worldTileRatio, pos1, pos2) {
  const sq = x => Math.pow(x, 2)
  let xs = pos1.x - pos2.x
  let ys = pos1.y - pos2.y
  let zs = (pos1.z - pos2.z) * 4
  return Math.sqrt(sq(xs) + sq(ys) + sq(zs))
}

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

  let bubbleCenter = {
    x: Math.floor(width / 2),
    y: Math.floor(height / 2),
    z: Math.floor(depth / 2)
  }

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      for (let z = 0; z < depth; z++) {
        let distance = worldDistance(worldTileRatio, { x, y, z }, bubbleCenter)
        if (distance > radius) bubble[x][y][z] = undefined
      }
    }
  }

  return bubble
}
