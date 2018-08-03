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

})
