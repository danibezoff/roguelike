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

    tileData.tile = this
    let hook = tileData.hookSet
    if (hook) hook(this)
    this._data[tileData.category] = tileData
  }

  remove (tileData) {
    delete this._data[tileData.category]
    let hook = tileData.hookRemove
    if (hook) hook()
  }

  exposeToClient ({
    withFloor = false, noCeiling = false, onlyCeiling = false
  } = {}) {
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
    if (withFloor) {
      let {x, y, z} = this.pos
      let tileBelow = this.world.data[x][y][z - 1]
      let ceiling = tileBelow && tileBelow.get('ceiling')
      if (ceiling) exposed.floor = ceiling.exposeToClient()
    }
    return exposed
  }
}
