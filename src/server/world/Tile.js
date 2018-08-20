export default class Tile {
  constructor (world, x, y, z) {
    this.world = world
    this.pos = { x, y, z }
    this._data = {}
  }

  proceed () {
    for (let prop in this._data) {
      if (this._data[prop].proceed()) {
        this.world.isDirtyForPlayer = true
      }
    }
  }

  get (category) {
    return this._data[category]
  }

  set (tileData) {
    if (this._data[tileData.category]) {
      throw new Error(
        `This tile already has ${tileData.category} TileData instance`
      )
    }

    tileData.tile = this
    tileData.hookSet(this)
    this._data[tileData.category] = tileData
  }

  remove (tileData) {
    delete this._data[tileData.category]
    tileData.hookRemove()
  }

  exposeToClient (onlyBlock) {
    let exposed = {
      pos: this.pos
    }
    if (onlyBlock) {
      if ('block' in this._data) {
        exposed.block = this._data.block.exposeToClient()
      }
    } else {
      for (let prop in this._data) {
        exposed[prop] = this._data[prop].exposeToClient()
      }
    }
    return exposed
  }
}
