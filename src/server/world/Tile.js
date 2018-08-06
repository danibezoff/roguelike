export default class Tile {
  constructor (world, x, y, z) {
    this.world = world
    this.pos = { x, y, z }
    this.data = {}
  }

  proceed () {
    for (let prop in this.data) {
      this.data[prop].proceed()
    }
  }

  set (tileData) {
    if (this.data[tileData.category]) {
      throw new Error(
        `This tile already has ${tileData.category} TileData instance`
      )
    }

    tileData.world = this.world
    tileData.pos = this.pos
    this.data[tileData.category] = tileData
  }

  remove (tileData) {
    delete this.data[tileData.category]
  }

  exposeToClient () {
    let exposed = {
      pos: this.pos
    }
    for (let prop in this.data) {
      exposed[prop] = this.data[prop].exposeToClient()
    }
    return exposed
  }
}
