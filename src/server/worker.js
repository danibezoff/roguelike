import World from './world/World'

let world = new World()
let lastStep = performance.now()
setInterval(() => {
  let now = performance.now()
  world.step(now - lastStep)
  lastStep = now

  let worldData = world.reveal()
  postMessage({ worldData })
}, 10)

self.onmessage = function ({data}) {
  if ('move' in data) world.move(data.move)
}
