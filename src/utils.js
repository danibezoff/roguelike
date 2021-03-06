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
  let zs = (pos1.z - pos2.z) * worldTileRatio
  return Math.sqrt(sq(xs) + sq(ys) + sq(zs))
}

// FIXME: rounding error
export function withTilesInLine (p1, p2, callback) {
  let pos1 = { x: p1.x, y: p1.y, z: p1.z }
  let pos2 = { x: p2.x, y: p2.y, z: p2.z }

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
        let dummyTileRatio = 2
        let aDist = worldDistance(dummyTileRatio, lastSinglePoint, a)
        let bDist = worldDistance(dummyTileRatio, lastSinglePoint, b)
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
