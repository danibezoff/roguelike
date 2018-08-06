export default class TileData {
  constructor (category, id) {
    this.category = category
    this.id = id
  }

  exposeToClient () {
    return { id: this.id }
  }
}
