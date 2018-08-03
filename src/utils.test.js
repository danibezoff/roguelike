const utils = require('./utils.js')

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
})
