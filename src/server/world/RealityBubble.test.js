import RealityBubble from './RealityBubble'

describe('RealityBubble.js', () => {
  describe('RealityBubble', () => {
    let instance
    beforeAll(() => {
      instance = Object.create(RealityBubble.prototype)
    })

    describe('_spiralOutwards(callback)', () => {
      let func
      beforeAll(() => {
        func = instance._spiralOutwards.bind(instance)
        instance.tileRatio = 3
        instance._createBubble(3)
      })

      it('runs callback with tiles in spiral', () => {
        let mock = jest.fn(tile => tile.distFromCenter > 2)
        func(mock)

        let {x, y, z} = instance.bubbleCenter
        let expected = [
          { x, y, z: z + 1 }, { x, y, z: z - 1 },
          { x, y: y + 1, z }, { x, y: y + 2, z }, { x, y: y + 3, z },
          { x, y: y - 1, z }, { x, y: y - 2, z }, { x, y: y - 3, z },
          { x: x + 1, y, z },
          { x: x + 1, y: y + 1, z }, { x: x + 1, y: y + 2, z },
          { x: x + 1, y: y - 1, z }, { x: x + 1, y: y - 2, z },
          { x: x + 2, y, z },
          { x: x + 2, y: y + 1, z }, { x: x + 2, y: y - 1, z },
          { x: x + 3, y, z },
          { x: x - 1, y, z },
          { x: x - 1, y: y + 1, z }, { x: x - 1, y: y + 2, z },
          { x: x - 1, y: y - 1, z }, { x: x - 1, y: y - 2, z },
          { x: x - 2, y, z },
          { x: x - 2, y: y + 1, z }, { x: x - 2, y: y - 1, z },
          { x: x - 3, y, z }
        ]

        let points = expected.length
        for (let i = 0; i < points; i++) {
          expect(mock.mock.calls[i][0].pos).toEqual(expected[i])
        }
        expect(mock.mock.calls[points]).toBe(undefined)
      })
    })
  })
})
