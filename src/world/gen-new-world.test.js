import genNewWorld from './gen-new-world'

describe('gen-new-world.js', () => {
  describe('genNewWorld', () => {
    let func = genNewWorld

    it('returns valid map data', () => {
      let res = func()

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
