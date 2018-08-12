import genNewWorldData from './gen-new-world-data'
import {Player} from './tile-data/creatures'
import {getBubbleFromWorld, withTilesInLine} from 'utils'

export default class World {
  constructor () {
    this.worldTileRatio = 4
    this.worldBubbleRadius = 25
    this.player = new Player()
    this.data = genNewWorldData(this, this.player)
    this.worldAge = 0
  }

  step (delta) {
    this.worldAge += delta
    this.lastStepTimestamp = performance.now()
    this.realBubble = getBubbleFromWorld(
      this, this.player.tile.pos, this.worldBubbleRadius
    )

    for (let x of this.realBubble) for (let y of x) for (let tile of y) {
      if (tile) tile.worldData.proceed()
    }
  }

  // TODO: add diagonal passible and not passible
  reveal () {
    let visionBubble = getBubbleFromWorld(
      this, this.player.tile.pos, this.player.visionRadius
    )

    let w = visionBubble.length
    let h = visionBubble[0].length
    let d = visionBubble[0][0].length

    let center = {
      x: Math.floor(w / 2),
      y: Math.floor(h / 2),
      z: Math.floor(d / 2)
    }

    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        for (let z = 0; z < d; z++) {
          if (!visionBubble[x][y][z]) continue

          let lastPoint
          let blockedParts = {}
          let pos1 = { x: center.x, y: center.y, z: center.z }

          withTilesInLine(pos1, { x, y, z }, points => {
            for (let i = 0; i < points.length; i++) {
              let point = points[i]
              let visionTile = visionBubble[point.x][point.y][point.z]

              if (visionTile) {
                if (lastPoint && point.z !== lastPoint.z) {
                  let terminate = this._shouldTerminateVerticalPassage(
                    visionBubble, lastPoint, point
                  )
                  if (terminate) return 'terminate'
                }

                // if it's destination point
                if (x === point.x && y === point.y && z === point.z) {
                  visionTile.visible = true
                } else {
                  if (visionTile.worldData.opaque) {
                    if (!(points.length in blockedParts)) {
                      blockedParts[points.length] = []
                    }
                    blockedParts[points.length][i] = true
                  }
                }
              } else {
                return 'terminate'
              }

              lastPoint = points[i]
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

            if (terminate) return 'terminate'
          }, this.worldTileRatio)
        }
      }
    }

    this._exposeToClient(visionBubble, w, h, d)
    return visionBubble
  }

  _shouldTerminateVerticalPassage (visionBubble, lastPoint, point) {
    let {x, y, z} = point
    let {x: lx, y: ly, z: lz} = lastPoint

    if (z > lz) {
      return visionBubble[x][y][z - 1].worldData.opaqueCeiling &&
        visionBubble[lx][ly][lz].worldData.opaqueCeiling
    } else {
      return visionBubble[lx][ly][lz - 1].worldData.opaqueCeiling &&
        visionBubble[x][y][z].worldData.opaqueCeiling
    }
  }

  move (where) {
    this.player.step(where)
  }

  _exposeToClient (bubble, w, h, d) {
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        for (let z = 0; z < d; z++) {
          let tile = bubble[x][y][z]
          if (tile && tile.visible) {
            let tileBeneath = bubble[x][y][z - 1]
            let tileAbove = bubble[x][y][z + 1]
            let opaque = tile.worldData.opaque
            let withFloor = (!tileBeneath || !tileBeneath.visible) && !opaque
            let noCeiling = (!tileAbove || !tileAbove.visible) && opaque
            bubble[x][y][z] = tile.worldData.exposeToClient({
              withFloor: withFloor,
              noCeiling: noCeiling
            })
          } else {
            bubble[x][y][z] = undefined
          }
        }
      }
    }
  }
}
