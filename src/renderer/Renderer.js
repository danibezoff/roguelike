// FIXME: invert y axis

import * as PIXI from 'pixi.js'
import DataVisualizer from './DataVisualizer'
import {dimensionalArr} from 'utils'

export default class Renderer {
  constructor () {
    this.cameraOffset = { x: 0, y: 0, z: 0 }
  }

  async init (tileset, image) {
    this.tileset = tileset
    this.texture = await getTextureFrom(image)
    this.renderer = getRenderer()
    attachRendererToDom(this.renderer)
    this._createStages()
    this.dataVisualizer = new DataVisualizer(tileset)

    this._resize()
    window.addEventListener('resize', this._resize.bind(this))
  }

  _createStages () {
    this.mainStage = getStage()
    this.bgStage = getStage()
    this.fgStage = getStage()
    this.mainStage.addChild(this.bgStage, this.fgStage)
  }

  _resize () {
    let {tileWidth, tileHeight} = this.tileset
    this.canvasWInTiles = floorDiv(window.innerWidth, tileWidth)
    this.canvasHInTiles = floorDiv(window.innerHeight, tileHeight)
    let canvasWidth = this.canvasWInTiles * tileWidth
    let canvasHeight = this.canvasHInTiles * tileHeight
    this.renderer.resize(canvasWidth, canvasHeight)

    this.bgStage.removeChildren()
    this.fgStage.removeChildren()
    this.cachedVisData = dimensionalArr(
      this.canvasWInTiles, this.canvasHInTiles
    )
    this._fillBgStage()
    this.smthChanged = true
  }

  _fillBgStage () {
    let w = this.canvasWInTiles
    let h = this.canvasHInTiles
    let tileW = this.tileset.tileWidth
    let tileH = this.tileset.tileHeight

    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        let sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
        sprite.width = tileW
        sprite.height = tileH
        sprite.position.set(x * tileW, y * tileH)
        this.bgStage.addChild(sprite)
      }
    }
  }

  render (data) {
    let visData = this._getVisData(data)
    this._updateStages(visData)
    this.cachedVisData = visData
    if (this.smthChanged) this.renderer.render(this.mainStage)
  }

  _getVisData (data) {
    let w = this.canvasWInTiles
    let h = this.canvasHInTiles
    let visData = dimensionalArr(w, h)
    let offset = getDataScreenOffset(data, visData, this.cameraOffset)
    let zFocusIndex = floorDiv(data[0][0].length, 2) + this.cameraOffset.z
    let visX = 0
    let visY = 0
    let dataX = -offset.x
    let dataY = -offset.y

    while (visX < w) {
      while (visY < h) {
        let zTiles = getZTiles(data, dataX, dataY)
        visData[visX][visY] = this.dataVisualizer.visualizeTile(
          zFocusIndex, zTiles
        )
        visY++
        dataY++
      }
      visX++
      dataX++
      visY = 0
      dataY = -offset.y
    }
    return visData
  }

  _updateStages (visData) {
    let w = this.canvasWInTiles
    let h = this.canvasHInTiles
    let tileW = this.tileset.tileWidth
    let tileH = this.tileset.tileHeight
    let childIndex = 0
    let fgChanged = false
    this.smthChanged = false

    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        let tile = visData[x][y]
        let cachedTile = this.cachedVisData[x][y]

        if (!cachedTile || !bgIsSame(tile, cachedTile)) {
          this.bgStage.getChildAt(childIndex).tint = tile.bg
          this.smthChanged = true
        }

        if (!cachedTile || !fgIsSame(tile, cachedTile)) {
          fgChanged = true
          this.smthChanged = true
        }

        childIndex++
      }
    }

    if (fgChanged) {
      this.fgStage.removeChildren()

      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          let tile = visData[x][y]
          let srcX = tile.col * tileW
          let srcY = tile.row * tileH
          let dstX = x * tileW
          let dstY = y * tileH
          let rectangle = new PIXI.Rectangle(srcX, srcY, tileW, tileH)
          let frame = new PIXI.Texture(this.texture, rectangle)
          let sprite = new PIXI.Sprite(frame)
          sprite.position.set(dstX, dstY)
          sprite.tint = tile.fg
          this.fgStage.addChild(sprite)
        }
      }
    }
  }
}

async function getTextureFrom (image) {
  await new Promise(resolve => PIXI.loader.add(image).load(resolve))
  return PIXI.loader.resources[image].texture
}

function getRenderer () {
  return PIXI.autoDetectRenderer({
    autoResize: true,
  })
}

function attachRendererToDom (renderer) {
  renderer.view.classList.add('canvas')
  document.body.appendChild(renderer.view)
}

function getStage () {
  return new PIXI.Container()
}

function floorDiv (x, y) {
  return Math.floor(x / y)
}

function getDataScreenOffset (data, visData, cameraOffset) {
  return {
    x: floorDiv(visData.length - data.length, 2) - cameraOffset.x,
    y: floorDiv(visData[0].length - data[0].length, 2) - cameraOffset.y
  }
}

function getZTiles (data, x, y) {
  return data && data[x] && data[x][y]
}

function fgIsSame (tile1, tile2) {
  let col = tile1.col === tile2.col
  let row = tile1.row === tile2.row
  let fg = tile1.fg === tile2.fg
  return col && row && fg
}

function bgIsSame (tile1, tile2) {
  return tile1.bg === tile2.bg
}

if (process.env.NODE_ENV === 'test') {
  module.exports.getDataScreenOffset = getDataScreenOffset
}
