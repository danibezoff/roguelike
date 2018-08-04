export default class GameHandler {
  constructor (renderer, world) {
    this.renderer = renderer
    this.world = world
    this.keydownListener = this._handleKeydown.bind(this)
  }

  handle () {
    window.addEventListener('keydown', this.keydownListener)
  }

  unhandle () {
    window.removeEventListener('keydown', this.keydownListener)
  }

  _handleKeydown ({code}) {
    let offset = this.renderer.cameraOffset

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
  }
}
