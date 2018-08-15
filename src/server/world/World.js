import genNewWorldData from './gen-new-world-data'
import RealityBubble from './RealityBubble'
import {Player} from './tile-data/creatures'

export default class World {
  constructor () {
    this.tileRatio = 4
    this.player = new Player()
    this.data = genNewWorldData(this, this.player)
    this.realityBubble = new RealityBubble(
      this.player, this.data, this.tileRatio
    )
    this.playerHasMoved = true
    this.worldAge = 0
  }

  step (delta) {
    this.worldAge += delta
    this.lastStepTimestamp = performance.now()
    this.realityBubble.proceed()

    if (this.playerHasMoved) {
      this.realityBubble.fillWithWorldData()
      this.realityBubble.calculateFov()
      this.playerHasMoved = false
      this.fovIsDirty = false
      this.dataIsDity = false
      return this.realityBubble.genClientData()
    }

    if (this.fovIsDirty) {
      this.realityBubble.calculateFov()
      this.fovIsDirty = false
      this.dataIsDity = false
      return this.realityBubble.genClientData()
    }

    if (this.dataIsDity) {
      this.dataIsDity = false
      return this.realityBubble.genClientData()
    }
  }

  move (where) {
    this.player.step(where)
  }
}
