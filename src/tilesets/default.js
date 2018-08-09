export default {
  tileWidth: 12,
  tileHeight: 12,
  cols: 16,
  rows: 16,
  defaultBgColor: 0x060606,
  defaultFgColor: 0xFFFFFF,
  bindings: {

    special: {
      beyondVisability: {
        col: 0,
        row: 0
      }
    },

    ceiling: {
      bedrock: {
        col: 9,
        row: 15
      }
    },

    block: {
      bedrock: {
        col: 11,
        row: 13
      }
    },

    creature: {
      player: {
        col: 0,
        row: 4
      }
    }
  }
}
