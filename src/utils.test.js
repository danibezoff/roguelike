import * as utils from 'utils'

describe('utils.js', () => {
  describe('dimensionalArr(...dimensionSizes)', () => {
    const func = utils.dimensionalArr

    it('creates array of specified sizes', () => {
      let res = func(1, 2, 3, 4)
      expect(res.length).toBe(1)
      expect(res[0].length).toBe(2)
      expect(res[0][0].length).toBe(3)
      expect(res[0][0][0].length).toBe(4)

      res = func(5, 5)
      expect(res.length).toBe(5)
      expect(res[0].length).toBe(5)
    })

    it('fills array with `undefined`', () => {
      let res = func(3, 4, 5)
      for (let x of res) {
        for (let y of x) {
          for (let z of y) {
            expect(z).toBe(undefined)
          }
        }
      }
    })
  })

  describe('hexToCss(hex)', () => {
    const func = utils.hexToCss

    it('converts hex number to valid css color', () => {
      expect(func(0xFFFFFF)).toBe('#ffffff')
      expect(func(0x00FFFF)).toBe('#00ffff')
      expect(func(0x0000FF)).toBe('#0000ff')
      expect(func(0x000001)).toBe('#000001')
    })
  })

  describe('saveIndexFromOverflow(index, length)', () => {
    const func = utils.saveIndexFromOverflow

    it('loops through valid indexes for specified length', function () {
      let inputsOutputs = [
        [0, 1, 0], [1, 1, 0], [5, 10, 5], [10, 10, 0], [11, 10, 1], [19, 10, 9],
        [20, 10, 0], [22, 10, 2], [0, 100, 0], [100, 10, 0], [-1, 1, 0],
        [-1, 2, 1], [-1, 10, 9], [-2, 10, 8], [-5, 10, 5], [-10, 10, 0],
        [-11, 10, 9], [-21, 10, 9]
      ]
      for (let [index, size, result] of inputsOutputs) {
        expect(func(index, size)).toBe(result)
      }
    })
  })

  describe('getBubbleFromWorld(world, center, radius)', () => {
    const func = utils.getBubbleFromWorld
    let world, center, radius

    beforeEach(() => {
      radius = 10
      center = { x: 1, y: 2, z: 3 }
      world = {}
      world.worldTileRatio = 4
      world.data = utils.dimensionalArr(10, 10, 10)
      for (let x of world.data) for (let y of x) {
        for (let z = 0; z < y.length; z++) {
          y[z] = {}
        }
      }
    })

    it('returns array with map data or `undefined`', () => {
      let res = func(world, center, radius)
      for (let x of res) for (let y of x) for (let tile of y) {
        if (tile !== undefined) {
          expect(typeof tile).toBe('object')
        }
      }
    })

    it('sets valid array size', () => {
      let argsResults = [
        [[world, center, 2], [5, 5, 1]],
        [[world, center, 1.9], [3, 3, 1]],
        [[world, center, 4], [9, 9, 3]],
        [[world, center, 5.9], [11, 11, 3]],
        [[world, center, 7.9], [15, 15, 3]]
      ]

      argsResults.forEach(([args, results]) => {
        let res = func(...args)
        expect(res.length).toBe(results[0])
        expect(res[0].length).toBe(results[1])
        expect(res[0][0].length).toBe(results[2])
      })
    })

    it('keeps references to corresponding world tiles', () => {
      radius = 0
      center = { x: 4, y: 5, z: 6 }
      let res = func(world, center, radius)
      expect(res[0][0][0]).toBe(world.data[4][5][6])
    })

    it('saves x and y from overflow', () => {
      radius = 1
      center = { x: 0, y: 0, z: 0 }
      let res = func(world, center, radius)
      expect(res[0][1][0]).toBe(world.data[9][0][0])
      expect(res[1][0][0]).toBe(world.data[0][9][0])
    })

    it('does not save z from overflow', () => {
      radius = 4
      center = { x: 4, y: 4, z: 0 }
      let res = func(world, center, radius)
      expect(res[0][0][0]).toBe(undefined)
      expect(res[0][0][0]).not.toBe(world.data[0][0][9])
    })

    it('does not keep references to tiles out of sphere', () => {
      radius = 1
      center = { x: 0, y: 0, z: 0 }
      let res = func(world, center, radius)
      expect(res[0][0][0]).toBe(undefined)
    })
  })

  describe('withTilesInLine(pos1, pos2, callback)', () => {
    const func = utils.withTilesInLine
    const testData = testData => {
      testData.forEach(([funcArgs, mockArgs]) => {
        let mockFunc = jest.fn()
        func(funcArgs[0], funcArgs[1], mockFunc)
        for (let i = 0; i < mockArgs.length; i++) {
          expect(mockFunc.mock.calls[i]).toEqual([mockArgs[i]])
        }
      })
    }

    it('runs callback with coordinates of tile or tiles in line', () => {
      testData([
        [
          [ { x: 0, y: 0, z: 0 }, { x: 2, y: 0, z: 0 } ],
          [
            [ { x: 0, y: 0, z: 0 } ],
            [ { x: 1, y: 0, z: 0 } ],
            [ { x: 2, y: 0, z: 0 } ]
          ]
        ],
        [
          [ { x: 0, y: 1, z: 0 }, { x: 2, y: 2, z: 0 } ],
          [
            [ { x: 0, y: 1, z: 0 } ],
            [ { x: 1, y: 2, z: 0 }, { x: 1, y: 1, z: 0 } ],
            [ { x: 2, y: 2, z: 0 } ]
          ]
        ],
        [
          [ { x: 0, y: 0, z: 0 }, { x: 2, y: -1, z: -1 } ],
          [
            [ { x: 0, y: 0, z: 0 } ],
            [
              { x: 1, y: 0, z: 0 },
              { x: 1, y: -1, z: 0 },
              { x: 1, y: 0, z: -1 },
              { x: 1, y: -1, z: -1 }
            ],
            [ { x: 2, y: -1, z: -1 } ]
          ]
        ]
      ])
    })

    it('works with longest delta y', () => {
      testData([
        [
          [ { y: 0, x: 0, z: 0 }, { y: 2, x: -1, z: -1 } ],
          [
            [ { y: 0, x: 0, z: 0 } ],
            [
              { y: 1, x: 0, z: 0 },
              { y: 1, x: -1, z: 0 },
              { y: 1, x: 0, z: -1 },
              { y: 1, x: -1, z: -1 }
            ],
            [ { y: 2, x: -1, z: -1 } ]
          ]
        ]
      ])
    })

    it('works with longest delta z', () => {
      testData([
        [
          [ { z: 0, y: 0, x: 0 }, { z: 2, y: -1, x: -1 } ],
          [
            [ { z: 0, y: 0, x: 0 } ],
            [
              { z: 1, y: 0, x: 0 },
              { z: 1, y: -1, x: 0 },
              { z: 1, y: 0, x: -1 },
              { z: 1, y: -1, x: -1 }
            ],
            [ { z: 2, y: -1, x: -1 } ]
          ]
        ]
      ])
    })

    it('is symmetric', () => {
      testData([
        [
          [ { x: 0, y: 1, z: 0 }, { x: 2, y: 2, z: 0 } ],
          [
            [ { x: 0, y: 1, z: 0 } ],
            [ { x: 1, y: 2, z: 0 }, { x: 1, y: 1, z: 0 } ],
            [ { x: 2, y: 2, z: 0 } ]
          ]
        ],
        [
          [ { x: 2, y: 2, z: 0 }, { x: 0, y: 1, z: 0 } ],
          [
            [ { x: 2, y: 2, z: 0 } ],
            [ { x: 1, y: 2, z: 0 }, { x: 1, y: 1, z: 0 } ],
            [ { x: 0, y: 1, z: 0 } ]
          ]
        ]
      ])
    })
  })
})
