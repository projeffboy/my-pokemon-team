import type { GameVariantData } from "../types";

const data: GameVariantData = {
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
        "basePower": 40
      },
      "megadrain": {
        "name": "Mega Drain",
        "type": "Grass",
        "category": "Special",
        "basePower": 75
      },
      "skyattack": {
        "name": "Sky Attack",
        "type": "Flying",
        "category": "Physical",
        "basePower": 200,
        "secondary": {
          "chance": 30
        }
      },
      "solarbeam": {
        "name": "Solar Beam",
        "type": "Grass",
        "category": "Special",
        "basePower": 200
      }
    }
  }
};

export default data;
