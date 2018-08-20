import {worldDistance, dimensionalArr, saveIndexFromOverflow} from 'utils'
import rbush from 'rbush'

export default class RealityBubble {
  constructor (player, worldData, tileRatio) {
    this.player = player
    this.worldData = worldData
    this.worldW = this.worldData.length
    this.worldH = this.worldData[0].length
    this.tileRatio = tileRatio
    this._createBubble(25)
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
            pos: { x, y, z },
            posRelToCenter: {
              x: x - bubbleCenter.x,
              y: y - bubbleCenter.y,
              z: z - bubbleCenter.z
            }
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
    this._iterateBubble(tile => tile.visible = false)

    let {x, y, z} = this.bubbleCenter
    this.bubble[x][y][z].visible = true
    let tree = rbush(9)

    this._spiralOutwards(tile => {
      if (tile.distFromCenter < radius) {
        this._manageTileFov(tile, tree)
      } else {
        return true
      }
    })
  }

  _manageTileFov (tile, tree) {
    if (!tile.worldData) return

    let {x, y, z} = tile.posRelToCenter
    let centerPhi = Math.atan2(x, y)
    let centerTheta = Math.acos(z / tile.tilesFromCenter)
    let beyondVis = tree.collides({
      minX: centerPhi, maxX: centerPhi, minY: centerTheta, maxY: centerTheta
    })
    if (!beyondVis) tile.visible = true
    if (!tile.worldData.opaque) return

    let PI = Math.PI
    let EPS = Number.EPSILON
    let halfSpotAngle = Math.atan(1 / (2 * tile.tilesFromCenter))
    let minX, maxX, minY, maxY

    if (Math.abs(Math.abs(centerPhi) - PI) < EPS) {
      minX = -PI
      maxX = -PI + halfSpotAngle
      minY = centerTheta - halfSpotAngle
      maxY = centerTheta + halfSpotAngle
      tree.insert({ minX, maxX, minY, maxY })
      minX = PI - halfSpotAngle
      maxX = PI
    } else if (centerTheta < EPS || Math.abs(centerTheta - PI) < EPS) {
      minX = -PI
      maxX = PI
      if (centerTheta < EPS) {
        minY = 0
        maxY = halfSpotAngle
      } else {
        minY = PI - halfSpotAngle
        maxY = PI
      }
    } else {
      minX = centerPhi - halfSpotAngle
      maxX = centerPhi + halfSpotAngle
      minY = centerTheta - halfSpotAngle
      maxY = centerTheta + halfSpotAngle
    }
    tree.insert({ minX, maxX, minY, maxY })
  }

  _spiralOutwards (callback) {
    let {x, y, z} = this.bubbleCenter
    let tile

    const zUpAndDown = () => {
      do {
        tile = this.bubble[x][y][++z]
      } while (tile && !callback(tile))
      z = this.bubbleCenter.z
      do {
        tile = this.bubble[x][y][--z]
      } while (tile && !callback(tile))
    }

    const yUpAndDown = () => {
      do {
        zUpAndDown()
        z = this.bubbleCenter.z
        tile = this.bubble[x][++y][z]
      } while (!callback(tile))

      y = this.bubbleCenter.y - 1
      tile = this.bubble[x][y][z]

      while (!callback(tile)) {
        zUpAndDown()
        z = this.bubbleCenter.z
        tile = this.bubble[x][--y][z]
      }
    }

    do {
      yUpAndDown()
      y = this.bubbleCenter.y
      tile = this.bubble[++x][y][z]
    } while (!callback(tile))

    x = this.bubbleCenter.x - 1
    tile = this.bubble[x][y][z]

    while (!callback(tile)) {
      yUpAndDown()
      y = this.bubbleCenter.y
      tile = this.bubble[--x][y][z]
    }
  }

  genClientData () {
    let clientData = dimensionalArr(
      this.widthHeight, this.widthHeight, this.depth
    )
    this._iterateBubble(tile => {
      if (!tile.visible && !tile.onlyBlockVisible) return
      let {x, y, z} = tile.pos
      clientData[x][y][z] = tile.worldData.exposeToClient(tile.onlyBlockVisible)
    })
    return clientData
  }
}
