import World from './world/World'

let world = new World()
let lastStep = performance.now()
setInterval(() => {
  let now = performance.now()
  let worldClientData = world.step(now - lastStep)
  lastStep = now

  if (worldClientData) {
    self.postMessage({ worldClientData })
  }
}, 10)

self.onmessage = function ({data}) {
  if ('move' in data) world.move(data.move)
}
