export default class GameHandler {
  constructor (renderer, world) {
    this.renderer = renderer
    this.world = world
    this.keydownListener = this._handleKeydown.bind(this)
    this.keyupListener = this._handleKeyup.bind(this)
  }

  handle () {
    window.addEventListener('keydown', this.keydownListener)
    window.addEventListener('keyup', this.keyupListener)
  }

  unhandle () {
    window.removeEventListener('keydown', this.keydownListener)
    window.removeEventListener('keyup', this.keyupListener)
  }

  _handleKeydown ({code}) {
    if (code === 'ShiftLeft' || code === 'ShiftRight') {
      this.shift = true
    }

    if (this.shift) {
      this._handleShifted(code)
    } else {
      this._handleUnshifted(code)
    }
  }

  _handleKeyup ({code}) {
    if (code === 'ShiftLeft' || code === 'ShiftRight') {
      this.shift = false
    }
  }

  _handleShifted (code) {
    if (code === 'NumpadAdd') {
      this.renderer.cameraOffset.z++
      return
    }
    if (code === 'NumpadSubtract') {
      this.renderer.cameraOffset.z--
      return
    }
    if (code === 'Comma') {
      this.world.move({ x: 0, y: 0, z: 1 })
      return
    }
    if (code === 'Period') {
      this.world.move({ x: 0, y: 0, z: -1 })
      return
    }
    if (code === 'Numpad1') {
      this.renderer.cameraOffset.x--
      this.renderer.cameraOffset.y--
      return
    }
    if (code === 'Numpad2') {
      this.renderer.cameraOffset.y--
      return
    }
    if (code === 'Numpad3') {
      this.renderer.cameraOffset.x++
      this.renderer.cameraOffset.y--
      return
    }
    if (code === 'Numpad4') {
      this.renderer.cameraOffset.x--
      return
    }
    if (code === 'Numpad5') {
      let offset = this.renderer.cameraOffset
      offset.x = offset.y = offset.z = 0
      return
    }
    if (code === 'Numpad6') {
      this.renderer.cameraOffset.x++
      return
    }
    if (code === 'Numpad7') {
      this.renderer.cameraOffset.x--
      this.renderer.cameraOffset.y++
      return
    }
    if (code === 'Numpad8') {
      this.renderer.cameraOffset.y++
      return
    }
    if (code === 'Numpad9') {
      this.renderer.cameraOffset.x++
      this.renderer.cameraOffset.y++
      return
    }
  }

  _handleUnshifted (code) {
    if (code === 'Numpad1') {
      this.world.move({ x: -1, y: -1, z: 0 })
      return
    }
    if (code === 'Numpad2') {
      this.world.move({ x: 0, y: -1, z: 0 })
      return
    }
    if (code === 'Numpad3') {
      this.world.move({ x: 1, y: -1, z: 0 })
      return
    }
    if (code === 'Numpad4') {
      this.world.move({ x: -1, y: 0, z: 0 })
      return
    }
    if (code === 'Numpad5') {
      let offset = this.renderer.cameraOffset
      offset.x = offset.y = offset.z = 0
      return
    }
    if (code === 'Numpad6') {
      this.world.move({ x: 1, y: 0, z: 0 })
      return
    }
    if (code === 'Numpad7') {
      this.world.move({ x: -1, y: 1, z: 0 })
      return
    }
    if (code === 'Numpad8') {
      this.world.move({ x: 0, y: 1, z: 0 })
      return
    }
    if (code === 'Numpad9') {
      this.world.move({ x: 1, y: 1, z: 0 })
      return
    }
  }
}
