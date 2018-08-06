import TileData from './TileData'

class Creature extends TileData {
  constructor (id) {
    super('creature', id)
    this.stepDelay = 275
  }

  step (where) {
    if (this.scheduledAction) return
    this.scheduledAction = () => {
      let {x, y, z} = this.pos
      this.world.data[x][y][z].remove(this)
      x += where.x
      y += where.y
      z += where.z
      this.world.data[x][y][z].set(this)
    }
    this._setScheduleTime(this.stepDelay)
  }
}

export class Player extends Creature {
  constructor () {
    super('player')
  }
}
