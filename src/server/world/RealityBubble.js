import {
  worldDistance, dimensionalArr, saveIndexFromOverflow, withTilesInLine
} from 'utils'

export default class RealityBubble {
  constructor (player, worldData, tileRatio) {
    this.player = player
    this.worldData = worldData
    this.worldW = this.worldData.length
    this.worldH = this.worldData[0].length
    this.tileRatio = tileRatio
    this._createBubble(15)
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
          bubble[x][y][z] = {
            distFromCenter,
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

  _spiralInside (callback) {
    let maxWidthHeightIndex = this.widthHeight - 1
    let maxDepthIndex = this.depth - 1

    let x, y, z
    let xReversed = true
    for (let i = 0; i < this.widthHeight; i++) {
      xReversed = !xReversed
      x = xReversed ? maxWidthHeightIndex - (i - 1) / 2 : i / 2

      let yReversed = true
      for (let j = 0; j < this.widthHeight; j++) {
        yReversed = !yReversed
        y = yReversed ? maxWidthHeightIndex - (j - 1) / 2 : j / 2

        let zReversed = true
        for (let k = 0; k < this.depth; k++) {
          zReversed = !zReversed
          z = zReversed ? maxDepthIndex - (k - 1) / 2 : k / 2

          let tile = this.bubble[x][y][z]
          if (tile) callback(tile)
        }
      }
    }
  }

  _setVisibilityLineTo (tile) {
    let lastPoint
    let blockedParts = {}

    withTilesInLine(this.bubbleCenter, tile.pos, (points, centered) => {
      for (let i = 0; i < points.length; i++) {
        let point = points[i]
        let tileUnderLine = this.bubble[point.x][point.y][point.z]

        if (lastPoint && point.z !== lastPoint.z) {
          let terminate = this._shouldTerminateVerticalPassage(point, lastPoint)
          if (terminate) return true
        }

        let destPoint = tile.pos.x === point.x && tile.pos.y === point.y &&
          tile.pos.z === point.z
        if (destPoint || (points.length === 1 && centered)) {
          tileUnderLine.visible = true
        }

        if (tileUnderLine.worldData.opaque) {
          if (!(points.length in blockedParts)) {
            blockedParts[points.length] = []
          }
          blockedParts[points.length][i] = true
        }

        lastPoint = point
      }

      let terminate = false
      outer:
      for (let partsNum in blockedParts) {
        for (let i = 0; i < partsNum; i++) {
          if (blockedParts[partsNum][i] === undefined) {
            continue outer
          }
        }
        terminate = true
      }
      if (terminate) return true
    })
  }

  _shouldTerminateVerticalPassage (point, lastPoint) {
    let {x, y, z} = point
    let {x: lx, y: ly, z: lz} = lastPoint

    if (z > lz) {
      return this.bubble[x][y][z - 1].worldData.opaqueCeiling &&
        this.bubble[lx][ly][lz].worldData.opaqueCeiling
    } else {
      return this.bubble[lx][ly][lz - 1].worldData.opaqueCeiling &&
        this.bubble[x][y][z].worldData.opaqueCeiling
    }
  }

  genClientData () {
    let clientData = dimensionalArr(
      this.widthHeight, this.widthHeight, this.depth
    )
    this._iterateBubble(tile => {
      if (!tile.visible) return
      let {x, y, z} = tile.pos
      let tileBeneath = this.bubble[x][y][z - 1]
      let tileAbove = this.bubble[x][y][z + 1]
      let opaque = tile.worldData.opaque
      let withFloor = (!tileBeneath || !tileBeneath.visible) && !opaque
      let noCeiling = (!tileAbove || !tileAbove.visible) && opaque
      clientData[x][y][z] = tile.worldData.exposeToClient({
        withFloor: withFloor,
        noCeiling: noCeiling
      })
    })
    return clientData
  }
}
