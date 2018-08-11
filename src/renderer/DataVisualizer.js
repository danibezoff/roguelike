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
    if ('floor' in tile) {
      return this._compose(binds.ceiling[tile.floor.id])
    }

    tile = zTiles[zFocusIndex--]
    if (tile === undefined) {
      return this._compose(binds.special.beyondVisability)
    }
    if ('ceiling' in tile) {
      return this._compose(binds.ceiling[tile.ceiling.id])
    }

    return this._compose(binds.special.beyondVisability)
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
