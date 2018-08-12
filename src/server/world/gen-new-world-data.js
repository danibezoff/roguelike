import {dimensionalArr} from 'utils'
import Tile from './Tile'
import * as blocks from './tile-data/blocks'
import * as ceilings from './tile-data/ceilings'
import * as creatures from './tile-data/creatures'

export default function genNewWorldData (world, player) {
  const width = 200
  const height = 200
  const peakLevel = 9

  let worldData = dimensionalArr(width, height, peakLevel)
  fillWithTiles(world, worldData)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      worldData[x][y][0].set(new blocks.Bedrock())
      worldData[x][y][0].set(new ceilings.Bedrock())
      if (y > 3) {
        worldData[x][y][1].set(new blocks.Bedrock())
        worldData[x][y][1].set(new ceilings.Bedrock())
      }
    }
  }

  worldData[7][7][2].set(player)

  worldData[5][7][2].set(new blocks.Bedrock())
  worldData[5][7][2].set(new ceilings.Bedrock())
  worldData[6][8][2].set(new blocks.Bedrock())
  worldData[6][8][2].set(new ceilings.Bedrock())

  worldData[15][7][2].set(new blocks.Bedrock())
  worldData[15][7][2].set(new ceilings.Bedrock())
  worldData[15][8][2].set(new blocks.Bedrock())
  worldData[15][8][2].set(new ceilings.Bedrock())
  worldData[16][8][2].set(new blocks.Bedrock())
  worldData[16][8][2].set(new ceilings.Bedrock())

  worldData[16][18][2].set(new ceilings.Bedrock())

  return worldData
}

function fillWithTiles (world, worldData) {
  let width = worldData.length
  let height = worldData[0].length
  let depth = worldData[0][0].length

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      for (let z = 0; z < depth; z++) {
        worldData[x][y][z] = new Tile(world, x, y, z)
      }
    }
  }
}
