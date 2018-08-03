import './style/style.sass'
import tileset from './tilesets/default'
import image from './tilesets/default.png'
import World from './world/World'
import Renderer from './renderer/Renderer'
import {ticker} from 'pixi.js'
import {hexToCss} from 'utils'

;(async function () {
  document.body.style['background-color'] = hexToCss(tileset.defaultBgColor)

  let renderer = new Renderer()
  let world = new World(30, 30)
  let mainTicker = ticker.shared
  let offset = { x: 0, y: 0, z: 0 }
  await renderer.init(tileset, image)

  mainTicker.add(delta => {
    world.step(delta)
    let data = world.reveal()
    renderer.render(data, offset)
  })
  mainTicker.start()

  window.addEventListener('keydown', ({code}) => {
    if (code === 'Numpad7' || code === 'Numpad8' || code === 'Numpad9') {
      offset.y--
    }
    if (code === 'Numpad1' || code === 'Numpad2' || code === 'Numpad3') {
      offset.y++
    }
    if (code === 'Numpad1' || code === 'Numpad4' || code === 'Numpad7') {
      offset.x--
    }
    if (code === 'Numpad3' || code === 'Numpad6' || code === 'Numpad9') {
      offset.x++
    }
    if (code === 'NumpadAdd') {
      offset.z++
    }
    if (code === 'NumpadSubtract') {
      offset.z--
    }
    if (code === 'Numpad5') {
      offset.x = offset.y = offset.z = 0
    }
  })
}())
