import {dimensionalArr} from 'utils'

export default class World {
  constructor (width, height) {
    this.width = width
    this.height = height
    this.seaLevel = 10
    this.peakLevel = 20
    this._generateNewWorld()
  }

  _generateNewWorld () {
    this.data = dimensionalArr(this.width, this.height, this.peakLevel)
    fillLevel(this.data, 0, () => ({
      block: {
        id: 'bedrock'
      }
    }))
    for (let i = 1; i < this.seaLevel; i++) {
      fillLevel(this.data, i, () => ({
        block: {
          id: 'rock'
        }
      }))
    }
    for (let i = this.seaLevel; i < this.peakLevel; i++) {
      fillLevel(this.data, i, () => ({}))
    }
  }

  // eslint-disable-next-line no-unused-vars
  step (delta) {
  }

  reveal () {
    return this.data
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

function fillLevel (data, level, callback) {
  for (let x of data) for (let y of x) y[level] = callback()
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

if (process.env.NODE_ENV === 'test') {
  module.exports.fillLevel = fillLevel
}
