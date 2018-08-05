import TileData from './TileData'

class Block extends TileData {
  constructor (id) {
    super('block', id)
  }
}

export class Bedrock extends Block {
  constructor () {
    super('bedrock')
    this.durability = 9999
    this.secretProperty = 'Shhhhh...'
  }

  exposeToClient () {
    let exposed = super.exposeToClient()
    exposed.durability = this.durability
    return exposed
  }
}
