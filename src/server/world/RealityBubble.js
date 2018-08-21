import {worldDistance, dimensionalArr, saveIndexFromOverflow} from 'utils'
import rbush from 'rbush'

const octantThirdTransforms = [
  { xx:  1, xy:  0, xz:  0, yy:  1, yx:  0, yz:  0, zz:  1, zx:  0, zy:  0 },
  { xx: -1, xy:  0, xz:  0, yy:  1, yx:  0, yz:  0, zz:  1, zx:  0, zy:  0 },
  { xx:  1, xy:  0, xz:  0, yy: -1, yx:  0, yz:  0, zz:  1, zx:  0, zy:  0 },
  { xx: -1, xy:  0, xz:  0, yy: -1, yx:  0, yz:  0, zz:  1, zx:  0, zy:  0 },
  { xx:  0, xy:  1, xz:  0, yy:  0, yx:  1, yz:  0, zz:  1, zx:  0, zy:  0 },
  { xx:  0, xy: -1, xz:  0, yy:  0, yx:  1, yz:  0, zz:  1, zx:  0, zy:  0 },
  { xx:  0, xy:  1, xz:  0, yy:  0, yx: -1, yz:  0, zz:  1, zx:  0, zy:  0 },
  { xx:  0, xy: -1, xz:  0, yy:  0, yx: -1, yz:  0, zz:  1, zx:  0, zy:  0 },

  { xx:  1, xy:  0, xz:  0, yy:  1, yx:  0, yz:  0, zz: -1, zx:  0, zy:  0 },
  { xx: -1, xy:  0, xz:  0, yy:  1, yx:  0, yz:  0, zz: -1, zx:  0, zy:  0 },
  { xx:  1, xy:  0, xz:  0, yy: -1, yx:  0, yz:  0, zz: -1, zx:  0, zy:  0 },
  { xx: -1, xy:  0, xz:  0, yy: -1, yx:  0, yz:  0, zz: -1, zx:  0, zy:  0 },
  { xx:  0, xy:  1, xz:  0, yy:  0, yx:  1, yz:  0, zz: -1, zx:  0, zy:  0 },
  { xx:  0, xy: -1, xz:  0, yy:  0, yx:  1, yz:  0, zz: -1, zx:  0, zy:  0 },
  { xx:  0, xy:  1, xz:  0, yy:  0, yx: -1, yz:  0, zz: -1, zx:  0, zy:  0 },
  { xx:  0, xy: -1, xz:  0, yy:  0, yx: -1, yz:  0, zz: -1, zx:  0, zy:  0 },

  { xx:  1, xy:  0, xz:  0, yy:  0, yx:  0, yz: -1, zz:  0, zx:  0, zy:  1 },
  { xx: -1, xy:  0, xz:  0, yy:  0, yx:  0, yz: -1, zz:  0, zx:  0, zy:  1 },
  { xx:  1, xy:  0, xz:  0, yy:  0, yx:  0, yz: -1, zz:  0, zx:  0, zy: -1 },
  { xx: -1, xy:  0, xz:  0, yy:  0, yx:  0, yz: -1, zz:  0, zx:  0, zy: -1 },
  { xx:  1, xy:  0, xz:  0, yy:  0, yx:  0, yz:  1, zz:  0, zx:  0, zy:  1 },
  { xx: -1, xy:  0, xz:  0, yy:  0, yx:  0, yz:  1, zz:  0, zx:  0, zy:  1 },
  { xx:  1, xy:  0, xz:  0, yy:  0, yx:  0, yz:  1, zz:  0, zx:  0, zy: -1 },
  { xx: -1, xy:  0, xz:  0, yy:  0, yx:  0, yz:  1, zz:  0, zx:  0, zy: -1 },
]

export default class RealityBubble {
  constructor (player, worldData, tileRatio) {
    this.player = player
    this.worldData = worldData
    this.worldW = this.worldData.length
    this.worldH = this.worldData[0].length
    this.tileRatio = tileRatio
    this._createBubble(25)
    this._createOctantThird()
    this.fillWithWorldData()
  }

  _createBubble (radius) {
    let offsetXY = radius
    let offsetZ = Math.floor(radius / this.tileRatio)
    let widthHeight = offsetXY * 2 + 1
    let depth = offsetZ * 2 + 1

    let bubbleCenter = { x: offsetXY, y: offsetXY, z: offsetZ }
    let bubble = dimensionalArr(widthHeight, widthHeight, depth)

    for (let x = 0; x < widthHeight; x++) {
      for (let y = 0; y < widthHeight; y++) {
        for (let z = 0; z < depth; z++) {
          let distFromCenter = worldDistance(
            this.tileRatio, bubbleCenter, { x, y, z }
          )
          if (distFromCenter > radius) continue

          let tilesFromCenter = worldDistance(1, bubbleCenter, { x, y, z })
          bubble[x][y][z] = {
            distFromCenter,
            tilesFromCenter,
            pos: { x, y, z }
          }
        }
      }
    }

    this.offsetXY = offsetXY
    this.offsetZ = offsetZ
    this.widthHeight = widthHeight
    this.depth = depth
    this.bubbleCenter = bubbleCenter
    this.bubble = bubble
  }

