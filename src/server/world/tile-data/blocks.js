import TileData from './TileData'

class Block extends TileData {
  constructor (id) {
    super('block', id)
  }
}

export class Bedrock extends Block {
  constructor () {
    super('bedrock')
  }

  hookSet (tile) {
    tile.opaque = true
  }

  hookRemove () {
    this.tile.opaque = false
  }
}
