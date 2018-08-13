export default class TileData {
  constructor (category, id) {
    this.category = category
    this.id = id
  }

  proceed () {
    if (!this.scheduledAction) return
    if (this.tile.world.worldAge >= this.scheduledTime) {
      this.scheduledAction()
      this.scheduledAction = this.scheduledTime = undefined
      return true
    }
  }

  _setScheduleTime (delay) {
    let delta = (performance.now() - this.tile.world.lastStepTimestamp) / 2
    this.scheduledTime = this.tile.world.worldAge + delay + delta
  }

  exposeToClient () {
    return { id: this.id }
  }
}
