import TileData from './TileData'

class Block extends TileData {
  constructor (id) {
    super('block', id)
    this.opaque = true
    this.passible = false
  }

  hookSet (tile) {
    tile.opaque = this.opaque
    tile.passible = this.passible
  }

  hookRemove () {
    this.tile.opaque = false
    this.tile.passible = true
  }
}

export class Bedrock extends Block {
  constructor () {
    super('bedrock')
  }
}
