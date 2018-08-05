import genNewWorld from './gen-new-world'
import {Player} from './tile-data/creatures'
import {dimensionalArr} from 'utils'

export default class World {
  constructor () {
    this.player = new Player()
    this.data = genNewWorld(this.player)
  }

  // eslint-disable-next-line no-unused-vars
  step (delta) {
  }

  reveal () {
    let revealedArea = this.data // temporary full map
    let clientData = this._expose(revealedArea)
    return clientData
  }

  move (where) {
    this.player.step(where)
  }

  // "exposing" should transform data to the format like the client sees:
  // hide unseen behind obstacles, invisible creatures, other players' inventory
  // for now it just hides unnecessary for client fields
  _expose (data) {
    let width = data.length
    let height = data[0].length
    let depth = data[0][0].length
    let clientData = dimensionalArr(width, height, depth)

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        for (let z = 0; z < depth; z++) {
          clientData[x][y][z] = data[x][y][z].exposeToClient()
        }
      }
    }

    return clientData
  }

  // reveal (x, y, radius) {
  //   let minX = Math.floor(x - radius)
  //   let maxX = Math.ceil(x + radius)
  //   let minY = Math.floor(y - radius)
  //   let maxY = Math.ceil(y + radius)
  //   let revealed = []

  //   for (let x = minX, revealedX = 0; x <= maxX; x++, revealedX++) {
  //     revealed[revealedX] = []
  //     for (let y = minY, revealedY = 0; y <= maxY; y++, revealedY++) {
  //       if (isInsideCircle(revealedX, revealedY, radius)) {
  //         let saveX = saveIndexFromOwerflow(x, this.SIZE)
  //         let saveY = saveIndexFromOwerflow(y, this.SIZE)
  //         revealed[revealedX][revealedY] = this.data[saveX][saveY]
  //       } else {
  //         revealed[revealedX][revealedY] = undefined
  //       }
  //     }
  //   }

  //   return revealed
  // }
}

// function randInt (limit) {
//   return Math.floor(Math.random() * limit)
// }

// function saveIndexFromOwerflow (index, size) {
//   while (index >= size) { index -= size }
//   while (index < 0) { index += size }
//   return index
// }

// function dirtOrGrass (data, x, y) {
//   let dirtTilesAround = 0
//   let grassTilesAround = 0
//
//   for (let addedX = -2; addedX <= 2; addedX++) {
//     let newX = saveIndexFromOwerflow(x + addedX, data.length)
//     for (let addedY = -2; addedY <= 2; addedY++) {
//       let newY = saveIndexFromOwerflow(y + addedY, data.length)
//       if (data[newX][newY] === undefined) continue
//       if (data[newX][newY].terrain === 'dirt') ++dirtTilesAround
//       if (data[newX][newY].terrain === 'grass') ++grassTilesAround
//     }
//   }
//
//   let tile = {}
//   if (dirtTilesAround !== grassTilesAround) {
//     tile.terrain = dirtTilesAround > grassTilesAround ? 'dirt' : 'grass'
//   } else {
//     tile.terrain = Math.random() > 0.5 ? 'dirt' : 'grass'
//   }
//   return tile
// }

// function findRandEmptyTileCoords (data, width, height) {
//   let x = randInt(width)
//   let y = randInt(height)
//
//   if (data[x][y] !== undefined) {
//     outer: for (let addedY = 0; addedY < height; addedY++) {
//       let newY = saveIndexFromOwerflow(y + addedY, height)
//       for (let addedX = 0; addedX < width; addedX++) {
//         let newX = saveIndexFromOwerflow(x + addedX, width)
//         if (data[newX][newY] === undefined) {
//           x = newX
//           y = newY
//           break outer
//         }
//       }
//     }
//   }
//
//   return [x, y]
// }
