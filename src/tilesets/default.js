export default {
  tileWidth: 12,
  tileHeight: 12,
  cols: 16,
  rows: 16,
  defaultBgColor: 0x030303,
  defaultFgColor: 0xFFFFFF,
  bindings: {

    special: {
      unvisible: {
        col: 0,
        row: 0
      },
      beyondVisability: {
        col: 0,
        row: 0
      }
    },

    block: {
      bedrock: {
        col: 11,
        row: 13,
        fromAbove: {
          col: 9,
          row: 15
        }
      },
      rock: {
        col: 1,
        row: 11,
        fromAbove: {
          col: 9,
          row: 15
        }
      },
      soil: {
        col: 0,
        row: 11,
        fg: 0x8B4513,
        fromAbove: {
          col: 9,
          row: 15,
          fg: 0x8B4513
        }
      },
      grass: {
        col: 0,
        row: 11,
        fg: 0x008000,
        fromAbove: {
          col: 9,
          row: 15,
          fg: 0x008000
        }
      }
    },

    creature: {
      player: {
        col: 4,
        row: 0
      }
    }
  }
}
