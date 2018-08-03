export default class DataVisualizer {
  constructor (tileset) {
    this.tileset = tileset
  }

  // NOTE: `undefined` is "beyond visability", other should be valid map data
  visualizeTile (zFocusIndex, zTiles) {
    let binds = this.tileset.bindings
    let tile = zTiles && zTiles[zFocusIndex--]
    if (tile === undefined) {
      return this._compose(binds.special.beyondVisability)
    }
    if ('block' in tile) {
      return this._compose(binds.block[tile.block.id])
    }
    if ('creature' in tile) {
      return this._compose(binds.creature[tile.creature.id])
    }

    tile = zTiles[zFocusIndex--]
    if (tile === undefined) {
      return this._compose(binds.special.beyondVisability)
    }
    if ('block' in tile) {
      return this._compose(binds.block[tile.block.id].fromAbove)
    }

    return this._compose(binds.special.air)
  }

  _compose (visData) {
    return {
      col: visData.col,
      row: visData.row,
      bg: visData.bg || this.tileset.defaultBgColor,
      fg: visData.fg || this.tileset.defaultFgColor
    }
  }
}
