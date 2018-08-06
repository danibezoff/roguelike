import {dimensionalArr} from 'utils'
import Tile from './Tile'
import * as blocks from './tile-data/blocks'
import * as creatures from './tile-data/creatures'

export default function genNewWorld (player) {
  const width = 15
  const height = 15
  const peakLevel = 4

  let world = dimensionalArr(width, height, peakLevel)
  fillWithTiles(world)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      world[x][y][0].set(new blocks.Bedrock())
      if (y > 3) world[x][y][1].set(new blocks.Bedrock())
    }
  }

  world[7][7][2].set(player)
  world[5][7][2].set(new blocks.Bedrock())

  return world
}

function fillWithTiles (world) {
  let width = world.length
  let height = world[0].length
  let depth = world[0][0].length

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      for (let z = 0; z < depth; z++) {
        world[x][y][z] = new Tile(world, x, y, z)
      }
    }
  }
}
