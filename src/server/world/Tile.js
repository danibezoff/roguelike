export default class Tile {
  constructor (world, x, y, z) {
    this.world = world
    this.pos = { x, y, z }
    this._data = {}
  }

  proceed () {
    for (let prop in this._data) {
      this._data[prop].proceed()
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

    tileData.world = this.world
    tileData.pos = this.pos
    this._data[tileData.category] = tileData
  }

  remove (tileData) {
    delete this._data[tileData.category]
  }

  exposeToClient ({ onlyCeiling = false, noCeiling = false } = {}) {
    let exposed = {
      pos: this.pos
    }

    let all = !onlyCeiling && !noCeiling
    for (let prop in this._data) {
      let isCeiling = prop === 'ceiling'
      if (all || (onlyCeiling && isCeiling) || (noCeiling && !isCeiling)) {
        exposed[prop] = this._data[prop].exposeToClient()
      }
    }
    return exposed
  }
}
