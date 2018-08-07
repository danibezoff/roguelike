import genNewWorldData from './gen-new-world-data'
import {Player} from './tile-data/creatures'
import {dimensionalArr, getBubbleFromWorld} from 'utils'

const BUBBLE_RADIUS = 12

export default class World {
  constructor () {
    this.worldTileRatio = 4
    this.player = new Player()
    this.data = genNewWorldData(this, this.player)
    this.worldAge = 0
  }

  step (delta) {
    this.worldAge += delta
    this.lastStepTimestamp = performance.now()
    this.realBubble = getBubbleFromWorld(this, this.player.pos, BUBBLE_RADIUS)
    for (let x of this.realBubble) for (let y of x) for (let tile of y) {
      if (tile) tile.proceed()
    }
  }

  reveal () {
    let bubble = getBubbleFromWorld(
      this, this.player.pos, this.player.maxVisionRadius
    )
    let clientData = this._exposeBubble(bubble)
    return clientData
  }

  move (where) {
    this.player.step(where)
  }

  // "exposing" should transform data to the format like the client sees:
  // hide unseen behind obstacles, invisible creatures, other players' inventory
  // for now it just hides unnecessary for client fields
  _exposeBubble (bubble) {
    let width = bubble.length
    let height = bubble[0].length
    let depth = bubble[0][0].length
    let clientData = dimensionalArr(width, height, depth)

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        for (let z = 0; z < depth; z++) {
          if (bubble[x][y][z]) {
            clientData[x][y][z] = bubble[x][y][z].exposeToClient()
          } else {
            clientData[x][y][z] = undefined
          }
        }
      }
    }
    return clientData
  }
}
