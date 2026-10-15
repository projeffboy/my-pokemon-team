import type { GameVariantData } from "../types";

const data: GameVariantData = {
  "Pokemon Champions (M-C)": {
    "moves": {
      "anchorshot": {
        "name": "Anchor Shot",
        "type": "Steel",
        "category": "Physical",
        "basePower": 90,
        "target": "normal",
        "secondary": {
          "chance": 100
        }
      },
      "appleacid": {
        "name": "Apple Acid",
        "type": "Grass",
        "category": "Special",
        "basePower": 90,
        "target": "normal",
        "secondary": {
          "chance": 100
        }
      },
      "astralbarrage": {
        "name": "Astral Barrage",
        "type": "Ghost",
        "category": "Special",
        "basePower": 110,
        "target": "allAdjacentFoes"
      },
      "beakblast": {
        "name": "Beak Blast",
        "type": "Flying",
        "category": "Physical",
        "basePower": 120,
        "target": "normal"
      },
      "bloodmoon": {
        "name": "Blood Moon",
        "type": "Normal",
        "category": "Special",
        "basePower": 130,
        "target": "normal"
      },
      "boltbeak": {
        "name": "Bolt Beak",
        "type": "Electric",
        "category": "Physical",
        "basePower": 80,
        "basePowerCallback": true,
        "target": "normal"
      },
      "bonerush": {
        "name": "Bone Rush",
        "type": "Ground",
        "category": "Physical",
        "basePower": 30,
        "multihit": [
          2,
          5
        ],
        "target": "normal"
      },
      "direclaw": {
        "name": "Dire Claw",
        "type": "Poison",
        "category": "Physical",
        "basePower": 80,
        "target": "normal",
        "secondary": {
          "chance": 30
        }
      },
      "dragoncheer": {
        "name": "Dragon Cheer",
        "type": "Dragon",
        "category": "Status",
        "basePower": 0,
        "target": "adjacentAlly",
        "flags": {
          "sound": 1
        }
      },
      "dragonhammer": {
        "name": "Dragon Hammer",
        "type": "Dragon",
        "category": "Physical",
        "basePower": 100,
        "target": "normal"
      },
      "firelash": {
        "name": "Fire Lash",
        "type": "Fire",
        "category": "Physical",
        "basePower": 90,
        "target": "normal",
        "secondary": {
          "chance": 100
        }
      },
      "firstimpression": {
        "name": "First Impression",
        "type": "Bug",
        "category": "Physical",
        "basePower": 100,
        "target": "normal"
      },
      "fishiousrend": {
        "name": "Fishious Rend",
        "type": "Water",
        "category": "Physical",
        "basePower": 80,
        "basePowerCallback": true,
        "target": "normal"
      },
      "freezedry": {
        "name": "Freeze-Dry",
        "type": "Ice",
        "category": "Special",
        "basePower": 70,
        "target": "normal"
      },
      "geargrind": {
        "name": "Gear Grind",
        "type": "Steel",
        "category": "Physical",
        "basePower": 60,
        "multihit": 2,
        "target": "normal"
      },
      "gravapple": {
        "name": "Grav Apple",
        "type": "Grass",
        "category": "Physical",
        "basePower": 90,
        "target": "normal",
        "secondary": {
          "chance": 100
        }
      },
      "growth": {
        "name": "Growth",
        "type": "Grass",
        "category": "Status",
        "basePower": 0,
        "onModifyMove": true,
        "boosts": {
          "atk": 1,
          "spa": 1
        },
        "target": "self"
      },
      "hyperdrill": {
        "name": "Hyper Drill",
        "type": "Normal",
        "category": "Physical",
        "basePower": 120,
        "target": "normal"
      },
      "infernalparade": {
        "name": "Infernal Parade",
        "type": "Ghost",
        "category": "Special",
        "basePower": 65,
        "basePowerCallback": true,
        "target": "normal",
        "secondary": {
          "chance": 30,
          "status": "brn"
        }
      },
      "ironhead": {
        "name": "Iron Head",
        "type": "Steel",
        "category": "Physical",
        "basePower": 80,
        "target": "normal",
        "secondary": {
          "chance": 20
        }
      },
      "makeitrain": {
        "name": "Make It Rain",
        "type": "Steel",
        "category": "Special",
        "basePower": 120,
        "target": "allAdjacentFoes",
        "selfBoosts": {
          "spa": -2
        }
      },
      "meteorassault": {
        "name": "Meteor Assault",
        "type": "Fighting",
        "category": "Physical",
        "basePower": 170,
        "target": "normal"
      },
      "milkdrink": {
        "name": "Milk Drink",
        "type": "Normal",
        "category": "Status",
        "basePower": 0,
        "target": "adjacentAllyOrSelf"
      },
      "moonblast": {
        "name": "Moonblast",
        "type": "Fairy",
        "category": "Special",
        "basePower": 95,
        "target": "normal",
        "secondary": {
          "chance": 10
        }
      },
      "mountaingale": {
        "name": "Mountain Gale",
        "type": "Ice",
        "category": "Physical",
        "basePower": 120,
        "target": "normal",
        "secondary": {
          "chance": 30
        }
      },
      "nightdaze": {
        "name": "Night Daze",
        "type": "Dark",
        "category": "Special",
        "basePower": 90,
        "target": "normal",
        "secondary": {
          "chance": 40
        }
      },
      "psyshieldbash": {
        "name": "Psyshield Bash",
        "type": "Psychic",
        "category": "Physical",
        "basePower": 90,
        "target": "normal",
        "selfBoosts": {
          "def": 1
        },
        "secondary": {
          "chance": 100
        }
      },
      "revelationdance": {
        "name": "Revelation Dance",
        "type": "Normal",
        "category": "Special",
        "basePower": 100,
        "target": "normal"
      },
      "slash": {
        "name": "Slash",
        "type": "Normal",
        "category": "Physical",
        "basePower": 80,
        "target": "normal"
      },
      "snaptrap": {
        "name": "Snap Trap",
        "type": "Steel",
        "category": "Physical",
        "basePower": 35,
        "target": "normal"
      },
      "snipeshot": {
        "name": "Snipe Shot",
        "type": "Water",
        "category": "Special",
        "basePower": 85,
        "target": "normal"
      },
      "spiritshackle": {
        "name": "Spirit Shackle",
        "type": "Ghost",
        "category": "Physical",
        "basePower": 90,
        "target": "normal",
        "secondary": {
          "chance": 100
        }
      },
      "toxicthread": {
        "name": "Toxic Thread",
        "type": "Poison",
        "category": "Status",
        "basePower": 0,
        "status": "psn",
        "boosts": {
          "spe": -2
        },
        "target": "normal"
      },
      "tripledive": {
        "name": "Triple Dive",
        "type": "Water",
        "category": "Physical",
        "basePower": 35,
        "multihit": 3,
        "target": "normal"
      },
      "tropkick": {
        "name": "Trop Kick",
        "type": "Grass",
        "category": "Physical",
        "basePower": 85,
        "target": "normal",
        "secondary": {
          "chance": 100
        }
      }
    }
  },
  "Legends: Z-A": {
    "baseStats": {
      "starmiemega": {
        "hp": 60,
        "atk": 140,
        "def": 105,
        "spa": 130,
        "spd": 105,
        "spe": 120
      },
      "mawilemega": {
        "hp": 50,
        "atk": 147,
        "def": 125,
        "spa": 55,
        "spd": 95,
        "spe": 50
      },
      "medichammega": {
        "hp": 60,
        "atk": 140,
        "def": 85,
        "spa": 80,
        "spd": 85,
        "spe": 100
      }
    }
  },
  "Legends: Arceus": {
    "baseStats": {
      "cherrimsunshine": {
        "hp": 70,
        "atk": 90,
        "def": 70,
        "spa": 87,
        "spd": 117,
        "spe": 85
      }
    }
  },
  "Let’s Go": {
    "moves": {
      "absorb": {
        "name": "Absorb",
        "type": "Grass",
        "category": "Special",
        "basePower": 40,
        "target": "normal"
      },
      "megadrain": {
        "name": "Mega Drain",
        "type": "Grass",
        "category": "Special",
        "basePower": 75,
        "target": "normal"
      },
      "skyattack": {
        "name": "Sky Attack",
        "type": "Flying",
        "category": "Physical",
        "basePower": 200,
        "target": "any",
        "secondary": {
          "chance": 30
        }
      },
      "solarbeam": {
        "name": "Solar Beam",
        "type": "Grass",
        "category": "Special",
        "basePower": 200,
        "target": "normal"
      }
    }
  }
};

export default data;
