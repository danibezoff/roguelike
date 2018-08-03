import {dimensionalArr} from 'utils'
import World, * as nonDefault from './World'

describe('World.js', () => {
  describe('World', () => {
    let instance
    beforeEach(() => instance = Object.create(World.prototype))

    describe('_generateNewWorld()', () => {
      let func
      beforeEach(() => {
        func = instance._generateNewWorld.bind(instance)
        instance.width = 10
        instance.height = 20
        instance.seaLevel = 30
        instance.peakLevel = 40
      })

      it('sets `data` with proper size', () => {
        func()
        let res = instance.data
        expect(res.length).toBe(10)
        expect(res[0].length).toBe(20)
        expect(res[0][0].length).toBe(40)
      })

      it('fills `data` with map data objects', () => {
        func()
        let res = instance.data
        for (let x of res) {
          for (let y of x) {
            for (let z of y) {
              expect(typeof z).toBe('object')
              expect(z).not.toBe(null)
            }
          }
        }
      })
    })
  })

  // describe.skip('randInt(limit)', function () {
  //   it('returns random integer from `0` to `limit - 1`', function () {
  //     let f = World.__get__('randInt')
  //     for (let i = 1; i <= 10; i++) {
  //       f(i).should.be.aboveOrEqual(0).and.lessThan(i)
  //     }
  //   })
  // })

  // describe.skip('saveIndexFromOwerflow(index, size)', function () {
  //   it('loops through valid size\'s indexes', function () {
  //     let f = World.__get__('saveIndexFromOwerflow')
  //     let inputsOutputs = [
  //       [0, 1, 0], [1, 1, 0], [1, 2, 1], [5, 10, 5], [10, 10, 0],
  //       [11, 10, 1], [19, 10, 9], [20, 10, 0], [22, 10, 2], [0, 100, 0],
  //       [100, 10, 0], [-1, 1, 0], [-1, 2, 1], [-1, 10, 9], [-2, 10, 8],
  //       [-5, 10, 5], [-10, 10, 0], [-11, 10, 9], [-21, 10, 9]
  //     ]
  //     for (let [index, size, result] of inputsOutputs) {
  //       f(index, size).should.equal(result)
  //     }
  //   })
  // })

  describe('fillLevel(data, level, callback)', () => {
    const func = nonDefault.fillLevel

    it('fills z-level with callback\'s return value', () => {
      let data = dimensionalArr(3, 3, 3)
      let level = 1
      let callback = () => ({ block: { id: 'bedrock' } })
      func(data, level, callback)
      for (let x of data) {
        for (let y of x) {
          expect(y[level]).toEqual(callback())
        }
      }
    })
  })
})
