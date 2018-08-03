import {dimensionalArr} from 'utils'
import * as nonDefault from './Renderer'
jest.mock('pixi.js', () => ({}))

describe('Renderer.js', () => {
  describe('getDataScreenOffset(data, visualData, cameraOffset)', () => {
    const func = nonDefault.getDataScreenOffset

    it('returns offset of data start from screen start', () => {
      let data, visualData, cameraOffset, res
      data = dimensionalArr(2, 1, 1)
      visualData = dimensionalArr(5, 5)
      cameraOffset = { x: 0, y: 0, z: 0 }
      res = func(data, visualData, cameraOffset)
      expect(res.x).toBe(1)
      expect(res.y).toBe(2)

      data = dimensionalArr(7, 5, 2)
      res = func(data, visualData, cameraOffset)
      expect(res.x).toBe(-1)
      expect(res.y).toBe(0)

      data = dimensionalArr(2, 3, 4)
      cameraOffset.x = 2
      cameraOffset.y = 3
      cameraOffset.z = 4
      res = func(data, visualData, cameraOffset)
      expect(res.x).toBe(-1)
      expect(res.y).toBe(-2)
    })
  })
})
