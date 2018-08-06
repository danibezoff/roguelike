import './style/style.sass'
import tileset from './tilesets/default'
import image from './tilesets/default.png'
import Renderer from './renderer/Renderer'
import {ticker} from 'pixi.js'
import {hexToCss} from 'utils'
import GameHandler from 'input/GameHandler'
import Server from 'worker-loader!./server/worker'

;(async function () {
  let server = new Server()
  document.body.style['background-color'] = hexToCss(tileset.defaultBgColor)

  let renderer = new Renderer()
  let gameHandler = new GameHandler(renderer, server)
  let renderTicker = ticker.shared
  await renderer.init(tileset, image)
  gameHandler.handle()

  let worldData
  renderTicker.add(() => {
    if (worldData) renderer.render(worldData)
  })
  renderTicker.start()

  server.onmessage = ({data}) => {
    if ('worldData' in data) worldData = data.worldData
  }
}())
