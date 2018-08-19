import TileData from './TileData'

class Creature extends TileData {
  constructor (id) {
    super('creature', id)
    this.stepDelay = 325
  }

  step (where) {
    if (this.scheduledAction) return
    this.scheduledAction = () => {
      let {x, y, z} = this.tile.pos
      let worldData = this.tile.world.data
      worldData[x][y][z].remove(this)
      x += where.x
      y += where.y
      z += where.z
      worldData[x][y][z].set(this)
      this.tile.world.playerHasMoved = true
    }
    this._setScheduleTime(this.stepDelay)
  }
}

export class Player extends Creature {
  constructor () {
    super('player')
    this.visionRadius = 24
  }
}
