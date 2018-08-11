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
  // TODO: make ceiling not passible
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
          withTilesInLine(center, { x, y, z }, points => {
            let hasLineOfSight = false
            for (let i = 0; i < points.length; i++) {
              let {x, y, z} = points[i]
              let point = visionBubble[x][y][z]
              if (point) {
                point.visible = true
                if (!point.worldData.opaque) hasLineOfSight = true
              }
            }
            if (!hasLineOfSight) return 'terminate'
          })
        }
      }
    }

    this._exposeToClient(visionBubble, w, h, d)
    return visionBubble
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
