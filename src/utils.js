export function dimensionalArr (...dimensionSizes) {
  return insertDim(dimensionSizes, [], 0)
}

function insertDim (dimensionSizes, arr, i) {
  let last = dimensionSizes.length === i + 1
  for (let j = 0; j < dimensionSizes[i]; j++) {
    arr[j] = last ? undefined : insertDim(dimensionSizes, [], i + 1)
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

  // OPTIMIZE: this block seems to be > 5ms
  while (x < width) {
    let safeWorldX = saveIndexFromOverflow(worldX, worldW)
    while (y < height) {
      let safeWorldY = saveIndexFromOverflow(worldY, worldH)
      while (z < depth) {
        let worldTile = worldData[safeWorldX][safeWorldY][worldZ]
        bubble[x][y][z] = worldTile ? { worldData: worldTile } : undefined
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

  excludeTilesBeyondRadius(bubble, radius, worldTileRatio)
  return bubble
}

const excludeTilesBeyondRadius = (function () {
  let cache = {}

  function execute (bubble, radius, worldTileRatio) {
    let cacheProp = `${radius}|${worldTileRatio}`
    if (cacheProp in cache) {
      let data = cache[cacheProp]

      for (let x = 0; x < data.w; x++) {
        for (let y = 0; y < data.h; y++) {
          for (let z = 0; z < data.d; z++) {
            let tile = data.tiles[x][y][z]
            if (tile === undefined) {
              bubble[x][y][z] = undefined
            }
          }
        }
      }
    } else {
      let width = bubble.length
      let height = bubble[0].length
      let depth = bubble[0][0].length

      cache[cacheProp] = {
        w: width,
        h: height,
        d: depth,
        tiles: dimensionalArr(width, height, depth)
      }

      let bubbleCenter = {
        x: Math.floor(width / 2),
        y: Math.floor(height / 2),
        z: Math.floor(depth / 2)
      }

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          for (let z = 0; z < depth; z++) {
            let distance = worldDistance(
              worldTileRatio, { x, y, z }, bubbleCenter
            )
            if (distance > radius) {
              cache[cacheProp].tiles[x][y][z] = undefined
              bubble[x][y][z] = undefined
            } else {
              cache[cacheProp].tiles[x][y][z] = 1
            }
          }
        }
      }
    }
  }

  return execute
}())

export function withTilesInLine (pos1, pos2, callback, worldTileRatio) {
  let xDist = Math.abs(pos1.x - pos2.x)
  let yDist = Math.abs(pos1.y - pos2.y)
  let zDist = Math.abs(pos1.z - pos2.z)

  let onAxisY, onAxisZ
  let longest = Math.max(xDist, yDist, zDist)

  if (xDist === longest) {
    // empty
  } else if (yDist === longest) {
    onAxisY = true
    ;[pos1.x, pos1.y] = [pos1.y, pos1.x]
    ;[pos2.x, pos2.y] = [pos2.y, pos2.x]
  } else if (zDist === longest) {
    onAxisZ = true
    ;[pos1.x, pos1.z] = [pos1.z, pos1.x]
    ;[pos2.x, pos2.z] = [pos2.z, pos2.x]
  }

  let steps = Math.abs(pos2.x - pos1.x)

  let deltaX = pos2.x > pos1.x ? 1 : -1
  let deltaY = (pos2.y - pos1.y) / steps
  let deltaZ = (pos2.z - pos1.z) / steps

  let deltedX = pos1.x + 0.5
  let deltedY = pos1.y + 0.5
  let deltedZ = pos1.z + 0.5
  let lastSinglePoint

  for (let point = 0; point < steps + 1; point++) {
    let points = []
    let x = Math.floor(deltedX)
    let y = Math.floor(deltedY)
    let z = Math.floor(deltedZ)
    points.push({ x, y, z })

    if (y === deltedY) {
      points.push({ x, y: y - 1, z })
    }
    if (z === deltedZ) {
      points.push({ x, y, z: z - 1 })
    }
    if (points.length === 3) {
      points.push({ x, y: y - 1, z: z - 1 })
    }

    if (onAxisY) {
      for (let i = 0; i < points.length; i++) {
        [points[i].x, points[i].y] = [points[i].y, points[i].x]
      }
    }
    if (onAxisZ) {
      for (let i = 0; i < points.length; i++) {
        [points[i].x, points[i].z] = [points[i].z, points[i].x]
      }
    }

    if (points.length !== 1) {
      points.sort((a, b) => {
        let aDist = worldDistance(worldTileRatio, lastSinglePoint, a)
        let bDist = worldDistance(worldTileRatio, lastSinglePoint, b)
        let residual = aDist - bDist
        if (residual === 0) { // we moving along z
          if (deltaZ > 0) {
            return a.x - b.x
          } else {
            return b.x - a.x
          }
        }
        return residual
      })
    } else {
      lastSinglePoint = points[0]
    }

    let centered = !(deltedX % 0.5) && !(deltedY % 0.5) && !(deltedZ % 0.5)
    if (callback(points, centered)) return

    deltedX += deltaX
    deltedY += deltaY
    deltedZ += deltaZ
  }
}
