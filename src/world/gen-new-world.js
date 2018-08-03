import {dimensionalArr} from 'utils'

export default function genNewWorld () {
  const width = 100
  const height = 100
  const peakLevel = 4

  let world = dimensionalArr(width, height, peakLevel)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      world[x][y][0] = { block: { id: 'bedrock' } }

      if (y < 75) {
        world[x][y][1] = { block: { id: 'bedrock' } }
      } else {
        world[x][y][1] = {}
      }

      for (let i = 2; i < 5; i++) {
        world[x][y][i] = {}
      }
    }
  }

  world[50][50][2] = { creature: { id: 'player' } }

  /*
   *   O
   */
  world[48][50][2] = { block: { id: 'bedrock' } }

  /*
   *   O
   *   O
   */
  world[48][46][2] = { block: { id: 'bedrock' } }
  world[48][45][2] = { block: { id: 'bedrock' } }

  /*
   *   OO
   *   O
   */
  world[48][41][2] = { block: { id: 'bedrock' } }
  world[48][40][2] = { block: { id: 'bedrock' } }
  world[49][40][2] = { block: { id: 'bedrock' } }

  /*
   *    O
   *   O
   */
  world[48][36][2] = { block: { id: 'bedrock' } }
  world[49][35][2] = { block: { id: 'bedrock' } }

  return world
}
