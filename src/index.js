import './style/style.sass'
import tileset from './tilesets/default'
import image from './tilesets/default.png'
import World from './world/World'
import Renderer from './renderer/Renderer'
import {ticker} from 'pixi.js'
import {hexToCss} from 'utils'
import GameHandler from 'input/GameHandler'

;(async function () {
  document.body.style['background-color'] = hexToCss(tileset.defaultBgColor)

  let renderer = new Renderer()
  let world = new World()
  let gameHandler = new GameHandler(renderer, world)

  let mainTicker = ticker.shared
  await renderer.init(tileset, image)
  gameHandler.handle()

  mainTicker.add(delta => {
    world.step(delta)
    let data = world.reveal()
    renderer.render(data)
  })
  mainTicker.start()
}())
