import type { PastGenerations } from "../types";

const data: PastGenerations = {
  "1": {
    "types": [
      "Bug",
      "Dragon",
      "Electric",
      "Fighting",
      "Fire",
      "Flying",
      "Ghost",
      "Grass",
      "Ground",
      "Ice",
      "Normal",
      "Poison",
      "Psychic",
      "Rock",
      "Water"
    ],
    "pokemon": {
      "clefairy": [
        "Normal"
      ],
      "clefable": [
        "Normal"
      ],
      "jigglypuff": [
        "Normal"
      ],
      "wigglytuff": [
        "Normal"
      ],
      "magnemite": [
        "Electric"
      ],
      "magneton": [
        "Electric"
      ],
      "mrmime": [
        "Psychic"
      ],
      "cleffa": [
        "Normal"
      ],
      "igglybuff": [
        "Normal"
      ],
      "togepi": [
        "Normal"
      ],
      "togetic": [
        "Normal",
        "Flying"
      ],
      "marill": [
        "Water"
      ],
      "azumarill": [
        "Water"
      ],
      "snubbull": [
        "Normal"
      ],
      "granbull": [
        "Normal"
      ],
      "ralts": [
        "Psychic"
      ],
      "kirlia": [
        "Psychic"
      ],
      "gardevoir": [
        "Psychic"
      ],
      "azurill": [
        "Normal"
      ],
      "mawile": [
        "Steel"
      ],
      "mimejr": [
        "Psychic"
      ],
      "togekiss": [
        "Normal",
        "Flying"
      ],
      "rotomheat": [
        "Electric",
        "Ghost"
      ],
      "rotomwash": [
        "Electric",
        "Ghost"
      ],
      "rotomfrost": [
        "Electric",
        "Ghost"
      ],
      "rotomfan": [
        "Electric",
        "Ghost"
      ],
      "rotommow": [
        "Electric",
        "Ghost"
      ],
      "cottonee": [
        "Grass"
      ],
      "whimsicott": [
        "Grass"
      ]
    },
    "moves": {
      "bide": "???",
      "bite": "Normal",
      "charm": "Normal",
      "curse": "???",
      "gust": "Normal",
      "karatechop": "Normal",
      "moonlight": "Normal",
      "sandattack": "Normal",
      "sweetkiss": "Normal"
    },
    "typechart": {
      "Bug": {
        "Bug": 0,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": 1,
        "Fire": -1,
        "Flying": -1,
        "Ghost": 0,
        "Grass": 1,
        "Ground": 1,
        "Ice": 0,
        "Normal": 0,
        "Poison": -1,
        "Psychic": 0,
        "Rock": -1,
        "Water": 0
      },
      "Dragon": {
        "Bug": 0,
        "Dragon": -1,
        "Electric": 1,
        "Fighting": 0,
        "Fire": 1,
        "Flying": 0,
        "Ghost": 0,
        "Grass": 1,
        "Ground": 0,
        "Ice": -1,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": 0,
        "Water": 1
      },
      "Electric": {
        "Bug": 0,
        "Dragon": 0,
        "Electric": 1,
        "Fighting": 0,
        "Fire": 0,
        "Flying": 1,
        "Ghost": 0,
        "Grass": 0,
        "Ground": -1,
        "Ice": 0,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": 0,
        "Water": 0
      },
      "Fighting": {
        "Bug": 1,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": 0,
        "Fire": 0,
        "Flying": -1,
        "Ghost": 0,
        "Grass": 0,
        "Ground": 0,
        "Ice": 0,
        "Normal": 0,
        "Poison": 0,
        "Psychic": -1,
        "Rock": 1,
        "Water": 0
      },
      "Fire": {
        "Bug": 1,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": 0,
        "Fire": 1,
        "Flying": 0,
        "Ghost": 0,
        "Grass": 1,
        "Ground": -1,
        "Ice": 0,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": -1,
        "Water": -1
      },
      "Flying": {
        "Bug": 1,
        "Dragon": 0,
        "Electric": -1,
        "Fighting": 1,
        "Fire": 0,
        "Flying": 0,
        "Ghost": 0,
        "Grass": 1,
        "Ground": 2,
        "Ice": -1,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": -1,
        "Water": 0
      },
      "Ghost": {
        "Bug": 1,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": 2,
        "Fire": 0,
        "Flying": 0,
        "Ghost": -1,
        "Grass": 0,
        "Ground": 0,
        "Ice": 0,
        "Normal": 2,
        "Poison": 1,
        "Psychic": 0,
        "Rock": 0,
        "Water": 0
      },
      "Grass": {
        "Bug": -1,
        "Dragon": 0,
        "Electric": 1,
        "Fighting": 0,
        "Fire": -1,
        "Flying": -1,
        "Ghost": 0,
        "Grass": 1,
        "Ground": 1,
        "Ice": -1,
        "Normal": 0,
        "Poison": -1,
        "Psychic": 0,
        "Rock": 0,
        "Water": 1
      },
      "Ground": {
        "Bug": 0,
        "Dragon": 0,
        "Electric": 2,
        "Fighting": 0,
        "Fire": 0,
        "Flying": 0,
        "Ghost": 0,
        "Grass": -1,
        "Ground": 0,
        "Ice": -1,
        "Normal": 0,
        "Poison": 1,
        "Psychic": 0,
        "Rock": 1,
        "Water": -1
      },
      "Ice": {
        "Bug": 0,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": -1,
        "Fire": -1,
        "Flying": 0,
        "Ghost": 0,
        "Grass": 0,
        "Ground": 0,
        "Ice": 1,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": -1,
        "Water": 0
      },
      "Normal": {
        "Bug": 0,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": -1,
        "Fire": 0,
        "Flying": 0,
        "Ghost": 2,
        "Grass": 0,
        "Ground": 0,
        "Ice": 0,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": 0,
        "Water": 0
      },
      "Poison": {
        "Bug": -1,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": 1,
        "Fire": 0,
        "Flying": 0,
        "Ghost": 0,
        "Grass": 1,
        "Ground": -1,
        "Ice": 0,
        "Normal": 0,
        "Poison": 1,
        "Psychic": -1,
        "Rock": 0,
        "Water": 0
      },
      "Psychic": {
        "Bug": -1,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": 1,
        "Fire": 0,
        "Flying": 0,
        "Ghost": 2,
        "Grass": 0,
        "Ground": 0,
        "Ice": 0,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 1,
        "Rock": 0,
        "Water": 0
      },
      "Rock": {
        "Bug": 0,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": -1,
        "Fire": 1,
        "Flying": 1,
        "Ghost": 0,
        "Grass": -1,
        "Ground": -1,
        "Ice": 0,
        "Normal": 1,
        "Poison": 1,
        "Psychic": 0,
        "Rock": 0,
        "Water": -1
      },
      "Water": {
        "Bug": 0,
        "Dragon": 0,
        "Electric": -1,
        "Fighting": 0,
        "Fire": 1,
        "Flying": 0,
        "Ghost": 0,
        "Grass": -1,
        "Ground": 0,
        "Ice": 1,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": 0,
        "Water": 1
      }
    }
  },
  "2": {
    "types": [
      "Bug",
      "Dark",
      "Dragon",
      "Electric",
      "Fighting",
      "Fire",
      "Flying",
      "Ghost",
      "Grass",
      "Ground",
      "Ice",
      "Normal",
      "Poison",
      "Psychic",
      "Rock",
      "Steel",
      "Water"
    ],
    "pokemon": {
      "clefairy": [
        "Normal"
      ],
      "clefable": [
        "Normal"
      ],
      "jigglypuff": [
        "Normal"
      ],
      "wigglytuff": [
        "Normal"
      ],
      "mrmime": [
        "Psychic"
      ],
      "cleffa": [
        "Normal"
      ],
      "igglybuff": [
        "Normal"
      ],
      "togepi": [
        "Normal"
      ],
      "togetic": [
        "Normal",
        "Flying"
      ],
      "marill": [
        "Water"
      ],
      "azumarill": [
        "Water"
      ],
      "snubbull": [
        "Normal"
      ],
      "granbull": [
        "Normal"
      ],
      "ralts": [
        "Psychic"
      ],
      "kirlia": [
        "Psychic"
      ],
      "gardevoir": [
        "Psychic"
      ],
      "azurill": [
        "Normal"
      ],
      "mawile": [
        "Steel"
      ],
      "mimejr": [
        "Psychic"
      ],
      "togekiss": [
        "Normal",
        "Flying"
      ],
      "rotomheat": [
        "Electric",
        "Ghost"
      ],
      "rotomwash": [
        "Electric",
        "Ghost"
      ],
      "rotomfrost": [
        "Electric",
        "Ghost"
      ],
      "rotomfan": [
        "Electric",
        "Ghost"
      ],
      "rotommow": [
        "Electric",
        "Ghost"
      ],
      "cottonee": [
        "Grass"
      ],
      "whimsicott": [
        "Grass"
      ]
    },
    "moves": {
      "charm": "Normal",
      "curse": "???",
      "moonlight": "Normal",
      "sweetkiss": "Normal"
    }
  },
  "3": {
    "types": [
      "Bug",
      "Dark",
      "Dragon",
      "Electric",
      "Fighting",
      "Fire",
      "Flying",
      "Ghost",
      "Grass",
      "Ground",
      "Ice",
      "Normal",
      "Poison",
      "Psychic",
      "Rock",
      "Steel",
      "Water"
    ],
    "pokemon": {
      "clefairy": [
        "Normal"
      ],
      "clefable": [
        "Normal"
      ],
      "jigglypuff": [
        "Normal"
      ],
      "wigglytuff": [
        "Normal"
      ],
      "mrmime": [
        "Psychic"
      ],
      "cleffa": [
        "Normal"
      ],
      "igglybuff": [
        "Normal"
      ],
      "togepi": [
        "Normal"
      ],
      "togetic": [
        "Normal",
        "Flying"
      ],
      "marill": [
        "Water"
      ],
      "azumarill": [
        "Water"
      ],
      "snubbull": [
        "Normal"
      ],
      "granbull": [
        "Normal"
      ],
      "ralts": [
        "Psychic"
      ],
      "kirlia": [
        "Psychic"
      ],
      "gardevoir": [
        "Psychic"
      ],
      "azurill": [
        "Normal"
      ],
      "mawile": [
        "Steel"
      ],
      "mimejr": [
        "Psychic"
      ],
      "togekiss": [
        "Normal",
        "Flying"
      ],
      "rotomheat": [
        "Electric",
        "Ghost"
      ],
      "rotomwash": [
        "Electric",
        "Ghost"
      ],
      "rotomfrost": [
        "Electric",
        "Ghost"
      ],
      "rotomfan": [
        "Electric",
        "Ghost"
      ],
      "rotommow": [
        "Electric",
        "Ghost"
      ],
      "cottonee": [
        "Grass"
      ],
      "whimsicott": [
        "Grass"
      ]
    },
    "moves": {
      "charm": "Normal",
      "curse": "???",
      "moonlight": "Normal",
      "sweetkiss": "Normal"
    }
  },
  "4": {
    "types": [
      "Bug",
      "Dark",
      "Dragon",
      "Electric",
      "Fighting",
      "Fire",
      "Flying",
      "Ghost",
      "Grass",
      "Ground",
      "Ice",
      "Normal",
      "Poison",
      "Psychic",
      "Rock",
      "Steel",
      "Water"
    ],
    "pokemon": {
      "clefairy": [
        "Normal"
      ],
      "clefable": [
        "Normal"
      ],
      "jigglypuff": [
        "Normal"
      ],
      "wigglytuff": [
        "Normal"
      ],
      "mrmime": [
        "Psychic"
      ],
      "cleffa": [
        "Normal"
      ],
      "igglybuff": [
        "Normal"
      ],
      "togepi": [
        "Normal"
      ],
      "togetic": [
        "Normal",
        "Flying"
      ],
      "marill": [
        "Water"
      ],
      "azumarill": [
        "Water"
      ],
      "snubbull": [
        "Normal"
      ],
      "granbull": [
        "Normal"
      ],
      "ralts": [
        "Psychic"
      ],
      "kirlia": [
        "Psychic"
      ],
      "gardevoir": [
        "Psychic"
      ],
      "azurill": [
        "Normal"
      ],
      "mawile": [
        "Steel"
      ],
      "mimejr": [
        "Psychic"
      ],
      "togekiss": [
        "Normal",
        "Flying"
      ],
      "rotomheat": [
        "Electric",
        "Ghost"
      ],
      "rotomwash": [
        "Electric",
        "Ghost"
      ],
      "rotomfrost": [
        "Electric",
        "Ghost"
      ],
      "rotomfan": [
        "Electric",
        "Ghost"
      ],
      "rotommow": [
        "Electric",
        "Ghost"
      ],
      "cottonee": [
        "Grass"
      ],
      "whimsicott": [
        "Grass"
      ]
    },
    "moves": {
      "charm": "Normal",
      "curse": "???",
      "moonlight": "Normal",
      "sweetkiss": "Normal"
    }
  },
  "5": {
    "types": [
      "Bug",
      "Dark",
      "Dragon",
      "Electric",
      "Fighting",
      "Fire",
      "Flying",
      "Ghost",
      "Grass",
      "Ground",
      "Ice",
      "Normal",
      "Poison",
      "Psychic",
      "Rock",
      "Steel",
      "Water"
    ],
    "pokemon": {
      "clefairy": [
        "Normal"
      ],
      "clefable": [
        "Normal"
      ],
      "jigglypuff": [
        "Normal"
      ],
      "wigglytuff": [
        "Normal"
      ],
      "mrmime": [
        "Psychic"
      ],
      "cleffa": [
        "Normal"
      ],
      "igglybuff": [
        "Normal"
      ],
      "togepi": [
        "Normal"
      ],
      "togetic": [
        "Normal",
        "Flying"
      ],
      "marill": [
        "Water"
      ],
      "azumarill": [
        "Water"
      ],
      "snubbull": [
        "Normal"
      ],
      "granbull": [
        "Normal"
      ],
      "ralts": [
        "Psychic"
      ],
      "kirlia": [
        "Psychic"
      ],
      "gardevoir": [
        "Psychic"
      ],
      "azurill": [
        "Normal"
      ],
      "mawile": [
        "Steel"
      ],
      "mimejr": [
        "Psychic"
      ],
      "togekiss": [
        "Normal",
        "Flying"
      ],
      "cottonee": [
        "Grass"
      ],
      "whimsicott": [
        "Grass"
      ]
    },
    "moves": {
      "charm": "Normal",
      "moonlight": "Normal",
      "sweetkiss": "Normal"
    },
    "typechart": {
      "Bug": {
        "Bug": 0,
        "Dark": 0,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": 1,
        "Fire": -1,
        "Flying": -1,
        "Ghost": 0,
        "Grass": 1,
        "Ground": 1,
        "Ice": 0,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": -1,
        "Steel": 0,
        "Water": 0
      },
      "Dark": {
        "Bug": -1,
        "Dark": 1,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": -1,
        "Fire": 0,
        "Flying": 0,
        "Ghost": 1,
        "Grass": 0,
        "Ground": 0,
        "Ice": 0,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 2,
        "Rock": 0,
        "Steel": 0,
        "Water": 0
      },
      "Dragon": {
        "Bug": 0,
        "Dark": 0,
        "Dragon": -1,
        "Electric": 1,
        "Fighting": 0,
        "Fire": 1,
        "Flying": 0,
        "Ghost": 0,
        "Grass": 1,
        "Ground": 0,
        "Ice": -1,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": 0,
        "Steel": 0,
        "Water": 1
      },
      "Electric": {
        "Bug": 0,
        "Dark": 0,
        "Dragon": 0,
        "Electric": 1,
        "Fighting": 0,
        "Fire": 0,
        "Flying": 1,
        "Ghost": 0,
        "Grass": 0,
        "Ground": -1,
        "Ice": 0,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": 0,
        "Steel": 1,
        "Water": 0
      },
      "Fighting": {
        "Bug": 1,
        "Dark": 1,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": 0,
        "Fire": 0,
        "Flying": -1,
        "Ghost": 0,
        "Grass": 0,
        "Ground": 0,
        "Ice": 0,
        "Normal": 0,
        "Poison": 0,
        "Psychic": -1,
        "Rock": 1,
        "Steel": 0,
        "Water": 0
      },
      "Fire": {
        "Bug": 1,
        "Dark": 0,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": 0,
        "Fire": 1,
        "Flying": 0,
        "Ghost": 0,
        "Grass": 1,
        "Ground": -1,
        "Ice": 1,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": -1,
        "Steel": 1,
        "Water": -1
      },
      "Flying": {
        "Bug": 1,
        "Dark": 0,
        "Dragon": 0,
        "Electric": -1,
        "Fighting": 1,
        "Fire": 0,
        "Flying": 0,
        "Ghost": 0,
        "Grass": 1,
        "Ground": 2,
        "Ice": -1,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": -1,
        "Steel": 0,
        "Water": 0
      },
      "Ghost": {
        "Bug": 1,
        "Dark": -1,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": 2,
        "Fire": 0,
        "Flying": 0,
        "Ghost": -1,
        "Grass": 0,
        "Ground": 0,
        "Ice": 0,
        "Normal": 2,
        "Poison": 1,
        "Psychic": 0,
        "Rock": 0,
        "Steel": 0,
        "Water": 0
      },
      "Grass": {
        "Bug": -1,
        "Dark": 0,
        "Dragon": 0,
        "Electric": 1,
        "Fighting": 0,
        "Fire": -1,
        "Flying": -1,
        "Ghost": 0,
        "Grass": 1,
        "Ground": 1,
        "Ice": -1,
        "Normal": 0,
        "Poison": -1,
        "Psychic": 0,
        "Rock": 0,
        "Steel": 0,
        "Water": 1
      },
      "Ground": {
        "Bug": 0,
        "Dark": 0,
        "Dragon": 0,
        "Electric": 2,
        "Fighting": 0,
        "Fire": 0,
        "Flying": 0,
        "Ghost": 0,
        "Grass": -1,
        "Ground": 0,
        "Ice": -1,
        "Normal": 0,
        "Poison": 1,
        "Psychic": 0,
        "Rock": 1,
        "Steel": 0,
        "Water": -1
      },
      "Ice": {
        "Bug": 0,
        "Dark": 0,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": -1,
        "Fire": -1,
        "Flying": 0,
        "Ghost": 0,
        "Grass": 0,
        "Ground": 0,
        "Ice": 1,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": -1,
        "Steel": -1,
        "Water": 0
      },
      "Normal": {
        "Bug": 0,
        "Dark": 0,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": -1,
        "Fire": 0,
        "Flying": 0,
        "Ghost": 2,
        "Grass": 0,
        "Ground": 0,
        "Ice": 0,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": 0,
        "Steel": 0,
        "Water": 0
      },
      "Poison": {
        "Bug": 1,
        "Dark": 0,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": 1,
        "Fire": 0,
        "Flying": 0,
        "Ghost": 0,
        "Grass": 1,
        "Ground": -1,
        "Ice": 0,
        "Normal": 0,
        "Poison": 1,
        "Psychic": -1,
        "Rock": 0,
        "Steel": 0,
        "Water": 0
      },
      "Psychic": {
        "Bug": -1,
        "Dark": -1,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": 1,
        "Fire": 0,
        "Flying": 0,
        "Ghost": -1,
        "Grass": 0,
        "Ground": 0,
        "Ice": 0,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 1,
        "Rock": 0,
        "Steel": 0,
        "Water": 0
      },
      "Rock": {
        "Bug": 0,
        "Dark": 0,
        "Dragon": 0,
        "Electric": 0,
        "Fighting": -1,
        "Fire": 1,
        "Flying": 1,
        "Ghost": 0,
        "Grass": -1,
        "Ground": -1,
        "Ice": 0,
        "Normal": 1,
        "Poison": 1,
        "Psychic": 0,
        "Rock": 0,
        "Steel": -1,
        "Water": -1
      },
      "Steel": {
        "Bug": 1,
        "Dark": 1,
        "Dragon": 1,
        "Electric": 0,
        "Fighting": -1,
        "Fire": -1,
        "Flying": 1,
        "Ghost": 1,
        "Grass": 1,
        "Ground": -1,
        "Ice": 1,
        "Normal": 1,
        "Poison": 2,
        "Psychic": 1,
        "Rock": 1,
        "Steel": 1,
        "Water": 0
      },
      "Water": {
        "Bug": 0,
        "Dark": 0,
        "Dragon": 0,
        "Electric": -1,
        "Fighting": 0,
        "Fire": 1,
        "Flying": 0,
        "Ghost": 0,
        "Grass": -1,
        "Ground": 0,
        "Ice": 1,
        "Normal": 0,
        "Poison": 0,
        "Psychic": 0,
        "Rock": 0,
        "Steel": 1,
        "Water": 1
      }
    }
  },
  "6": {
    "types": [
      "Bug",
      "Dark",
      "Dragon",
      "Electric",
      "Fairy",
      "Fighting",
      "Fire",
      "Flying",
      "Ghost",
      "Grass",
      "Ground",
      "Ice",
      "Normal",
      "Poison",
      "Psychic",
      "Rock",
      "Steel",
      "Water"
    ],
    "pokemon": {},
    "moves": {}
  },
  "7": {
    "types": [
      "Bug",
      "Dark",
      "Dragon",
      "Electric",
      "Fairy",
      "Fighting",
      "Fire",
      "Flying",
      "Ghost",
      "Grass",
      "Ground",
      "Ice",
      "Normal",
      "Poison",
      "Psychic",
      "Rock",
      "Steel",
      "Water"
    ],
    "pokemon": {},
    "moves": {}
  },
  "8": {
    "types": [
      "Bug",
      "Dark",
      "Dragon",
      "Electric",
      "Fairy",
      "Fighting",
      "Fire",
      "Flying",
      "Ghost",
      "Grass",
      "Ground",
      "Ice",
      "Normal",
      "Poison",
      "Psychic",
      "Rock",
      "Steel",
      "Water"
    ],
    "pokemon": {},
    "moves": {}
  }
};

export default data;