  _createOctantThird () {
    let size = this.offsetXY
    let octantThird = dimensionalArr(size, size, size)
    let center = { x: 0, y: 0, z: 0 }
    const tilesDist = point => worldDistance(1, center, point)

    for (let y = 1; y < size; y++) {
      for (let x = 0; x <= y; x++) {
        for (let z = 0; z <= y; z++) {
          let tile = {}
          octantThird[x][y][z] = tile

          tile.centerPhi = getPhi(x, y)
          let tilesToCenter = tilesDist({ x, y, z })
          tile.centerTheta = getTheta(z, tilesToCenter)

          tile.leftPhi = getPhi(x - 0.5, y)
          tile.rightPhi = getPhi(x + 0.5, y)

          let tilesToBottom = tilesDist({ x, y, z: z - 0.5 })
          tile.bottomTheta = getTheta(z - 0.5, tilesToBottom)
          let tilesToTop = tilesDist({ x, y, z: z + 0.5 })
          tile.topTheta = getTheta(z + 0.5, tilesToTop)
        }
      }
    }

    this.octantThird = octantThird
  }

  fillWithWorldData () {
    let dataCenter = this.player.tile.pos
    let startWorldX = dataCenter.x - this.offsetXY
    let startWorldY = dataCenter.y - this.offsetXY
    let startWorldZ = dataCenter.z - this.offsetZ
    let worldX = startWorldX
    let worldY = startWorldY
    let worldZ = startWorldZ
    let x, y, z
    x = y = z = 0

    while (x < this.widthHeight) {
      let safeWorldX = saveIndexFromOverflow(worldX, this.worldW)
      while (y < this.widthHeight) {
        let safeWorldY = saveIndexFromOverflow(worldY, this.worldH)
        while (z < this.depth) {
          let tile = this.bubble[x][y][z]
          if (tile) {
            tile.worldData = this.worldData[safeWorldX][safeWorldY][worldZ]
          }
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
  }

  _iterateBubble (callback) {
    for (let x = 0; x < this.widthHeight; x++) {
      for (let y = 0; y < this.widthHeight; y++) {
        for (let z = 0; z < this.depth; z++) {
          let tile = this.bubble[x][y][z]
          if (tile) callback(tile)
        }
      }
    }
  }

  proceed () {
    this._iterateBubble(tile => {
      let worldData = tile.worldData
      if (worldData) worldData.proceed()
    })
  }

  calculateFov () {
    let radius = this.player.visionRadius
    if (radius + 1 > this.offsetXY) {
      throw new Error('Vision radius has to be (bubble radius - 1) at maximum')
    }
    this._iterateBubble(tile => {
      tile.visible = false
      tile.onlyBlockVis = false
    })
    let {x, y, z} = this.bubbleCenter
    this.bubble[x][y][z].visible = true

    for (let i = 0; i < octantThirdTransforms.length; i++) {
      this._scanOctantThird(octantThirdTransforms[i], radius)
    }
  }

  _scanOctantThird (transform, radius) {
    // TODO: test what node entries size has best performance
    let tree = rbush(9)
    let size = this.octantThird.length
    let {x: cx, y: cy, z: cz} = this.bubbleCenter

    for (let y = 1; y < size; y++) {
      if (y > radius) break
      if (transform.zy !== 0 && y > this.offsetZ) break

      for (let x = 0; x <= y; x++) {
        for (let z = 0; z <= y; z++) {
          let bubbleX =
            cx + x * transform.xx + y * transform.yx + z * transform.zx
          let bubbleY =
            cy + y * transform.yy + x * transform.xy + z * transform.zy
          let bubbleZ =
            cz + z * transform.zz + x * transform.xz + y * transform.yz

          let bubbleTile = this.bubble[bubbleX][bubbleY][bubbleZ]
          if (
            !bubbleTile ||
            !bubbleTile.worldData ||
            bubbleTile.distFromCenter > radius
          ) continue

          let octantTile = this.octantThird[x][y][z]
          let beyondVis = tree.collides({
            minX: octantTile.centerPhi, maxX: octantTile.centerPhi,
            minY: octantTile.centerTheta, maxY: octantTile.centerTheta
          })
          if (!beyondVis) bubbleTile.visible = true

          if (beyondVis && bubbleTile.worldData.get('block')) {
            let bottomFaceBeyondVis = tree.collides({
              minX: octantTile.centerPhi, maxX: octantTile.centerPhi,
              minY: octantTile.bottomTheta, maxY: octantTile.bottomTheta
            })
            if (!bottomFaceBeyondVis) {
              bubbleTile.onlyBlockVis = true
            } else {
              let leftFaceBeyondVis = tree.collides({
                minX: octantTile.leftPhi, maxX: octantTile.leftPhi,
                minY: octantTile.centerTheta, maxY: octantTile.centerTheta
              })
              if (!leftFaceBeyondVis) bubbleTile.onlyBlockVis = true
            }
          }

          if (bubbleTile.worldData.opaque) {
            tree.insert({
              minX: octantTile.leftPhi, maxX: octantTile.rightPhi,
              minY: octantTile.topTheta, maxY: octantTile.bottomTheta
            })
          }
        }
      }
    }
  }

  genClientData () {
    let clientData = dimensionalArr(
      this.widthHeight, this.widthHeight, this.depth
    )
    this._iterateBubble(tile => {
      if (!tile.visible && !tile.onlyBlockVis) return
      let {x, y, z} = tile.pos
      clientData[x][y][z] = tile.worldData.exposeToClient(tile.onlyBlockVis)
    })
    return clientData
  }
}

function getPhi (x, y) {
  return Math.atan2(x, y)
}

function getTheta (z, dist) {
  return Math.acos(z / dist)
}
