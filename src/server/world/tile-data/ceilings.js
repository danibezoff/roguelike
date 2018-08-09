import TileData from './TileData'

class Ceiling extends TileData {
  constructor (id) {
    super('ceiling', id)
  }
}

export class Bedrock extends Ceiling {
  constructor () {
    super('bedrock')
  }
}
