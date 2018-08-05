import TileData from './TileData'

class Creature extends TileData {
  constructor (id) {
    super('creature', id)
  }

  step (where) {
    let {x, y, z} = this.pos
    this.world[x][y][z].remove(this)
    x += where.x
    y += where.y
    z += where.z
    this.world[x][y][z].set(this)
  }
}

export class Player extends Creature {
  constructor () {
    super('player')
  }
}
