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
    "moveData": {
      "aircutter": {
        "category": "Special",
        "basePower": 55
      },
      "assurance": {
        "category": "Physical",
        "basePower": 50,
        "basePowerCallback": true
      },
      "aurasphere": {
        "category": "Special",
        "basePower": 90
      },
      "baddybad": {
        "category": "Special",
        "basePower": 90
      },
      "beatup": {
        "category": "Physical",
        "basePower": 10,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "blizzard": {
        "category": "Special",
        "basePower": 120
      },
      "bouncybubble": {
        "category": "Special",
        "basePower": 90
      },
      "bubble": {
        "category": "Special",
        "basePower": 20
      },
      "bulletseed": {
        "category": "Physical",
        "basePower": 10,
        "multihit": [
          2,
          5
        ]
      },
      "buzzybuzz": {
        "category": "Special",
        "basePower": 90
      },
      "chatter": {
        "category": "Special",
        "basePower": 60,
        "onModifyMove": true
      },
      "counter": {
        "category": "Physical",
        "basePower": 1
      },
      "covet": {
        "category": "Physical",
        "basePower": 40
      },
      "crabhammer": {
        "category": "Physical",
        "basePower": 90
      },
      "dig": {
        "category": "Physical",
        "basePower": 100
      },
      "dive": {
        "category": "Physical",
        "basePower": 60
      },
      "doomdesire": {
        "category": "Special",
        "basePower": 120
      },
      "doubleedge": {
        "category": "Physical",
        "basePower": 100
      },
      "dracometeor": {
        "category": "Special",
        "basePower": 140
      },
      "dragonpulse": {
        "category": "Special",
        "basePower": 90
      },
      "dragonrage": {
        "category": "Special",
        "basePower": 1
      },
      "drainpunch": {
        "category": "Physical",
        "basePower": 60
      },
      "energyball": {
        "category": "Special",
        "basePower": 80
      },
      "explosion": {
        "category": "Physical",
        "basePower": 170
      },
      "feint": {
        "category": "Physical",
        "basePower": 50
      },
      "fellstinger": {
        "category": "Physical",
        "basePower": 30
      },
      "fireblast": {
        "category": "Special",
        "basePower": 120
      },
      "firepledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "firespin": {
        "category": "Special",
        "basePower": 15
      },
      "flamethrower": {
        "category": "Special",
        "basePower": 95
      },
      "fly": {
        "category": "Physical",
        "basePower": 70
      },
      "flyingpress": {
        "category": "Physical",
        "basePower": 80
      },
      "freezyfrost": {
        "category": "Special",
        "basePower": 90
      },
      "frostbreath": {
        "category": "Special",
        "basePower": 40
      },
      "furycutter": {
        "category": "Physical",
        "basePower": 10,
        "basePowerCallback": true
      },
      "futuresight": {
        "category": "Special",
        "basePower": 80
      },
      "gigadrain": {
        "category": "Special",
        "basePower": 60
      },
      "glaciallance": {
        "category": "Physical",
        "basePower": 130
      },
      "glitzyglow": {
        "category": "Special",
        "basePower": 90
      },
      "grasspledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "grassyglide": {
        "category": "Physical",
        "basePower": 70
      },
      "growth": {
        "category": "Status",
        "basePower": 0
      },
      "heatwave": {
        "category": "Special",
        "basePower": 100
      },
      "hex": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true
      },
      "hiddenpower": {
        "category": "Physical",
        "basePower": 0,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "hiddenpowerbug": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerdark": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerdragon": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerelectric": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerfighting": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerfire": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerflying": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerghost": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowergrass": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerground": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerice": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerpoison": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerpsychic": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerrock": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowersteel": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerwater": {
        "category": "Special",
        "basePower": 70
      },
      "highjumpkick": {
        "category": "Physical",
        "basePower": 85
      },
      "hurricane": {
        "category": "Special",
        "basePower": 120,
        "onModifyMove": true
      },
      "hydropump": {
        "category": "Special",
        "basePower": 120
      },
      "icebeam": {
        "category": "Special",
        "basePower": 95
      },
      "iciclespear": {
        "category": "Physical",
        "basePower": 10,
        "multihit": [
          2,
          5
        ]
      },
      "incinerate": {
        "category": "Special",
        "basePower": 30
      },
      "jumpkick": {
        "category": "Physical",
        "basePower": 70
      },
      "knockoff": {
        "category": "Physical",
        "basePower": 20
      },
      "lastresort": {
        "category": "Physical",
        "basePower": 130
      },
      "leafblade": {
        "category": "Physical",
        "basePower": 70
      },
      "leafstorm": {
        "category": "Special",
        "basePower": 140
      },
      "leechlife": {
        "category": "Physical",
        "basePower": 20
      },
      "lick": {
        "category": "Physical",
        "basePower": 20
      },
      "lowkick": {
        "category": "Physical",
        "basePower": 50
      },
      "lowsweep": {
        "category": "Physical",
        "basePower": 60
      },
      "lusterpurge": {
        "category": "Special",
        "basePower": 70
      },
      "magmastorm": {
        "category": "Special",
        "basePower": 120
      },
      "meteormash": {
        "category": "Physical",
        "basePower": 100
      },
      "mistball": {
        "category": "Special",
        "basePower": 70
      },
      "muddywater": {
        "category": "Special",
        "basePower": 95
      },
      "multiattack": {
        "category": "Physical",
        "basePower": 90
      },
      "mysticalfire": {
        "category": "Special",
        "basePower": 65
      },
      "nightshade": {
        "category": "Special",
        "basePower": 1
      },
      "outrage": {
        "category": "Physical",
        "basePower": 90
      },
      "overheat": {
        "category": "Special",
        "basePower": 140
      },
      "paraboliccharge": {
        "category": "Special",
        "basePower": 50
      },
      "petaldance": {
        "category": "Special",
        "basePower": 70
      },
      "pinmissile": {
        "category": "Physical",
        "basePower": 14,
        "multihit": [
          2,
          5
        ]
      },
      "powergem": {
        "category": "Special",
        "basePower": 70
      },
      "psywave": {
        "category": "Special",
        "basePower": 1
      },
      "pursuit": {
        "category": "Physical",
        "basePower": 40,
        "basePowerCallback": true
      },
      "rapidspin": {
        "category": "Physical",
        "basePower": 20
      },
      "rocksmash": {
        "category": "Physical",
        "basePower": 20
      },
      "rocktomb": {
        "category": "Physical",
        "basePower": 50
      },
      "sandtomb": {
        "category": "Physical",
        "basePower": 15
      },
      "sappyseed": {
        "category": "Physical",
        "basePower": 90
      },
      "seismictoss": {
        "category": "Physical",
        "basePower": 1
      },
      "selfdestruct": {
        "category": "Physical",
        "basePower": 130
      },
      "sizzlyslide": {
        "category": "Physical",
        "basePower": 90
      },
      "skullbash": {
        "category": "Physical",
        "basePower": 100
      },
      "smellingsalts": {
        "category": "Physical",
        "basePower": 60,
        "basePowerCallback": true
      },
      "smog": {
        "category": "Special",
        "basePower": 20
      },
      "snore": {
        "category": "Special",
        "basePower": 40
      },
      "sonicboom": {
        "category": "Special",
        "basePower": 1
      },
      "sparklyswirl": {
        "category": "Special",
        "basePower": 90
      },
      "stormthrow": {
        "category": "Physical",
        "basePower": 40
      },
      "struggle": {
        "category": "Physical",
        "basePower": 50
      },
      "strugglebug": {
        "category": "Special",
        "basePower": 30
      },
      "suckerpunch": {
        "category": "Physical",
        "basePower": 80
      },
      "superfang": {
        "category": "Physical",
        "basePower": 1
      },
      "surf": {
        "category": "Special",
        "basePower": 95
      },
      "synchronoise": {
        "category": "Special",
        "basePower": 70
      },
      "tackle": {
        "category": "Physical",
        "basePower": 35
      },
      "technoblast": {
        "category": "Special",
        "basePower": 85
      },
      "thief": {
        "category": "Physical",
        "basePower": 40
      },
      "thrash": {
        "category": "Physical",
        "basePower": 90
      },
      "thunder": {
        "category": "Special",
        "basePower": 120,
        "onModifyMove": true
      },
      "thunderbolt": {
        "category": "Special",
        "basePower": 95
      },
      "triplekick": {
        "category": "Physical",
        "basePower": 10,
        "multihit": [
          1,
          3
        ],
        "basePowerCallback": true
      },
      "uproar": {
        "category": "Special",
        "basePower": 50
      },
      "vinewhip": {
        "category": "Physical",
        "basePower": 35
      },
      "wakeupslap": {
        "category": "Physical",
        "basePower": 60,
        "basePowerCallback": true
      },
      "waterpledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "watershuriken": {
        "category": "Physical",
        "basePower": 15,
        "multihit": [
          2,
          5
        ],
        "basePowerCallback": true
      },
      "whirlpool": {
        "category": "Special",
        "basePower": 15
      },
      "wickedblow": {
        "category": "Physical",
        "basePower": 80
      },
      "wingattack": {
        "category": "Physical",
        "basePower": 35
      },
      "zapcannon": {
        "category": "Special",
        "basePower": 100
      },
      "zippyzap": {
        "category": "Physical",
        "basePower": 50
      }
    },
    "formats": {
      "venusaur": {
        "tier": "PU"
      },
      "charizard": {
        "tier": "NU"
      },
      "blastoise": {
        "tier": "NU"
      },
      "caterpie": {
        "tier": "LC"
      },
      "metapod": {
        "tier": "NFE"
      },
      "butterfree": {
        "tier": "ZU"
      },
      "weedle": {
        "tier": "LC"
      },
      "kakuna": {
        "tier": "NFE"
      },
      "beedrill": {
        "tier": "ZU"
      },
      "pidgey": {
        "tier": "LC"
      },
      "pidgeotto": {
        "tier": "NFE"
      },
      "pidgeot": {
        "tier": "PU"
      },
      "rattata": {
        "tier": "LC"
      },
      "raticate": {
        "tier": "NU"
      },
      "spearow": {
        "tier": "LC"
      },
      "fearow": {
        "tier": "NU"
      },
      "arbok": {
        "tier": "ZU"
      },
      "pikachu": {
        "tier": "LC"
      },
      "raichu": {
        "tier": "UU"
      },
      "sandslash": {
        "tier": "ZU"
      },
      "nidoranf": {
        "tier": "LC"
      },
      "nidorina": {
        "tier": "NFE"
      },
      "nidoqueen": {
        "tier": "ZU"
      },
      "nidoranm": {
        "tier": "LC"
      },
      "nidorino": {
        "tier": "NFE"
      },
      "nidoking": {
        "tier": "PU"
      },
      "clefairy": {
        "tier": "LC"
      },
      "clefable": {
        "tier": "UU"
      },
      "vulpix": {
        "tier": "LC"
      },
      "ninetales": {
        "tier": "UU"
      },
      "jigglypuff": {
        "tier": "LC"
      },
      "wigglytuff": {
        "tier": "ZU"
      },
      "zubat": {
        "tier": "LC"
      },
      "golbat": {
        "tier": "ZU"
      },
      "vileplume": {
        "tier": "ZU"
      },
      "paras": {
        "tier": "LC"
      },
      "parasect": {
        "tier": "ZU"
      },
      "venomoth": {
        "tier": "NU"
      },
      "diglett": {
        "tier": "LC"
      },
      "dugtrio": {
        "tier": "UU"
      },
      "persian": {
        "tier": "UU"
      },
      "golduck": {
        "tier": "PU"
      },
      "primeape": {
        "tier": "PU"
      },
      "arcanine": {
        "tier": "NU"
      },
      "poliwag": {
        "tier": "ZUBL"
      },
      "poliwhirl": {
        "tier": "NU"
      },
      "poliwrath": {
        "tier": "NU"
      },
      "abra": {
        "tier": "PU"
      },
      "kadabra": {
        "tier": "NU"
      },
      "alakazam": {
        "tier": "OU"
      },
      "machop": {
        "tier": "LC"
      },
      "machoke": {
        "tier": "NFE"
      },
      "machamp": {
        "tier": "ZU"
      },
      "victreebel": {
        "tier": "NU"
      },
      "tentacool": {
        "tier": "ZU"
      },
      "tentacruel": {
        "tier": "NU"
      },
      "graveler": {
        "tier": "PU"
      },
      "golem": {
        "tier": "NU"
      },
      "ponyta": {
        "tier": "LC"
      },
      "rapidash": {
        "tier": "UU"
      },
      "slowpoke": {
        "tier": "ZU"
      },
      "slowbro": {
        "tier": "UU"
      },
      "magneton": {
        "tier": "NU"
      },
      "farfetchd": {
        "tier": "ZU"
      },
      "dodrio": {
        "tier": "UU"
      },
      "dewgong": {
        "tier": "NU"
      },
      "muk": {
        "tier": "ZU"
      },
      "shellder": {
        "tier": "LC"
      },
      "cloyster": {
        "tier": "OU"
      },
      "gastly": {
        "tier": "PU"
      },
      "haunter": {
        "tier": "UU"
      },
      "gengar": {
        "tier": "OU"
      },
      "onix": {
        "tier": "ZU"
      },
      "drowzee": {
        "tier": "ZU"
      },
      "hypno": {
        "tier": "UU"
      },
      "krabby": {
        "tier": "LC"
      },
      "kingler": {
        "tier": "ZU"
      },
      "electrode": {
        "tier": "NU"
      },
      "exeggcute": {
        "tier": "PU"
      },
      "exeggutor": {
        "tier": "OU"
      },
      "cubone": {
        "tier": "LC"
      },
      "marowak": {
        "tier": "ZU"
      },
      "hitmonlee": {
        "tier": "ZU"
      },
      "hitmonchan": {
        "tier": "ZU"
      },
      "lickitung": {
        "tier": "ZU"
      },
      "weezing": {
        "tier": "ZU"
      },
      "rhydon": {
        "tier": "OU"
      },
      "chansey": {
        "tier": "OU"
      },
      "tangela": {
        "tier": "NU"
      },
      "kangaskhan": {
        "tier": "UU"
      },
      "seadra": {
        "tier": "NU"
      },
      "goldeen": {
        "tier": "LC"
      },
      "seaking": {
        "tier": "PU"
      },
      "staryu": {
        "tier": "PU"
      },
      "starmie": {
        "tier": "OU"
      },
      "mrmime": {
        "tier": "NU"
      },
      "scyther": {
        "tier": "PU"
      },
      "jynx": {
        "tier": "OU"
      },
      "electabuzz": {
        "tier": "UU"
      },
      "magmar": {
        "tier": "PU"
      },
      "pinsir": {
        "tier": "ZUBL"
      },
      "tauros": {
        "tier": "OU"
      },
      "gyarados": {
        "tier": "UU"
      },
      "lapras": {
        "tier": "UU"
      },
      "ditto": {
        "tier": "ZU"
      },
      "vaporeon": {
        "tier": "NU"
      },
      "jolteon": {
        "tier": "UU"
      },
      "flareon": {
        "tier": "ZU"
      },
      "porygon": {
        "tier": "PU"
      },
      "omanyte": {
        "tier": "ZU"
      },
      "omastar": {
        "tier": "NU"
      },
      "kabuto": {
        "tier": "LC"
      },
      "kabutops": {
        "tier": "NU"
      },
      "aerodactyl": {
        "tier": "NU"
      },
      "snorlax": {
        "tier": "OU"
      },
      "articuno": {
        "tier": "UU"
      },
      "zapdos": {
        "tier": "OU"
      },
      "moltres": {
        "tier": "UU"
      },
      "dragonair": {
        "tier": "ZU"
      },
      "dragonite": {
        "tier": "UU"
      },
      "mewtwo": {
        "tier": "Uber"
      },
      "mew": {
        "tier": "Uber"
      }
    },
    "baseStats": {
      "charmander": {
        "hp": 39,
        "atk": 52,
        "def": 43,
        "spa": 50,
        "spd": 50,
        "spe": 65
      },
      "charmeleon": {
        "hp": 58,
        "atk": 64,
        "def": 58,
        "spa": 65,
        "spd": 65,
        "spe": 80
      },
      "charizard": {
        "hp": 78,
        "atk": 84,
        "def": 78,
        "spa": 85,
        "spd": 85,
        "spe": 100
      },
      "squirtle": {
        "hp": 44,
        "atk": 48,
        "def": 65,
        "spa": 50,
        "spd": 50,
        "spe": 43
      },
      "wartortle": {
        "hp": 59,
        "atk": 63,
        "def": 80,
        "spa": 65,
        "spd": 65,
        "spe": 58
      },
      "blastoise": {
        "hp": 79,
        "atk": 83,
        "def": 100,
        "spa": 85,
        "spd": 85,
        "spe": 78
      },
      "butterfree": {
        "hp": 60,
        "atk": 45,
        "def": 50,
        "spa": 80,
        "spd": 80,
        "spe": 70
      },
      "beedrill": {
        "hp": 65,
        "atk": 80,
        "def": 40,
        "spa": 45,
        "spd": 45,
        "spe": 75
      },
      "pidgeot": {
        "hp": 83,
        "atk": 80,
        "def": 75,
        "spa": 70,
        "spd": 70,
        "spe": 91
      },
      "rattata": {
        "hp": 30,
        "atk": 56,
        "def": 35,
        "spa": 25,
        "spd": 25,
        "spe": 72
      },
      "raticate": {
        "hp": 55,
        "atk": 81,
        "def": 60,
        "spa": 50,
        "spd": 50,
        "spe": 97
      },
      "ekans": {
        "hp": 35,
        "atk": 60,
        "def": 44,
        "spa": 40,
        "spd": 40,
        "spe": 55
      },
      "arbok": {
        "hp": 60,
        "atk": 85,
        "def": 69,
        "spa": 65,
        "spd": 65,
        "spe": 80
      },
      "pikachu": {
        "hp": 35,
        "atk": 55,
        "def": 30,
        "spa": 50,
        "spd": 50,
        "spe": 90
      },
      "raichu": {
        "hp": 60,
        "atk": 90,
        "def": 55,
        "spa": 90,
        "spd": 90,
        "spe": 100
      },
      "sandshrew": {
        "hp": 50,
        "atk": 75,
        "def": 85,
        "spa": 30,
        "spd": 30,
        "spe": 40
      },
      "sandslash": {
        "hp": 75,
        "atk": 100,
        "def": 110,
        "spa": 55,
        "spd": 55,
        "spe": 65
      },
      "nidoqueen": {
        "hp": 90,
        "atk": 82,
        "def": 87,
        "spa": 75,
        "spd": 75,
        "spe": 76
      },
      "nidoking": {
        "hp": 81,
        "atk": 92,
        "def": 77,
        "spa": 75,
        "spd": 75,
        "spe": 85
      },
      "clefairy": {
        "hp": 70,
        "atk": 45,
        "def": 48,
        "spa": 60,
        "spd": 60,
        "spe": 35
      },
      "clefable": {
        "hp": 95,
        "atk": 70,
        "def": 73,
        "spa": 85,
        "spd": 85,
        "spe": 60
      },
      "vulpix": {
        "hp": 38,
        "atk": 41,
        "def": 40,
        "spa": 65,
        "spd": 65,
        "spe": 65
      },
      "ninetales": {
        "hp": 73,
        "atk": 76,
        "def": 75,
        "spa": 100,
        "spd": 100,
        "spe": 100
      },
      "jigglypuff": {
        "hp": 115,
        "atk": 45,
        "def": 20,
        "spa": 25,
        "spd": 25,
        "spe": 20
      },
      "wigglytuff": {
        "hp": 140,
        "atk": 70,
        "def": 45,
        "spa": 50,
        "spd": 50,
        "spe": 45
      },
      "zubat": {
        "hp": 40,
        "atk": 45,
        "def": 35,
        "spa": 40,
        "spd": 40,
        "spe": 55
      },
      "golbat": {
        "hp": 75,
        "atk": 80,
        "def": 70,
        "spa": 75,
        "spd": 75,
        "spe": 90
      },
      "oddish": {
        "hp": 45,
        "atk": 50,
        "def": 55,
        "spa": 75,
        "spd": 75,
        "spe": 30
      },
      "gloom": {
        "hp": 60,
        "atk": 65,
        "def": 70,
        "spa": 85,
        "spd": 85,
        "spe": 40
      },
      "vileplume": {
        "hp": 75,
        "atk": 80,
        "def": 85,
        "spa": 100,
        "spd": 100,
        "spe": 50
      },
      "paras": {
        "hp": 35,
        "atk": 70,
        "def": 55,
        "spa": 55,
        "spd": 55,
        "spe": 25
      },
      "parasect": {
        "hp": 60,
        "atk": 95,
        "def": 80,
        "spa": 80,
        "spd": 80,
        "spe": 30
      },
      "venonat": {
        "hp": 60,
        "atk": 55,
        "def": 50,
        "spa": 40,
        "spd": 40,
        "spe": 45
      },
      "venomoth": {
        "hp": 70,
        "atk": 65,
        "def": 60,
        "spa": 90,
        "spd": 90,
        "spe": 90
      },
      "diglett": {
        "hp": 10,
        "atk": 55,
        "def": 25,
        "spa": 45,
        "spd": 45,
        "spe": 95
      },
      "dugtrio": {
        "hp": 35,
        "atk": 80,
        "def": 50,
        "spa": 70,
        "spd": 70,
        "spe": 120
      },
      "psyduck": {
        "hp": 50,
        "atk": 52,
        "def": 48,
        "spa": 50,
        "spd": 50,
        "spe": 55
      },
      "golduck": {
        "hp": 80,
        "atk": 82,
        "def": 78,
        "spa": 80,
        "spd": 80,
        "spe": 85
      },
      "mankey": {
        "hp": 40,
        "atk": 80,
        "def": 35,
        "spa": 35,
        "spd": 35,
        "spe": 70
      },
      "primeape": {
        "hp": 65,
        "atk": 105,
        "def": 60,
        "spa": 60,
        "spd": 60,
        "spe": 95
      },
      "growlithe": {
        "hp": 55,
        "atk": 70,
        "def": 45,
        "spa": 50,
        "spd": 50,
        "spe": 60
      },
      "arcanine": {
        "hp": 90,
        "atk": 110,
        "def": 80,
        "spa": 80,
        "spd": 80,
        "spe": 95
      },
      "poliwrath": {
        "hp": 90,
        "atk": 85,
        "def": 95,
        "spa": 70,
        "spd": 70,
        "spe": 70
      },
      "abra": {
        "hp": 25,
        "atk": 20,
        "def": 15,
        "spa": 105,
        "spd": 105,
        "spe": 90
      },
      "kadabra": {
        "hp": 40,
        "atk": 35,
        "def": 30,
        "spa": 120,
        "spd": 120,
        "spe": 105
      },
      "alakazam": {
        "hp": 55,
        "atk": 50,
        "def": 45,
        "spa": 135,
        "spd": 135,
        "spe": 120
      },
      "alakazammega": {
        "hp": 55,
        "atk": 50,
        "def": 65,
        "spa": 175,
        "spd": 95,
        "spe": 150
      },
      "machoke": {
        "hp": 80,
        "atk": 100,
        "def": 70,
        "spa": 50,
        "spd": 50,
        "spe": 45
      },
      "machamp": {
        "hp": 90,
        "atk": 130,
        "def": 80,
        "spa": 65,
        "spd": 65,
        "spe": 55
      },
      "bellsprout": {
        "hp": 50,
        "atk": 75,
        "def": 35,
        "spa": 70,
        "spd": 70,
        "spe": 40
      },
      "weepinbell": {
        "hp": 65,
        "atk": 90,
        "def": 50,
        "spa": 85,
        "spd": 85,
        "spe": 55
      },
      "victreebel": {
        "hp": 80,
        "atk": 105,
        "def": 65,
        "spa": 100,
        "spd": 100,
        "spe": 70
      },
      "tentacool": {
        "hp": 40,
        "atk": 40,
        "def": 35,
        "spa": 100,
        "spd": 100,
        "spe": 70
      },
      "tentacruel": {
        "hp": 80,
        "atk": 70,
        "def": 65,
        "spa": 120,
        "spd": 120,
        "spe": 100
      },
      "golem": {
        "hp": 80,
        "atk": 110,
        "def": 130,
        "spa": 55,
        "spd": 55,
        "spe": 45
      },
      "slowbro": {
        "hp": 95,
        "atk": 75,
        "def": 110,
        "spa": 80,
        "spd": 80,
        "spe": 30
      },
      "magnemite": {
        "hp": 25,
        "atk": 35,
        "def": 70,
        "spa": 95,
        "spd": 95,
        "spe": 45
      },
      "magneton": {
        "hp": 50,
        "atk": 60,
        "def": 95,
        "spa": 120,
        "spd": 120,
        "spe": 70
      },
      "farfetchd": {
        "hp": 52,
        "atk": 65,
        "def": 55,
        "spa": 58,
        "spd": 58,
        "spe": 60
      },
      "dodrio": {
        "hp": 60,
        "atk": 110,
        "def": 70,
        "spa": 60,
        "spd": 60,
        "spe": 100
      },
      "seel": {
        "hp": 65,
        "atk": 45,
        "def": 55,
        "spa": 70,
        "spd": 70,
        "spe": 45
      },
      "dewgong": {
        "hp": 90,
        "atk": 70,
        "def": 80,
        "spa": 95,
        "spd": 95,
        "spe": 70
      },
      "grimer": {
        "hp": 80,
        "atk": 80,
        "def": 50,
        "spa": 40,
        "spd": 40,
        "spe": 25
      },
      "muk": {
        "hp": 105,
        "atk": 105,
        "def": 75,
        "spa": 65,
        "spd": 65,
        "spe": 50
      },
      "shellder": {
        "hp": 30,
        "atk": 65,
        "def": 100,
        "spa": 45,
        "spd": 45,
        "spe": 40
      },
      "cloyster": {
        "hp": 50,
        "atk": 95,
        "def": 180,
        "spa": 85,
        "spd": 85,
        "spe": 70
      },
      "gastly": {
        "hp": 30,
        "atk": 35,
        "def": 30,
        "spa": 100,
        "spd": 100,
        "spe": 80
      },
      "haunter": {
        "hp": 45,
        "atk": 50,
        "def": 45,
        "spa": 115,
        "spd": 115,
        "spe": 95
      },
      "gengar": {
        "hp": 60,
        "atk": 65,
        "def": 60,
        "spa": 130,
        "spd": 130,
        "spe": 110
      },
      "onix": {
        "hp": 35,
        "atk": 45,
        "def": 160,
        "spa": 30,
        "spd": 30,
        "spe": 70
      },
      "drowzee": {
        "hp": 60,
        "atk": 48,
        "def": 45,
        "spa": 90,
        "spd": 90,
        "spe": 42
      },
      "hypno": {
        "hp": 85,
        "atk": 73,
        "def": 70,
        "spa": 115,
        "spd": 115,
        "spe": 67
      },
      "electrode": {
        "hp": 60,
        "atk": 50,
        "def": 70,
        "spa": 80,
        "spd": 80,
        "spe": 140
      },
      "exeggcute": {
        "hp": 60,
        "atk": 40,
        "def": 80,
        "spa": 60,
        "spd": 60,
        "spe": 40
      },
      "exeggutor": {
        "hp": 95,
        "atk": 95,
        "def": 85,
        "spa": 125,
        "spd": 125,
        "spe": 55
      },
      "cubone": {
        "hp": 50,
        "atk": 50,
        "def": 95,
        "spa": 40,
        "spd": 40,
        "spe": 35
      },
      "marowak": {
        "hp": 60,
        "atk": 80,
        "def": 110,
        "spa": 50,
        "spd": 50,
        "spe": 45
      },
      "hitmonlee": {
        "hp": 50,
        "atk": 120,
        "def": 53,
        "spa": 35,
        "spd": 35,
        "spe": 87
      },
      "hitmonchan": {
        "hp": 50,
        "atk": 105,
        "def": 79,
        "spa": 35,
        "spd": 35,
        "spe": 76
      },
      "lickitung": {
        "hp": 90,
        "atk": 55,
        "def": 75,
        "spa": 60,
        "spd": 60,
        "spe": 30
      },
      "koffing": {
        "hp": 40,
        "atk": 65,
        "def": 95,
        "spa": 60,
        "spd": 60,
        "spe": 35
      },
      "weezing": {
        "hp": 65,
        "atk": 90,
        "def": 120,
        "spa": 85,
        "spd": 85,
        "spe": 60
      },
      "chansey": {
        "hp": 250,
        "atk": 5,
        "def": 5,
        "spa": 105,
        "spd": 105,
        "spe": 50
      },
      "tangela": {
        "hp": 65,
        "atk": 55,
        "def": 115,
        "spa": 100,
        "spd": 100,
        "spe": 60
      },
      "kangaskhan": {
        "hp": 105,
        "atk": 95,
        "def": 80,
        "spa": 40,
        "spd": 40,
        "spe": 90
      },
      "horsea": {
        "hp": 30,
        "atk": 40,
        "def": 70,
        "spa": 70,
        "spd": 70,
        "spe": 60
      },
      "seadra": {
        "hp": 55,
        "atk": 65,
        "def": 95,
        "spa": 95,
        "spd": 95,
        "spe": 85
      },
      "goldeen": {
        "hp": 45,
        "atk": 67,
        "def": 60,
        "spa": 50,
        "spd": 50,
        "spe": 63
      },
      "seaking": {
        "hp": 80,
        "atk": 92,
        "def": 65,
        "spa": 80,
        "spd": 80,
        "spe": 68
      },
      "staryu": {
        "hp": 30,
        "atk": 45,
        "def": 55,
        "spa": 70,
        "spd": 70,
        "spe": 85
      },
      "starmie": {
        "hp": 60,
        "atk": 75,
        "def": 85,
        "spa": 100,
        "spd": 100,
        "spe": 115
      },
      "mrmime": {
        "hp": 40,
        "atk": 45,
        "def": 65,
        "spa": 100,
        "spd": 100,
        "spe": 90
      },
      "scyther": {
        "hp": 70,
        "atk": 110,
        "def": 80,
        "spa": 55,
        "spd": 55,
        "spe": 105
      },
      "jynx": {
        "hp": 65,
        "atk": 50,
        "def": 35,
        "spa": 95,
        "spd": 95,
        "spe": 95
      },
      "electabuzz": {
        "hp": 65,
        "atk": 83,
        "def": 57,
        "spa": 85,
        "spd": 85,
        "spe": 105
      },
      "magmar": {
        "hp": 65,
        "atk": 95,
        "def": 57,
        "spa": 85,
        "spd": 85,
        "spe": 93
      },
      "pinsir": {
        "hp": 65,
        "atk": 125,
        "def": 100,
        "spa": 55,
        "spd": 55,
        "spe": 85
      },
      "tauros": {
        "hp": 75,
        "atk": 100,
        "def": 95,
        "spa": 70,
        "spd": 70,
        "spe": 110
      },
      "magikarp": {
        "hp": 20,
        "atk": 10,
        "def": 55,
        "spa": 20,
        "spd": 20,
        "spe": 80
      },
      "gyarados": {
        "hp": 95,
        "atk": 125,
        "def": 79,
        "spa": 100,
        "spd": 100,
        "spe": 81
      },
      "lapras": {
        "hp": 130,
        "atk": 85,
        "def": 80,
        "spa": 95,
        "spd": 95,
        "spe": 60
      },
      "eevee": {
        "hp": 55,
        "atk": 55,
        "def": 50,
        "spa": 65,
        "spd": 65,
        "spe": 55
      },
      "vaporeon": {
        "hp": 130,
        "atk": 65,
        "def": 60,
        "spa": 110,
        "spd": 110,
        "spe": 65
      },
      "jolteon": {
        "hp": 65,
        "atk": 65,
        "def": 60,
        "spa": 110,
        "spd": 110,
        "spe": 130
      },
      "flareon": {
        "hp": 65,
        "atk": 130,
        "def": 60,
        "spa": 110,
        "spd": 110,
        "spe": 65
      },
      "porygon": {
        "hp": 65,
        "atk": 60,
        "def": 70,
        "spa": 75,
        "spd": 75,
        "spe": 40
      },
      "omanyte": {
        "hp": 35,
        "atk": 40,
        "def": 100,
        "spa": 90,
        "spd": 90,
        "spe": 35
      },
      "omastar": {
        "hp": 70,
        "atk": 60,
        "def": 125,
        "spa": 115,
        "spd": 115,
        "spe": 55
      },
      "kabuto": {
        "hp": 30,
        "atk": 80,
        "def": 90,
        "spa": 45,
        "spd": 45,
        "spe": 55
      },
      "kabutops": {
        "hp": 60,
        "atk": 115,
        "def": 105,
        "spa": 70,
        "spd": 70,
        "spe": 80
      },
      "aerodactyl": {
        "hp": 80,
        "atk": 105,
        "def": 65,
        "spa": 60,
        "spd": 60,
        "spe": 130
      },
      "snorlax": {
        "hp": 160,
        "atk": 110,
        "def": 65,
        "spa": 65,
        "spd": 65,
        "spe": 30
      },
      "articuno": {
        "hp": 90,
        "atk": 85,
        "def": 100,
        "spa": 125,
        "spd": 125,
        "spe": 85
      },
      "zapdos": {
        "hp": 90,
        "atk": 90,
        "def": 85,
        "spa": 125,
        "spd": 125,
        "spe": 100
      },
      "moltres": {
        "hp": 90,
        "atk": 100,
        "def": 90,
        "spa": 125,
        "spd": 125,
        "spe": 90
      },
      "mewtwo": {
        "hp": 106,
        "atk": 110,
        "def": 90,
        "spa": 154,
        "spd": 154,
        "spe": 130
      },
      "noctowl": {
        "hp": 100,
        "atk": 50,
        "def": 50,
        "spa": 76,
        "spd": 96,
        "spe": 70
      },
      "ariados": {
        "hp": 70,
        "atk": 90,
        "def": 70,
        "spa": 60,
        "spd": 60,
        "spe": 40
      },
      "ampharos": {
        "hp": 90,
        "atk": 75,
        "def": 75,
        "spa": 115,
        "spd": 90,
        "spe": 55
      },
      "bellossom": {
        "hp": 75,
        "atk": 80,
        "def": 85,
        "spa": 90,
        "spd": 100,
        "spe": 50
      },
      "azumarill": {
        "hp": 100,
        "atk": 50,
        "def": 80,
        "spa": 50,
        "spd": 80,
        "spe": 50
      },
      "jumpluff": {
        "hp": 75,
        "atk": 55,
        "def": 70,
        "spa": 55,
        "spd": 85,
        "spe": 110
      },
      "qwilfish": {
        "hp": 65,
        "atk": 95,
        "def": 75,
        "spa": 55,
        "spd": 55,
        "spe": 85
      },
      "magcargo": {
        "hp": 50,
        "atk": 50,
        "def": 120,
        "spa": 80,
        "spd": 80,
        "spe": 30
      },
      "corsola": {
        "hp": 55,
        "atk": 55,
        "def": 85,
        "spa": 65,
        "spd": 85,
        "spe": 35
      },
      "mantine": {
        "hp": 65,
        "atk": 40,
        "def": 70,
        "spa": 80,
        "spd": 140,
        "spe": 70
      },
      "beautifly": {
        "hp": 60,
        "atk": 70,
        "def": 50,
        "spa": 90,
        "spd": 50,
        "spe": 65
      },
      "swellow": {
        "hp": 60,
        "atk": 85,
        "def": 60,
        "spa": 50,
        "spd": 50,
        "spe": 125
      },
      "pelipper": {
        "hp": 60,
        "atk": 50,
        "def": 100,
        "spa": 85,
        "spd": 70,
        "spe": 65
      },
      "masquerain": {
        "hp": 70,
        "atk": 60,
        "def": 62,
        "spa": 80,
        "spd": 82,
        "spe": 60
      },
      "exploud": {
        "hp": 104,
        "atk": 91,
        "def": 63,
        "spa": 91,
        "spd": 63,
        "spe": 68
      },
      "delcatty": {
        "hp": 70,
        "atk": 65,
        "def": 65,
        "spa": 55,
        "spd": 55,
        "spe": 70
      },
      "volbeat": {
        "hp": 65,
        "atk": 73,
        "def": 55,
        "spa": 47,
        "spd": 75,
        "spe": 85
      },
      "illumise": {
        "hp": 65,
        "atk": 47,
        "def": 55,
        "spa": 73,
        "spd": 75,
        "spe": 85
      },
      "lunatone": {
        "hp": 70,
        "atk": 55,
        "def": 65,
        "spa": 95,
        "spd": 85,
        "spe": 70
      },
      "solrock": {
        "hp": 70,
        "atk": 95,
        "def": 85,
        "spa": 55,
        "spd": 65,
        "spe": 70
      },
      "chimecho": {
        "hp": 65,
        "atk": 50,
        "def": 70,
        "spa": 95,
        "spd": 80,
        "spe": 65
      },
      "staraptor": {
        "hp": 85,
        "atk": 120,
        "def": 70,
        "spa": 50,
        "spd": 50,
        "spe": 100
      },
      "roserade": {
        "hp": 60,
        "atk": 70,
        "def": 55,
        "spa": 125,
        "spd": 105,
        "spe": 90
      },
      "cresselia": {
        "hp": 120,
        "atk": 70,
        "def": 120,
        "spa": 75,
        "spd": 130,
        "spe": 85
      },
      "stoutland": {
        "hp": 85,
        "atk": 100,
        "def": 90,
        "spa": 45,
        "spd": 90,
        "spe": 80
      },
      "unfezant": {
        "hp": 80,
        "atk": 105,
        "def": 80,
        "spa": 65,
        "spd": 55,
        "spe": 93
      },
      "gigalith": {
        "hp": 85,
        "atk": 135,
        "def": 130,
        "spa": 60,
        "spd": 70,
        "spe": 25
      },
      "woobat": {
        "hp": 55,
        "atk": 45,
        "def": 43,
        "spa": 55,
        "spd": 43,
        "spe": 72
      },
      "seismitoad": {
        "hp": 105,
        "atk": 85,
        "def": 75,
        "spa": 85,
        "spd": 75,
        "spe": 74
      },
      "leavanny": {
        "hp": 75,
        "atk": 103,
        "def": 80,
        "spa": 70,
        "spd": 70,
        "spe": 92
      },
      "scolipede": {
        "hp": 60,
        "atk": 90,
        "def": 89,
        "spa": 55,
        "spd": 69,
        "spe": 112
      },
      "krookodile": {
        "hp": 95,
        "atk": 117,
        "def": 70,
        "spa": 65,
        "spd": 70,
        "spe": 92
      },
      "crustle": {
        "hp": 70,
        "atk": 95,
        "def": 125,
        "spa": 65,
        "spd": 75,
        "spe": 45
      },
      "beartic": {
        "hp": 95,
        "atk": 110,
        "def": 80,
        "spa": 70,
        "spd": 80,
        "spe": 50
      },
      "cryogonal": {
        "hp": 70,
        "atk": 50,
        "def": 30,
        "spa": 95,
        "spd": 135,
        "spe": 105
      },
      "aegislash": {
        "hp": 60,
        "atk": 50,
        "def": 150,
        "spa": 50,
        "spd": 150,
        "spe": 60
      },
      "aegislashblade": {
        "hp": 60,
        "atk": 150,
        "def": 50,
        "spa": 150,
        "spd": 50,
        "spe": 60
      },
      "zacian": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zaciancrowned": {
        "hp": 92,
        "atk": 170,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 148
      },
      "zamazenta": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zamazentacrowned": {
        "hp": 92,
        "atk": 130,
        "def": 145,
        "spa": 80,
        "spd": 145,
        "spe": 128
      },
      "pyroak": {
        "hp": 120,
        "atk": 70,
        "def": 105,
        "spa": 95,
        "spd": 90,
        "spe": 60
      },
      "kitsunoh": {
        "hp": 80,
        "atk": 103,
        "def": 85,
        "spa": 55,
        "spd": 80,
        "spe": 110
      },
      "voodoom": {
        "hp": 90,
        "atk": 85,
        "def": 80,
        "spa": 105,
        "spd": 80,
        "spe": 110
      },
      "necturna": {
        "hp": 64,
        "atk": 120,
        "def": 100,
        "spa": 85,
        "spd": 120,
        "spe": 81
      },
      "crucibellemega": {
        "hp": 106,
        "atk": 135,
        "def": 75,
        "spa": 85,
        "spd": 125,
        "spe": 114
      }
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
    },
    "moveData": {
      "aircutter": {
        "category": "Special",
        "basePower": 55
      },
      "assurance": {
        "category": "Physical",
        "basePower": 50,
        "basePowerCallback": true
      },
      "aurasphere": {
        "category": "Special",
        "basePower": 90
      },
      "baddybad": {
        "category": "Special",
        "basePower": 90
      },
      "beatup": {
        "category": "Physical",
        "basePower": 10,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "blizzard": {
        "category": "Special",
        "basePower": 120
      },
      "bouncybubble": {
        "category": "Special",
        "basePower": 90
      },
      "bubble": {
        "category": "Special",
        "basePower": 20
      },
      "bulletseed": {
        "category": "Physical",
        "basePower": 10,
        "multihit": [
          2,
          5
        ]
      },
      "buzzybuzz": {
        "category": "Special",
        "basePower": 90
      },
      "chatter": {
        "category": "Special",
        "basePower": 60,
        "onModifyMove": true
      },
      "covet": {
        "category": "Physical",
        "basePower": 40
      },
      "crabhammer": {
        "category": "Physical",
        "basePower": 90
      },
      "dig": {
        "category": "Physical",
        "basePower": 60
      },
      "dive": {
        "category": "Physical",
        "basePower": 60
      },
      "doomdesire": {
        "category": "Special",
        "basePower": 120
      },
      "dracometeor": {
        "category": "Special",
        "basePower": 140
      },
      "dragonpulse": {
        "category": "Special",
        "basePower": 90
      },
      "drainpunch": {
        "category": "Physical",
        "basePower": 60
      },
      "energyball": {
        "category": "Special",
        "basePower": 80
      },
      "feint": {
        "category": "Physical",
        "basePower": 50
      },
      "fellstinger": {
        "category": "Physical",
        "basePower": 30
      },
      "fireblast": {
        "category": "Special",
        "basePower": 120
      },
      "firepledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "firespin": {
        "category": "Special",
        "basePower": 15
      },
      "flamethrower": {
        "category": "Special",
        "basePower": 95
      },
      "fly": {
        "category": "Physical",
        "basePower": 70
      },
      "flyingpress": {
        "category": "Physical",
        "basePower": 80
      },
      "freezyfrost": {
        "category": "Special",
        "basePower": 90
      },
      "frostbreath": {
        "category": "Special",
        "basePower": 40
      },
      "furycutter": {
        "category": "Physical",
        "basePower": 10,
        "basePowerCallback": true
      },
      "futuresight": {
        "category": "Special",
        "basePower": 80
      },
      "gigadrain": {
        "category": "Special",
        "basePower": 60
      },
      "glaciallance": {
        "category": "Physical",
        "basePower": 130
      },
      "glitzyglow": {
        "category": "Special",
        "basePower": 90
      },
      "grasspledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "grassyglide": {
        "category": "Physical",
        "basePower": 70
      },
      "growth": {
        "category": "Status",
        "basePower": 0
      },
      "heatwave": {
        "category": "Special",
        "basePower": 100
      },
      "hex": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true
      },
      "hiddenpower": {
        "category": "Physical",
        "basePower": 0,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "hiddenpowerbug": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerdark": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerdragon": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerelectric": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerfighting": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerfire": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerflying": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerghost": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowergrass": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerground": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerice": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerpoison": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerpsychic": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerrock": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowersteel": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerwater": {
        "category": "Special",
        "basePower": 70
      },
      "highjumpkick": {
        "category": "Physical",
        "basePower": 85
      },
      "hurricane": {
        "category": "Special",
        "basePower": 120,
        "onModifyMove": true
      },
      "hydropump": {
        "category": "Special",
        "basePower": 120
      },
      "icebeam": {
        "category": "Special",
        "basePower": 95
      },
      "iciclespear": {
        "category": "Physical",
        "basePower": 10,
        "multihit": [
          2,
          5
        ]
      },
      "incinerate": {
        "category": "Special",
        "basePower": 30
      },
      "jumpkick": {
        "category": "Physical",
        "basePower": 70
      },
      "knockoff": {
        "category": "Physical",
        "basePower": 20
      },
      "lastresort": {
        "category": "Physical",
        "basePower": 130
      },
      "leafblade": {
        "category": "Physical",
        "basePower": 70
      },
      "leafstorm": {
        "category": "Special",
        "basePower": 140
      },
      "leechlife": {
        "category": "Physical",
        "basePower": 20
      },
      "lick": {
        "category": "Physical",
        "basePower": 20
      },
      "lowkick": {
        "category": "Physical",
        "basePower": 50
      },
      "lowsweep": {
        "category": "Physical",
        "basePower": 60
      },
      "lusterpurge": {
        "category": "Special",
        "basePower": 70
      },
      "magmastorm": {
        "category": "Special",
        "basePower": 120
      },
      "meteormash": {
        "category": "Physical",
        "basePower": 100
      },
      "mistball": {
        "category": "Special",
        "basePower": 70
      },
      "muddywater": {
        "category": "Special",
        "basePower": 95
      },
      "multiattack": {
        "category": "Physical",
        "basePower": 90
      },
      "mysticalfire": {
        "category": "Special",
        "basePower": 65
      },
      "outrage": {
        "category": "Physical",
        "basePower": 90
      },
      "overheat": {
        "category": "Special",
        "basePower": 140
      },
      "paraboliccharge": {
        "category": "Special",
        "basePower": 50
      },
      "petaldance": {
        "category": "Special",
        "basePower": 70
      },
      "pinmissile": {
        "category": "Physical",
        "basePower": 14,
        "multihit": [
          2,
          5
        ]
      },
      "powergem": {
        "category": "Special",
        "basePower": 70
      },
      "pursuit": {
        "category": "Physical",
        "basePower": 40,
        "basePowerCallback": true
      },
      "rapidspin": {
        "category": "Physical",
        "basePower": 20
      },
      "rocksmash": {
        "category": "Physical",
        "basePower": 20
      },
      "rocktomb": {
        "category": "Physical",
        "basePower": 50
      },
      "sandtomb": {
        "category": "Physical",
        "basePower": 15
      },
      "sappyseed": {
        "category": "Physical",
        "basePower": 90
      },
      "sizzlyslide": {
        "category": "Physical",
        "basePower": 90
      },
      "skullbash": {
        "category": "Physical",
        "basePower": 100
      },
      "smellingsalts": {
        "category": "Physical",
        "basePower": 60,
        "basePowerCallback": true
      },
      "smog": {
        "category": "Special",
        "basePower": 20
      },
      "snore": {
        "category": "Special",
        "basePower": 40
      },
      "sparklyswirl": {
        "category": "Special",
        "basePower": 90
      },
      "stormthrow": {
        "category": "Physical",
        "basePower": 40
      },
      "strugglebug": {
        "category": "Special",
        "basePower": 30
      },
      "suckerpunch": {
        "category": "Physical",
        "basePower": 80
      },
      "surf": {
        "category": "Special",
        "basePower": 95
      },
      "synchronoise": {
        "category": "Special",
        "basePower": 70
      },
      "tackle": {
        "category": "Physical",
        "basePower": 35
      },
      "technoblast": {
        "category": "Special",
        "basePower": 85
      },
      "thief": {
        "category": "Physical",
        "basePower": 40
      },
      "thrash": {
        "category": "Physical",
        "basePower": 90
      },
      "thunder": {
        "category": "Special",
        "basePower": 120,
        "onModifyMove": true
      },
      "thunderbolt": {
        "category": "Special",
        "basePower": 95
      },
      "triplekick": {
        "category": "Physical",
        "basePower": 10,
        "multihit": [
          1,
          3
        ],
        "basePowerCallback": true
      },
      "uproar": {
        "category": "Special",
        "basePower": 50
      },
      "vinewhip": {
        "category": "Physical",
        "basePower": 35
      },
      "wakeupslap": {
        "category": "Physical",
        "basePower": 60,
        "basePowerCallback": true
      },
      "waterpledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "watershuriken": {
        "category": "Physical",
        "basePower": 15,
        "multihit": [
          2,
          5
        ],
        "basePowerCallback": true
      },
      "whirlpool": {
        "category": "Special",
        "basePower": 15
      },
      "wickedblow": {
        "category": "Physical",
        "basePower": 80
      },
      "zapcannon": {
        "category": "Special",
        "basePower": 100
      },
      "zippyzap": {
        "category": "Physical",
        "basePower": 50
      }
    },
    "formats": {
      "ivysaur": {
        "tier": "ZU"
      },
      "venusaur": {
        "tier": "UUBL"
      },
      "charmeleon": {
        "tier": "ZU"
      },
      "charizard": {
        "tier": "UUBL"
      },
      "wartortle": {
        "tier": "ZU"
      },
      "blastoise": {
        "tier": "UU"
      },
      "caterpie": {
        "tier": "LC"
      },
      "metapod": {
        "tier": "NFE"
      },
      "butterfree": {
        "tier": "ZU"
      },
      "weedle": {
        "tier": "LC"
      },
      "kakuna": {
        "tier": "NFE"
      },
      "beedrill": {
        "tier": "ZUBL"
      },
      "pidgey": {
        "tier": "LC"
      },
      "pidgeotto": {
        "tier": "NFE"
      },
      "pidgeot": {
        "tier": "NU"
      },
      "rattata": {
        "tier": "LC"
      },
      "raticate": {
        "tier": "PU"
      },
      "spearow": {
        "tier": "LC"
      },
      "fearow": {
        "tier": "NU"
      },
      "arbok": {
        "tier": "PU"
      },
      "pikachu": {
        "tier": "UU"
      },
      "raichu": {
        "tier": "NUBL"
      },
      "sandslash": {
        "tier": "UU"
      },
      "nidoranf": {
        "tier": "LC"
      },
      "nidorina": {
        "tier": "ZU"
      },
      "nidoqueen": {
        "tier": "UU"
      },
      "nidoranm": {
        "tier": "LC"
      },
      "nidorino": {
        "tier": "NFE"
      },
      "nidoking": {
        "tier": "OU"
      },
      "clefairy": {
        "tier": "ZU"
      },
      "clefable": {
        "tier": "UUBL"
      },
      "vulpix": {
        "tier": "LC"
      },
      "ninetales": {
        "tier": "NU"
      },
      "wigglytuff": {
        "tier": "NU"
      },
      "zubat": {
        "tier": "LC"
      },
      "golbat": {
        "tier": "PU"
      },
      "crobat": {
        "tier": "UU"
      },
      "gloom": {
        "tier": "NU"
      },
      "vileplume": {
        "tier": "UU"
      },
      "bellossom": {
        "tier": "UU"
      },
      "paras": {
        "tier": "LC"
      },
      "parasect": {
        "tier": "ZU"
      },
      "venomoth": {
        "tier": "PU"
      },
      "diglett": {
        "tier": "ZU"
      },
      "dugtrio": {
        "tier": "NU"
      },
      "meowth": {
        "tier": "ZU"
      },
      "persian": {
        "tier": "NU"
      },
      "golduck": {
        "tier": "NUBL"
      },
      "primeape": {
        "tier": "NU"
      },
      "arcanine": {
        "tier": "UU"
      },
      "poliwag": {
        "tier": "ZU"
      },
      "poliwhirl": {
        "tier": "PUBL"
      },
      "poliwrath": {
        "tier": "NUBL"
      },
      "politoed": {
        "tier": "UU"
      },
      "abra": {
        "tier": "ZU"
      },
      "kadabra": {
        "tier": "UU"
      },
      "alakazam": {
        "tier": "OU"
      },
      "machop": {
        "tier": "LC"
      },
      "machoke": {
        "tier": "PU"
      },
      "machamp": {
        "tier": "OU"
      },
      "weepinbell": {
        "tier": "ZU"
      },
      "victreebel": {
        "tier": "UU"
      },
      "tentacool": {
        "tier": "ZU"
      },
      "tentacruel": {
        "tier": "UUBL"
      },
      "geodude": {
        "tier": "ZU"
      },
      "graveler": {
        "tier": "NU"
      },
      "golem": {
        "tier": "OU"
      },
      "ponyta": {
        "tier": "ZU"
      },
      "rapidash": {
        "tier": "NU"
      },
      "slowpoke": {
        "tier": "ZU"
      },
      "slowbro": {
        "tier": "UU"
      },
      "slowking": {
        "tier": "UU"
      },
      "magnemite": {
        "tier": "NU"
      },
      "magneton": {
        "tier": "UU"
      },
      "farfetchd": {
        "tier": "PU"
      },
      "doduo": {
        "tier": "ZU"
      },
      "dodrio": {
        "tier": "UU"
      },
      "dewgong": {
        "tier": "NU"
      },
      "grimer": {
        "tier": "ZU"
      },
      "muk": {
        "tier": "UU"
      },
      "shellder": {
        "tier": "LC"
      },
      "cloyster": {
        "tier": "OU"
      },
      "gastly": {
        "tier": "PU"
      },
      "haunter": {
        "tier": "UU"
      },
      "gengar": {
        "tier": "OU"
      },
      "onix": {
        "tier": "ZU"
      },
      "steelix": {
        "tier": "OU"
      },
      "drowzee": {
        "tier": "PU"
      },
      "hypno": {
        "tier": "UU"
      },
      "krabby": {
        "tier": "LC"
      },
      "kingler": {
        "tier": "NU"
      },
      "voltorb": {
        "tier": "ZU"
      },
      "electrode": {
        "tier": "UU"
      },
      "exeggcute": {
        "tier": "NU"
      },
      "exeggutor": {
        "tier": "OU"
      },
      "cubone": {
        "tier": "PU"
      },
      "marowak": {
        "tier": "OU"
      },
      "hitmonlee": {
        "tier": "NU"
      },
      "hitmonchan": {
        "tier": "PU"
      },
      "hitmontop": {
        "tier": "NU"
      },
      "lickitung": {
        "tier": "NU"
      },
      "koffing": {
        "tier": "ZU"
      },
      "weezing": {
        "tier": "NU"
      },
      "rhyhorn": {
        "tier": "PU"
      },
      "rhydon": {
        "tier": "OU"
      },
      "chansey": {
        "tier": "UU"
      },
      "blissey": {
        "tier": "OU"
      },
      "tangela": {
        "tier": "PU"
      },
      "kangaskhan": {
        "tier": "UUBL"
      },
      "seadra": {
        "tier": "PU"
      },
      "kingdra": {
        "tier": "UUBL"
      },
      "goldeen": {
        "tier": "LC"
      },
      "seaking": {
        "tier": "PU"
      },
      "staryu": {
        "tier": "ZU"
      },
      "starmie": {
        "tier": "OU"
      },
      "mrmime": {
        "tier": "UU"
      },
      "scyther": {
        "tier": "UU"
      },
      "scizor": {
        "tier": "UUBL"
      },
      "smoochum": {
        "tier": "LC"
      },
      "jynx": {
        "tier": "OU"
      },
      "elekid": {
        "tier": "PU"
      },
      "electabuzz": {
        "tier": "UU"
      },
      "magby": {
        "tier": "LC"
      },
      "magmar": {
        "tier": "NU"
      },
      "pinsir": {
        "tier": "UU"
      },
      "tauros": {
        "tier": "UUBL"
      },
      "gyarados": {
        "tier": "UU"
      },
      "lapras": {
        "tier": "UUBL"
      },
      "ditto": {
        "tier": "ZU"
      },
      "eevee": {
        "tier": "ZUBL"
      },
      "vaporeon": {
        "tier": "OU"
      },
      "jolteon": {
        "tier": "OU"
      },
      "flareon": {
        "tier": "NU"
      },
      "espeon": {
        "tier": "UUBL"
      },
      "umbreon": {
        "tier": "OU"
      },
      "porygon": {
        "tier": "NU"
      },
      "porygon2": {
        "tier": "(OU)"
      },
      "omanyte": {
        "tier": "ZU"
      },
      "omastar": {
        "tier": "UU"
      },
      "kabuto": {
        "tier": "LC"
      },
      "kabutops": {
        "tier": "UU"
      },
      "aerodactyl": {
        "tier": "UU"
      },
      "snorlax": {
        "tier": "OU"
      },
      "articuno": {
        "tier": "UUBL"
      },
      "zapdos": {
        "tier": "OU"
      },
      "moltres": {
        "tier": "UUBL"
      },
      "dragonair": {
        "tier": "NU"
      },
      "dragonite": {
        "tier": "UUBL"
      },
      "mewtwo": {
        "tier": "Uber"
      },
      "mew": {
        "tier": "Uber"
      },
      "bayleef": {
        "tier": "ZU"
      },
      "meganium": {
        "tier": "UUBL"
      },
      "quilava": {
        "tier": "ZU"
      },
      "typhlosion": {
        "tier": "UUBL"
      },
      "croconaw": {
        "tier": "ZU"
      },
      "feraligatr": {
        "tier": "UU"
      },
      "furret": {
        "tier": "PU"
      },
      "noctowl": {
        "tier": "PU"
      },
      "ledyba": {
        "tier": "LC"
      },
      "ledian": {
        "tier": "NU"
      },
      "ariados": {
        "tier": "ZU"
      },
      "chinchou": {
        "tier": "NU"
      },
      "lanturn": {
        "tier": "UU"
      },
      "togepi": {
        "tier": "LC"
      },
      "togetic": {
        "tier": "ZU"
      },
      "natu": {
        "tier": "LC"
      },
      "xatu": {
        "tier": "NU"
      },
      "flaaffy": {
        "tier": "PU"
      },
      "ampharos": {
        "tier": "UU"
      },
      "marill": {
        "tier": "LC"
      },
      "azumarill": {
        "tier": "PU"
      },
      "sudowoodo": {
        "tier": "NU"
      },
      "jumpluff": {
        "tier": "UU"
      },
      "aipom": {
        "tier": "ZU"
      },
      "sunflora": {
        "tier": "ZU"
      },
      "yanma": {
        "tier": "ZU"
      },
      "quagsire": {
        "tier": "UU"
      },
      "murkrow": {
        "tier": "PU"
      },
      "misdreavus": {
        "tier": "OU"
      },
      "unown": {
        "tier": "ZU"
      },
      "wobbuffet": {
        "tier": "ZU"
      },
      "girafarig": {
        "tier": "UU"
      },
      "pineco": {
        "tier": "NU"
      },
      "forretress": {
        "tier": "OU"
      },
      "dunsparce": {
        "tier": "PU"
      },
      "gligar": {
        "tier": "UU"
      },
      "granbull": {
        "tier": "UU"
      },
      "qwilfish": {
        "tier": "UU"
      },
      "shuckle": {
        "tier": "NU"
      },
      "heracross": {
        "tier": "OU"
      },
      "sneasel": {
        "tier": "PU"
      },
      "teddiursa": {
        "tier": "ZU"
      },
      "ursaring": {
        "tier": "UUBL"
      },
      "magcargo": {
        "tier": "PU"
      },
      "piloswine": {
        "tier": "UU"
      },
      "corsola": {
        "tier": "PU"
      },
      "remoraid": {
        "tier": "LC"
      },
      "octillery": {
        "tier": "NU"
      },
      "delibird": {
        "tier": "PU"
      },
      "mantine": {
        "tier": "PU"
      },
      "skarmory": {
        "tier": "OU"
      },
      "houndour": {
        "tier": "ZU"
      },
      "houndoom": {
        "tier": "UUBL"
      },
      "donphan": {
        "tier": "UUBL"
      },
      "stantler": {
        "tier": "NU"
      },
      "smeargle": {
        "tier": "UUBL"
      },
      "miltank": {
        "tier": "OU"
      },
      "raikou": {
        "tier": "OU"
      },
      "entei": {
        "tier": "UUBL"
      },
      "suicune": {
        "tier": "OU"
      },
      "pupitar": {
        "tier": "NU"
      },
      "tyranitar": {
        "tier": "OU"
      },
      "lugia": {
        "tier": "Uber"
      },
      "hooh": {
        "tier": "Uber"
      },
      "celebi": {
        "tier": "Uber"
      }
    },
    "baseStats": {
      "butterfree": {
        "hp": 60,
        "atk": 45,
        "def": 50,
        "spa": 80,
        "spd": 80,
        "spe": 70
      },
      "beedrill": {
        "hp": 65,
        "atk": 80,
        "def": 40,
        "spa": 45,
        "spd": 80,
        "spe": 75
      },
      "pidgeot": {
        "hp": 83,
        "atk": 80,
        "def": 75,
        "spa": 70,
        "spd": 70,
        "spe": 91
      },
      "arbok": {
        "hp": 60,
        "atk": 85,
        "def": 69,
        "spa": 65,
        "spd": 79,
        "spe": 80
      },
      "pikachu": {
        "hp": 35,
        "atk": 55,
        "def": 30,
        "spa": 50,
        "spd": 40,
        "spe": 90
      },
      "raichu": {
        "hp": 60,
        "atk": 90,
        "def": 55,
        "spa": 90,
        "spd": 80,
        "spe": 100
      },
      "nidoqueen": {
        "hp": 90,
        "atk": 82,
        "def": 87,
        "spa": 75,
        "spd": 85,
        "spe": 76
      },
      "nidoking": {
        "hp": 81,
        "atk": 92,
        "def": 77,
        "spa": 85,
        "spd": 75,
        "spe": 85
      },
      "clefable": {
        "hp": 95,
        "atk": 70,
        "def": 73,
        "spa": 85,
        "spd": 90,
        "spe": 60
      },
      "wigglytuff": {
        "hp": 140,
        "atk": 70,
        "def": 45,
        "spa": 75,
        "spd": 50,
        "spe": 45
      },
      "vileplume": {
        "hp": 75,
        "atk": 80,
        "def": 85,
        "spa": 100,
        "spd": 90,
        "spe": 50
      },
      "dugtrio": {
        "hp": 35,
        "atk": 80,
        "def": 50,
        "spa": 50,
        "spd": 70,
        "spe": 120
      },
      "poliwrath": {
        "hp": 90,
        "atk": 85,
        "def": 95,
        "spa": 70,
        "spd": 90,
        "spe": 70
      },
      "alakazam": {
        "hp": 55,
        "atk": 50,
        "def": 45,
        "spa": 135,
        "spd": 85,
        "spe": 120
      },
      "alakazammega": {
        "hp": 55,
        "atk": 50,
        "def": 65,
        "spa": 175,
        "spd": 95,
        "spe": 150
      },
      "victreebel": {
        "hp": 80,
        "atk": 105,
        "def": 65,
        "spa": 100,
        "spd": 60,
        "spe": 70
      },
      "golem": {
        "hp": 80,
        "atk": 110,
        "def": 130,
        "spa": 55,
        "spd": 65,
        "spe": 45
      },
      "farfetchd": {
        "hp": 52,
        "atk": 65,
        "def": 55,
        "spa": 58,
        "spd": 62,
        "spe": 60
      },
      "dodrio": {
        "hp": 60,
        "atk": 110,
        "def": 70,
        "spa": 60,
        "spd": 60,
        "spe": 100
      },
      "electrode": {
        "hp": 60,
        "atk": 50,
        "def": 70,
        "spa": 80,
        "spd": 80,
        "spe": 140
      },
      "exeggutor": {
        "hp": 95,
        "atk": 95,
        "def": 85,
        "spa": 125,
        "spd": 65,
        "spe": 55
      },
      "noctowl": {
        "hp": 100,
        "atk": 50,
        "def": 50,
        "spa": 76,
        "spd": 96,
        "spe": 70
      },
      "ariados": {
        "hp": 70,
        "atk": 90,
        "def": 70,
        "spa": 60,
        "spd": 60,
        "spe": 40
      },
      "ampharos": {
        "hp": 90,
        "atk": 75,
        "def": 75,
        "spa": 115,
        "spd": 90,
        "spe": 55
      },
      "bellossom": {
        "hp": 75,
        "atk": 80,
        "def": 85,
        "spa": 90,
        "spd": 100,
        "spe": 50
      },
      "azumarill": {
        "hp": 100,
        "atk": 50,
        "def": 80,
        "spa": 50,
        "spd": 80,
        "spe": 50
      },
      "jumpluff": {
        "hp": 75,
        "atk": 55,
        "def": 70,
        "spa": 55,
        "spd": 85,
        "spe": 110
      },
      "qwilfish": {
        "hp": 65,
        "atk": 95,
        "def": 75,
        "spa": 55,
        "spd": 55,
        "spe": 85
      },
      "magcargo": {
        "hp": 50,
        "atk": 50,
        "def": 120,
        "spa": 80,
        "spd": 80,
        "spe": 30
      },
      "corsola": {
        "hp": 55,
        "atk": 55,
        "def": 85,
        "spa": 65,
        "spd": 85,
        "spe": 35
      },
      "mantine": {
        "hp": 65,
        "atk": 40,
        "def": 70,
        "spa": 80,
        "spd": 140,
        "spe": 70
      },
      "beautifly": {
        "hp": 60,
        "atk": 70,
        "def": 50,
        "spa": 90,
        "spd": 50,
        "spe": 65
      },
      "swellow": {
        "hp": 60,
        "atk": 85,
        "def": 60,
        "spa": 50,
        "spd": 50,
        "spe": 125
      },
      "pelipper": {
        "hp": 60,
        "atk": 50,
        "def": 100,
        "spa": 85,
        "spd": 70,
        "spe": 65
      },
      "masquerain": {
        "hp": 70,
        "atk": 60,
        "def": 62,
        "spa": 80,
        "spd": 82,
        "spe": 60
      },
      "exploud": {
        "hp": 104,
        "atk": 91,
        "def": 63,
        "spa": 91,
        "spd": 63,
        "spe": 68
      },
      "delcatty": {
        "hp": 70,
        "atk": 65,
        "def": 65,
        "spa": 55,
        "spd": 55,
        "spe": 70
      },
      "volbeat": {
        "hp": 65,
        "atk": 73,
        "def": 55,
        "spa": 47,
        "spd": 75,
        "spe": 85
      },
      "illumise": {
        "hp": 65,
        "atk": 47,
        "def": 55,
        "spa": 73,
        "spd": 75,
        "spe": 85
      },
      "lunatone": {
        "hp": 70,
        "atk": 55,
        "def": 65,
        "spa": 95,
        "spd": 85,
        "spe": 70
      },
      "solrock": {
        "hp": 70,
        "atk": 95,
        "def": 85,
        "spa": 55,
        "spd": 65,
        "spe": 70
      },
      "chimecho": {
        "hp": 65,
        "atk": 50,
        "def": 70,
        "spa": 95,
        "spd": 80,
        "spe": 65
      },
      "staraptor": {
        "hp": 85,
        "atk": 120,
        "def": 70,
        "spa": 50,
        "spd": 50,
        "spe": 100
      },
      "roserade": {
        "hp": 60,
        "atk": 70,
        "def": 55,
        "spa": 125,
        "spd": 105,
        "spe": 90
      },
      "cresselia": {
        "hp": 120,
        "atk": 70,
        "def": 120,
        "spa": 75,
        "spd": 130,
        "spe": 85
      },
      "stoutland": {
        "hp": 85,
        "atk": 100,
        "def": 90,
        "spa": 45,
        "spd": 90,
        "spe": 80
      },
      "unfezant": {
        "hp": 80,
        "atk": 105,
        "def": 80,
        "spa": 65,
        "spd": 55,
        "spe": 93
      },
      "gigalith": {
        "hp": 85,
        "atk": 135,
        "def": 130,
        "spa": 60,
        "spd": 70,
        "spe": 25
      },
      "woobat": {
        "hp": 55,
        "atk": 45,
        "def": 43,
        "spa": 55,
        "spd": 43,
        "spe": 72
      },
      "seismitoad": {
        "hp": 105,
        "atk": 85,
        "def": 75,
        "spa": 85,
        "spd": 75,
        "spe": 74
      },
      "leavanny": {
        "hp": 75,
        "atk": 103,
        "def": 80,
        "spa": 70,
        "spd": 70,
        "spe": 92
      },
      "scolipede": {
        "hp": 60,
        "atk": 90,
        "def": 89,
        "spa": 55,
        "spd": 69,
        "spe": 112
      },
      "krookodile": {
        "hp": 95,
        "atk": 117,
        "def": 70,
        "spa": 65,
        "spd": 70,
        "spe": 92
      },
      "crustle": {
        "hp": 70,
        "atk": 95,
        "def": 125,
        "spa": 65,
        "spd": 75,
        "spe": 45
      },
      "beartic": {
        "hp": 95,
        "atk": 110,
        "def": 80,
        "spa": 70,
        "spd": 80,
        "spe": 50
      },
      "cryogonal": {
        "hp": 70,
        "atk": 50,
        "def": 30,
        "spa": 95,
        "spd": 135,
        "spe": 105
      },
      "aegislash": {
        "hp": 60,
        "atk": 50,
        "def": 150,
        "spa": 50,
        "spd": 150,
        "spe": 60
      },
      "aegislashblade": {
        "hp": 60,
        "atk": 150,
        "def": 50,
        "spa": 150,
        "spd": 50,
        "spe": 60
      },
      "zacian": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zaciancrowned": {
        "hp": 92,
        "atk": 170,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 148
      },
      "zamazenta": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zamazentacrowned": {
        "hp": 92,
        "atk": 130,
        "def": 145,
        "spa": 80,
        "spd": 145,
        "spe": 128
      },
      "pyroak": {
        "hp": 120,
        "atk": 70,
        "def": 105,
        "spa": 95,
        "spd": 90,
        "spe": 60
      },
      "kitsunoh": {
        "hp": 80,
        "atk": 103,
        "def": 85,
        "spa": 55,
        "spd": 80,
        "spe": 110
      },
      "voodoom": {
        "hp": 90,
        "atk": 85,
        "def": 80,
        "spa": 105,
        "spd": 80,
        "spe": 110
      },
      "necturna": {
        "hp": 64,
        "atk": 120,
        "def": 100,
        "spa": 85,
        "spd": 120,
        "spe": 81
      },
      "crucibellemega": {
        "hp": 106,
        "atk": 135,
        "def": 75,
        "spa": 85,
        "spd": 125,
        "spe": 114
      }
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
    },
    "moveData": {
      "aircutter": {
        "category": "Special",
        "basePower": 55
      },
      "assurance": {
        "category": "Physical",
        "basePower": 50,
        "basePowerCallback": true
      },
      "aurasphere": {
        "category": "Special",
        "basePower": 90
      },
      "baddybad": {
        "category": "Special",
        "basePower": 90
      },
      "beatup": {
        "category": "Physical",
        "basePower": 10,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "blizzard": {
        "category": "Special",
        "basePower": 120
      },
      "bouncybubble": {
        "category": "Special",
        "basePower": 90
      },
      "bubble": {
        "category": "Special",
        "basePower": 20
      },
      "bulletseed": {
        "category": "Physical",
        "basePower": 10,
        "multihit": [
          2,
          5
        ]
      },
      "buzzybuzz": {
        "category": "Special",
        "basePower": 90
      },
      "chatter": {
        "category": "Special",
        "basePower": 60,
        "onModifyMove": true
      },
      "covet": {
        "category": "Physical",
        "basePower": 40
      },
      "crabhammer": {
        "category": "Physical",
        "basePower": 90
      },
      "dig": {
        "category": "Physical",
        "basePower": 60
      },
      "dive": {
        "category": "Physical",
        "basePower": 60
      },
      "doomdesire": {
        "category": "Special",
        "basePower": 120
      },
      "dracometeor": {
        "category": "Special",
        "basePower": 140
      },
      "dragonpulse": {
        "category": "Special",
        "basePower": 90
      },
      "drainpunch": {
        "category": "Physical",
        "basePower": 60
      },
      "energyball": {
        "category": "Special",
        "basePower": 80
      },
      "feint": {
        "category": "Physical",
        "basePower": 50
      },
      "fellstinger": {
        "category": "Physical",
        "basePower": 30
      },
      "fireblast": {
        "category": "Special",
        "basePower": 120
      },
      "firepledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "firespin": {
        "category": "Special",
        "basePower": 15
      },
      "flamethrower": {
        "category": "Special",
        "basePower": 95
      },
      "fly": {
        "category": "Physical",
        "basePower": 70
      },
      "flyingpress": {
        "category": "Physical",
        "basePower": 80
      },
      "freezyfrost": {
        "category": "Special",
        "basePower": 90
      },
      "frostbreath": {
        "category": "Special",
        "basePower": 40
      },
      "furycutter": {
        "category": "Physical",
        "basePower": 10,
        "basePowerCallback": true
      },
      "futuresight": {
        "category": "Special",
        "basePower": 80
      },
      "gigadrain": {
        "category": "Special",
        "basePower": 60
      },
      "glaciallance": {
        "category": "Physical",
        "basePower": 130
      },
      "glitzyglow": {
        "category": "Special",
        "basePower": 90
      },
      "grasspledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "grassyglide": {
        "category": "Physical",
        "basePower": 70
      },
      "growth": {
        "category": "Status",
        "basePower": 0
      },
      "heatwave": {
        "category": "Special",
        "basePower": 100
      },
      "hex": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true
      },
      "hiddenpower": {
        "category": "Physical",
        "basePower": 0,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "hiddenpowerbug": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerdark": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerdragon": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerelectric": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerfighting": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerfire": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerflying": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerghost": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowergrass": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerground": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerice": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerpoison": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerpsychic": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerrock": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowersteel": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerwater": {
        "category": "Special",
        "basePower": 70
      },
      "highjumpkick": {
        "category": "Physical",
        "basePower": 85
      },
      "hurricane": {
        "category": "Special",
        "basePower": 120,
        "onModifyMove": true
      },
      "hydropump": {
        "category": "Special",
        "basePower": 120
      },
      "icebeam": {
        "category": "Special",
        "basePower": 95
      },
      "iciclespear": {
        "category": "Physical",
        "basePower": 10,
        "multihit": [
          2,
          5
        ]
      },
      "incinerate": {
        "category": "Special",
        "basePower": 30
      },
      "jumpkick": {
        "category": "Physical",
        "basePower": 70
      },
      "knockoff": {
        "category": "Physical",
        "basePower": 20
      },
      "lastresort": {
        "category": "Physical",
        "basePower": 130
      },
      "leafblade": {
        "category": "Physical",
        "basePower": 70
      },
      "leafstorm": {
        "category": "Special",
        "basePower": 140
      },
      "leechlife": {
        "category": "Physical",
        "basePower": 20
      },
      "lick": {
        "category": "Physical",
        "basePower": 20
      },
      "lowsweep": {
        "category": "Physical",
        "basePower": 60
      },
      "lusterpurge": {
        "category": "Special",
        "basePower": 70
      },
      "magmastorm": {
        "category": "Special",
        "basePower": 120
      },
      "meteormash": {
        "category": "Physical",
        "basePower": 100
      },
      "mistball": {
        "category": "Special",
        "basePower": 70
      },
      "muddywater": {
        "category": "Special",
        "basePower": 95
      },
      "multiattack": {
        "category": "Physical",
        "basePower": 90
      },
      "mysticalfire": {
        "category": "Special",
        "basePower": 65
      },
      "outrage": {
        "category": "Physical",
        "basePower": 90
      },
      "overheat": {
        "category": "Special",
        "basePower": 140
      },
      "paraboliccharge": {
        "category": "Special",
        "basePower": 50
      },
      "petaldance": {
        "category": "Special",
        "basePower": 70
      },
      "pinmissile": {
        "category": "Physical",
        "basePower": 14,
        "multihit": [
          2,
          5
        ]
      },
      "powergem": {
        "category": "Special",
        "basePower": 70
      },
      "rapidspin": {
        "category": "Physical",
        "basePower": 20
      },
      "rocksmash": {
        "category": "Physical",
        "basePower": 20
      },
      "rocktomb": {
        "category": "Physical",
        "basePower": 50
      },
      "sandtomb": {
        "category": "Physical",
        "basePower": 15
      },
      "sappyseed": {
        "category": "Physical",
        "basePower": 90
      },
      "sizzlyslide": {
        "category": "Physical",
        "basePower": 90
      },
      "skullbash": {
        "category": "Physical",
        "basePower": 100
      },
      "smellingsalts": {
        "category": "Physical",
        "basePower": 60,
        "basePowerCallback": true
      },
      "smog": {
        "category": "Special",
        "basePower": 20
      },
      "snore": {
        "category": "Special",
        "basePower": 40
      },
      "sparklyswirl": {
        "category": "Special",
        "basePower": 90
      },
      "stormthrow": {
        "category": "Physical",
        "basePower": 40
      },
      "strugglebug": {
        "category": "Special",
        "basePower": 30
      },
      "suckerpunch": {
        "category": "Physical",
        "basePower": 80
      },
      "surf": {
        "category": "Special",
        "basePower": 95
      },
      "synchronoise": {
        "category": "Special",
        "basePower": 70
      },
      "tackle": {
        "category": "Physical",
        "basePower": 35
      },
      "technoblast": {
        "category": "Special",
        "basePower": 85
      },
      "thief": {
        "category": "Physical",
        "basePower": 40
      },
      "thrash": {
        "category": "Physical",
        "basePower": 90
      },
      "thunder": {
        "category": "Special",
        "basePower": 120,
        "onModifyMove": true
      },
      "thunderbolt": {
        "category": "Special",
        "basePower": 95
      },
      "uproar": {
        "category": "Special",
        "basePower": 50
      },
      "vinewhip": {
        "category": "Physical",
        "basePower": 35
      },
      "wakeupslap": {
        "category": "Physical",
        "basePower": 60,
        "basePowerCallback": true
      },
      "waterpledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "watershuriken": {
        "category": "Physical",
        "basePower": 15,
        "multihit": [
          2,
          5
        ],
        "basePowerCallback": true
      },
      "whirlpool": {
        "category": "Special",
        "basePower": 15
      },
      "wickedblow": {
        "category": "Physical",
        "basePower": 80
      },
      "zapcannon": {
        "category": "Special",
        "basePower": 100
      },
      "zippyzap": {
        "category": "Physical",
        "basePower": 50
      }
    },
    "formats": {
      "ivysaur": {
        "tier": "ZU"
      },
      "venusaur": {
        "tier": "UUBL"
      },
      "charmeleon": {
        "tier": "PU"
      },
      "charizard": {
        "tier": "OU"
      },
      "wartortle": {
        "tier": "PU"
      },
      "blastoise": {
        "tier": "UU"
      },
      "caterpie": {
        "tier": "LC"
      },
      "metapod": {
        "tier": "NFE"
      },
      "butterfree": {
        "tier": "ZU"
      },
      "weedle": {
        "tier": "LC"
      },
      "kakuna": {
        "tier": "NFE"
      },
      "beedrill": {
        "tier": "ZU"
      },
      "pidgey": {
        "tier": "LC"
      },
      "pidgeotto": {
        "tier": "NFE"
      },
      "pidgeot": {
        "tier": "NU"
      },
      "rattata": {
        "tier": "LC"
      },
      "raticate": {
        "tier": "NU"
      },
      "spearow": {
        "tier": "LC"
      },
      "fearow": {
        "tier": "RUBL"
      },
      "arbok": {
        "tier": "PU"
      },
      "pikachu": {
        "tier": "NU"
      },
      "raichu": {
        "tier": "RU"
      },
      "sandslash": {
        "tier": "UU"
      },
      "nidoranf": {
        "tier": "LC"
      },
      "nidorina": {
        "tier": "NFE"
      },
      "nidoqueen": {
        "tier": "UU"
      },
      "nidoranm": {
        "tier": "LC"
      },
      "nidorino": {
        "tier": "NFE"
      },
      "nidoking": {
        "tier": "UU"
      },
      "clefable": {
        "tier": "RU"
      },
      "vulpix": {
        "tier": "LC"
      },
      "ninetales": {
        "tier": "RU"
      },
      "wigglytuff": {
        "tier": "PU"
      },
      "zubat": {
        "tier": "LC"
      },
      "golbat": {
        "tier": "NU"
      },
      "crobat": {
        "tier": "UUBL"
      },
      "gloom": {
        "tier": "ZU"
      },
      "vileplume": {
        "tier": "UU"
      },
      "bellossom": {
        "tier": "NU"
      },
      "paras": {
        "tier": "LC"
      },
      "parasect": {
        "tier": "ZU"
      },
      "venomoth": {
        "tier": "NU"
      },
      "diglett": {
        "tier": "NU"
      },
      "dugtrio": {
        "tier": "OU"
      },
      "persian": {
        "tier": "RU"
      },
      "golduck": {
        "tier": "UU"
      },
      "primeape": {
        "tier": "RU"
      },
      "arcanine": {
        "tier": "UU"
      },
      "poliwhirl": {
        "tier": "ZU"
      },
      "poliwrath": {
        "tier": "RU"
      },
      "politoed": {
        "tier": "RU"
      },
      "abra": {
        "tier": "ZU"
      },
      "kadabra": {
        "tier": "UUBL"
      },
      "alakazam": {
        "tier": "UUBL"
      },
      "machop": {
        "tier": "LC"
      },
      "machoke": {
        "tier": "PUBL"
      },
      "machamp": {
        "tier": "UUBL"
      },
      "victreebel": {
        "tier": "RU"
      },
      "tentacool": {
        "tier": "ZU"
      },
      "tentacruel": {
        "tier": "UU"
      },
      "graveler": {
        "tier": "PU"
      },
      "golem": {
        "tier": "UU"
      },
      "ponyta": {
        "tier": "ZU"
      },
      "rapidash": {
        "tier": "RU"
      },
      "slowbro": {
        "tier": "UUBL"
      },
      "slowking": {
        "tier": "UU"
      },
      "magnemite": {
        "tier": "ZUBL"
      },
      "magneton": {
        "tier": "OU"
      },
      "farfetchd": {
        "tier": "ZU"
      },
      "doduo": {
        "tier": "ZU"
      },
      "dodrio": {
        "tier": "UUBL"
      },
      "dewgong": {
        "tier": "NU"
      },
      "muk": {
        "tier": "UU"
      },
      "shellder": {
        "tier": "LC"
      },
      "cloyster": {
        "tier": "OU"
      },
      "gastly": {
        "tier": "PU"
      },
      "haunter": {
        "tier": "NU"
      },
      "gengar": {
        "tier": "OU"
      },
      "onix": {
        "tier": "LC"
      },
      "steelix": {
        "tier": "UUBL"
      },
      "drowzee": {
        "tier": "ZU"
      },
      "hypno": {
        "tier": "RU"
      },
      "krabby": {
        "tier": "LC"
      },
      "kingler": {
        "tier": "PU"
      },
      "voltorb": {
        "tier": "ZU"
      },
      "electrode": {
        "tier": "UU"
      },
      "exeggutor": {
        "tier": "UUBL"
      },
      "cubone": {
        "tier": "ZU"
      },
      "marowak": {
        "tier": "UUBL"
      },
      "hitmonlee": {
        "tier": "UU"
      },
      "hitmonchan": {
        "tier": "NU"
      },
      "hitmontop": {
        "tier": "UU"
      },
      "lickitung": {
        "tier": "PU"
      },
      "koffing": {
        "tier": "ZU"
      },
      "weezing": {
        "tier": "UUBL"
      },
      "rhyhorn": {
        "tier": "ZU"
      },
      "rhydon": {
        "tier": "UUBL"
      },
      "chansey": {
        "tier": "UUBL"
      },
      "blissey": {
        "tier": "OU"
      },
      "tangela": {
        "tier": "PU"
      },
      "kangaskhan": {
        "tier": "UU"
      },
      "seadra": {
        "tier": "PU"
      },
      "kingdra": {
        "tier": "UUBL"
      },
      "goldeen": {
        "tier": "LC"
      },
      "seaking": {
        "tier": "ZU"
      },
      "staryu": {
        "tier": "LC"
      },
      "starmie": {
        "tier": "OU"
      },
      "mrmime": {
        "tier": "RU"
      },
      "scyther": {
        "tier": "UU"
      },
      "scizor": {
        "tier": "UUBL"
      },
      "smoochum": {
        "tier": "LC"
      },
      "jynx": {
        "tier": "UUBL"
      },
      "elekid": {
        "tier": "ZU"
      },
      "electabuzz": {
        "tier": "UU"
      },
      "magby": {
        "tier": "LC"
      },
      "magmar": {
        "tier": "RU"
      },
      "pinsir": {
        "tier": "UU"
      },
      "tauros": {
        "tier": "UUBL"
      },
      "gyarados": {
        "tier": "OU"
      },
      "lapras": {
        "tier": "UU"
      },
      "ditto": {
        "tier": "ZU"
      },
      "vaporeon": {
        "tier": "UUBL"
      },
      "jolteon": {
        "tier": "OU"
      },
      "flareon": {
        "tier": "NU"
      },
      "espeon": {
        "tier": "UUBL"
      },
      "umbreon": {
        "tier": "UUBL"
      },
      "porygon": {
        "tier": "ZU"
      },
      "porygon2": {
        "tier": "(OU)"
      },
      "omanyte": {
        "tier": "ZU"
      },
      "omastar": {
        "tier": "UU"
      },
      "kabuto": {
        "tier": "LC"
      },
      "kabutops": {
        "tier": "RU"
      },
      "aerodactyl": {
        "tier": "OU"
      },
      "snorlax": {
        "tier": "OU"
      },
      "articuno": {
        "tier": "UUBL"
      },
      "zapdos": {
        "tier": "OU"
      },
      "moltres": {
        "tier": "OU"
      },
      "dragonair": {
        "tier": "PU"
      },
      "dragonite": {
        "tier": "UUBL"
      },
      "mewtwo": {
        "tier": "Uber"
      },
      "mew": {
        "tier": "Uber"
      },
      "meganium": {
        "tier": "RU"
      },
      "quilava": {
        "tier": "ZU"
      },
      "typhlosion": {
        "tier": "UUBL"
      },
      "feraligatr": {
        "tier": "UU"
      },
      "furret": {
        "tier": "PU"
      },
      "noctowl": {
        "tier": "ZU"
      },
      "ledyba": {
        "tier": "LC"
      },
      "ledian": {
        "tier": "ZU"
      },
      "ariados": {
        "tier": "ZU"
      },
      "chinchou": {
        "tier": "ZU"
      },
      "lanturn": {
        "tier": "UU"
      },
      "togepi": {
        "tier": "LC"
      },
      "togetic": {
        "tier": "PU"
      },
      "natu": {
        "tier": "LC"
      },
      "xatu": {
        "tier": "RU"
      },
      "flaaffy": {
        "tier": "ZU"
      },
      "ampharos": {
        "tier": "UU"
      },
      "azumarill": {
        "tier": "RU"
      },
      "sudowoodo": {
        "tier": "NU"
      },
      "jumpluff": {
        "tier": "RUBL"
      },
      "aipom": {
        "tier": "ZU"
      },
      "sunflora": {
        "tier": "ZU"
      },
      "yanma": {
        "tier": "ZU"
      },
      "quagsire": {
        "tier": "UU"
      },
      "murkrow": {
        "tier": "NU"
      },
      "misdreavus": {
        "tier": "UU"
      },
      "unown": {
        "tier": "ZU"
      },
      "wynaut": {
        "tier": "Uber"
      },
      "wobbuffet": {
        "tier": "Uber"
      },
      "girafarig": {
        "tier": "UU"
      },
      "pineco": {
        "tier": "PU"
      },
      "forretress": {
        "tier": "OU"
      },
      "dunsparce": {
        "tier": "PUBL"
      },
      "gligar": {
        "tier": "UU"
      },
      "granbull": {
        "tier": "UU"
      },
      "qwilfish": {
        "tier": "UU"
      },
      "shuckle": {
        "tier": "PU"
      },
      "heracross": {
        "tier": "OU"
      },
      "sneasel": {
        "tier": "RU"
      },
      "ursaring": {
        "tier": "UUBL"
      },
      "magcargo": {
        "tier": "ZU"
      },
      "piloswine": {
        "tier": "PUBL"
      },
      "corsola": {
        "tier": "ZU"
      },
      "remoraid": {
        "tier": "LC"
      },
      "octillery": {
        "tier": "NU"
      },
      "delibird": {
        "tier": "ZU"
      },
      "mantine": {
        "tier": "RU"
      },
      "skarmory": {
        "tier": "OU"
      },
      "houndour": {
        "tier": "ZU"
      },
      "houndoom": {
        "tier": "UUBL"
      },
      "donphan": {
        "tier": "UUBL"
      },
      "stantler": {
        "tier": "RU"
      },
      "smeargle": {
        "tier": "UUBL"
      },
      "miltank": {
        "tier": "UUBL"
      },
      "raikou": {
        "tier": "OU"
      },
      "entei": {
        "tier": "UUBL"
      },
      "suicune": {
        "tier": "OU"
      },
      "pupitar": {
        "tier": "NU"
      },
      "tyranitar": {
        "tier": "OU"
      },
      "lugia": {
        "tier": "Uber"
      },
      "hooh": {
        "tier": "Uber"
      },
      "celebi": {
        "tier": "OU"
      },
      "grovyle": {
        "tier": "PU"
      },
      "sceptile": {
        "tier": "UUBL"
      },
      "torchic": {
        "tier": "LC"
      },
      "combusken": {
        "tier": "PU"
      },
      "blaziken": {
        "tier": "UUBL"
      },
      "marshtomp": {
        "tier": "PU"
      },
      "swampert": {
        "tier": "OU"
      },
      "mightyena": {
        "tier": "PU"
      },
      "zigzagoon": {
        "tier": "NFE"
      },
      "linoone": {
        "tier": "UUBL"
      },
      "wurmple": {
        "tier": "LC"
      },
      "silcoon": {
        "tier": "NFE"
      },
      "beautifly": {
        "tier": "ZU"
      },
      "cascoon": {
        "tier": "NFE"
      },
      "dustox": {
        "tier": "ZU"
      },
      "ludicolo": {
        "tier": "UUBL"
      },
      "shiftry": {
        "tier": "RU"
      },
      "taillow": {
        "tier": "LC"
      },
      "swellow": {
        "tier": "UUBL"
      },
      "pelipper": {
        "tier": "NU"
      },
      "gardevoir": {
        "tier": "UUBL"
      },
      "masquerain": {
        "tier": "ZU"
      },
      "breloom": {
        "tier": "OU"
      },
      "vigoroth": {
        "tier": "NU"
      },
      "slaking": {
        "tier": "UUBL"
      },
      "nincada": {
        "tier": "LC"
      },
      "ninjask": {
        "tier": "RUBL"
      },
      "shedinja": {
        "tier": "ZU"
      },
      "whismur": {
        "tier": "LC"
      },
      "loudred": {
        "tier": "NFE"
      },
      "exploud": {
        "tier": "RU"
      },
      "hariyama": {
        "tier": "UUBL"
      },
      "nosepass": {
        "tier": "ZU"
      },
      "skitty": {
        "tier": "LC"
      },
      "delcatty": {
        "tier": "ZU"
      },
      "sableye": {
        "tier": "NU"
      },
      "mawile": {
        "tier": "PU"
      },
      "aron": {
        "tier": "LC"
      },
      "lairon": {
        "tier": "PU"
      },
      "aggron": {
        "tier": "RU"
      },
      "meditite": {
        "tier": "ZU"
      },
      "medicham": {
        "tier": "OU"
      },
      "electrike": {
        "tier": "LC"
      },
      "manectric": {
        "tier": "RUBL"
      },
      "plusle": {
        "tier": "NU"
      },
      "minun": {
        "tier": "PU"
      },
      "volbeat": {
        "tier": "ZU"
      },
      "illumise": {
        "tier": "ZU"
      },
      "roselia": {
        "tier": "NU"
      },
      "swalot": {
        "tier": "PU"
      },
      "carvanha": {
        "tier": "LC"
      },
      "sharpedo": {
        "tier": "RU"
      },
      "wailmer": {
        "tier": "LC"
      },
      "wailord": {
        "tier": "NU"
      },
      "camerupt": {
        "tier": "RU"
      },
      "torkoal": {
        "tier": "NU"
      },
      "grumpig": {
        "tier": "UU"
      },
      "spinda": {
        "tier": "ZU"
      },
      "trapinch": {
        "tier": "PU"
      },
      "vibrava": {
        "tier": "PU"
      },
      "flygon": {
        "tier": "OU"
      },
      "cacturne": {
        "tier": "NU"
      },
      "altaria": {
        "tier": "UU"
      },
      "zangoose": {
        "tier": "UUBL"
      },
      "seviper": {
        "tier": "PU"
      },
      "lunatone": {
        "tier": "UU"
      },
      "solrock": {
        "tier": "UU"
      },
      "whiscash": {
        "tier": "NU"
      },
      "crawdaunt": {
        "tier": "NU"
      },
      "baltoy": {
        "tier": "LC"
      },
      "claydol": {
        "tier": "OU"
      },
      "lileep": {
        "tier": "ZU"
      },
      "cradily": {
        "tier": "UU"
      },
      "anorith": {
        "tier": "ZU"
      },
      "armaldo": {
        "tier": "UUBL"
      },
      "milotic": {
        "tier": "OU"
      },
      "castform": {
        "tier": "ZU"
      },
      "kecleon": {
        "tier": "NU"
      },
      "banette": {
        "tier": "RU"
      },
      "duskull": {
        "tier": "PU"
      },
      "dusclops": {
        "tier": "UUBL"
      },
      "tropius": {
        "tier": "ZU"
      },
      "chimecho": {
        "tier": "NU"
      },
      "absol": {
        "tier": "RU"
      },
      "glalie": {
        "tier": "NUBL"
      },
      "spheal": {
        "tier": "LC"
      },
      "sealeo": {
        "tier": "PU"
      },
      "walrein": {
        "tier": "UU"
      },
      "clamperl": {
        "tier": "PU"
      },
      "huntail": {
        "tier": "NU"
      },
      "gorebyss": {
        "tier": "UU"
      },
      "relicanth": {
        "tier": "NU"
      },
      "luvdisc": {
        "tier": "ZU"
      },
      "shelgon": {
        "tier": "ZUBL"
      },
      "salamence": {
        "tier": "OU"
      },
      "metang": {
        "tier": "NU"
      },
      "metagross": {
        "tier": "OU"
      },
      "regirock": {
        "tier": "UUBL"
      },
      "regice": {
        "tier": "(OU)"
      },
      "registeel": {
        "tier": "OU"
      },
      "latias": {
        "tier": "Uber"
      },
      "latios": {
        "tier": "Uber"
      },
      "kyogre": {
        "tier": "Uber"
      },
      "groudon": {
        "tier": "Uber"
      },
      "rayquaza": {
        "tier": "Uber"
      },
      "jirachi": {
        "tier": "OU"
      },
      "deoxys": {
        "tier": "Uber"
      },
      "deoxysattack": {
        "tier": "Uber"
      },
      "deoxysdefense": {
        "tier": "Uber"
      },
      "deoxysspeed": {
        "tier": "Uber"
      }
    },
    "baseStats": {
      "butterfree": {
        "hp": 60,
        "atk": 45,
        "def": 50,
        "spa": 80,
        "spd": 80,
        "spe": 70
      },
      "beedrill": {
        "hp": 65,
        "atk": 80,
        "def": 40,
        "spa": 45,
        "spd": 80,
        "spe": 75
      },
      "pidgeot": {
        "hp": 83,
        "atk": 80,
        "def": 75,
        "spa": 70,
        "spd": 70,
        "spe": 91
      },
      "arbok": {
        "hp": 60,
        "atk": 85,
        "def": 69,
        "spa": 65,
        "spd": 79,
        "spe": 80
      },
      "pikachu": {
        "hp": 35,
        "atk": 55,
        "def": 30,
        "spa": 50,
        "spd": 40,
        "spe": 90
      },
      "raichu": {
        "hp": 60,
        "atk": 90,
        "def": 55,
        "spa": 90,
        "spd": 80,
        "spe": 100
      },
      "nidoqueen": {
        "hp": 90,
        "atk": 82,
        "def": 87,
        "spa": 75,
        "spd": 85,
        "spe": 76
      },
      "nidoking": {
        "hp": 81,
        "atk": 92,
        "def": 77,
        "spa": 85,
        "spd": 75,
        "spe": 85
      },
      "clefable": {
        "hp": 95,
        "atk": 70,
        "def": 73,
        "spa": 85,
        "spd": 90,
        "spe": 60
      },
      "wigglytuff": {
        "hp": 140,
        "atk": 70,
        "def": 45,
        "spa": 75,
        "spd": 50,
        "spe": 45
      },
      "vileplume": {
        "hp": 75,
        "atk": 80,
        "def": 85,
        "spa": 100,
        "spd": 90,
        "spe": 50
      },
      "dugtrio": {
        "hp": 35,
        "atk": 80,
        "def": 50,
        "spa": 50,
        "spd": 70,
        "spe": 120
      },
      "poliwrath": {
        "hp": 90,
        "atk": 85,
        "def": 95,
        "spa": 70,
        "spd": 90,
        "spe": 70
      },
      "alakazam": {
        "hp": 55,
        "atk": 50,
        "def": 45,
        "spa": 135,
        "spd": 85,
        "spe": 120
      },
      "alakazammega": {
        "hp": 55,
        "atk": 50,
        "def": 65,
        "spa": 175,
        "spd": 95,
        "spe": 150
      },
      "victreebel": {
        "hp": 80,
        "atk": 105,
        "def": 65,
        "spa": 100,
        "spd": 60,
        "spe": 70
      },
      "golem": {
        "hp": 80,
        "atk": 110,
        "def": 130,
        "spa": 55,
        "spd": 65,
        "spe": 45
      },
      "farfetchd": {
        "hp": 52,
        "atk": 65,
        "def": 55,
        "spa": 58,
        "spd": 62,
        "spe": 60
      },
      "dodrio": {
        "hp": 60,
        "atk": 110,
        "def": 70,
        "spa": 60,
        "spd": 60,
        "spe": 100
      },
      "electrode": {
        "hp": 60,
        "atk": 50,
        "def": 70,
        "spa": 80,
        "spd": 80,
        "spe": 140
      },
      "exeggutor": {
        "hp": 95,
        "atk": 95,
        "def": 85,
        "spa": 125,
        "spd": 65,
        "spe": 55
      },
      "noctowl": {
        "hp": 100,
        "atk": 50,
        "def": 50,
        "spa": 76,
        "spd": 96,
        "spe": 70
      },
      "ariados": {
        "hp": 70,
        "atk": 90,
        "def": 70,
        "spa": 60,
        "spd": 60,
        "spe": 40
      },
      "ampharos": {
        "hp": 90,
        "atk": 75,
        "def": 75,
        "spa": 115,
        "spd": 90,
        "spe": 55
      },
      "bellossom": {
        "hp": 75,
        "atk": 80,
        "def": 85,
        "spa": 90,
        "spd": 100,
        "spe": 50
      },
      "azumarill": {
        "hp": 100,
        "atk": 50,
        "def": 80,
        "spa": 50,
        "spd": 80,
        "spe": 50
      },
      "jumpluff": {
        "hp": 75,
        "atk": 55,
        "def": 70,
        "spa": 55,
        "spd": 85,
        "spe": 110
      },
      "qwilfish": {
        "hp": 65,
        "atk": 95,
        "def": 75,
        "spa": 55,
        "spd": 55,
        "spe": 85
      },
      "magcargo": {
        "hp": 50,
        "atk": 50,
        "def": 120,
        "spa": 80,
        "spd": 80,
        "spe": 30
      },
      "corsola": {
        "hp": 55,
        "atk": 55,
        "def": 85,
        "spa": 65,
        "spd": 85,
        "spe": 35
      },
      "mantine": {
        "hp": 65,
        "atk": 40,
        "def": 70,
        "spa": 80,
        "spd": 140,
        "spe": 70
      },
      "beautifly": {
        "hp": 60,
        "atk": 70,
        "def": 50,
        "spa": 90,
        "spd": 50,
        "spe": 65
      },
      "swellow": {
        "hp": 60,
        "atk": 85,
        "def": 60,
        "spa": 50,
        "spd": 50,
        "spe": 125
      },
      "pelipper": {
        "hp": 60,
        "atk": 50,
        "def": 100,
        "spa": 85,
        "spd": 70,
        "spe": 65
      },
      "masquerain": {
        "hp": 70,
        "atk": 60,
        "def": 62,
        "spa": 80,
        "spd": 82,
        "spe": 60
      },
      "exploud": {
        "hp": 104,
        "atk": 91,
        "def": 63,
        "spa": 91,
        "spd": 63,
        "spe": 68
      },
      "delcatty": {
        "hp": 70,
        "atk": 65,
        "def": 65,
        "spa": 55,
        "spd": 55,
        "spe": 70
      },
      "volbeat": {
        "hp": 65,
        "atk": 73,
        "def": 55,
        "spa": 47,
        "spd": 75,
        "spe": 85
      },
      "illumise": {
        "hp": 65,
        "atk": 47,
        "def": 55,
        "spa": 73,
        "spd": 75,
        "spe": 85
      },
      "lunatone": {
        "hp": 70,
        "atk": 55,
        "def": 65,
        "spa": 95,
        "spd": 85,
        "spe": 70
      },
      "solrock": {
        "hp": 70,
        "atk": 95,
        "def": 85,
        "spa": 55,
        "spd": 65,
        "spe": 70
      },
      "chimecho": {
        "hp": 65,
        "atk": 50,
        "def": 70,
        "spa": 95,
        "spd": 80,
        "spe": 65
      },
      "staraptor": {
        "hp": 85,
        "atk": 120,
        "def": 70,
        "spa": 50,
        "spd": 50,
        "spe": 100
      },
      "roserade": {
        "hp": 60,
        "atk": 70,
        "def": 55,
        "spa": 125,
        "spd": 105,
        "spe": 90
      },
      "cresselia": {
        "hp": 120,
        "atk": 70,
        "def": 120,
        "spa": 75,
        "spd": 130,
        "spe": 85
      },
      "stoutland": {
        "hp": 85,
        "atk": 100,
        "def": 90,
        "spa": 45,
        "spd": 90,
        "spe": 80
      },
      "unfezant": {
        "hp": 80,
        "atk": 105,
        "def": 80,
        "spa": 65,
        "spd": 55,
        "spe": 93
      },
      "gigalith": {
        "hp": 85,
        "atk": 135,
        "def": 130,
        "spa": 60,
        "spd": 70,
        "spe": 25
      },
      "woobat": {
        "hp": 55,
        "atk": 45,
        "def": 43,
        "spa": 55,
        "spd": 43,
        "spe": 72
      },
      "seismitoad": {
        "hp": 105,
        "atk": 85,
        "def": 75,
        "spa": 85,
        "spd": 75,
        "spe": 74
      },
      "leavanny": {
        "hp": 75,
        "atk": 103,
        "def": 80,
        "spa": 70,
        "spd": 70,
        "spe": 92
      },
      "scolipede": {
        "hp": 60,
        "atk": 90,
        "def": 89,
        "spa": 55,
        "spd": 69,
        "spe": 112
      },
      "krookodile": {
        "hp": 95,
        "atk": 117,
        "def": 70,
        "spa": 65,
        "spd": 70,
        "spe": 92
      },
      "crustle": {
        "hp": 70,
        "atk": 95,
        "def": 125,
        "spa": 65,
        "spd": 75,
        "spe": 45
      },
      "beartic": {
        "hp": 95,
        "atk": 110,
        "def": 80,
        "spa": 70,
        "spd": 80,
        "spe": 50
      },
      "cryogonal": {
        "hp": 70,
        "atk": 50,
        "def": 30,
        "spa": 95,
        "spd": 135,
        "spe": 105
      },
      "aegislash": {
        "hp": 60,
        "atk": 50,
        "def": 150,
        "spa": 50,
        "spd": 150,
        "spe": 60
      },
      "aegislashblade": {
        "hp": 60,
        "atk": 150,
        "def": 50,
        "spa": 150,
        "spd": 50,
        "spe": 60
      },
      "zacian": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zaciancrowned": {
        "hp": 92,
        "atk": 170,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 148
      },
      "zamazenta": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zamazentacrowned": {
        "hp": 92,
        "atk": 130,
        "def": 145,
        "spa": 80,
        "spd": 145,
        "spe": 128
      },
      "pyroak": {
        "hp": 120,
        "atk": 70,
        "def": 105,
        "spa": 95,
        "spd": 90,
        "spe": 60
      },
      "kitsunoh": {
        "hp": 80,
        "atk": 103,
        "def": 85,
        "spa": 55,
        "spd": 80,
        "spe": 110
      },
      "voodoom": {
        "hp": 90,
        "atk": 85,
        "def": 80,
        "spa": 105,
        "spd": 80,
        "spe": 110
      },
      "necturna": {
        "hp": 64,
        "atk": 120,
        "def": 100,
        "spa": 85,
        "spd": 120,
        "spe": 81
      },
      "crucibellemega": {
        "hp": 106,
        "atk": 135,
        "def": 75,
        "spa": 85,
        "spd": 125,
        "spe": 114
      }
    },
    "abilities": {
      "bulbasaur": [
        "Overgrow"
      ],
      "ivysaur": [
        "Overgrow"
      ],
      "venusaur": [
        "Overgrow"
      ],
      "venusaurgmax": [
        "Overgrow"
      ],
      "charmander": [
        "Blaze"
      ],
      "charmeleon": [
        "Blaze"
      ],
      "charizard": [
        "Blaze"
      ],
      "charizardmegax": [],
      "charizardgmax": [
        "Blaze"
      ],
      "squirtle": [
        "Torrent"
      ],
      "wartortle": [
        "Torrent"
      ],
      "blastoise": [
        "Torrent"
      ],
      "blastoisemega": [],
      "blastoisegmax": [
        "Torrent"
      ],
      "caterpie": [
        "Shield Dust"
      ],
      "butterfree": [
        "Compound Eyes"
      ],
      "butterfreegmax": [
        "Compound Eyes"
      ],
      "weedle": [
        "Shield Dust"
      ],
      "beedrill": [
        "Swarm"
      ],
      "beedrillmega": [],
      "pidgey": [
        "Keen Eye"
      ],
      "pidgeotto": [
        "Keen Eye"
      ],
      "pidgeot": [
        "Keen Eye"
      ],
      "pidgeotmega": [],
      "rattata": [
        "Run Away",
        "Guts"
      ],
      "rattataalola": [
        "Hustle"
      ],
      "raticate": [
        "Run Away",
        "Guts"
      ],
      "raticatealola": [
        "Hustle"
      ],
      "spearow": [
        "Keen Eye"
      ],
      "fearow": [
        "Keen Eye"
      ],
      "ekans": [
        "Intimidate",
        "Shed Skin"
      ],
      "arbok": [
        "Intimidate",
        "Shed Skin"
      ],
      "pikachu": [
        "Static"
      ],
      "pikachuoriginal": [
        "Static"
      ],
      "pikachuhoenn": [
        "Static"
      ],
      "pikachusinnoh": [
        "Static"
      ],
      "pikachuunova": [
        "Static"
      ],
      "pikachukalos": [
        "Static"
      ],
      "pikachualola": [
        "Static"
      ],
      "pikachupartner": [
        "Static"
      ],
      "pikachustarter": [
        "Static"
      ],
      "pikachugmax": [
        "Static"
      ],
      "pikachuworld": [
        "Static"
      ],
      "raichu": [
        "Static"
      ],
      "raichualola": [],
      "raichumegax": [],
      "raichumegay": [],
      "sandshrew": [
        "Sand Veil"
      ],
      "sandshrewalola": [],
      "sandslash": [
        "Sand Veil"
      ],
      "sandslashalola": [],
      "nidoranf": [
        "Poison Point"
      ],
      "nidorina": [
        "Poison Point"
      ],
      "nidoqueen": [
        "Poison Point"
      ],
      "nidoranm": [
        "Poison Point"
      ],
      "nidorino": [
        "Poison Point"
      ],
      "nidoking": [
        "Poison Point"
      ],
      "clefairy": [
        "Cute Charm"
      ],
      "clefable": [
        "Cute Charm"
      ],
      "clefablemega": [],
      "vulpix": [
        "Flash Fire"
      ],
      "vulpixalola": [],
      "ninetales": [
        "Flash Fire"
      ],
      "ninetalesalola": [],
      "jigglypuff": [
        "Cute Charm"
      ],
      "wigglytuff": [
        "Cute Charm"
      ],
      "zubat": [
        "Inner Focus"
      ],
      "golbat": [
        "Inner Focus"
      ],
      "oddish": [
        "Chlorophyll"
      ],
      "gloom": [
        "Chlorophyll"
      ],
      "vileplume": [
        "Chlorophyll"
      ],
      "paras": [
        "Effect Spore"
      ],
      "parasect": [
        "Effect Spore"
      ],
      "venonat": [
        "Compound Eyes"
      ],
      "venomoth": [
        "Shield Dust"
      ],
      "diglett": [
        "Sand Veil",
        "Arena Trap"
      ],
      "diglettalola": [
        "Sand Veil"
      ],
      "dugtrio": [
        "Sand Veil",
        "Arena Trap"
      ],
      "dugtrioalola": [
        "Sand Veil"
      ],
      "meowth": [
        "Pickup"
      ],
      "meowthalola": [
        "Pickup"
      ],
      "meowthgalar": [
        "Pickup"
      ],
      "meowthgmax": [
        "Pickup"
      ],
      "persian": [
        "Limber"
      ],
      "persianalola": [],
      "psyduck": [
        "Damp",
        "Cloud Nine"
      ],
      "golduck": [
        "Damp",
        "Cloud Nine"
      ],
      "mankey": [
        "Vital Spirit"
      ],
      "primeape": [
        "Vital Spirit"
      ],
      "growlithe": [
        "Intimidate",
        "Flash Fire"
      ],
      "growlithehisui": [
        "Intimidate",
        "Flash Fire"
      ],
      "arcanine": [
        "Intimidate",
        "Flash Fire"
      ],
      "arcaninehisui": [
        "Intimidate",
        "Flash Fire"
      ],
      "poliwag": [
        "Water Absorb",
        "Damp"
      ],
      "poliwhirl": [
        "Water Absorb",
        "Damp"
      ],
      "poliwrath": [
        "Water Absorb",
        "Damp"
      ],
      "abra": [
        "Synchronize",
        "Inner Focus"
      ],
      "kadabra": [
        "Synchronize",
        "Inner Focus"
      ],
      "alakazam": [
        "Synchronize",
        "Inner Focus"
      ],
      "machop": [
        "Guts"
      ],
      "machoke": [
        "Guts"
      ],
      "machamp": [
        "Guts"
      ],
      "machampgmax": [
        "Guts"
      ],
      "bellsprout": [
        "Chlorophyll"
      ],
      "weepinbell": [
        "Chlorophyll"
      ],
      "victreebel": [
        "Chlorophyll"
      ],
      "victreebelmega": [],
      "tentacool": [
        "Clear Body",
        "Liquid Ooze"
      ],
      "tentacruel": [
        "Clear Body",
        "Liquid Ooze"
      ],
      "geodude": [
        "Rock Head",
        "Sturdy"
      ],
      "geodudealola": [
        "Magnet Pull",
        "Sturdy"
      ],
      "graveler": [
        "Rock Head",
        "Sturdy"
      ],
      "graveleralola": [
        "Magnet Pull",
        "Sturdy"
      ],
      "golem": [
        "Rock Head",
        "Sturdy"
      ],
      "golemalola": [
        "Magnet Pull",
        "Sturdy"
      ],
      "ponyta": [
        "Run Away",
        "Flash Fire"
      ],
      "ponytagalar": [
        "Run Away"
      ],
      "rapidash": [
        "Run Away",
        "Flash Fire"
      ],
      "rapidashgalar": [
        "Run Away"
      ],
      "slowpoke": [
        "Oblivious",
        "Own Tempo"
      ],
      "slowpokegalar": [
        "Own Tempo"
      ],
      "slowbro": [
        "Oblivious",
        "Own Tempo"
      ],
      "slowbrogalar": [
        "Own Tempo"
      ],
      "magnemite": [
        "Magnet Pull",
        "Sturdy"
      ],
      "magneton": [
        "Magnet Pull",
        "Sturdy"
      ],
      "farfetchd": [
        "Keen Eye",
        "Inner Focus"
      ],
      "farfetchdgalar": [],
      "doduo": [
        "Run Away",
        "Early Bird"
      ],
      "dodrio": [
        "Run Away",
        "Early Bird"
      ],
      "seel": [
        "Thick Fat"
      ],
      "dewgong": [
        "Thick Fat"
      ],
      "grimer": [
        "Stench",
        "Sticky Hold"
      ],
      "grimeralola": [],
      "muk": [
        "Stench",
        "Sticky Hold"
      ],
      "mukalola": [],
      "shellder": [
        "Shell Armor"
      ],
      "cloyster": [
        "Shell Armor"
      ],
      "gengar": [
        "Levitate"
      ],
      "gengargmax": [],
      "onix": [
        "Rock Head",
        "Sturdy"
      ],
      "drowzee": [
        "Insomnia"
      ],
      "hypno": [
        "Insomnia"
      ],
      "krabby": [
        "Hyper Cutter",
        "Shell Armor"
      ],
      "kingler": [
        "Hyper Cutter",
        "Shell Armor"
      ],
      "kinglergmax": [
        "Hyper Cutter",
        "Shell Armor"
      ],
      "voltorb": [
        "Soundproof",
        "Static"
      ],
      "voltorbhisui": [
        "Soundproof",
        "Static"
      ],
      "electrode": [
        "Soundproof",
        "Static"
      ],
      "electrodehisui": [
        "Soundproof",
        "Static"
      ],
      "exeggcute": [
        "Chlorophyll"
      ],
      "exeggutor": [
        "Chlorophyll"
      ],
      "exeggutoralola": [],
      "cubone": [
        "Rock Head",
        "Lightning Rod"
      ],
      "marowak": [
        "Rock Head",
        "Lightning Rod"
      ],
      "marowakalola": [
        "Lightning Rod"
      ],
      "hitmonlee": [
        "Limber"
      ],
      "hitmonchan": [
        "Keen Eye"
      ],
      "lickitung": [
        "Own Tempo",
        "Oblivious"
      ],
      "koffing": [
        "Levitate"
      ],
      "weezing": [
        "Levitate"
      ],
      "weezinggalar": [
        "Levitate"
      ],
      "rhyhorn": [
        "Lightning Rod",
        "Rock Head"
      ],
      "rhydon": [
        "Lightning Rod",
        "Rock Head"
      ],
      "chansey": [
        "Natural Cure",
        "Serene Grace"
      ],
      "tangela": [
        "Chlorophyll"
      ],
      "kangaskhan": [
        "Early Bird"
      ],
      "kangaskhanmega": [],
      "horsea": [
        "Swift Swim"
      ],
      "seadra": [
        "Poison Point"
      ],
      "goldeen": [
        "Swift Swim",
        "Water Veil"
      ],
      "seaking": [
        "Swift Swim",
        "Water Veil"
      ],
      "staryu": [
        "Illuminate",
        "Natural Cure"
      ],
      "starmie": [
        "Illuminate",
        "Natural Cure"
      ],
      "mrmime": [
        "Soundproof"
      ],
      "mrmimegalar": [
        "Vital Spirit"
      ],
      "scyther": [
        "Swarm"
      ],
      "jynx": [
        "Oblivious"
      ],
      "electabuzz": [
        "Static"
      ],
      "magmar": [
        "Flame Body"
      ],
      "pinsir": [
        "Hyper Cutter"
      ],
      "pinsirmega": [],
      "tauros": [
        "Intimidate"
      ],
      "taurospaldeacombat": [
        "Intimidate"
      ],
      "taurospaldeablaze": [
        "Intimidate"
      ],
      "taurospaldeaaqua": [
        "Intimidate"
      ],
      "magikarp": [
        "Swift Swim"
      ],
      "gyarados": [
        "Intimidate"
      ],
      "gyaradosmega": [],
      "lapras": [
        "Water Absorb",
        "Shell Armor"
      ],
      "laprasgmax": [
        "Water Absorb",
        "Shell Armor"
      ],
      "ditto": [
        "Limber"
      ],
      "eevee": [
        "Run Away"
      ],
      "eeveestarter": [
        "Run Away"
      ],
      "eeveegmax": [
        "Run Away"
      ],
      "vaporeon": [
        "Water Absorb"
      ],
      "jolteon": [
        "Volt Absorb"
      ],
      "flareon": [
        "Flash Fire"
      ],
      "porygon": [
        "Trace"
      ],
      "omanyte": [
        "Swift Swim",
        "Shell Armor"
      ],
      "omastar": [
        "Swift Swim",
        "Shell Armor"
      ],
      "kabuto": [
        "Swift Swim",
        "Battle Armor"
      ],
      "kabutops": [
        "Swift Swim",
        "Battle Armor"
      ],
      "aerodactyl": [
        "Rock Head",
        "Pressure"
      ],
      "aerodactylmega": [],
      "snorlax": [
        "Immunity",
        "Thick Fat"
      ],
      "snorlaxgmax": [
        "Immunity",
        "Thick Fat"
      ],
      "articuno": [
        "Pressure"
      ],
      "articunogalar": [],
      "zapdos": [
        "Pressure"
      ],
      "zapdosgalar": [],
      "moltres": [
        "Pressure"
      ],
      "moltresgalar": [],
      "dratini": [
        "Shed Skin"
      ],
      "dragonair": [
        "Shed Skin"
      ],
      "dragonite": [
        "Inner Focus"
      ],
      "dragonitemega": [],
      "mewtwo": [
        "Pressure"
      ],
      "mewtwomegax": [],
      "chikorita": [
        "Overgrow"
      ],
      "bayleef": [
        "Overgrow"
      ],
      "meganium": [
        "Overgrow"
      ],
      "meganiummega": [],
      "cyndaquil": [
        "Blaze"
      ],
      "quilava": [
        "Blaze"
      ],
      "typhlosion": [
        "Blaze"
      ],
      "typhlosionhisui": [
        "Blaze"
      ],
      "totodile": [
        "Torrent"
      ],
      "croconaw": [
        "Torrent"
      ],
      "feraligatr": [
        "Torrent"
      ],
      "feraligatrmega": [],
      "sentret": [
        "Run Away",
        "Keen Eye"
      ],
      "furret": [
        "Run Away",
        "Keen Eye"
      ],
      "hoothoot": [
        "Insomnia",
        "Keen Eye"
      ],
      "noctowl": [
        "Insomnia",
        "Keen Eye"
      ],
      "ledyba": [
        "Swarm",
        "Early Bird"
      ],
      "ledian": [
        "Swarm",
        "Early Bird"
      ],
      "spinarak": [
        "Swarm",
        "Insomnia"
      ],
      "ariados": [
        "Swarm",
        "Insomnia"
      ],
      "crobat": [
        "Inner Focus"
      ],
      "chinchou": [
        "Volt Absorb",
        "Illuminate"
      ],
      "lanturn": [
        "Volt Absorb",
        "Illuminate"
      ],
      "pichu": [
        "Static"
      ],
      "cleffa": [
        "Cute Charm"
      ],
      "igglybuff": [
        "Cute Charm"
      ],
      "togepi": [
        "Hustle",
        "Serene Grace"
      ],
      "togetic": [
        "Hustle",
        "Serene Grace"
      ],
      "natu": [
        "Synchronize",
        "Early Bird"
      ],
      "xatu": [
        "Synchronize",
        "Early Bird"
      ],
      "mareep": [
        "Static"
      ],
      "flaaffy": [
        "Static"
      ],
      "ampharos": [
        "Static"
      ],
      "ampharosmega": [],
      "bellossom": [
        "Chlorophyll"
      ],
      "marill": [
        "Thick Fat",
        "Huge Power"
      ],
      "azumarill": [
        "Thick Fat",
        "Huge Power"
      ],
      "sudowoodo": [
        "Sturdy",
        "Rock Head"
      ],
      "politoed": [
        "Water Absorb",
        "Damp"
      ],
      "hoppip": [
        "Chlorophyll"
      ],
      "skiploom": [
        "Chlorophyll"
      ],
      "jumpluff": [
        "Chlorophyll"
      ],
      "aipom": [
        "Run Away",
        "Pickup"
      ],
      "sunkern": [
        "Chlorophyll"
      ],
      "sunflora": [
        "Chlorophyll"
      ],
      "yanma": [
        "Speed Boost",
        "Compound Eyes"
      ],
      "wooper": [
        "Damp",
        "Water Absorb"
      ],
      "wooperpaldea": [
        "Poison Point",
        "Water Absorb"
      ],
      "quagsire": [
        "Damp",
        "Water Absorb"
      ],
      "espeon": [
        "Synchronize"
      ],
      "umbreon": [
        "Synchronize"
      ],
      "murkrow": [
        "Insomnia"
      ],
      "slowking": [
        "Oblivious",
        "Own Tempo"
      ],
      "slowkinggalar": [
        "Own Tempo"
      ],
      "wobbuffet": [
        "Shadow Tag"
      ],
      "girafarig": [
        "Inner Focus",
        "Early Bird"
      ],
      "pineco": [
        "Sturdy"
      ],
      "forretress": [
        "Sturdy"
      ],
      "dunsparce": [
        "Serene Grace",
        "Run Away"
      ],
      "gligar": [
        "Hyper Cutter",
        "Sand Veil"
      ],
      "steelix": [
        "Rock Head",
        "Sturdy"
      ],
      "steelixmega": [],
      "snubbull": [
        "Intimidate",
        "Run Away"
      ],
      "granbull": [
        "Intimidate"
      ],
      "qwilfish": [
        "Poison Point",
        "Swift Swim"
      ],
      "qwilfishhisui": [
        "Poison Point",
        "Swift Swim"
      ],
      "scizor": [
        "Swarm"
      ],
      "scizormega": [],
      "shuckle": [
        "Sturdy"
      ],
      "heracross": [
        "Swarm",
        "Guts"
      ],
      "heracrossmega": [],
      "sneasel": [
        "Inner Focus",
        "Keen Eye"
      ],
      "sneaselhisui": [
        "Inner Focus",
        "Keen Eye"
      ],
      "teddiursa": [
        "Pickup"
      ],
      "ursaring": [
        "Guts"
      ],
      "slugma": [
        "Magma Armor",
        "Flame Body"
      ],
      "magcargo": [
        "Magma Armor",
        "Flame Body"
      ],
      "swinub": [
        "Oblivious"
      ],
      "piloswine": [
        "Oblivious"
      ],
      "corsola": [
        "Hustle",
        "Natural Cure"
      ],
      "corsolagalar": [],
      "remoraid": [
        "Hustle"
      ],
      "octillery": [
        "Suction Cups"
      ],
      "delibird": [
        "Vital Spirit",
        "Hustle"
      ],
      "mantine": [
        "Swift Swim",
        "Water Absorb"
      ],
      "skarmory": [
        "Keen Eye",
        "Sturdy"
      ],
      "skarmorymega": [],
      "houndour": [
        "Early Bird",
        "Flash Fire"
      ],
      "houndoom": [
        "Early Bird",
        "Flash Fire"
      ],
      "houndoommega": [],
      "kingdra": [
        "Swift Swim"
      ],
      "phanpy": [
        "Pickup"
      ],
      "donphan": [
        "Sturdy"
      ],
      "porygon2": [
        "Trace"
      ],
      "stantler": [
        "Intimidate"
      ],
      "smeargle": [
        "Own Tempo"
      ],
      "tyrogue": [
        "Guts"
      ],
      "hitmontop": [
        "Intimidate"
      ],
      "smoochum": [
        "Oblivious"
      ],
      "elekid": [
        "Static"
      ],
      "magby": [
        "Flame Body"
      ],
      "miltank": [
        "Thick Fat"
      ],
      "blissey": [
        "Natural Cure",
        "Serene Grace"
      ],
      "raikou": [
        "Pressure"
      ],
      "entei": [
        "Pressure"
      ],
      "suicune": [
        "Pressure"
      ],
      "larvitar": [
        "Guts"
      ],
      "tyranitar": [
        "Sand Stream"
      ],
      "lugia": [
        "Pressure"
      ],
      "hooh": [
        "Pressure"
      ],
      "treecko": [
        "Overgrow"
      ],
      "grovyle": [
        "Overgrow"
      ],
      "sceptile": [
        "Overgrow"
      ],
      "torchic": [
        "Blaze"
      ],
      "combusken": [
        "Blaze"
      ],
      "blaziken": [
        "Blaze"
      ],
      "mudkip": [
        "Torrent"
      ],
      "marshtomp": [
        "Torrent"
      ],
      "swampert": [
        "Torrent"
      ],
      "poochyena": [
        "Run Away"
      ],
      "mightyena": [
        "Intimidate"
      ],
      "zigzagoon": [
        "Pickup"
      ],
      "zigzagoongalar": [
        "Pickup"
      ],
      "linoone": [
        "Pickup"
      ],
      "linoonegalar": [
        "Pickup"
      ],
      "wurmple": [
        "Shield Dust"
      ],
      "beautifly": [
        "Swarm"
      ],
      "dustox": [
        "Shield Dust"
      ],
      "lotad": [
        "Swift Swim",
        "Rain Dish"
      ],
      "lombre": [
        "Swift Swim",
        "Rain Dish"
      ],
      "ludicolo": [
        "Swift Swim",
        "Rain Dish"
      ],
      "seedot": [
        "Chlorophyll",
        "Early Bird"
      ],
      "nuzleaf": [
        "Chlorophyll",
        "Early Bird"
      ],
      "shiftry": [
        "Chlorophyll",
        "Early Bird"
      ],
      "taillow": [
        "Guts"
      ],
      "swellow": [
        "Guts"
      ],
      "wingull": [
        "Keen Eye"
      ],
      "pelipper": [
        "Keen Eye"
      ],
      "ralts": [
        "Synchronize",
        "Trace"
      ],
      "kirlia": [
        "Synchronize",
        "Trace"
      ],
      "gardevoir": [
        "Synchronize",
        "Trace"
      ],
      "gardevoirmega": [],
      "surskit": [
        "Swift Swim"
      ],
      "masquerain": [
        "Intimidate"
      ],
      "shroomish": [
        "Effect Spore"
      ],
      "breloom": [
        "Effect Spore"
      ],
      "nincada": [
        "Compound Eyes"
      ],
      "ninjask": [
        "Speed Boost"
      ],
      "whismur": [
        "Soundproof"
      ],
      "loudred": [
        "Soundproof"
      ],
      "exploud": [
        "Soundproof"
      ],
      "makuhita": [
        "Thick Fat",
        "Guts"
      ],
      "hariyama": [
        "Thick Fat",
        "Guts"
      ],
      "azurill": [
        "Thick Fat",
        "Huge Power"
      ],
      "nosepass": [
        "Sturdy",
        "Magnet Pull"
      ],
      "skitty": [
        "Cute Charm"
      ],
      "delcatty": [
        "Cute Charm"
      ],
      "sableye": [
        "Keen Eye"
      ],
      "sableyemega": [],
      "mawile": [
        "Hyper Cutter",
        "Intimidate"
      ],
      "aron": [
        "Sturdy",
        "Rock Head"
      ],
      "lairon": [
        "Sturdy",
        "Rock Head"
      ],
      "aggron": [
        "Sturdy",
        "Rock Head"
      ],
      "aggronmega": [],
      "meditite": [
        "Pure Power"
      ],
      "medicham": [
        "Pure Power"
      ],
      "electrike": [
        "Static",
        "Lightning Rod"
      ],
      "manectric": [
        "Static",
        "Lightning Rod"
      ],
      "plusle": [
        "Plus"
      ],
      "minun": [
        "Minus"
      ],
      "volbeat": [
        "Illuminate",
        "Swarm"
      ],
      "illumise": [
        "Oblivious"
      ],
      "roselia": [
        "Natural Cure",
        "Poison Point"
      ],
      "gulpin": [
        "Liquid Ooze",
        "Sticky Hold"
      ],
      "swalot": [
        "Liquid Ooze",
        "Sticky Hold"
      ],
      "carvanha": [
        "Rough Skin"
      ],
      "sharpedo": [
        "Rough Skin"
      ],
      "sharpedomega": [],
      "wailmer": [
        "Water Veil",
        "Oblivious"
      ],
      "wailord": [
        "Water Veil",
        "Oblivious"
      ],
      "numel": [
        "Oblivious"
      ],
      "camerupt": [
        "Magma Armor"
      ],
      "cameruptmega": [],
      "torkoal": [
        "White Smoke"
      ],
      "spoink": [
        "Thick Fat",
        "Own Tempo"
      ],
      "grumpig": [
        "Thick Fat",
        "Own Tempo"
      ],
      "spinda": [
        "Own Tempo"
      ],
      "trapinch": [
        "Hyper Cutter",
        "Arena Trap"
      ],
      "cacnea": [
        "Sand Veil"
      ],
      "cacturne": [
        "Sand Veil"
      ],
      "swablu": [
        "Natural Cure"
      ],
      "altaria": [
        "Natural Cure"
      ],
      "altariamega": [],
      "zangoose": [
        "Immunity"
      ],
      "seviper": [
        "Shed Skin"
      ],
      "barboach": [
        "Oblivious"
      ],
      "whiscash": [
        "Oblivious"
      ],
      "corphish": [
        "Hyper Cutter",
        "Shell Armor"
      ],
      "crawdaunt": [
        "Hyper Cutter",
        "Shell Armor"
      ],
      "lileep": [
        "Suction Cups"
      ],
      "cradily": [
        "Suction Cups"
      ],
      "anorith": [
        "Battle Armor"
      ],
      "armaldo": [
        "Battle Armor"
      ],
      "feebas": [
        "Swift Swim"
      ],
      "milotic": [
        "Marvel Scale"
      ],
      "kecleon": [
        "Color Change"
      ],
      "shuppet": [
        "Insomnia"
      ],
      "banette": [
        "Insomnia"
      ],
      "banettemega": [],
      "duskull": [
        "Levitate"
      ],
      "dusclops": [
        "Pressure"
      ],
      "tropius": [
        "Chlorophyll"
      ],
      "absol": [
        "Pressure"
      ],
      "absolmega": [],
      "absolmegaz": [],
      "wynaut": [
        "Shadow Tag"
      ],
      "snorunt": [
        "Inner Focus"
      ],
      "glalie": [
        "Inner Focus"
      ],
      "glaliemega": [],
      "spheal": [
        "Thick Fat"
      ],
      "sealeo": [
        "Thick Fat"
      ],
      "walrein": [
        "Thick Fat"
      ],
      "clamperl": [
        "Shell Armor"
      ],
      "huntail": [
        "Swift Swim"
      ],
      "gorebyss": [
        "Swift Swim"
      ],
      "relicanth": [
        "Swift Swim",
        "Rock Head"
      ],
      "luvdisc": [
        "Swift Swim"
      ],
      "bagon": [
        "Rock Head"
      ],
      "shelgon": [
        "Rock Head"
      ],
      "salamence": [
        "Intimidate"
      ],
      "salamencemega": [],
      "beldum": [
        "Clear Body"
      ],
      "metang": [
        "Clear Body"
      ],
      "metagross": [
        "Clear Body"
      ],
      "metagrossmega": [],
      "regirock": [
        "Clear Body"
      ],
      "regice": [
        "Clear Body"
      ],
      "registeel": [
        "Clear Body"
      ],
      "kyogreprimal": [],
      "groudonprimal": [],
      "rayquazamega": [],
      "turtwig": [
        "Overgrow"
      ],
      "grotle": [
        "Overgrow"
      ],
      "torterra": [
        "Overgrow"
      ],
      "chimchar": [
        "Blaze"
      ],
      "monferno": [
        "Blaze"
      ],
      "infernape": [
        "Blaze"
      ],
      "piplup": [
        "Torrent"
      ],
      "prinplup": [
        "Torrent"
      ],
      "empoleon": [
        "Torrent"
      ],
      "starly": [
        "Keen Eye"
      ],
      "staravia": [
        "Intimidate"
      ],
      "staraptor": [
        "Intimidate"
      ],
      "staraptormega": [],
      "bidoof": [],
      "bibarel": [],
      "kricketot": [
        "Shed Skin"
      ],
      "kricketune": [
        "Swarm"
      ],
      "shinx": [
        "Intimidate"
      ],
      "luxio": [
        "Intimidate"
      ],
      "luxray": [
        "Intimidate"
      ],
      "budew": [
        "Natural Cure",
        "Poison Point"
      ],
      "roserade": [
        "Natural Cure",
        "Poison Point"
      ],
      "cranidos": [],
      "rampardos": [],
      "shieldon": [
        "Sturdy"
      ],
      "bastiodon": [
        "Sturdy"
      ],
      "burmy": [
        "Shed Skin"
      ],
      "burmysandy": [
        "Shed Skin"
      ],
      "burmytrash": [
        "Shed Skin"
      ],
      "wormadam": [],
      "wormadamsandy": [],
      "wormadamtrash": [],
      "mothim": [
        "Swarm"
      ],
      "combee": [],
      "vespiquen": [
        "Pressure"
      ],
      "pachirisu": [
        "Run Away",
        "Pickup"
      ],
      "buizel": [
        "Swift Swim"
      ],
      "floatzel": [
        "Swift Swim"
      ],
      "cherrim": [],
      "cherrimsunshine": [],
      "shellos": [
        "Sticky Hold"
      ],
      "shelloseast": [
        "Sticky Hold"
      ],
      "gastrodon": [
        "Sticky Hold"
      ],
      "gastrodoneast": [
        "Sticky Hold"
      ],
      "ambipom": [
        "Pickup"
      ],
      "drifloon": [],
      "drifblim": [],
      "buneary": [
        "Run Away"
      ],
      "lopunny": [
        "Cute Charm"
      ],
      "lopunnymega": [],
      "honchkrow": [
        "Insomnia"
      ],
      "glameow": [
        "Limber",
        "Own Tempo"
      ],
      "purugly": [
        "Thick Fat",
        "Own Tempo"
      ],
      "stunky": [
        "Stench"
      ],
      "skuntank": [
        "Stench"
      ],
      "bronzor": [
        "Levitate"
      ],
      "bronzong": [
        "Levitate"
      ],
      "bonsly": [
        "Sturdy",
        "Rock Head"
      ],
      "mimejr": [
        "Soundproof"
      ],
      "happiny": [
        "Natural Cure",
        "Serene Grace"
      ],
      "chatot": [
        "Keen Eye"
      ],
      "spiritomb": [
        "Pressure"
      ],
      "gible": [
        "Sand Veil"
      ],
      "gabite": [
        "Sand Veil"
      ],
      "garchomp": [
        "Sand Veil"
      ],
      "garchompmega": [],
      "munchlax": [
        "Pickup",
        "Thick Fat"
      ],
      "riolu": [
        "Inner Focus"
      ],
      "lucario": [
        "Inner Focus"
      ],
      "lucariomega": [],
      "lucariomegaz": [],
      "hippopotas": [
        "Sand Stream"
      ],
      "hippowdon": [
        "Sand Stream"
      ],
      "skorupi": [
        "Battle Armor"
      ],
      "drapion": [
        "Battle Armor"
      ],
      "croagunk": [],
      "toxicroak": [],
      "finneon": [
        "Swift Swim"
      ],
      "lumineon": [
        "Swift Swim"
      ],
      "mantyke": [
        "Swift Swim",
        "Water Absorb"
      ],
      "snover": [],
      "abomasnow": [],
      "abomasnowmega": [],
      "weavile": [
        "Pressure"
      ],
      "magnezone": [
        "Magnet Pull",
        "Sturdy"
      ],
      "lickilicky": [
        "Own Tempo",
        "Oblivious"
      ],
      "rhyperior": [
        "Lightning Rod"
      ],
      "tangrowth": [
        "Chlorophyll"
      ],
      "electivire": [],
      "magmortar": [
        "Flame Body"
      ],
      "togekiss": [
        "Hustle",
        "Serene Grace"
      ],
      "yanmega": [
        "Speed Boost"
      ],
      "leafeon": [],
      "glaceon": [],
      "gliscor": [
        "Hyper Cutter",
        "Sand Veil"
      ],
      "mamoswine": [
        "Oblivious"
      ],
      "porygonz": [],
      "gallade": [],
      "probopass": [
        "Sturdy",
        "Magnet Pull"
      ],
      "dusknoir": [
        "Pressure"
      ],
      "froslass": [],
      "froslassmega": [],
      "dialga": [
        "Pressure"
      ],
      "dialgaorigin": [
        "Pressure"
      ],
      "palkia": [
        "Pressure"
      ],
      "palkiaorigin": [
        "Pressure"
      ],
      "heatran": [
        "Flash Fire"
      ],
      "heatranmega": [
        "Flash Fire"
      ],
      "regigigas": [],
      "giratina": [
        "Pressure"
      ],
      "phione": [],
      "manaphy": [],
      "darkrai": [],
      "darkraimega": [],
      "arceus": [],
      "arceusbug": [],
      "arceusdark": [],
      "arceusdragon": [],
      "arceuselectric": [],
      "arceusfairy": [],
      "arceusfighting": [],
      "arceusfire": [],
      "arceusflying": [],
      "arceusghost": [],
      "arceusgrass": [],
      "arceusground": [],
      "arceusice": [],
      "arceuspoison": [],
      "arceuspsychic": [],
      "arceusrock": [],
      "arceussteel": [],
      "arceuswater": [],
      "victini": [],
      "snivy": [
        "Overgrow"
      ],
      "servine": [
        "Overgrow"
      ],
      "serperior": [
        "Overgrow"
      ],
      "tepig": [
        "Blaze"
      ],
      "pignite": [
        "Blaze"
      ],
      "emboar": [
        "Blaze"
      ],
      "emboarmega": [],
      "oshawott": [
        "Torrent"
      ],
      "dewott": [
        "Torrent"
      ],
      "samurott": [
        "Torrent"
      ],
      "samurotthisui": [
        "Torrent"
      ],
      "patrat": [
        "Run Away",
        "Keen Eye"
      ],
      "watchog": [
        "Illuminate",
        "Keen Eye"
      ],
      "lillipup": [
        "Vital Spirit",
        "Pickup"
      ],
      "herdier": [
        "Intimidate"
      ],
      "stoutland": [
        "Intimidate"
      ],
      "purrloin": [
        "Limber"
      ],
      "liepard": [
        "Limber"
      ],
      "pansage": [],
      "simisage": [],
      "pansear": [],
      "simisear": [],
      "panpour": [],
      "simipour": [],
      "munna": [
        "Synchronize"
      ],
      "musharna": [
        "Synchronize"
      ],
      "pidove": [],
      "tranquill": [],
      "unfezant": [],
      "blitzle": [
        "Lightning Rod"
      ],
      "zebstrika": [
        "Lightning Rod"
      ],
      "roggenrola": [
        "Sturdy"
      ],
      "boldore": [
        "Sturdy"
      ],
      "gigalith": [
        "Sturdy"
      ],
      "woobat": [],
      "swoobat": [],
      "drilbur": [],
      "excadrill": [],
      "excadrillmega": [],
      "audino": [],
      "audinomega": [],
      "timburr": [
        "Guts"
      ],
      "gurdurr": [
        "Guts"
      ],
      "conkeldurr": [
        "Guts"
      ],
      "tympole": [
        "Swift Swim"
      ],
      "palpitoad": [
        "Swift Swim"
      ],
      "seismitoad": [
        "Swift Swim"
      ],
      "throh": [
        "Guts",
        "Inner Focus"
      ],
      "sawk": [
        "Sturdy",
        "Inner Focus"
      ],
      "sewaddle": [
        "Swarm",
        "Chlorophyll"
      ],
      "swadloon": [
        "Chlorophyll"
      ],
      "leavanny": [
        "Swarm",
        "Chlorophyll"
      ],
      "venipede": [
        "Poison Point",
        "Swarm"
      ],
      "whirlipede": [
        "Poison Point",
        "Swarm"
      ],
      "scolipede": [
        "Poison Point",
        "Swarm"
      ],
      "cottonee": [],
      "whimsicott": [],
      "petilil": [
        "Chlorophyll",
        "Own Tempo"
      ],
      "lilligant": [
        "Chlorophyll",
        "Own Tempo"
      ],
      "lilliganthisui": [
        "Chlorophyll",
        "Hustle"
      ],
      "basculin": [],
      "basculinbluestriped": [
        "Rock Head"
      ],
      "basculinwhitestriped": [],
      "sandile": [
        "Intimidate"
      ],
      "krokorok": [
        "Intimidate"
      ],
      "krookodile": [
        "Intimidate"
      ],
      "darumaka": [
        "Hustle"
      ],
      "darumakagalar": [
        "Hustle"
      ],
      "darmanitan": [],
      "darmanitanzen": [],
      "darmanitangalar": [],
      "darmanitangalarzen": [],
      "maractus": [
        "Water Absorb",
        "Chlorophyll"
      ],
      "dwebble": [
        "Sturdy",
        "Shell Armor"
      ],
      "crustle": [
        "Sturdy",
        "Shell Armor"
      ],
      "scraggy": [
        "Shed Skin"
      ],
      "scrafty": [
        "Shed Skin"
      ],
      "sigilyph": [],
      "yamask": [],
      "yamaskgalar": [],
      "cofagrigus": [],
      "tirtouga": [
        "Sturdy"
      ],
      "carracosta": [
        "Sturdy"
      ],
      "archen": [],
      "archeops": [],
      "trubbish": [
        "Stench",
        "Sticky Hold"
      ],
      "garbodor": [
        "Stench"
      ],
      "garbodorgmax": [
        "Stench"
      ],
      "zorua": [],
      "zoruahisui": [],
      "zoroark": [],
      "zoroarkhisui": [],
      "minccino": [
        "Cute Charm"
      ],
      "cinccino": [
        "Cute Charm"
      ],
      "gothita": [],
      "gothorita": [],
      "gothitelle": [],
      "solosis": [],
      "duosion": [],
      "reuniclus": [],
      "ducklett": [
        "Keen Eye"
      ],
      "swanna": [
        "Keen Eye"
      ],
      "vanillite": [],
      "vanillish": [],
      "vanilluxe": [],
      "deerling": [
        "Chlorophyll"
      ],
      "deerlingsummer": [
        "Chlorophyll"
      ],
      "deerlingautumn": [
        "Chlorophyll"
      ],
      "deerlingwinter": [
        "Chlorophyll"
      ],
      "sawsbuck": [
        "Chlorophyll"
      ],
      "emolga": [
        "Static"
      ],
      "karrablast": [
        "Swarm",
        "Shed Skin"
      ],
      "escavalier": [
        "Swarm",
        "Shell Armor"
      ],
      "foongus": [
        "Effect Spore"
      ],
      "amoonguss": [
        "Effect Spore"
      ],
      "frillish": [
        "Water Absorb"
      ],
      "jellicent": [
        "Water Absorb"
      ],
      "alomomola": [],
      "joltik": [
        "Compound Eyes"
      ],
      "galvantula": [
        "Compound Eyes"
      ],
      "ferroseed": [],
      "ferrothorn": [],
      "klink": [
        "Plus",
        "Minus"
      ],
      "klang": [
        "Plus",
        "Minus"
      ],
      "klinklang": [
        "Plus",
        "Minus"
      ],
      "eelektrossmega": [],
      "elgyem": [
        "Synchronize"
      ],
      "beheeyem": [
        "Synchronize"
      ],
      "litwick": [
        "Flash Fire",
        "Flame Body"
      ],
      "lampent": [
        "Flash Fire",
        "Flame Body"
      ],
      "chandelure": [
        "Flash Fire",
        "Flame Body"
      ],
      "chandeluremega": [],
      "axew": [],
      "fraxure": [],
      "haxorus": [],
      "cubchoo": [],
      "beartic": [],
      "shelmet": [
        "Shell Armor"
      ],
      "accelgor": [
        "Sticky Hold"
      ],
      "stunfisk": [
        "Static",
        "Limber"
      ],
      "stunfiskgalar": [],
      "mienfoo": [
        "Inner Focus"
      ],
      "mienshao": [
        "Inner Focus"
      ],
      "druddigon": [
        "Rough Skin"
      ],
      "golett": [],
      "golurk": [],
      "golurkmega": [],
      "pawniard": [
        "Inner Focus"
      ],
      "bisharp": [
        "Inner Focus"
      ],
      "bouffalant": [],
      "rufflet": [
        "Keen Eye"
      ],
      "braviary": [
        "Keen Eye"
      ],
      "braviaryhisui": [
        "Keen Eye"
      ],
      "vullaby": [],
      "mandibuzz": [],
      "heatmor": [
        "Flash Fire"
      ],
      "durant": [
        "Swarm",
        "Hustle"
      ],
      "larvesta": [
        "Flame Body"
      ],
      "volcarona": [
        "Flame Body"
      ],
      "cobalion": [],
      "terrakion": [],
      "virizion": [],
      "tornadus": [],
      "tornadustherian": [],
      "thundurus": [],
      "reshiram": [],
      "zekrom": [],
      "landorus": [],
      "kyuremblack": [],
      "kyuremwhite": [],
      "keldeo": [],
      "keldeoresolute": [],
      "genesect": [],
      "genesectdouse": [],
      "genesectshock": [],
      "genesectburn": [],
      "genesectchill": [],
      "chespin": [
        "Overgrow"
      ],
      "quilladin": [
        "Overgrow"
      ],
      "chesnaught": [
        "Overgrow"
      ],
      "chesnaughtmega": [],
      "fennekin": [
        "Blaze"
      ],
      "braixen": [
        "Blaze"
      ],
      "delphox": [
        "Blaze"
      ],
      "froakie": [
        "Torrent"
      ],
      "frogadier": [
        "Torrent"
      ],
      "greninja": [
        "Torrent"
      ],
      "greninjabond": [],
      "greninjaash": [],
      "greninjamega": [],
      "bunnelby": [
        "Pickup"
      ],
      "diggersby": [
        "Pickup"
      ],
      "fletchling": [],
      "fletchinder": [
        "Flame Body"
      ],
      "talonflame": [
        "Flame Body"
      ],
      "scatterbug": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "spewpa": [
        "Shed Skin"
      ],
      "vivillon": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonicysnow": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonpolar": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillontundra": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivilloncontinental": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillongarden": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonelegant": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonmodern": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonmarine": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonarchipelago": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonhighplains": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonsandstorm": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonriver": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonmonsoon": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonsavanna": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonsun": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonocean": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonjungle": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonfancy": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonpokeball": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "litleo": [],
      "pyroar": [],
      "pyroarmega": [],
      "flabebe": [],
      "floette": [],
      "floetteeternal": [],
      "floettemega": [],
      "florges": [],
      "skiddo": [],
      "gogoat": [],
      "pancham": [],
      "pangoro": [],
      "furfrou": [],
      "espurr": [
        "Keen Eye"
      ],
      "meowstic": [
        "Keen Eye"
      ],
      "meowsticf": [
        "Keen Eye"
      ],
      "honedge": [],
      "doublade": [],
      "aegislash": [],
      "aegislashblade": [],
      "spritzee": [],
      "aromatisse": [],
      "swirlix": [],
      "slurpuff": [],
      "inkay": [
        "Suction Cups"
      ],
      "malamar": [
        "Suction Cups"
      ],
      "malamarmega": [],
      "binacle": [],
      "barbaracle": [],
      "barbaraclemega": [],
      "skrelp": [
        "Poison Point"
      ],
      "dragalge": [
        "Poison Point"
      ],
      "dragalgemega": [],
      "clauncher": [],
      "clawitzer": [],
      "helioptile": [
        "Sand Veil"
      ],
      "heliolisk": [
        "Sand Veil"
      ],
      "tyrunt": [],
      "tyrantrum": [],
      "amaura": [],
      "aurorus": [],
      "sylveon": [
        "Cute Charm"
      ],
      "hawlucha": [
        "Limber"
      ],
      "hawluchamega": [],
      "dedenne": [
        "Pickup"
      ],
      "carbink": [
        "Clear Body"
      ],
      "goomy": [],
      "sliggoo": [],
      "sliggoohisui": [],
      "goodra": [],
      "goodrahisui": [],
      "klefki": [],
      "phantump": [
        "Natural Cure"
      ],
      "trevenant": [
        "Natural Cure"
      ],
      "pumpkaboo": [
        "Pickup"
      ],
      "pumpkaboosmall": [
        "Pickup"
      ],
      "pumpkaboolarge": [
        "Pickup"
      ],
      "pumpkaboosuper": [
        "Pickup"
      ],
      "gourgeist": [
        "Pickup"
      ],
      "gourgeistsmall": [
        "Pickup"
      ],
      "gourgeistlarge": [
        "Pickup"
      ],
      "gourgeistsuper": [
        "Pickup"
      ],
      "bergmite": [
        "Own Tempo"
      ],
      "avalugg": [
        "Own Tempo"
      ],
      "avalugghisui": [],
      "noibat": [],
      "noivern": [],
      "xerneas": [],
      "xerneasneutral": [],
      "yveltal": [],
      "zygarde": [],
      "zygarde10": [],
      "zygardecomplete": [],
      "zygardemega": [],
      "dianciemega": [],
      "hoopa": [],
      "hoopaunbound": [],
      "rowlet": [
        "Overgrow"
      ],
      "dartrix": [
        "Overgrow"
      ],
      "decidueye": [
        "Overgrow"
      ],
      "decidueyehisui": [
        "Overgrow"
      ],
      "litten": [
        "Blaze"
      ],
      "torracat": [
        "Blaze"
      ],
      "incineroar": [
        "Blaze"
      ],
      "popplio": [
        "Torrent"
      ],
      "brionne": [
        "Torrent"
      ],
      "primarina": [
        "Torrent"
      ],
      "pikipek": [
        "Keen Eye"
      ],
      "trumbeak": [
        "Keen Eye"
      ],
      "toucannon": [
        "Keen Eye"
      ],
      "yungoos": [],
      "gumshoos": [],
      "gumshoostotem": [],
      "charjabug": [],
      "crabrawler": [
        "Hyper Cutter"
      ],
      "crabominable": [
        "Hyper Cutter"
      ],
      "crabominablemega": [],
      "oricorio": [],
      "oricoriopompom": [],
      "oricoriopau": [],
      "oricoriosensu": [],
      "cutiefly": [
        "Shield Dust"
      ],
      "ribombee": [
        "Shield Dust"
      ],
      "ribombeetotem": [],
      "rockruff": [
        "Keen Eye",
        "Vital Spirit",
        "Own Tempo"
      ],
      "lycanroc": [
        "Keen Eye"
      ],
      "lycanrocmidnight": [
        "Keen Eye",
        "Vital Spirit"
      ],
      "lycanrocdusk": [],
      "wishiwashi": [],
      "wishiwashischool": [],
      "mareanie": [
        "Limber"
      ],
      "toxapex": [
        "Limber"
      ],
      "mudbray": [
        "Own Tempo"
      ],
      "mudsdale": [
        "Own Tempo"
      ],
      "dewpider": [],
      "araquanid": [],
      "araquanidtotem": [],
      "fomantis": [],
      "lurantis": [],
      "lurantistotem": [],
      "morelull": [
        "Illuminate",
        "Effect Spore"
      ],
      "shiinotic": [
        "Illuminate",
        "Effect Spore"
      ],
      "salandit": [],
      "salazzle": [],
      "salazzletotem": [],
      "stufful": [],
      "bewear": [],
      "bounsweet": [
        "Oblivious"
      ],
      "steenee": [
        "Oblivious"
      ],
      "tsareena": [],
      "comfey": [],
      "oranguru": [
        "Inner Focus"
      ],
      "passimian": [],
      "wimpod": [],
      "golisopod": [],
      "golisopodmega": [],
      "sandygast": [],
      "palossand": [],
      "pyukumuku": [],
      "silvally": [],
      "silvallybug": [],
      "silvallydark": [],
      "silvallydragon": [],
      "silvallyelectric": [],
      "silvallyfairy": [],
      "silvallyfighting": [],
      "silvallyfire": [],
      "silvallyflying": [],
      "silvallyghost": [],
      "silvallygrass": [],
      "silvallyground": [],
      "silvallyice": [],
      "silvallypoison": [],
      "silvallypsychic": [],
      "silvallyrock": [],
      "silvallysteel": [],
      "silvallywater": [],
      "minior": [],
      "miniororange": [],
      "minioryellow": [],
      "miniorgreen": [],
      "miniorblue": [],
      "miniorindigo": [],
      "miniorviolet": [],
      "miniormeteor": [],
      "komala": [],
      "togedemaru": [
        "Lightning Rod"
      ],
      "mimikyu": [],
      "mimikyubusted": [],
      "mimikyutotem": [],
      "mimikyubustedtotem": [],
      "bruxish": [],
      "drampa": [],
      "drampamega": [],
      "dhelmise": [],
      "jangmoo": [
        "Soundproof"
      ],
      "hakamoo": [
        "Soundproof"
      ],
      "kommoo": [
        "Soundproof"
      ],
      "kommoototem": [],
      "tapukoko": [],
      "tapulele": [],
      "tapubulu": [],
      "tapufini": [],
      "cosmog": [],
      "solgaleo": [],
      "lunala": [],
      "nihilego": [],
      "buzzwole": [],
      "pheromosa": [],
      "xurkitree": [],
      "celesteela": [],
      "kartana": [],
      "guzzlord": [],
      "necrozma": [],
      "necrozmaduskmane": [],
      "necrozmadawnwings": [],
      "necrozmaultra": [],
      "magearna": [],
      "magearnaoriginal": [],
      "magearnamega": [],
      "magearnaoriginalmega": [],
      "marshadow": [],
      "poipole": [],
      "naganadel": [],
      "stakataka": [],
      "blacephalon": [],
      "melmetal": [],
      "melmetalgmax": [],
      "grookey": [
        "Overgrow"
      ],
      "thwackey": [
        "Overgrow"
      ],
      "rillaboom": [
        "Overgrow"
      ],
      "rillaboomgmax": [
        "Overgrow"
      ],
      "scorbunny": [
        "Blaze"
      ],
      "raboot": [
        "Blaze"
      ],
      "cinderace": [
        "Blaze"
      ],
      "cinderacegmax": [
        "Blaze"
      ],
      "sobble": [
        "Torrent"
      ],
      "drizzile": [
        "Torrent"
      ],
      "inteleon": [
        "Torrent"
      ],
      "inteleongmax": [
        "Torrent"
      ],
      "skwovet": [],
      "greedent": [],
      "rookidee": [
        "Keen Eye"
      ],
      "corvisquire": [
        "Keen Eye"
      ],
      "corviknight": [
        "Pressure"
      ],
      "corviknightgmax": [
        "Pressure"
      ],
      "blipbug": [
        "Swarm",
        "Compound Eyes"
      ],
      "dottler": [
        "Swarm",
        "Compound Eyes"
      ],
      "orbeetle": [
        "Swarm"
      ],
      "orbeetlegmax": [
        "Swarm"
      ],
      "nickit": [
        "Run Away"
      ],
      "thievul": [
        "Run Away"
      ],
      "gossifleur": [],
      "eldegoss": [],
      "wooloo": [
        "Run Away"
      ],
      "dubwool": [],
      "chewtle": [
        "Shell Armor"
      ],
      "drednaw": [
        "Shell Armor"
      ],
      "drednawgmax": [
        "Shell Armor"
      ],
      "yamper": [],
      "boltund": [],
      "rolycoly": [],
      "carkol": [
        "Flame Body"
      ],
      "coalossal": [
        "Flame Body"
      ],
      "coalossalgmax": [
        "Flame Body"
      ],
      "applin": [],
      "flapple": [],
      "flapplegmax": [],
      "appletun": [],
      "appletungmax": [],
      "silicobra": [
        "Shed Skin"
      ],
      "sandaconda": [
        "Shed Skin"
      ],
      "sandacondagmax": [
        "Shed Skin"
      ],
      "cramorant": [],
      "cramorantgulping": [],
      "cramorantgorging": [],
      "arrokuda": [
        "Swift Swim"
      ],
      "barraskewda": [
        "Swift Swim"
      ],
      "toxel": [
        "Static"
      ],
      "toxtricity": [
        "Plus"
      ],
      "toxtricitylowkey": [
        "Minus"
      ],
      "toxtricitygmax": [
        "Plus"
      ],
      "toxtricitylowkeygmax": [
        "Minus"
      ],
      "sizzlipede": [
        "Flash Fire",
        "White Smoke"
      ],
      "centiskorch": [
        "Flash Fire",
        "White Smoke"
      ],
      "centiskorchgmax": [
        "Flash Fire",
        "White Smoke"
      ],
      "clobbopus": [
        "Limber"
      ],
      "grapploct": [
        "Limber"
      ],
      "sinistea": [],
      "sinisteaantique": [],
      "polteageist": [],
      "polteageistantique": [],
      "hatenna": [],
      "hattrem": [],
      "hatterene": [],
      "hatterenegmax": [],
      "impidimp": [],
      "morgrem": [],
      "grimmsnarl": [],
      "grimmsnarlgmax": [],
      "obstagoon": [
        "Guts"
      ],
      "perrserker": [
        "Battle Armor"
      ],
      "cursola": [],
      "sirfetchd": [],
      "mrrime": [],
      "runerigus": [],
      "milcery": [],
      "alcremie": [],
      "alcremierubycream": [],
      "alcremiematchacream": [],
      "alcremiemintcream": [],
      "alcremielemoncream": [],
      "alcremierubyswirl": [],
      "alcremiecaramelswirl": [],
      "alcremierainbowswirl": [],
      "alcremiegmax": [],
      "falinks": [
        "Battle Armor"
      ],
      "falinksmega": [],
      "pincurchin": [
        "Lightning Rod"
      ],
      "snom": [
        "Shield Dust"
      ],
      "frosmoth": [
        "Shield Dust"
      ],
      "stonjourner": [],
      "eiscue": [],
      "eiscuenoice": [],
      "indeedee": [
        "Inner Focus",
        "Synchronize"
      ],
      "indeedeef": [
        "Own Tempo",
        "Synchronize"
      ],
      "morpeko": [],
      "morpekohangry": [],
      "cufant": [],
      "copperajah": [],
      "copperajahgmax": [],
      "dracozolt": [
        "Volt Absorb",
        "Hustle"
      ],
      "arctozolt": [
        "Volt Absorb",
        "Static"
      ],
      "dracovish": [
        "Water Absorb"
      ],
      "arctovish": [
        "Water Absorb"
      ],
      "duraludon": [],
      "duraludongmax": [],
      "dreepy": [
        "Clear Body"
      ],
      "drakloak": [
        "Clear Body"
      ],
      "dragapult": [
        "Clear Body"
      ],
      "zacian": [],
      "zaciancrowned": [],
      "zamazenta": [],
      "zamazentacrowned": [],
      "urshifu": [],
      "urshifurapidstrike": [],
      "urshifugmax": [],
      "urshifurapidstrikegmax": [],
      "zarude": [],
      "zarudedada": [],
      "regieleki": [],
      "regidrago": [],
      "glastrier": [],
      "spectrier": [],
      "calyrex": [],
      "calyrexice": [],
      "calyrexshadow": [],
      "wyrdeer": [
        "Intimidate"
      ],
      "kleavor": [
        "Swarm"
      ],
      "ursaluna": [
        "Guts"
      ],
      "ursalunabloodmoon": [],
      "basculegion": [],
      "basculegionf": [],
      "sneasler": [
        "Pressure"
      ],
      "overqwil": [
        "Poison Point",
        "Swift Swim"
      ],
      "enamorus": [],
      "enamorustherian": [],
      "sprigatito": [
        "Overgrow"
      ],
      "floragato": [
        "Overgrow"
      ],
      "meowscarada": [
        "Overgrow"
      ],
      "fuecoco": [
        "Blaze"
      ],
      "crocalor": [
        "Blaze"
      ],
      "skeledirge": [
        "Blaze"
      ],
      "quaxly": [
        "Torrent"
      ],
      "quaxwell": [
        "Torrent"
      ],
      "quaquaval": [
        "Torrent"
      ],
      "lechonk": [],
      "oinkologne": [],
      "oinkolognef": [],
      "tarountula": [
        "Insomnia"
      ],
      "spidops": [
        "Insomnia"
      ],
      "nymble": [
        "Swarm"
      ],
      "lokix": [
        "Swarm"
      ],
      "pawmi": [
        "Static",
        "Natural Cure"
      ],
      "pawmo": [
        "Volt Absorb",
        "Natural Cure"
      ],
      "pawmot": [
        "Volt Absorb",
        "Natural Cure"
      ],
      "tandemaus": [
        "Run Away",
        "Pickup"
      ],
      "maushold": [],
      "mausholdfour": [],
      "fidough": [
        "Own Tempo"
      ],
      "dachsbun": [],
      "smoliv": [
        "Early Bird"
      ],
      "dolliv": [
        "Early Bird"
      ],
      "arboliva": [],
      "squawkabilly": [
        "Intimidate",
        "Hustle"
      ],
      "squawkabillyblue": [
        "Intimidate",
        "Hustle"
      ],
      "squawkabillyyellow": [
        "Intimidate",
        "Hustle"
      ],
      "squawkabillywhite": [
        "Intimidate",
        "Hustle"
      ],
      "nacli": [
        "Sturdy"
      ],
      "naclstack": [
        "Sturdy"
      ],
      "garganacl": [
        "Sturdy"
      ],
      "charcadet": [
        "Flash Fire"
      ],
      "armarouge": [
        "Flash Fire"
      ],
      "ceruledge": [
        "Flash Fire"
      ],
      "tadbulb": [
        "Own Tempo",
        "Static"
      ],
      "bellibolt": [
        "Static"
      ],
      "wattrel": [
        "Volt Absorb"
      ],
      "kilowattrel": [
        "Volt Absorb"
      ],
      "maschiff": [
        "Intimidate",
        "Run Away"
      ],
      "mabosstiff": [
        "Intimidate"
      ],
      "shroodle": [],
      "grafaiai": [],
      "bramblin": [],
      "brambleghast": [],
      "toedscool": [],
      "toedscruel": [],
      "klawf": [
        "Shell Armor"
      ],
      "capsakid": [
        "Chlorophyll",
        "Insomnia"
      ],
      "scovillain": [
        "Chlorophyll",
        "Insomnia"
      ],
      "scovillainmega": [],
      "rellor": [
        "Compound Eyes"
      ],
      "rabsca": [
        "Synchronize"
      ],
      "flittle": [],
      "espathra": [],
      "tinkatink": [
        "Own Tempo"
      ],
      "tinkatuff": [
        "Own Tempo"
      ],
      "tinkaton": [
        "Own Tempo"
      ],
      "wiglett": [],
      "wugtrio": [],
      "bombirdier": [
        "Keen Eye"
      ],
      "palafin": [],
      "palafinhero": [],
      "varoom": [],
      "revavroom": [],
      "cyclizar": [
        "Shed Skin"
      ],
      "orthworm": [],
      "glimmet": [],
      "glimmora": [],
      "glimmoramega": [],
      "greavard": [
        "Pickup"
      ],
      "houndstone": [],
      "flamigo": [],
      "cetoddle": [
        "Thick Fat"
      ],
      "cetitan": [
        "Thick Fat"
      ],
      "veluza": [],
      "dondozo": [
        "Oblivious"
      ],
      "tatsugiri": [],
      "tatsugiridroopy": [],
      "tatsugiristretchy": [],
      "tatsugiricurlymega": [],
      "tatsugiridroopymega": [],
      "tatsugiristretchymega": [],
      "annihilape": [
        "Vital Spirit",
        "Inner Focus"
      ],
      "clodsire": [
        "Poison Point",
        "Water Absorb"
      ],
      "farigiraf": [],
      "dudunsparce": [
        "Serene Grace",
        "Run Away"
      ],
      "dudunsparcethreesegment": [
        "Serene Grace",
        "Run Away"
      ],
      "kingambit": [],
      "greattusk": [],
      "screamtail": [],
      "brutebonnet": [],
      "fluttermane": [],
      "slitherwing": [],
      "sandyshocks": [],
      "irontreads": [],
      "ironbundle": [],
      "ironhands": [],
      "ironjugulis": [],
      "ironmoth": [],
      "ironthorns": [],
      "frigibax": [],
      "arctibax": [],
      "baxcalibur": [],
      "baxcaliburmega": [],
      "gimmighoul": [],
      "gholdengo": [],
      "wochien": [],
      "chienpao": [],
      "tinglu": [],
      "chiyu": [],
      "roaringmoon": [],
      "ironvaliant": [],
      "koraidon": [],
      "miraidon": [],
      "walkingwake": [],
      "ironleaves": [],
      "dipplin": [],
      "poltchageist": [],
      "poltchageistartisan": [],
      "sinistcha": [],
      "sinistchamasterpiece": [],
      "okidogi": [],
      "munkidori": [],
      "fezandipiti": [],
      "ogerpon": [],
      "ogerponhearthflame": [],
      "ogerpontealtera": [],
      "ogerponwellspringtera": [],
      "ogerponhearthflametera": [],
      "ogerponcornerstonetera": [],
      "archaludon": [
        "Sturdy"
      ],
      "hydrapple": [],
      "gougingfire": [],
      "ragingbolt": [],
      "ironboulder": [],
      "ironcrown": [],
      "terapagos": [],
      "terapagosterastal": [],
      "terapagosstellar": [],
      "pecharunt": [],
      "syclar": [
        "Compound Eyes"
      ],
      "syclant": [
        "Compound Eyes",
        "Mountaineer"
      ],
      "revenankh": [
        "Air Lock"
      ],
      "embirch": [],
      "flarelm": [
        "Rock Head",
        "Battle Armor"
      ],
      "pyroak": [
        "Rock Head",
        "Battle Armor"
      ],
      "breezi": [
        "Own Tempo"
      ],
      "fidgit": [
        "Persistent",
        "Vital Spirit"
      ],
      "rebble": [
        "Levitate"
      ],
      "tactite": [
        "Levitate"
      ],
      "stratagem": [
        "Levitate"
      ],
      "privatyke": [],
      "arghonaut": [],
      "kitsunoh": [
        "Limber"
      ],
      "cyclohm": [
        "Shield Dust",
        "Static"
      ],
      "colossoil": [
        "Rebound",
        "Guts"
      ],
      "krilowatt": [
        "Trace"
      ],
      "voodoll": [
        "Volt Absorb",
        "Lightning Rod"
      ],
      "voodoom": [
        "Volt Absorb",
        "Lightning Rod"
      ],
      "scratchet": [],
      "tomohawk": [
        "Intimidate"
      ],
      "necturine": [],
      "necturna": [],
      "mollux": [],
      "cupra": [
        "Shield Dust",
        "Keen Eye"
      ],
      "argalis": [
        "Shed Skin",
        "Compound Eyes"
      ],
      "aurumoth": [],
      "brattler": [],
      "malaconda": [],
      "cawdet": [
        "Keen Eye",
        "Volt Absorb"
      ],
      "cawmodore": [
        "Intimidate",
        "Volt Absorb"
      ],
      "volkritter": [],
      "volkraken": [],
      "snugglow": [
        "Vital Spirit"
      ],
      "plasmanta": [
        "Vital Spirit"
      ],
      "floatoy": [
        "Water Veil"
      ],
      "caimanoe": [
        "Water Veil"
      ],
      "naviathan": [
        "Water Veil"
      ],
      "crucibelle": [],
      "crucibellemega": [],
      "pluffle": [
        "Natural Cure"
      ],
      "kerfluffle": [
        "Natural Cure"
      ],
      "pajantom": [],
      "mumbao": [
        "Trace"
      ],
      "jumbao": [
        "Trace"
      ],
      "fawnifer": [
        "Overgrow"
      ],
      "electrelk": [
        "Overgrow"
      ],
      "caribolt": [
        "Overgrow"
      ],
      "smogecko": [
        "Blaze"
      ],
      "smoguana": [
        "Blaze"
      ],
      "smokomodo": [
        "Blaze"
      ],
      "swirlpool": [
        "Torrent"
      ],
      "coribalis": [
        "Torrent"
      ],
      "snaelstrom": [
        "Torrent"
      ],
      "justyke": [
        "Levitate"
      ],
      "equilibra": [
        "Levitate"
      ],
      "solotl": [
        "Vital Spirit"
      ],
      "astrolotl": [
        "Vital Spirit"
      ],
      "miasmite": [
        "Hyper Cutter"
      ],
      "miasmaw": [
        "Hyper Cutter"
      ],
      "nohface": [
        "Limber"
      ],
      "monohm": [
        "Shield Dust",
        "Static"
      ],
      "duohm": [
        "Shield Dust",
        "Static"
      ],
      "dorsoil": [
        "Oblivious",
        "Guts"
      ],
      "protowatt": [
        "Trace"
      ],
      "venomicon": [],
      "venomiconepilogue": [],
      "saharascal": [
        "Water Absorb"
      ],
      "saharaja": [
        "Water Absorb",
        "Serene Grace"
      ],
      "ababo": [],
      "scattervein": [
        "Intimidate"
      ],
      "hemogoblin": [
        "Intimidate"
      ],
      "cresceidon": [
        "Rough Skin"
      ],
      "chuggon": [
        "Shell Armor",
        "White Smoke"
      ],
      "draggalong": [
        "White Smoke"
      ],
      "chuggalong": [
        "White Smoke"
      ],
      "flox": [
        "Static",
        "Sticky Hold"
      ],
      "shox": [
        "Sticky Hold"
      ],
      "ramnarok": [],
      "ramnarokradiant": [],
      "scraptor": [
        "Early Bird"
      ],
      "obliteryx": [
        "Early Bird"
      ],
      "pokestarsmeargle": [
        "Own Tempo"
      ],
      "pokestarmt": [],
      "pokestartransport": [],
      "pokestarf002": []
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
    },
    "moveData": {
      "aircutter": {
        "category": "Special",
        "basePower": 55
      },
      "assurance": {
        "category": "Physical",
        "basePower": 50,
        "basePowerCallback": true
      },
      "aurasphere": {
        "category": "Special",
        "basePower": 90
      },
      "baddybad": {
        "category": "Special",
        "basePower": 90
      },
      "beatup": {
        "category": "Physical",
        "basePower": 10,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "blizzard": {
        "category": "Special",
        "basePower": 120,
        "onModifyMove": true
      },
      "bouncybubble": {
        "category": "Special",
        "basePower": 90
      },
      "bubble": {
        "category": "Special",
        "basePower": 20
      },
      "bulletseed": {
        "category": "Physical",
        "basePower": 10,
        "multihit": [
          2,
          5
        ]
      },
      "buzzybuzz": {
        "category": "Special",
        "basePower": 90
      },
      "chatter": {
        "category": "Special",
        "basePower": 60,
        "onModifyMove": true
      },
      "covet": {
        "category": "Physical",
        "basePower": 40
      },
      "crabhammer": {
        "category": "Physical",
        "basePower": 90
      },
      "doomdesire": {
        "category": "Special",
        "basePower": 120
      },
      "dracometeor": {
        "category": "Special",
        "basePower": 140
      },
      "dragonpulse": {
        "category": "Special",
        "basePower": 90
      },
      "drainpunch": {
        "category": "Physical",
        "basePower": 60
      },
      "energyball": {
        "category": "Special",
        "basePower": 80
      },
      "feint": {
        "category": "Physical",
        "basePower": 50
      },
      "fellstinger": {
        "category": "Physical",
        "basePower": 30
      },
      "fireblast": {
        "category": "Special",
        "basePower": 120
      },
      "firepledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "firespin": {
        "category": "Special",
        "basePower": 15
      },
      "flamethrower": {
        "category": "Special",
        "basePower": 95
      },
      "flyingpress": {
        "category": "Physical",
        "basePower": 80
      },
      "freezyfrost": {
        "category": "Special",
        "basePower": 90
      },
      "frostbreath": {
        "category": "Special",
        "basePower": 40
      },
      "furycutter": {
        "category": "Physical",
        "basePower": 10,
        "basePowerCallback": true
      },
      "futuresight": {
        "category": "Special",
        "basePower": 80
      },
      "gigadrain": {
        "category": "Special",
        "basePower": 60
      },
      "glaciallance": {
        "category": "Physical",
        "basePower": 130
      },
      "glitzyglow": {
        "category": "Special",
        "basePower": 90
      },
      "grasspledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "grassyglide": {
        "category": "Physical",
        "basePower": 70
      },
      "growth": {
        "category": "Status",
        "basePower": 0
      },
      "heatwave": {
        "category": "Special",
        "basePower": 100
      },
      "hex": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true
      },
      "hiddenpower": {
        "category": "Special",
        "basePower": 0,
        "basePowerCallback": true
      },
      "hiddenpowerbug": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerdark": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerdragon": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerelectric": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerfighting": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerfire": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerflying": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerghost": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowergrass": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerground": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerice": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerpoison": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerpsychic": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerrock": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowersteel": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerwater": {
        "category": "Special",
        "basePower": 70
      },
      "highjumpkick": {
        "category": "Physical",
        "basePower": 100
      },
      "hurricane": {
        "category": "Special",
        "basePower": 120,
        "onModifyMove": true
      },
      "hydropump": {
        "category": "Special",
        "basePower": 120
      },
      "icebeam": {
        "category": "Special",
        "basePower": 95
      },
      "iciclespear": {
        "category": "Physical",
        "basePower": 10,
        "multihit": [
          2,
          5
        ]
      },
      "incinerate": {
        "category": "Special",
        "basePower": 30
      },
      "jumpkick": {
        "category": "Physical",
        "basePower": 85
      },
      "knockoff": {
        "category": "Physical",
        "basePower": 20
      },
      "lastresort": {
        "category": "Physical",
        "basePower": 130
      },
      "leafstorm": {
        "category": "Special",
        "basePower": 140
      },
      "leechlife": {
        "category": "Physical",
        "basePower": 20
      },
      "lick": {
        "category": "Physical",
        "basePower": 20
      },
      "lowsweep": {
        "category": "Physical",
        "basePower": 60
      },
      "lusterpurge": {
        "category": "Special",
        "basePower": 70
      },
      "magmastorm": {
        "category": "Special",
        "basePower": 120
      },
      "meteormash": {
        "category": "Physical",
        "basePower": 100
      },
      "mistball": {
        "category": "Special",
        "basePower": 70
      },
      "muddywater": {
        "category": "Special",
        "basePower": 95
      },
      "multiattack": {
        "category": "Physical",
        "basePower": 90
      },
      "mysticalfire": {
        "category": "Special",
        "basePower": 65
      },
      "overheat": {
        "category": "Special",
        "basePower": 140
      },
      "paraboliccharge": {
        "category": "Special",
        "basePower": 50
      },
      "petaldance": {
        "category": "Special",
        "basePower": 90
      },
      "pinmissile": {
        "category": "Physical",
        "basePower": 14,
        "multihit": [
          2,
          5
        ]
      },
      "powergem": {
        "category": "Special",
        "basePower": 70
      },
      "rapidspin": {
        "category": "Physical",
        "basePower": 20
      },
      "rocktomb": {
        "category": "Physical",
        "basePower": 50
      },
      "sandtomb": {
        "category": "Physical",
        "basePower": 15
      },
      "sappyseed": {
        "category": "Physical",
        "basePower": 90
      },
      "sizzlyslide": {
        "category": "Physical",
        "basePower": 90
      },
      "skullbash": {
        "category": "Physical",
        "basePower": 100
      },
      "smellingsalts": {
        "category": "Physical",
        "basePower": 60,
        "basePowerCallback": true
      },
      "smog": {
        "category": "Special",
        "basePower": 20
      },
      "snore": {
        "category": "Special",
        "basePower": 40
      },
      "sparklyswirl": {
        "category": "Special",
        "basePower": 90
      },
      "stormthrow": {
        "category": "Physical",
        "basePower": 40
      },
      "strugglebug": {
        "category": "Special",
        "basePower": 30
      },
      "suckerpunch": {
        "category": "Physical",
        "basePower": 80
      },
      "surf": {
        "category": "Special",
        "basePower": 95
      },
      "synchronoise": {
        "category": "Special",
        "basePower": 70
      },
      "tackle": {
        "category": "Physical",
        "basePower": 35
      },
      "technoblast": {
        "category": "Special",
        "basePower": 85
      },
      "thief": {
        "category": "Physical",
        "basePower": 40
      },
      "thrash": {
        "category": "Physical",
        "basePower": 90
      },
      "thunder": {
        "category": "Special",
        "basePower": 120,
        "onModifyMove": true
      },
      "thunderbolt": {
        "category": "Special",
        "basePower": 95
      },
      "uproar": {
        "category": "Special",
        "basePower": 50
      },
      "vinewhip": {
        "category": "Physical",
        "basePower": 35
      },
      "wakeupslap": {
        "category": "Physical",
        "basePower": 60,
        "basePowerCallback": true
      },
      "waterpledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "watershuriken": {
        "category": "Physical",
        "basePower": 15,
        "multihit": [
          2,
          5
        ],
        "basePowerCallback": true
      },
      "whirlpool": {
        "category": "Special",
        "basePower": 15
      },
      "wickedblow": {
        "category": "Physical",
        "basePower": 80
      },
      "zippyzap": {
        "category": "Physical",
        "basePower": 50
      }
    },
    "formats": {
      "venusaur": {
        "tier": "UU"
      },
      "charizard": {
        "tier": "NU"
      },
      "blastoise": {
        "tier": "UU"
      },
      "caterpie": {
        "tier": "LC"
      },
      "metapod": {
        "tier": "NFE"
      },
      "butterfree": {
        "tier": "ZU"
      },
      "weedle": {
        "tier": "LC"
      },
      "kakuna": {
        "tier": "NFE"
      },
      "beedrill": {
        "tier": "ZU"
      },
      "pidgey": {
        "tier": "LC"
      },
      "pidgeotto": {
        "tier": "NFE"
      },
      "pidgeot": {
        "tier": "ZU"
      },
      "rattata": {
        "tier": "LC"
      },
      "raticate": {
        "tier": "ZU"
      },
      "spearow": {
        "tier": "LC"
      },
      "fearow": {
        "tier": "ZU"
      },
      "arbok": {
        "tier": "ZU"
      },
      "pichuspikyeared": {
        "tier": "ZU"
      },
      "pikachu": {
        "tier": "ZU"
      },
      "raichu": {
        "tier": "ZUBL"
      },
      "sandslash": {
        "tier": "NU"
      },
      "nidoranf": {
        "tier": "LC"
      },
      "nidorina": {
        "tier": "NFE"
      },
      "nidoqueen": {
        "tier": "NU"
      },
      "nidoranm": {
        "tier": "LC"
      },
      "nidorino": {
        "tier": "NFE"
      },
      "nidoking": {
        "tier": "UU"
      },
      "clefable": {
        "tier": "UU"
      },
      "vulpix": {
        "tier": "LC"
      },
      "ninetales": {
        "tier": "NU"
      },
      "wigglytuff": {
        "tier": "ZU"
      },
      "zubat": {
        "tier": "LC"
      },
      "golbat": {
        "tier": "ZU"
      },
      "crobat": {
        "tier": "UUBL"
      },
      "vileplume": {
        "tier": "NU"
      },
      "bellossom": {
        "tier": "PU"
      },
      "paras": {
        "tier": "LC"
      },
      "parasect": {
        "tier": "ZU"
      },
      "venomoth": {
        "tier": "NU"
      },
      "diglett": {
        "tier": "ZU"
      },
      "dugtrio": {
        "tier": "UU"
      },
      "persian": {
        "tier": "ZU"
      },
      "golduck": {
        "tier": "PU"
      },
      "primeape": {
        "tier": "UU"
      },
      "arcanine": {
        "tier": "UU"
      },
      "poliwrath": {
        "tier": "NU"
      },
      "politoed": {
        "tier": "PU"
      },
      "abra": {
        "tier": "LC"
      },
      "kadabra": {
        "tier": "PU"
      },
      "alakazam": {
        "tier": "UU"
      },
      "machop": {
        "tier": "LC"
      },
      "machoke": {
        "tier": "PU"
      },
      "machamp": {
        "tier": "Uber"
      },
      "victreebel": {
        "tier": "PU"
      },
      "tentacruel": {
        "tier": "(OU)"
      },
      "golem": {
        "tier": "NU"
      },
      "ponyta": {
        "tier": "LC"
      },
      "rapidash": {
        "tier": "PU"
      },
      "slowbro": {
        "tier": "UU"
      },
      "slowking": {
        "tier": "NU"
      },
      "magneton": {
        "tier": "NU"
      },
      "magnezone": {
        "tier": "OU"
      },
      "farfetchd": {
        "tier": "ZU"
      },
      "dodrio": {
        "tier": "NU"
      },
      "dewgong": {
        "tier": "ZU"
      },
      "muk": {
        "tier": "PU"
      },
      "shellder": {
        "tier": "LC"
      },
      "cloyster": {
        "tier": "UU"
      },
      "gastly": {
        "tier": "LC"
      },
      "haunter": {
        "tier": "NU"
      },
      "gengar": {
        "tier": "OU"
      },
      "onix": {
        "tier": "LC"
      },
      "steelix": {
        "tier": "UU"
      },
      "hypno": {
        "tier": "NU"
      },
      "krabby": {
        "tier": "LC"
      },
      "kingler": {
        "tier": "ZUBL"
      },
      "electrode": {
        "tier": "NU"
      },
      "exeggutor": {
        "tier": "UU"
      },
      "cubone": {
        "tier": "LC"
      },
      "marowak": {
        "tier": "ZUBL"
      },
      "hitmonlee": {
        "tier": "UU"
      },
      "hitmonchan": {
        "tier": "NU"
      },
      "hitmontop": {
        "tier": "UU"
      },
      "lickitung": {
        "tier": "LC"
      },
      "lickilicky": {
        "tier": "NU"
      },
      "weezing": {
        "tier": "UU"
      },
      "rhydon": {
        "tier": "PU"
      },
      "rhyperior": {
        "tier": "UU"
      },
      "chansey": {
        "tier": "UU"
      },
      "blissey": {
        "tier": "OU"
      },
      "tangela": {
        "tier": "PU"
      },
      "tangrowth": {
        "tier": "UU"
      },
      "kangaskhan": {
        "tier": "UU"
      },
      "kingdra": {
        "tier": "OU"
      },
      "goldeen": {
        "tier": "LC"
      },
      "seaking": {
        "tier": "ZU"
      },
      "staryu": {
        "tier": "LC"
      },
      "starmie": {
        "tier": "OU"
      },
      "mimejr": {
        "tier": "LC"
      },
      "mrmime": {
        "tier": "PU"
      },
      "scyther": {
        "tier": "UU"
      },
      "scizor": {
        "tier": "OU"
      },
      "smoochum": {
        "tier": "LC"
      },
      "jynx": {
        "tier": "NU"
      },
      "electabuzz": {
        "tier": "ZUBL"
      },
      "electivire": {
        "tier": "(OU)"
      },
      "magby": {
        "tier": "LC"
      },
      "magmar": {
        "tier": "PU"
      },
      "magmortar": {
        "tier": "NU"
      },
      "pinsir": {
        "tier": "PU"
      },
      "tauros": {
        "tier": "NU"
      },
      "gyarados": {
        "tier": "OU"
      },
      "lapras": {
        "tier": "ZUBL"
      },
      "ditto": {
        "tier": "ZU"
      },
      "vaporeon": {
        "tier": "(OU)"
      },
      "jolteon": {
        "tier": "(OU)"
      },
      "flareon": {
        "tier": "ZU"
      },
      "espeon": {
        "tier": "NUBL"
      },
      "umbreon": {
        "tier": "(OU)"
      },
      "leafeon": {
        "tier": "UU"
      },
      "glaceon": {
        "tier": "PU"
      },
      "porygon": {
        "tier": "LC"
      },
      "porygon2": {
        "tier": "NU"
      },
      "porygonz": {
        "tier": "UUBL"
      },
      "omanyte": {
        "tier": "LC"
      },
      "omastar": {
        "tier": "UU"
      },
      "kabuto": {
        "tier": "LC"
      },
      "kabutops": {
        "tier": "UU"
      },
      "aerodactyl": {
        "tier": "OU"
      },
      "snorlax": {
        "tier": "(OU)"
      },
      "articuno": {
        "tier": "PUBL"
      },
      "zapdos": {
        "tier": "OU"
      },
      "moltres": {
        "tier": "UU"
      },
      "dragonair": {
        "tier": "PU"
      },
      "dragonite": {
        "tier": "OU"
      },
      "mewtwo": {
        "tier": "Uber"
      },
      "mew": {
        "tier": "Uber"
      },
      "meganium": {
        "tier": "NU"
      },
      "typhlosion": {
        "tier": "NU"
      },
      "feraligatr": {
        "tier": "UU"
      },
      "furret": {
        "tier": "ZU"
      },
      "noctowl": {
        "tier": "ZU"
      },
      "ledyba": {
        "tier": "LC"
      },
      "ledian": {
        "tier": "ZU"
      },
      "ariados": {
        "tier": "ZU"
      },
      "lanturn": {
        "tier": "UU"
      },
      "togepi": {
        "tier": "LC"
      },
      "togetic": {
        "tier": "ZU"
      },
      "togekiss": {
        "tier": "(OU)"
      },
      "natu": {
        "tier": "LC"
      },
      "xatu": {
        "tier": "PU"
      },
      "ampharos": {
        "tier": "PU"
      },
      "azumarill": {
        "tier": "UU"
      },
      "sudowoodo": {
        "tier": "ZU"
      },
      "jumpluff": {
        "tier": "NU"
      },
      "ambipom": {
        "tier": "UU"
      },
      "sunflora": {
        "tier": "ZU"
      },
      "yanma": {
        "tier": "ZU"
      },
      "yanmega": {
        "tier": "UUBL"
      },
      "quagsire": {
        "tier": "PU"
      },
      "murkrow": {
        "tier": "PU"
      },
      "honchkrow": {
        "tier": "UUBL"
      },
      "misdreavus": {
        "tier": "PU"
      },
      "mismagius": {
        "tier": "UU"
      },
      "unown": {
        "tier": "ZU"
      },
      "wynaut": {
        "tier": "Uber"
      },
      "wobbuffet": {
        "tier": "Uber"
      },
      "girafarig": {
        "tier": "ZU"
      },
      "forretress": {
        "tier": "OU"
      },
      "dunsparce": {
        "tier": "ZU"
      },
      "gligar": {
        "tier": "NU",
        "doublesTier": "LC"
      },
      "gliscor": {
        "tier": "OU"
      },
      "granbull": {
        "tier": "ZU"
      },
      "qwilfish": {
        "tier": "UU"
      },
      "shuckle": {
        "tier": "ZU"
      },
      "heracross": {
        "tier": "UUBL"
      },
      "sneasel": {
        "tier": "PU"
      },
      "weavile": {
        "tier": "(OU)"
      },
      "ursaring": {
        "tier": "UU"
      },
      "magcargo": {
        "tier": "ZU"
      },
      "piloswine": {
        "tier": "NU"
      },
      "mamoswine": {
        "tier": "(OU)"
      },
      "corsola": {
        "tier": "ZU"
      },
      "remoraid": {
        "tier": "LC"
      },
      "octillery": {
        "tier": "ZU"
      },
      "delibird": {
        "tier": "ZU"
      },
      "mantyke": {
        "tier": "LC"
      },
      "mantine": {
        "tier": "PU"
      },
      "skarmory": {
        "tier": "OU"
      },
      "houndoom": {
        "tier": "UU"
      },
      "donphan": {
        "tier": "UU"
      },
      "stantler": {
        "tier": "ZU"
      },
      "smeargle": {
        "tier": "(OU)"
      },
      "miltank": {
        "tier": "UU"
      },
      "raikou": {
        "tier": "UUBL"
      },
      "entei": {
        "tier": "NUBL"
      },
      "suicune": {
        "tier": "OU"
      },
      "tyranitar": {
        "tier": "OU"
      },
      "lugia": {
        "tier": "Uber"
      },
      "hooh": {
        "tier": "Uber"
      },
      "celebi": {
        "tier": "OU"
      },
      "sceptile": {
        "tier": "UU"
      },
      "torchic": {
        "tier": "LC"
      },
      "blaziken": {
        "tier": "UU"
      },
      "swampert": {
        "tier": "OU"
      },
      "mightyena": {
        "tier": "ZU"
      },
      "zigzagoon": {
        "tier": "LC"
      },
      "linoone": {
        "tier": "PUBL"
      },
      "wurmple": {
        "tier": "LC"
      },
      "silcoon": {
        "tier": "NFE"
      },
      "beautifly": {
        "tier": "ZU"
      },
      "cascoon": {
        "tier": "NFE"
      },
      "dustox": {
        "tier": "ZU"
      },
      "ludicolo": {
        "tier": "UU"
      },
      "shiftry": {
        "tier": "NU"
      },
      "taillow": {
        "tier": "LC"
      },
      "swellow": {
        "tier": "UU"
      },
      "pelipper": {
        "tier": "ZU"
      },
      "gardevoir": {
        "tier": "NU"
      },
      "gallade": {
        "tier": "UUBL"
      },
      "masquerain": {
        "tier": "ZU"
      },
      "breloom": {
        "tier": "OU"
      },
      "vigoroth": {
        "tier": "ZU"
      },
      "slaking": {
        "tier": "ZU"
      },
      "nincada": {
        "tier": "LC"
      },
      "ninjask": {
        "tier": "(OU)"
      },
      "shedinja": {
        "tier": "ZU"
      },
      "whismur": {
        "tier": "LC"
      },
      "loudred": {
        "tier": "NFE"
      },
      "exploud": {
        "tier": "ZU"
      },
      "hariyama": {
        "tier": "UU"
      },
      "probopass": {
        "tier": "ZU"
      },
      "skitty": {
        "tier": "LC"
      },
      "delcatty": {
        "tier": "ZU"
      },
      "sableye": {
        "tier": "ZU"
      },
      "mawile": {
        "tier": "ZU"
      },
      "aron": {
        "tier": "LC"
      },
      "lairon": {
        "tier": "NFE"
      },
      "aggron": {
        "tier": "UU"
      },
      "medicham": {
        "tier": "NU"
      },
      "electrike": {
        "tier": "LC"
      },
      "manectric": {
        "tier": "NU"
      },
      "plusle": {
        "tier": "ZU"
      },
      "minun": {
        "tier": "ZU"
      },
      "volbeat": {
        "tier": "ZU"
      },
      "illumise": {
        "tier": "ZU"
      },
      "budew": {
        "tier": "LC"
      },
      "roselia": {
        "tier": "PUBL"
      },
      "roserade": {
        "tier": "OU"
      },
      "swalot": {
        "tier": "ZU"
      },
      "carvanha": {
        "tier": "LC"
      },
      "sharpedo": {
        "tier": "NU"
      },
      "wailmer": {
        "tier": "LC"
      },
      "wailord": {
        "tier": "ZU"
      },
      "camerupt": {
        "tier": "ZU"
      },
      "torkoal": {
        "tier": "PU"
      },
      "grumpig": {
        "tier": "NU"
      },
      "spinda": {
        "tier": "ZU"
      },
      "flygon": {
        "tier": "OU"
      },
      "cacturne": {
        "tier": "NU"
      },
      "altaria": {
        "tier": "UU"
      },
      "zangoose": {
        "tier": "PU"
      },
      "seviper": {
        "tier": "ZU"
      },
      "lunatone": {
        "tier": "ZU"
      },
      "solrock": {
        "tier": "PU"
      },
      "whiscash": {
        "tier": "ZU"
      },
      "crawdaunt": {
        "tier": "ZU"
      },
      "baltoy": {
        "tier": "LC"
      },
      "claydol": {
        "tier": "UU"
      },
      "lileep": {
        "tier": "LC"
      },
      "cradily": {
        "tier": "NU"
      },
      "anorith": {
        "tier": "LC"
      },
      "armaldo": {
        "tier": "PU"
      },
      "milotic": {
        "tier": "UU"
      },
      "castform": {
        "tier": "ZU"
      },
      "kecleon": {
        "tier": "ZU"
      },
      "banette": {
        "tier": "ZU"
      },
      "dusclops": {
        "tier": "NU"
      },
      "dusknoir": {
        "tier": "(OU)"
      },
      "tropius": {
        "tier": "ZU"
      },
      "chimecho": {
        "tier": "ZU"
      },
      "absol": {
        "tier": "UU"
      },
      "glalie": {
        "tier": "PU"
      },
      "froslass": {
        "tier": "UUBL"
      },
      "spheal": {
        "tier": "LC"
      },
      "sealeo": {
        "tier": "NFE"
      },
      "walrein": {
        "tier": "ZUBL"
      },
      "clamperl": {
        "tier": "ZU"
      },
      "huntail": {
        "tier": "ZU"
      },
      "gorebyss": {
        "tier": "ZUBL"
      },
      "relicanth": {
        "tier": "PU"
      },
      "luvdisc": {
        "tier": "ZU"
      },
      "shelgon": {
        "tier": "ZU"
      },
      "salamence": {
        "tier": "Uber"
      },
      "metang": {
        "tier": "PU"
      },
      "metagross": {
        "tier": "OU"
      },
      "regirock": {
        "tier": "NU"
      },
      "regice": {
        "tier": "NU"
      },
      "registeel": {
        "tier": "UU"
      },
      "latias": {
        "tier": "OU"
      },
      "latios": {
        "tier": "Uber"
      },
      "kyogre": {
        "tier": "Uber"
      },
      "groudon": {
        "tier": "Uber"
      },
      "rayquaza": {
        "tier": "Uber"
      },
      "jirachi": {
        "tier": "OU"
      },
      "deoxys": {
        "tier": "Uber"
      },
      "deoxysattack": {
        "tier": "Uber"
      },
      "deoxysdefense": {
        "tier": "Uber"
      },
      "deoxysspeed": {
        "tier": "Uber"
      },
      "torterra": {
        "tier": "UU"
      },
      "monferno": {
        "tier": "PU"
      },
      "infernape": {
        "tier": "OU"
      },
      "empoleon": {
        "tier": "OU"
      },
      "staraptor": {
        "tier": "UUBL"
      },
      "bidoof": {
        "tier": "LC"
      },
      "bibarel": {
        "tier": "ZU"
      },
      "kricketune": {
        "tier": "ZU"
      },
      "luxray": {
        "tier": "ZU"
      },
      "rampardos": {
        "tier": "ZUBL"
      },
      "bastiodon": {
        "tier": "ZU"
      },
      "burmy": {
        "tier": "LC"
      },
      "wormadam": {
        "tier": "ZU"
      },
      "wormadamsandy": {
        "tier": "ZU"
      },
      "wormadamtrash": {
        "tier": "ZU"
      },
      "mothim": {
        "tier": "ZU"
      },
      "vespiquen": {
        "tier": "ZU"
      },
      "pachirisu": {
        "tier": "ZU"
      },
      "floatzel": {
        "tier": "NU"
      },
      "cherubi": {
        "tier": "LC"
      },
      "cherrim": {
        "tier": "ZU"
      },
      "gastrodon": {
        "tier": "PU"
      },
      "drifblim": {
        "tier": "NU"
      },
      "buneary": {
        "tier": "LC"
      },
      "lopunny": {
        "tier": "ZU"
      },
      "glameow": {
        "tier": "LC"
      },
      "purugly": {
        "tier": "PU"
      },
      "skuntank": {
        "tier": "NU"
      },
      "bronzor": {
        "tier": "ZU"
      },
      "bronzong": {
        "tier": "OU"
      },
      "chatot": {
        "tier": "ZU"
      },
      "spiritomb": {
        "tier": "UU"
      },
      "gabite": {
        "tier": "PU"
      },
      "garchomp": {
        "tier": "Uber"
      },
      "lucario": {
        "tier": "OU"
      },
      "hippopotas": {
        "tier": "NUBL"
      },
      "hippowdon": {
        "tier": "OU"
      },
      "skorupi": {
        "tier": "LC"
      },
      "drapion": {
        "tier": "UU"
      },
      "toxicroak": {
        "tier": "UU"
      },
      "carnivine": {
        "tier": "ZU"
      },
      "lumineon": {
        "tier": "ZU"
      },
      "snover": {
        "tier": "NUBL"
      },
      "abomasnow": {
        "tier": "UUBL"
      },
      "rotom": {
        "tier": "UU"
      },
      "rotomheat": {
        "tier": "OU"
      },
      "rotomwash": {
        "tier": "OU"
      },
      "rotomfrost": {
        "tier": "OU"
      },
      "rotomfan": {
        "tier": "OU"
      },
      "rotommow": {
        "tier": "OU"
      },
      "uxie": {
        "tier": "UU"
      },
      "mesprit": {
        "tier": "UU"
      },
      "azelf": {
        "tier": "OU"
      },
      "dialga": {
        "tier": "Uber"
      },
      "palkia": {
        "tier": "Uber"
      },
      "heatran": {
        "tier": "OU"
      },
      "regigigas": {
        "tier": "PU"
      },
      "giratina": {
        "tier": "Uber"
      },
      "giratinaorigin": {},
      "cresselia": {
        "tier": "UUBL"
      },
      "phione": {
        "tier": "ZU"
      },
      "manaphy": {
        "tier": "Uber"
      },
      "darkrai": {
        "tier": "Uber"
      },
      "shaymin": {
        "tier": "(OU)"
      },
      "shayminsky": {
        "tier": "Uber"
      },
      "arceus": {
        "tier": "AG"
      }
    },
    "baseStats": {
      "butterfree": {
        "hp": 60,
        "atk": 45,
        "def": 50,
        "spa": 80,
        "spd": 80,
        "spe": 70
      },
      "beedrill": {
        "hp": 65,
        "atk": 80,
        "def": 40,
        "spa": 45,
        "spd": 80,
        "spe": 75
      },
      "pidgeot": {
        "hp": 83,
        "atk": 80,
        "def": 75,
        "spa": 70,
        "spd": 70,
        "spe": 91
      },
      "arbok": {
        "hp": 60,
        "atk": 85,
        "def": 69,
        "spa": 65,
        "spd": 79,
        "spe": 80
      },
      "pikachu": {
        "hp": 35,
        "atk": 55,
        "def": 30,
        "spa": 50,
        "spd": 40,
        "spe": 90
      },
      "raichu": {
        "hp": 60,
        "atk": 90,
        "def": 55,
        "spa": 90,
        "spd": 80,
        "spe": 100
      },
      "nidoqueen": {
        "hp": 90,
        "atk": 82,
        "def": 87,
        "spa": 75,
        "spd": 85,
        "spe": 76
      },
      "nidoking": {
        "hp": 81,
        "atk": 92,
        "def": 77,
        "spa": 85,
        "spd": 75,
        "spe": 85
      },
      "clefable": {
        "hp": 95,
        "atk": 70,
        "def": 73,
        "spa": 85,
        "spd": 90,
        "spe": 60
      },
      "wigglytuff": {
        "hp": 140,
        "atk": 70,
        "def": 45,
        "spa": 75,
        "spd": 50,
        "spe": 45
      },
      "vileplume": {
        "hp": 75,
        "atk": 80,
        "def": 85,
        "spa": 100,
        "spd": 90,
        "spe": 50
      },
      "dugtrio": {
        "hp": 35,
        "atk": 80,
        "def": 50,
        "spa": 50,
        "spd": 70,
        "spe": 120
      },
      "poliwrath": {
        "hp": 90,
        "atk": 85,
        "def": 95,
        "spa": 70,
        "spd": 90,
        "spe": 70
      },
      "alakazam": {
        "hp": 55,
        "atk": 50,
        "def": 45,
        "spa": 135,
        "spd": 85,
        "spe": 120
      },
      "alakazammega": {
        "hp": 55,
        "atk": 50,
        "def": 65,
        "spa": 175,
        "spd": 95,
        "spe": 150
      },
      "victreebel": {
        "hp": 80,
        "atk": 105,
        "def": 65,
        "spa": 100,
        "spd": 60,
        "spe": 70
      },
      "golem": {
        "hp": 80,
        "atk": 110,
        "def": 130,
        "spa": 55,
        "spd": 65,
        "spe": 45
      },
      "farfetchd": {
        "hp": 52,
        "atk": 65,
        "def": 55,
        "spa": 58,
        "spd": 62,
        "spe": 60
      },
      "dodrio": {
        "hp": 60,
        "atk": 110,
        "def": 70,
        "spa": 60,
        "spd": 60,
        "spe": 100
      },
      "electrode": {
        "hp": 60,
        "atk": 50,
        "def": 70,
        "spa": 80,
        "spd": 80,
        "spe": 140
      },
      "exeggutor": {
        "hp": 95,
        "atk": 95,
        "def": 85,
        "spa": 125,
        "spd": 65,
        "spe": 55
      },
      "noctowl": {
        "hp": 100,
        "atk": 50,
        "def": 50,
        "spa": 76,
        "spd": 96,
        "spe": 70
      },
      "ariados": {
        "hp": 70,
        "atk": 90,
        "def": 70,
        "spa": 60,
        "spd": 60,
        "spe": 40
      },
      "ampharos": {
        "hp": 90,
        "atk": 75,
        "def": 75,
        "spa": 115,
        "spd": 90,
        "spe": 55
      },
      "bellossom": {
        "hp": 75,
        "atk": 80,
        "def": 85,
        "spa": 90,
        "spd": 100,
        "spe": 50
      },
      "azumarill": {
        "hp": 100,
        "atk": 50,
        "def": 80,
        "spa": 50,
        "spd": 80,
        "spe": 50
      },
      "jumpluff": {
        "hp": 75,
        "atk": 55,
        "def": 70,
        "spa": 55,
        "spd": 85,
        "spe": 110
      },
      "qwilfish": {
        "hp": 65,
        "atk": 95,
        "def": 75,
        "spa": 55,
        "spd": 55,
        "spe": 85
      },
      "magcargo": {
        "hp": 50,
        "atk": 50,
        "def": 120,
        "spa": 80,
        "spd": 80,
        "spe": 30
      },
      "corsola": {
        "hp": 55,
        "atk": 55,
        "def": 85,
        "spa": 65,
        "spd": 85,
        "spe": 35
      },
      "mantine": {
        "hp": 65,
        "atk": 40,
        "def": 70,
        "spa": 80,
        "spd": 140,
        "spe": 70
      },
      "beautifly": {
        "hp": 60,
        "atk": 70,
        "def": 50,
        "spa": 90,
        "spd": 50,
        "spe": 65
      },
      "swellow": {
        "hp": 60,
        "atk": 85,
        "def": 60,
        "spa": 50,
        "spd": 50,
        "spe": 125
      },
      "pelipper": {
        "hp": 60,
        "atk": 50,
        "def": 100,
        "spa": 85,
        "spd": 70,
        "spe": 65
      },
      "masquerain": {
        "hp": 70,
        "atk": 60,
        "def": 62,
        "spa": 80,
        "spd": 82,
        "spe": 60
      },
      "exploud": {
        "hp": 104,
        "atk": 91,
        "def": 63,
        "spa": 91,
        "spd": 63,
        "spe": 68
      },
      "delcatty": {
        "hp": 70,
        "atk": 65,
        "def": 65,
        "spa": 55,
        "spd": 55,
        "spe": 70
      },
      "volbeat": {
        "hp": 65,
        "atk": 73,
        "def": 55,
        "spa": 47,
        "spd": 75,
        "spe": 85
      },
      "illumise": {
        "hp": 65,
        "atk": 47,
        "def": 55,
        "spa": 73,
        "spd": 75,
        "spe": 85
      },
      "lunatone": {
        "hp": 70,
        "atk": 55,
        "def": 65,
        "spa": 95,
        "spd": 85,
        "spe": 70
      },
      "solrock": {
        "hp": 70,
        "atk": 95,
        "def": 85,
        "spa": 55,
        "spd": 65,
        "spe": 70
      },
      "chimecho": {
        "hp": 65,
        "atk": 50,
        "def": 70,
        "spa": 95,
        "spd": 80,
        "spe": 65
      },
      "staraptor": {
        "hp": 85,
        "atk": 120,
        "def": 70,
        "spa": 50,
        "spd": 50,
        "spe": 100
      },
      "roserade": {
        "hp": 60,
        "atk": 70,
        "def": 55,
        "spa": 125,
        "spd": 105,
        "spe": 90
      },
      "cresselia": {
        "hp": 120,
        "atk": 70,
        "def": 120,
        "spa": 75,
        "spd": 130,
        "spe": 85
      },
      "stoutland": {
        "hp": 85,
        "atk": 100,
        "def": 90,
        "spa": 45,
        "spd": 90,
        "spe": 80
      },
      "unfezant": {
        "hp": 80,
        "atk": 105,
        "def": 80,
        "spa": 65,
        "spd": 55,
        "spe": 93
      },
      "gigalith": {
        "hp": 85,
        "atk": 135,
        "def": 130,
        "spa": 60,
        "spd": 70,
        "spe": 25
      },
      "woobat": {
        "hp": 55,
        "atk": 45,
        "def": 43,
        "spa": 55,
        "spd": 43,
        "spe": 72
      },
      "seismitoad": {
        "hp": 105,
        "atk": 85,
        "def": 75,
        "spa": 85,
        "spd": 75,
        "spe": 74
      },
      "leavanny": {
        "hp": 75,
        "atk": 103,
        "def": 80,
        "spa": 70,
        "spd": 70,
        "spe": 92
      },
      "scolipede": {
        "hp": 60,
        "atk": 90,
        "def": 89,
        "spa": 55,
        "spd": 69,
        "spe": 112
      },
      "krookodile": {
        "hp": 95,
        "atk": 117,
        "def": 70,
        "spa": 65,
        "spd": 70,
        "spe": 92
      },
      "crustle": {
        "hp": 70,
        "atk": 95,
        "def": 125,
        "spa": 65,
        "spd": 75,
        "spe": 45
      },
      "beartic": {
        "hp": 95,
        "atk": 110,
        "def": 80,
        "spa": 70,
        "spd": 80,
        "spe": 50
      },
      "cryogonal": {
        "hp": 70,
        "atk": 50,
        "def": 30,
        "spa": 95,
        "spd": 135,
        "spe": 105
      },
      "aegislash": {
        "hp": 60,
        "atk": 50,
        "def": 150,
        "spa": 50,
        "spd": 150,
        "spe": 60
      },
      "aegislashblade": {
        "hp": 60,
        "atk": 150,
        "def": 50,
        "spa": 150,
        "spd": 50,
        "spe": 60
      },
      "zacian": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zaciancrowned": {
        "hp": 92,
        "atk": 170,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 148
      },
      "zamazenta": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zamazentacrowned": {
        "hp": 92,
        "atk": 130,
        "def": 145,
        "spa": 80,
        "spd": 145,
        "spe": 128
      },
      "pyroak": {
        "hp": 120,
        "atk": 70,
        "def": 105,
        "spa": 95,
        "spd": 90,
        "spe": 60
      },
      "kitsunoh": {
        "hp": 80,
        "atk": 103,
        "def": 85,
        "spa": 55,
        "spd": 80,
        "spe": 110
      },
      "voodoom": {
        "hp": 90,
        "atk": 85,
        "def": 80,
        "spa": 105,
        "spd": 80,
        "spe": 110
      },
      "necturna": {
        "hp": 64,
        "atk": 120,
        "def": 100,
        "spa": 85,
        "spd": 120,
        "spe": 81
      },
      "crucibellemega": {
        "hp": 106,
        "atk": 135,
        "def": 75,
        "spa": 85,
        "spd": 125,
        "spe": 114
      }
    },
    "abilities": {
      "bulbasaur": [
        "Overgrow"
      ],
      "ivysaur": [
        "Overgrow"
      ],
      "venusaur": [
        "Overgrow"
      ],
      "venusaurgmax": [
        "Overgrow"
      ],
      "charmander": [
        "Blaze"
      ],
      "charmeleon": [
        "Blaze"
      ],
      "charizard": [
        "Blaze"
      ],
      "charizardmegax": [],
      "charizardgmax": [
        "Blaze"
      ],
      "squirtle": [
        "Torrent"
      ],
      "wartortle": [
        "Torrent"
      ],
      "blastoise": [
        "Torrent"
      ],
      "blastoisemega": [],
      "blastoisegmax": [
        "Torrent"
      ],
      "caterpie": [
        "Shield Dust"
      ],
      "butterfree": [
        "Compound Eyes"
      ],
      "butterfreegmax": [
        "Compound Eyes"
      ],
      "weedle": [
        "Shield Dust"
      ],
      "beedrill": [
        "Swarm"
      ],
      "pidgey": [
        "Keen Eye",
        "Tangled Feet"
      ],
      "pidgeotto": [
        "Keen Eye",
        "Tangled Feet"
      ],
      "pidgeot": [
        "Keen Eye",
        "Tangled Feet"
      ],
      "rattata": [
        "Run Away",
        "Guts"
      ],
      "rattataalola": [
        "Gluttony",
        "Hustle"
      ],
      "raticate": [
        "Run Away",
        "Guts"
      ],
      "raticatealola": [
        "Gluttony",
        "Hustle"
      ],
      "spearow": [
        "Keen Eye"
      ],
      "fearow": [
        "Keen Eye"
      ],
      "ekans": [
        "Intimidate",
        "Shed Skin"
      ],
      "arbok": [
        "Intimidate",
        "Shed Skin"
      ],
      "pikachu": [
        "Static"
      ],
      "pikachuoriginal": [
        "Static"
      ],
      "pikachuhoenn": [
        "Static"
      ],
      "pikachusinnoh": [
        "Static"
      ],
      "pikachuunova": [
        "Static"
      ],
      "pikachukalos": [
        "Static"
      ],
      "pikachualola": [
        "Static"
      ],
      "pikachupartner": [
        "Static"
      ],
      "pikachustarter": [
        "Static"
      ],
      "pikachugmax": [
        "Static"
      ],
      "pikachuworld": [
        "Static"
      ],
      "raichu": [
        "Static"
      ],
      "raichualola": [],
      "raichumegax": [],
      "sandshrew": [
        "Sand Veil"
      ],
      "sandshrewalola": [
        "Snow Cloak"
      ],
      "sandslash": [
        "Sand Veil"
      ],
      "sandslashalola": [
        "Snow Cloak"
      ],
      "nidoranf": [
        "Poison Point",
        "Rivalry"
      ],
      "nidorina": [
        "Poison Point",
        "Rivalry"
      ],
      "nidoqueen": [
        "Poison Point",
        "Rivalry"
      ],
      "nidoranm": [
        "Poison Point",
        "Rivalry"
      ],
      "nidorino": [
        "Poison Point",
        "Rivalry"
      ],
      "nidoking": [
        "Poison Point",
        "Rivalry"
      ],
      "clefairy": [
        "Cute Charm",
        "Magic Guard"
      ],
      "clefable": [
        "Cute Charm",
        "Magic Guard"
      ],
      "clefablemega": [],
      "vulpix": [
        "Flash Fire"
      ],
      "vulpixalola": [
        "Snow Cloak"
      ],
      "ninetales": [
        "Flash Fire"
      ],
      "ninetalesalola": [
        "Snow Cloak"
      ],
      "jigglypuff": [
        "Cute Charm"
      ],
      "wigglytuff": [
        "Cute Charm"
      ],
      "zubat": [
        "Inner Focus"
      ],
      "golbat": [
        "Inner Focus"
      ],
      "oddish": [
        "Chlorophyll"
      ],
      "gloom": [
        "Chlorophyll"
      ],
      "vileplume": [
        "Chlorophyll"
      ],
      "paras": [
        "Effect Spore",
        "Dry Skin"
      ],
      "parasect": [
        "Effect Spore",
        "Dry Skin"
      ],
      "venonat": [
        "Compound Eyes",
        "Tinted Lens"
      ],
      "venomoth": [
        "Shield Dust",
        "Tinted Lens"
      ],
      "diglett": [
        "Sand Veil",
        "Arena Trap"
      ],
      "diglettalola": [
        "Sand Veil"
      ],
      "dugtrio": [
        "Sand Veil",
        "Arena Trap"
      ],
      "dugtrioalola": [
        "Sand Veil"
      ],
      "meowth": [
        "Pickup",
        "Technician"
      ],
      "meowthalola": [
        "Pickup",
        "Technician"
      ],
      "meowthgalar": [
        "Pickup"
      ],
      "meowthgmax": [
        "Pickup",
        "Technician"
      ],
      "persian": [
        "Limber",
        "Technician"
      ],
      "persianalola": [
        "Technician"
      ],
      "psyduck": [
        "Damp",
        "Cloud Nine"
      ],
      "golduck": [
        "Damp",
        "Cloud Nine"
      ],
      "mankey": [
        "Vital Spirit",
        "Anger Point"
      ],
      "primeape": [
        "Vital Spirit",
        "Anger Point"
      ],
      "growlithe": [
        "Intimidate",
        "Flash Fire"
      ],
      "growlithehisui": [
        "Intimidate",
        "Flash Fire"
      ],
      "arcanine": [
        "Intimidate",
        "Flash Fire"
      ],
      "arcaninehisui": [
        "Intimidate",
        "Flash Fire"
      ],
      "poliwag": [
        "Water Absorb",
        "Damp"
      ],
      "poliwhirl": [
        "Water Absorb",
        "Damp"
      ],
      "poliwrath": [
        "Water Absorb",
        "Damp"
      ],
      "abra": [
        "Synchronize",
        "Inner Focus"
      ],
      "kadabra": [
        "Synchronize",
        "Inner Focus"
      ],
      "alakazam": [
        "Synchronize",
        "Inner Focus"
      ],
      "machop": [
        "Guts",
        "No Guard"
      ],
      "machoke": [
        "Guts",
        "No Guard"
      ],
      "machamp": [
        "Guts",
        "No Guard"
      ],
      "machampgmax": [
        "Guts",
        "No Guard"
      ],
      "bellsprout": [
        "Chlorophyll"
      ],
      "weepinbell": [
        "Chlorophyll"
      ],
      "victreebel": [
        "Chlorophyll"
      ],
      "victreebelmega": [],
      "tentacool": [
        "Clear Body",
        "Liquid Ooze"
      ],
      "tentacruel": [
        "Clear Body",
        "Liquid Ooze"
      ],
      "geodude": [
        "Rock Head",
        "Sturdy"
      ],
      "geodudealola": [
        "Magnet Pull",
        "Sturdy"
      ],
      "graveler": [
        "Rock Head",
        "Sturdy"
      ],
      "graveleralola": [
        "Magnet Pull",
        "Sturdy"
      ],
      "golem": [
        "Rock Head",
        "Sturdy"
      ],
      "golemalola": [
        "Magnet Pull",
        "Sturdy"
      ],
      "ponyta": [
        "Run Away",
        "Flash Fire"
      ],
      "ponytagalar": [
        "Run Away"
      ],
      "rapidash": [
        "Run Away",
        "Flash Fire"
      ],
      "rapidashgalar": [
        "Run Away"
      ],
      "slowpoke": [
        "Oblivious",
        "Own Tempo"
      ],
      "slowpokegalar": [
        "Gluttony",
        "Own Tempo"
      ],
      "slowbro": [
        "Oblivious",
        "Own Tempo"
      ],
      "slowbrogalar": [
        "Own Tempo"
      ],
      "magnemite": [
        "Magnet Pull",
        "Sturdy"
      ],
      "magneton": [
        "Magnet Pull",
        "Sturdy"
      ],
      "farfetchd": [
        "Keen Eye",
        "Inner Focus"
      ],
      "farfetchdgalar": [
        "Steadfast"
      ],
      "doduo": [
        "Run Away",
        "Early Bird"
      ],
      "dodrio": [
        "Run Away",
        "Early Bird"
      ],
      "seel": [
        "Thick Fat",
        "Hydration"
      ],
      "dewgong": [
        "Thick Fat",
        "Hydration"
      ],
      "grimer": [
        "Stench",
        "Sticky Hold"
      ],
      "grimeralola": [
        "Gluttony"
      ],
      "muk": [
        "Stench",
        "Sticky Hold"
      ],
      "mukalola": [
        "Gluttony"
      ],
      "shellder": [
        "Shell Armor",
        "Skill Link"
      ],
      "cloyster": [
        "Shell Armor",
        "Skill Link"
      ],
      "gengar": [
        "Levitate"
      ],
      "gengargmax": [],
      "onix": [
        "Rock Head",
        "Sturdy"
      ],
      "drowzee": [
        "Insomnia",
        "Forewarn"
      ],
      "hypno": [
        "Insomnia",
        "Forewarn"
      ],
      "krabby": [
        "Hyper Cutter",
        "Shell Armor"
      ],
      "kingler": [
        "Hyper Cutter",
        "Shell Armor"
      ],
      "kinglergmax": [
        "Hyper Cutter",
        "Shell Armor"
      ],
      "voltorb": [
        "Soundproof",
        "Static"
      ],
      "voltorbhisui": [
        "Soundproof",
        "Static"
      ],
      "electrode": [
        "Soundproof",
        "Static"
      ],
      "electrodehisui": [
        "Soundproof",
        "Static"
      ],
      "exeggcute": [
        "Chlorophyll"
      ],
      "exeggutor": [
        "Chlorophyll"
      ],
      "exeggutoralola": [
        "Frisk"
      ],
      "cubone": [
        "Rock Head",
        "Lightning Rod"
      ],
      "marowak": [
        "Rock Head",
        "Lightning Rod"
      ],
      "marowakalola": [
        "Lightning Rod"
      ],
      "hitmonlee": [
        "Limber",
        "Reckless"
      ],
      "hitmonchan": [
        "Keen Eye",
        "Iron Fist"
      ],
      "lickitung": [
        "Own Tempo",
        "Oblivious"
      ],
      "koffing": [
        "Levitate"
      ],
      "weezing": [
        "Levitate"
      ],
      "weezinggalar": [
        "Levitate"
      ],
      "rhyhorn": [
        "Lightning Rod",
        "Rock Head"
      ],
      "rhydon": [
        "Lightning Rod",
        "Rock Head"
      ],
      "chansey": [
        "Natural Cure",
        "Serene Grace"
      ],
      "tangela": [
        "Chlorophyll",
        "Leaf Guard"
      ],
      "kangaskhan": [
        "Early Bird",
        "Scrappy"
      ],
      "kangaskhanmega": [],
      "horsea": [
        "Swift Swim",
        "Sniper"
      ],
      "seadra": [
        "Poison Point",
        "Sniper"
      ],
      "goldeen": [
        "Swift Swim",
        "Water Veil"
      ],
      "seaking": [
        "Swift Swim",
        "Water Veil"
      ],
      "staryu": [
        "Illuminate",
        "Natural Cure"
      ],
      "starmie": [
        "Illuminate",
        "Natural Cure"
      ],
      "mrmime": [
        "Soundproof",
        "Filter"
      ],
      "mrmimegalar": [
        "Vital Spirit"
      ],
      "scyther": [
        "Swarm",
        "Technician"
      ],
      "jynx": [
        "Oblivious",
        "Forewarn"
      ],
      "electabuzz": [
        "Static"
      ],
      "magmar": [
        "Flame Body"
      ],
      "pinsir": [
        "Hyper Cutter",
        "Mold Breaker"
      ],
      "pinsirmega": [],
      "tauros": [
        "Intimidate",
        "Anger Point"
      ],
      "taurospaldeacombat": [
        "Intimidate",
        "Anger Point"
      ],
      "taurospaldeablaze": [
        "Intimidate",
        "Anger Point"
      ],
      "taurospaldeaaqua": [
        "Intimidate",
        "Anger Point"
      ],
      "magikarp": [
        "Swift Swim"
      ],
      "gyarados": [
        "Intimidate"
      ],
      "lapras": [
        "Water Absorb",
        "Shell Armor"
      ],
      "laprasgmax": [
        "Water Absorb",
        "Shell Armor"
      ],
      "ditto": [
        "Limber"
      ],
      "eevee": [
        "Run Away",
        "Adaptability"
      ],
      "eeveestarter": [
        "Run Away",
        "Adaptability"
      ],
      "eeveegmax": [
        "Run Away",
        "Adaptability"
      ],
      "vaporeon": [
        "Water Absorb"
      ],
      "jolteon": [
        "Volt Absorb"
      ],
      "flareon": [
        "Flash Fire"
      ],
      "porygon": [
        "Trace",
        "Download"
      ],
      "omanyte": [
        "Swift Swim",
        "Shell Armor"
      ],
      "omastar": [
        "Swift Swim",
        "Shell Armor"
      ],
      "kabuto": [
        "Swift Swim",
        "Battle Armor"
      ],
      "kabutops": [
        "Swift Swim",
        "Battle Armor"
      ],
      "aerodactyl": [
        "Rock Head",
        "Pressure"
      ],
      "aerodactylmega": [],
      "snorlax": [
        "Immunity",
        "Thick Fat"
      ],
      "snorlaxgmax": [
        "Immunity",
        "Thick Fat"
      ],
      "articuno": [
        "Pressure"
      ],
      "articunogalar": [],
      "zapdos": [
        "Pressure"
      ],
      "zapdosgalar": [],
      "moltres": [
        "Pressure"
      ],
      "moltresgalar": [],
      "dratini": [
        "Shed Skin"
      ],
      "dragonair": [
        "Shed Skin"
      ],
      "dragonite": [
        "Inner Focus"
      ],
      "dragonitemega": [],
      "mewtwo": [
        "Pressure"
      ],
      "chikorita": [
        "Overgrow"
      ],
      "bayleef": [
        "Overgrow"
      ],
      "meganium": [
        "Overgrow"
      ],
      "meganiummega": [],
      "cyndaquil": [
        "Blaze"
      ],
      "quilava": [
        "Blaze"
      ],
      "typhlosion": [
        "Blaze"
      ],
      "typhlosionhisui": [
        "Blaze"
      ],
      "totodile": [
        "Torrent"
      ],
      "croconaw": [
        "Torrent"
      ],
      "feraligatr": [
        "Torrent"
      ],
      "feraligatrmega": [],
      "sentret": [
        "Run Away",
        "Keen Eye"
      ],
      "furret": [
        "Run Away",
        "Keen Eye"
      ],
      "hoothoot": [
        "Insomnia",
        "Keen Eye"
      ],
      "noctowl": [
        "Insomnia",
        "Keen Eye"
      ],
      "ledyba": [
        "Swarm",
        "Early Bird"
      ],
      "ledian": [
        "Swarm",
        "Early Bird"
      ],
      "spinarak": [
        "Swarm",
        "Insomnia"
      ],
      "ariados": [
        "Swarm",
        "Insomnia"
      ],
      "crobat": [
        "Inner Focus"
      ],
      "chinchou": [
        "Volt Absorb",
        "Illuminate"
      ],
      "lanturn": [
        "Volt Absorb",
        "Illuminate"
      ],
      "pichu": [
        "Static"
      ],
      "cleffa": [
        "Cute Charm",
        "Magic Guard"
      ],
      "igglybuff": [
        "Cute Charm"
      ],
      "togepi": [
        "Hustle",
        "Serene Grace"
      ],
      "togetic": [
        "Hustle",
        "Serene Grace"
      ],
      "natu": [
        "Synchronize",
        "Early Bird"
      ],
      "xatu": [
        "Synchronize",
        "Early Bird"
      ],
      "mareep": [
        "Static"
      ],
      "flaaffy": [
        "Static"
      ],
      "ampharos": [
        "Static"
      ],
      "bellossom": [
        "Chlorophyll"
      ],
      "marill": [
        "Thick Fat",
        "Huge Power"
      ],
      "azumarill": [
        "Thick Fat",
        "Huge Power"
      ],
      "sudowoodo": [
        "Sturdy",
        "Rock Head"
      ],
      "politoed": [
        "Water Absorb",
        "Damp"
      ],
      "hoppip": [
        "Chlorophyll",
        "Leaf Guard"
      ],
      "skiploom": [
        "Chlorophyll",
        "Leaf Guard"
      ],
      "jumpluff": [
        "Chlorophyll",
        "Leaf Guard"
      ],
      "aipom": [
        "Run Away",
        "Pickup"
      ],
      "sunkern": [
        "Chlorophyll",
        "Solar Power"
      ],
      "sunflora": [
        "Chlorophyll",
        "Solar Power"
      ],
      "yanma": [
        "Speed Boost",
        "Compound Eyes"
      ],
      "wooper": [
        "Damp",
        "Water Absorb"
      ],
      "wooperpaldea": [
        "Poison Point",
        "Water Absorb"
      ],
      "quagsire": [
        "Damp",
        "Water Absorb"
      ],
      "espeon": [
        "Synchronize"
      ],
      "umbreon": [
        "Synchronize"
      ],
      "murkrow": [
        "Insomnia",
        "Super Luck"
      ],
      "slowking": [
        "Oblivious",
        "Own Tempo"
      ],
      "slowkinggalar": [
        "Own Tempo"
      ],
      "wobbuffet": [
        "Shadow Tag"
      ],
      "girafarig": [
        "Inner Focus",
        "Early Bird"
      ],
      "pineco": [
        "Sturdy"
      ],
      "forretress": [
        "Sturdy"
      ],
      "dunsparce": [
        "Serene Grace",
        "Run Away"
      ],
      "gligar": [
        "Hyper Cutter",
        "Sand Veil"
      ],
      "steelix": [
        "Rock Head",
        "Sturdy"
      ],
      "steelixmega": [],
      "snubbull": [
        "Intimidate",
        "Run Away"
      ],
      "granbull": [
        "Intimidate",
        "Quick Feet"
      ],
      "qwilfish": [
        "Poison Point",
        "Swift Swim"
      ],
      "qwilfishhisui": [
        "Poison Point",
        "Swift Swim"
      ],
      "scizor": [
        "Swarm",
        "Technician"
      ],
      "shuckle": [
        "Sturdy",
        "Gluttony"
      ],
      "heracross": [
        "Swarm",
        "Guts"
      ],
      "sneasel": [
        "Inner Focus",
        "Keen Eye"
      ],
      "sneaselhisui": [
        "Inner Focus",
        "Keen Eye"
      ],
      "teddiursa": [
        "Pickup",
        "Quick Feet"
      ],
      "ursaring": [
        "Guts",
        "Quick Feet"
      ],
      "slugma": [
        "Magma Armor",
        "Flame Body"
      ],
      "magcargo": [
        "Magma Armor",
        "Flame Body"
      ],
      "swinub": [
        "Oblivious",
        "Snow Cloak"
      ],
      "piloswine": [
        "Oblivious",
        "Snow Cloak"
      ],
      "corsola": [
        "Hustle",
        "Natural Cure"
      ],
      "corsolagalar": [],
      "remoraid": [
        "Hustle",
        "Sniper"
      ],
      "octillery": [
        "Suction Cups",
        "Sniper"
      ],
      "delibird": [
        "Vital Spirit",
        "Hustle"
      ],
      "mantine": [
        "Swift Swim",
        "Water Absorb"
      ],
      "skarmory": [
        "Keen Eye",
        "Sturdy"
      ],
      "skarmorymega": [],
      "houndour": [
        "Early Bird",
        "Flash Fire"
      ],
      "houndoom": [
        "Early Bird",
        "Flash Fire"
      ],
      "kingdra": [
        "Swift Swim",
        "Sniper"
      ],
      "phanpy": [
        "Pickup"
      ],
      "donphan": [
        "Sturdy"
      ],
      "porygon2": [
        "Trace",
        "Download"
      ],
      "stantler": [
        "Intimidate",
        "Frisk"
      ],
      "smeargle": [
        "Own Tempo",
        "Technician"
      ],
      "tyrogue": [
        "Guts",
        "Steadfast"
      ],
      "hitmontop": [
        "Intimidate",
        "Technician"
      ],
      "smoochum": [
        "Oblivious",
        "Forewarn"
      ],
      "elekid": [
        "Static"
      ],
      "magby": [
        "Flame Body"
      ],
      "miltank": [
        "Thick Fat",
        "Scrappy"
      ],
      "blissey": [
        "Natural Cure",
        "Serene Grace"
      ],
      "raikou": [
        "Pressure"
      ],
      "entei": [
        "Pressure"
      ],
      "suicune": [
        "Pressure"
      ],
      "larvitar": [
        "Guts"
      ],
      "tyranitar": [
        "Sand Stream"
      ],
      "lugia": [
        "Pressure"
      ],
      "hooh": [
        "Pressure"
      ],
      "treecko": [
        "Overgrow"
      ],
      "grovyle": [
        "Overgrow"
      ],
      "sceptile": [
        "Overgrow"
      ],
      "torchic": [
        "Blaze"
      ],
      "combusken": [
        "Blaze"
      ],
      "blaziken": [
        "Blaze"
      ],
      "mudkip": [
        "Torrent"
      ],
      "marshtomp": [
        "Torrent"
      ],
      "swampert": [
        "Torrent"
      ],
      "poochyena": [
        "Run Away",
        "Quick Feet"
      ],
      "mightyena": [
        "Intimidate",
        "Quick Feet"
      ],
      "zigzagoon": [
        "Pickup",
        "Gluttony"
      ],
      "zigzagoongalar": [
        "Pickup",
        "Gluttony"
      ],
      "linoone": [
        "Pickup",
        "Gluttony"
      ],
      "linoonegalar": [
        "Pickup",
        "Gluttony"
      ],
      "wurmple": [
        "Shield Dust"
      ],
      "beautifly": [
        "Swarm"
      ],
      "dustox": [
        "Shield Dust"
      ],
      "lotad": [
        "Swift Swim",
        "Rain Dish"
      ],
      "lombre": [
        "Swift Swim",
        "Rain Dish"
      ],
      "ludicolo": [
        "Swift Swim",
        "Rain Dish"
      ],
      "seedot": [
        "Chlorophyll",
        "Early Bird"
      ],
      "nuzleaf": [
        "Chlorophyll",
        "Early Bird"
      ],
      "shiftry": [
        "Chlorophyll",
        "Early Bird"
      ],
      "taillow": [
        "Guts"
      ],
      "swellow": [
        "Guts"
      ],
      "wingull": [
        "Keen Eye"
      ],
      "pelipper": [
        "Keen Eye"
      ],
      "ralts": [
        "Synchronize",
        "Trace"
      ],
      "kirlia": [
        "Synchronize",
        "Trace"
      ],
      "gardevoir": [
        "Synchronize",
        "Trace"
      ],
      "gardevoirmega": [],
      "surskit": [
        "Swift Swim"
      ],
      "masquerain": [
        "Intimidate"
      ],
      "shroomish": [
        "Effect Spore",
        "Poison Heal"
      ],
      "breloom": [
        "Effect Spore",
        "Poison Heal"
      ],
      "nincada": [
        "Compound Eyes"
      ],
      "ninjask": [
        "Speed Boost"
      ],
      "whismur": [
        "Soundproof"
      ],
      "loudred": [
        "Soundproof"
      ],
      "exploud": [
        "Soundproof"
      ],
      "makuhita": [
        "Thick Fat",
        "Guts"
      ],
      "hariyama": [
        "Thick Fat",
        "Guts"
      ],
      "azurill": [
        "Thick Fat",
        "Huge Power"
      ],
      "nosepass": [
        "Sturdy",
        "Magnet Pull"
      ],
      "skitty": [
        "Cute Charm",
        "Normalize"
      ],
      "delcatty": [
        "Cute Charm",
        "Normalize"
      ],
      "sableye": [
        "Keen Eye",
        "Stall"
      ],
      "sableyemega": [],
      "mawile": [
        "Hyper Cutter",
        "Intimidate"
      ],
      "aron": [
        "Sturdy",
        "Rock Head"
      ],
      "lairon": [
        "Sturdy",
        "Rock Head"
      ],
      "aggron": [
        "Sturdy",
        "Rock Head"
      ],
      "meditite": [
        "Pure Power"
      ],
      "medicham": [
        "Pure Power"
      ],
      "electrike": [
        "Static",
        "Lightning Rod"
      ],
      "manectric": [
        "Static",
        "Lightning Rod"
      ],
      "plusle": [
        "Plus"
      ],
      "minun": [
        "Minus"
      ],
      "volbeat": [
        "Illuminate",
        "Swarm"
      ],
      "illumise": [
        "Oblivious",
        "Tinted Lens"
      ],
      "roselia": [
        "Natural Cure",
        "Poison Point"
      ],
      "gulpin": [
        "Liquid Ooze",
        "Sticky Hold"
      ],
      "swalot": [
        "Liquid Ooze",
        "Sticky Hold"
      ],
      "carvanha": [
        "Rough Skin"
      ],
      "sharpedo": [
        "Rough Skin"
      ],
      "sharpedomega": [],
      "wailmer": [
        "Water Veil",
        "Oblivious"
      ],
      "wailord": [
        "Water Veil",
        "Oblivious"
      ],
      "numel": [
        "Oblivious",
        "Simple"
      ],
      "camerupt": [
        "Magma Armor",
        "Solid Rock"
      ],
      "cameruptmega": [],
      "torkoal": [
        "White Smoke"
      ],
      "spoink": [
        "Thick Fat",
        "Own Tempo"
      ],
      "grumpig": [
        "Thick Fat",
        "Own Tempo"
      ],
      "spinda": [
        "Own Tempo",
        "Tangled Feet"
      ],
      "trapinch": [
        "Hyper Cutter",
        "Arena Trap"
      ],
      "cacnea": [
        "Sand Veil"
      ],
      "cacturne": [
        "Sand Veil"
      ],
      "swablu": [
        "Natural Cure"
      ],
      "altaria": [
        "Natural Cure"
      ],
      "altariamega": [],
      "zangoose": [
        "Immunity"
      ],
      "seviper": [
        "Shed Skin"
      ],
      "barboach": [
        "Oblivious",
        "Anticipation"
      ],
      "whiscash": [
        "Oblivious",
        "Anticipation"
      ],
      "corphish": [
        "Hyper Cutter",
        "Shell Armor"
      ],
      "crawdaunt": [
        "Hyper Cutter",
        "Shell Armor"
      ],
      "lileep": [
        "Suction Cups"
      ],
      "cradily": [
        "Suction Cups"
      ],
      "anorith": [
        "Battle Armor"
      ],
      "armaldo": [
        "Battle Armor"
      ],
      "feebas": [
        "Swift Swim"
      ],
      "milotic": [
        "Marvel Scale"
      ],
      "kecleon": [
        "Color Change"
      ],
      "shuppet": [
        "Insomnia",
        "Frisk"
      ],
      "banette": [
        "Insomnia",
        "Frisk"
      ],
      "banettemega": [],
      "duskull": [
        "Levitate"
      ],
      "dusclops": [
        "Pressure"
      ],
      "tropius": [
        "Chlorophyll",
        "Solar Power"
      ],
      "absol": [
        "Pressure",
        "Super Luck"
      ],
      "absolmega": [],
      "absolmegaz": [],
      "wynaut": [
        "Shadow Tag"
      ],
      "snorunt": [
        "Inner Focus",
        "Ice Body"
      ],
      "glalie": [
        "Inner Focus",
        "Ice Body"
      ],
      "glaliemega": [],
      "spheal": [
        "Thick Fat",
        "Ice Body"
      ],
      "sealeo": [
        "Thick Fat",
        "Ice Body"
      ],
      "walrein": [
        "Thick Fat",
        "Ice Body"
      ],
      "clamperl": [
        "Shell Armor"
      ],
      "huntail": [
        "Swift Swim"
      ],
      "gorebyss": [
        "Swift Swim"
      ],
      "relicanth": [
        "Swift Swim",
        "Rock Head"
      ],
      "luvdisc": [
        "Swift Swim"
      ],
      "bagon": [
        "Rock Head"
      ],
      "shelgon": [
        "Rock Head"
      ],
      "salamence": [
        "Intimidate"
      ],
      "salamencemega": [],
      "beldum": [
        "Clear Body"
      ],
      "metang": [
        "Clear Body"
      ],
      "metagross": [
        "Clear Body"
      ],
      "metagrossmega": [],
      "regirock": [
        "Clear Body"
      ],
      "regice": [
        "Clear Body"
      ],
      "registeel": [
        "Clear Body"
      ],
      "kyogreprimal": [],
      "groudonprimal": [],
      "rayquazamega": [],
      "turtwig": [
        "Overgrow"
      ],
      "grotle": [
        "Overgrow"
      ],
      "torterra": [
        "Overgrow"
      ],
      "chimchar": [
        "Blaze"
      ],
      "monferno": [
        "Blaze"
      ],
      "infernape": [
        "Blaze"
      ],
      "piplup": [
        "Torrent"
      ],
      "prinplup": [
        "Torrent"
      ],
      "empoleon": [
        "Torrent"
      ],
      "starly": [
        "Keen Eye"
      ],
      "staravia": [
        "Intimidate"
      ],
      "staraptor": [
        "Intimidate"
      ],
      "staraptormega": [],
      "bidoof": [
        "Simple",
        "Unaware"
      ],
      "bibarel": [
        "Simple",
        "Unaware"
      ],
      "kricketot": [
        "Shed Skin"
      ],
      "kricketune": [
        "Swarm"
      ],
      "shinx": [
        "Rivalry",
        "Intimidate"
      ],
      "luxio": [
        "Rivalry",
        "Intimidate"
      ],
      "luxray": [
        "Rivalry",
        "Intimidate"
      ],
      "budew": [
        "Natural Cure",
        "Poison Point"
      ],
      "roserade": [
        "Natural Cure",
        "Poison Point"
      ],
      "cranidos": [
        "Mold Breaker"
      ],
      "rampardos": [
        "Mold Breaker"
      ],
      "shieldon": [
        "Sturdy"
      ],
      "bastiodon": [
        "Sturdy"
      ],
      "burmy": [
        "Shed Skin"
      ],
      "burmysandy": [
        "Shed Skin"
      ],
      "burmytrash": [
        "Shed Skin"
      ],
      "wormadam": [
        "Anticipation"
      ],
      "wormadamsandy": [
        "Anticipation"
      ],
      "wormadamtrash": [
        "Anticipation"
      ],
      "mothim": [
        "Swarm"
      ],
      "combee": [
        "Honey Gather"
      ],
      "vespiquen": [
        "Pressure"
      ],
      "pachirisu": [
        "Run Away",
        "Pickup"
      ],
      "buizel": [
        "Swift Swim"
      ],
      "floatzel": [
        "Swift Swim"
      ],
      "shellos": [
        "Sticky Hold",
        "Storm Drain"
      ],
      "shelloseast": [
        "Sticky Hold",
        "Storm Drain"
      ],
      "gastrodon": [
        "Sticky Hold",
        "Storm Drain"
      ],
      "gastrodoneast": [
        "Sticky Hold",
        "Storm Drain"
      ],
      "ambipom": [
        "Technician",
        "Pickup"
      ],
      "drifloon": [
        "Aftermath",
        "Unburden"
      ],
      "drifblim": [
        "Aftermath",
        "Unburden"
      ],
      "buneary": [
        "Run Away",
        "Klutz"
      ],
      "lopunny": [
        "Cute Charm",
        "Klutz"
      ],
      "honchkrow": [
        "Insomnia",
        "Super Luck"
      ],
      "glameow": [
        "Limber",
        "Own Tempo"
      ],
      "purugly": [
        "Thick Fat",
        "Own Tempo"
      ],
      "stunky": [
        "Stench",
        "Aftermath"
      ],
      "skuntank": [
        "Stench",
        "Aftermath"
      ],
      "bronzor": [
        "Levitate",
        "Heatproof"
      ],
      "bronzong": [
        "Levitate",
        "Heatproof"
      ],
      "bonsly": [
        "Sturdy",
        "Rock Head"
      ],
      "mimejr": [
        "Soundproof",
        "Filter"
      ],
      "happiny": [
        "Natural Cure",
        "Serene Grace"
      ],
      "chatot": [
        "Keen Eye",
        "Tangled Feet"
      ],
      "spiritomb": [
        "Pressure"
      ],
      "gible": [
        "Sand Veil"
      ],
      "gabite": [
        "Sand Veil"
      ],
      "garchomp": [
        "Sand Veil"
      ],
      "garchompmega": [],
      "munchlax": [
        "Pickup",
        "Thick Fat"
      ],
      "riolu": [
        "Steadfast",
        "Inner Focus"
      ],
      "lucario": [
        "Steadfast",
        "Inner Focus"
      ],
      "lucariomegaz": [],
      "hippopotas": [
        "Sand Stream"
      ],
      "hippowdon": [
        "Sand Stream"
      ],
      "skorupi": [
        "Battle Armor",
        "Sniper"
      ],
      "drapion": [
        "Battle Armor",
        "Sniper"
      ],
      "croagunk": [
        "Anticipation",
        "Dry Skin"
      ],
      "toxicroak": [
        "Anticipation",
        "Dry Skin"
      ],
      "finneon": [
        "Swift Swim",
        "Storm Drain"
      ],
      "lumineon": [
        "Swift Swim",
        "Storm Drain"
      ],
      "mantyke": [
        "Swift Swim",
        "Water Absorb"
      ],
      "snover": [
        "Snow Warning"
      ],
      "abomasnow": [
        "Snow Warning"
      ],
      "weavile": [
        "Pressure"
      ],
      "magnezone": [
        "Magnet Pull",
        "Sturdy"
      ],
      "lickilicky": [
        "Own Tempo",
        "Oblivious"
      ],
      "rhyperior": [
        "Lightning Rod",
        "Solid Rock"
      ],
      "tangrowth": [
        "Chlorophyll",
        "Leaf Guard"
      ],
      "electivire": [
        "Motor Drive"
      ],
      "magmortar": [
        "Flame Body"
      ],
      "togekiss": [
        "Hustle",
        "Serene Grace"
      ],
      "yanmega": [
        "Speed Boost",
        "Tinted Lens"
      ],
      "leafeon": [
        "Leaf Guard"
      ],
      "glaceon": [
        "Snow Cloak"
      ],
      "gliscor": [
        "Hyper Cutter",
        "Sand Veil"
      ],
      "mamoswine": [
        "Oblivious",
        "Snow Cloak"
      ],
      "porygonz": [
        "Adaptability",
        "Download"
      ],
      "gallade": [
        "Steadfast"
      ],
      "probopass": [
        "Sturdy",
        "Magnet Pull"
      ],
      "dusknoir": [
        "Pressure"
      ],
      "froslass": [
        "Snow Cloak"
      ],
      "dialga": [
        "Pressure"
      ],
      "dialgaorigin": [
        "Pressure"
      ],
      "palkia": [
        "Pressure"
      ],
      "palkiaorigin": [
        "Pressure"
      ],
      "heatran": [
        "Flash Fire"
      ],
      "heatranmega": [
        "Flash Fire"
      ],
      "giratina": [
        "Pressure"
      ],
      "victini": [],
      "snivy": [
        "Overgrow"
      ],
      "servine": [
        "Overgrow"
      ],
      "serperior": [
        "Overgrow"
      ],
      "tepig": [
        "Blaze"
      ],
      "pignite": [
        "Blaze"
      ],
      "emboar": [
        "Blaze"
      ],
      "oshawott": [
        "Torrent"
      ],
      "dewott": [
        "Torrent"
      ],
      "samurott": [
        "Torrent"
      ],
      "samurotthisui": [
        "Torrent"
      ],
      "patrat": [
        "Run Away",
        "Keen Eye"
      ],
      "watchog": [
        "Illuminate",
        "Keen Eye"
      ],
      "lillipup": [
        "Vital Spirit",
        "Pickup"
      ],
      "herdier": [
        "Intimidate"
      ],
      "stoutland": [
        "Intimidate"
      ],
      "purrloin": [
        "Limber",
        "Unburden"
      ],
      "liepard": [
        "Limber",
        "Unburden"
      ],
      "pansage": [
        "Gluttony"
      ],
      "simisage": [
        "Gluttony"
      ],
      "pansear": [
        "Gluttony"
      ],
      "simisear": [
        "Gluttony"
      ],
      "panpour": [
        "Gluttony"
      ],
      "simipour": [
        "Gluttony"
      ],
      "munna": [
        "Forewarn",
        "Synchronize"
      ],
      "musharna": [
        "Forewarn",
        "Synchronize"
      ],
      "pidove": [
        "Super Luck"
      ],
      "tranquill": [
        "Super Luck"
      ],
      "unfezant": [
        "Super Luck"
      ],
      "blitzle": [
        "Lightning Rod",
        "Motor Drive"
      ],
      "zebstrika": [
        "Lightning Rod",
        "Motor Drive"
      ],
      "roggenrola": [
        "Sturdy"
      ],
      "boldore": [
        "Sturdy"
      ],
      "gigalith": [
        "Sturdy"
      ],
      "woobat": [
        "Unaware",
        "Klutz"
      ],
      "swoobat": [
        "Unaware",
        "Klutz"
      ],
      "drilbur": [],
      "excadrill": [],
      "excadrillmega": [],
      "audino": [],
      "audinomega": [],
      "timburr": [
        "Guts"
      ],
      "gurdurr": [
        "Guts"
      ],
      "conkeldurr": [
        "Guts"
      ],
      "tympole": [
        "Swift Swim",
        "Hydration"
      ],
      "palpitoad": [
        "Swift Swim",
        "Hydration"
      ],
      "seismitoad": [
        "Swift Swim"
      ],
      "throh": [
        "Guts",
        "Inner Focus"
      ],
      "sawk": [
        "Sturdy",
        "Inner Focus"
      ],
      "sewaddle": [
        "Swarm",
        "Chlorophyll"
      ],
      "swadloon": [
        "Leaf Guard",
        "Chlorophyll"
      ],
      "leavanny": [
        "Swarm",
        "Chlorophyll"
      ],
      "venipede": [
        "Poison Point",
        "Swarm"
      ],
      "whirlipede": [
        "Poison Point",
        "Swarm"
      ],
      "scolipede": [
        "Poison Point",
        "Swarm"
      ],
      "cottonee": [],
      "whimsicott": [],
      "petilil": [
        "Chlorophyll",
        "Own Tempo"
      ],
      "lilligant": [
        "Chlorophyll",
        "Own Tempo"
      ],
      "lilliganthisui": [
        "Chlorophyll",
        "Hustle"
      ],
      "basculin": [
        "Reckless",
        "Adaptability"
      ],
      "basculinbluestriped": [
        "Rock Head",
        "Adaptability",
        "Reckless"
      ],
      "basculinwhitestriped": [
        "Adaptability"
      ],
      "sandile": [
        "Intimidate"
      ],
      "krokorok": [
        "Intimidate"
      ],
      "krookodile": [
        "Intimidate"
      ],
      "darumaka": [
        "Hustle"
      ],
      "darumakagalar": [
        "Hustle"
      ],
      "darmanitan": [],
      "darmanitanzen": [],
      "darmanitangalar": [],
      "darmanitangalarzen": [],
      "maractus": [
        "Water Absorb",
        "Chlorophyll"
      ],
      "dwebble": [
        "Sturdy",
        "Shell Armor"
      ],
      "crustle": [
        "Sturdy",
        "Shell Armor"
      ],
      "scraggy": [
        "Shed Skin"
      ],
      "scrafty": [
        "Shed Skin"
      ],
      "sigilyph": [
        "Magic Guard"
      ],
      "yamask": [],
      "yamaskgalar": [],
      "cofagrigus": [],
      "tirtouga": [
        "Solid Rock",
        "Sturdy"
      ],
      "carracosta": [
        "Solid Rock",
        "Sturdy"
      ],
      "archen": [],
      "archeops": [],
      "trubbish": [
        "Stench",
        "Sticky Hold"
      ],
      "garbodor": [
        "Stench"
      ],
      "garbodorgmax": [
        "Stench"
      ],
      "zorua": [],
      "zoruahisui": [],
      "zoroark": [],
      "zoroarkhisui": [],
      "minccino": [
        "Cute Charm",
        "Technician"
      ],
      "cinccino": [
        "Cute Charm",
        "Technician"
      ],
      "gothita": [
        "Frisk"
      ],
      "gothorita": [
        "Frisk"
      ],
      "gothitelle": [
        "Frisk"
      ],
      "solosis": [
        "Magic Guard"
      ],
      "duosion": [
        "Magic Guard"
      ],
      "reuniclus": [
        "Magic Guard"
      ],
      "ducklett": [
        "Keen Eye"
      ],
      "swanna": [
        "Keen Eye"
      ],
      "vanillite": [
        "Ice Body"
      ],
      "vanillish": [
        "Ice Body"
      ],
      "vanilluxe": [
        "Ice Body"
      ],
      "deerling": [
        "Chlorophyll"
      ],
      "deerlingsummer": [
        "Chlorophyll"
      ],
      "deerlingautumn": [
        "Chlorophyll"
      ],
      "deerlingwinter": [
        "Chlorophyll"
      ],
      "sawsbuck": [
        "Chlorophyll"
      ],
      "emolga": [
        "Static"
      ],
      "karrablast": [
        "Swarm",
        "Shed Skin"
      ],
      "escavalier": [
        "Swarm",
        "Shell Armor"
      ],
      "foongus": [
        "Effect Spore"
      ],
      "amoonguss": [
        "Effect Spore"
      ],
      "frillish": [
        "Water Absorb"
      ],
      "jellicent": [
        "Water Absorb"
      ],
      "alomomola": [
        "Hydration"
      ],
      "joltik": [
        "Compound Eyes"
      ],
      "galvantula": [
        "Compound Eyes"
      ],
      "ferroseed": [],
      "ferrothorn": [],
      "klink": [
        "Plus",
        "Minus"
      ],
      "klang": [
        "Plus",
        "Minus"
      ],
      "klinklang": [
        "Plus",
        "Minus"
      ],
      "eelektrossmega": [],
      "elgyem": [
        "Synchronize"
      ],
      "beheeyem": [
        "Synchronize"
      ],
      "litwick": [
        "Flash Fire",
        "Flame Body"
      ],
      "lampent": [
        "Flash Fire",
        "Flame Body"
      ],
      "chandelure": [
        "Flash Fire",
        "Flame Body"
      ],
      "chandeluremega": [],
      "axew": [
        "Rivalry",
        "Mold Breaker"
      ],
      "fraxure": [
        "Rivalry",
        "Mold Breaker"
      ],
      "haxorus": [
        "Rivalry",
        "Mold Breaker"
      ],
      "cubchoo": [
        "Snow Cloak"
      ],
      "beartic": [
        "Snow Cloak"
      ],
      "shelmet": [
        "Hydration",
        "Shell Armor"
      ],
      "accelgor": [
        "Hydration",
        "Sticky Hold"
      ],
      "stunfisk": [
        "Static",
        "Limber"
      ],
      "stunfiskgalar": [],
      "mienfoo": [
        "Inner Focus"
      ],
      "mienshao": [
        "Inner Focus"
      ],
      "druddigon": [
        "Rough Skin"
      ],
      "golett": [
        "Iron Fist",
        "Klutz"
      ],
      "golurk": [
        "Iron Fist",
        "Klutz"
      ],
      "golurkmega": [],
      "pawniard": [
        "Inner Focus"
      ],
      "bisharp": [
        "Inner Focus"
      ],
      "bouffalant": [
        "Reckless"
      ],
      "rufflet": [
        "Keen Eye"
      ],
      "braviary": [
        "Keen Eye"
      ],
      "braviaryhisui": [
        "Keen Eye"
      ],
      "vullaby": [],
      "mandibuzz": [],
      "heatmor": [
        "Gluttony",
        "Flash Fire"
      ],
      "durant": [
        "Swarm",
        "Hustle"
      ],
      "larvesta": [
        "Flame Body"
      ],
      "volcarona": [
        "Flame Body"
      ],
      "cobalion": [],
      "terrakion": [],
      "virizion": [],
      "tornadus": [],
      "tornadustherian": [],
      "thundurus": [],
      "reshiram": [],
      "zekrom": [],
      "landorus": [],
      "kyuremblack": [],
      "kyuremwhite": [],
      "keldeo": [],
      "keldeoresolute": [],
      "chespin": [
        "Overgrow"
      ],
      "quilladin": [
        "Overgrow"
      ],
      "chesnaught": [
        "Overgrow"
      ],
      "chesnaughtmega": [],
      "fennekin": [
        "Blaze"
      ],
      "braixen": [
        "Blaze"
      ],
      "delphox": [
        "Blaze"
      ],
      "froakie": [
        "Torrent"
      ],
      "frogadier": [
        "Torrent"
      ],
      "greninja": [
        "Torrent"
      ],
      "greninjabond": [],
      "greninjaash": [],
      "greninjamega": [],
      "bunnelby": [
        "Pickup"
      ],
      "diggersby": [
        "Pickup"
      ],
      "fletchling": [],
      "fletchinder": [
        "Flame Body"
      ],
      "talonflame": [
        "Flame Body"
      ],
      "scatterbug": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "spewpa": [
        "Shed Skin"
      ],
      "vivillon": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonicysnow": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonpolar": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillontundra": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivilloncontinental": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillongarden": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonelegant": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonmodern": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonmarine": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonarchipelago": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonhighplains": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonsandstorm": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonriver": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonmonsoon": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonsavanna": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonsun": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonocean": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonjungle": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonfancy": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonpokeball": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "litleo": [
        "Rivalry"
      ],
      "pyroar": [
        "Rivalry"
      ],
      "pyroarmega": [],
      "flabebe": [],
      "floette": [],
      "floetteeternal": [],
      "floettemega": [],
      "florges": [],
      "skiddo": [],
      "gogoat": [],
      "pancham": [
        "Iron Fist",
        "Mold Breaker"
      ],
      "pangoro": [
        "Iron Fist",
        "Mold Breaker"
      ],
      "furfrou": [],
      "espurr": [
        "Keen Eye"
      ],
      "meowstic": [
        "Keen Eye"
      ],
      "meowsticf": [
        "Keen Eye"
      ],
      "aegislash": [],
      "aegislashblade": [],
      "spritzee": [],
      "aromatisse": [],
      "swirlix": [],
      "slurpuff": [],
      "inkay": [
        "Suction Cups"
      ],
      "malamar": [
        "Suction Cups"
      ],
      "malamarmega": [],
      "binacle": [
        "Sniper"
      ],
      "barbaracle": [
        "Sniper"
      ],
      "barbaraclemega": [],
      "skrelp": [
        "Poison Point"
      ],
      "dragalge": [
        "Poison Point"
      ],
      "dragalgemega": [],
      "clauncher": [],
      "clawitzer": [],
      "helioptile": [
        "Dry Skin",
        "Sand Veil"
      ],
      "heliolisk": [
        "Dry Skin",
        "Sand Veil"
      ],
      "tyrunt": [],
      "tyrantrum": [],
      "amaura": [],
      "aurorus": [],
      "sylveon": [
        "Cute Charm"
      ],
      "hawlucha": [
        "Limber",
        "Unburden"
      ],
      "dedenne": [
        "Pickup"
      ],
      "carbink": [
        "Clear Body"
      ],
      "goomy": [
        "Hydration"
      ],
      "sliggoo": [
        "Hydration"
      ],
      "sliggoohisui": [],
      "goodra": [
        "Hydration"
      ],
      "goodrahisui": [],
      "klefki": [],
      "phantump": [
        "Natural Cure",
        "Frisk"
      ],
      "trevenant": [
        "Natural Cure",
        "Frisk"
      ],
      "pumpkaboo": [
        "Pickup",
        "Frisk"
      ],
      "pumpkaboosmall": [
        "Pickup",
        "Frisk"
      ],
      "pumpkaboolarge": [
        "Pickup",
        "Frisk"
      ],
      "pumpkaboosuper": [
        "Pickup",
        "Frisk"
      ],
      "gourgeist": [
        "Pickup",
        "Frisk"
      ],
      "gourgeistsmall": [
        "Pickup",
        "Frisk"
      ],
      "gourgeistlarge": [
        "Pickup",
        "Frisk"
      ],
      "gourgeistsuper": [
        "Pickup",
        "Frisk"
      ],
      "bergmite": [
        "Own Tempo",
        "Ice Body"
      ],
      "avalugg": [
        "Own Tempo",
        "Ice Body"
      ],
      "avalugghisui": [
        "Ice Body"
      ],
      "noibat": [
        "Frisk"
      ],
      "noivern": [
        "Frisk"
      ],
      "xerneas": [],
      "xerneasneutral": [],
      "yveltal": [],
      "zygarde": [],
      "zygarde10": [],
      "zygardecomplete": [],
      "zygardemega": [],
      "dianciemega": [],
      "hoopa": [],
      "hoopaunbound": [],
      "rowlet": [
        "Overgrow"
      ],
      "dartrix": [
        "Overgrow"
      ],
      "decidueye": [
        "Overgrow"
      ],
      "decidueyehisui": [
        "Overgrow"
      ],
      "litten": [
        "Blaze"
      ],
      "torracat": [
        "Blaze"
      ],
      "incineroar": [
        "Blaze"
      ],
      "popplio": [
        "Torrent"
      ],
      "brionne": [
        "Torrent"
      ],
      "primarina": [
        "Torrent"
      ],
      "pikipek": [
        "Keen Eye",
        "Skill Link"
      ],
      "trumbeak": [
        "Keen Eye",
        "Skill Link"
      ],
      "toucannon": [
        "Keen Eye",
        "Skill Link"
      ],
      "yungoos": [],
      "gumshoos": [],
      "charjabug": [],
      "crabrawler": [
        "Hyper Cutter",
        "Iron Fist"
      ],
      "crabominable": [
        "Hyper Cutter",
        "Iron Fist"
      ],
      "oricorio": [],
      "oricoriopompom": [],
      "oricoriopau": [],
      "oricoriosensu": [],
      "cutiefly": [
        "Honey Gather",
        "Shield Dust"
      ],
      "ribombee": [
        "Honey Gather",
        "Shield Dust"
      ],
      "ribombeetotem": [],
      "rockruff": [
        "Keen Eye",
        "Vital Spirit",
        "Own Tempo"
      ],
      "lycanroc": [
        "Keen Eye"
      ],
      "lycanrocmidnight": [
        "Keen Eye",
        "Vital Spirit"
      ],
      "lycanrocdusk": [],
      "wishiwashi": [],
      "wishiwashischool": [],
      "mareanie": [
        "Limber"
      ],
      "toxapex": [
        "Limber"
      ],
      "mudbray": [
        "Own Tempo"
      ],
      "mudsdale": [
        "Own Tempo"
      ],
      "dewpider": [],
      "araquanid": [],
      "araquanidtotem": [],
      "fomantis": [
        "Leaf Guard"
      ],
      "lurantis": [
        "Leaf Guard"
      ],
      "morelull": [
        "Illuminate",
        "Effect Spore"
      ],
      "shiinotic": [
        "Illuminate",
        "Effect Spore"
      ],
      "salandit": [],
      "salazzle": [],
      "salazzletotem": [],
      "stufful": [
        "Klutz"
      ],
      "bewear": [
        "Klutz"
      ],
      "bounsweet": [
        "Leaf Guard",
        "Oblivious"
      ],
      "steenee": [
        "Leaf Guard",
        "Oblivious"
      ],
      "tsareena": [
        "Leaf Guard"
      ],
      "comfey": [],
      "oranguru": [
        "Inner Focus"
      ],
      "passimian": [],
      "wimpod": [],
      "golisopod": [],
      "golisopodmega": [],
      "sandygast": [],
      "palossand": [],
      "pyukumuku": [],
      "silvally": [],
      "silvallybug": [],
      "silvallydark": [],
      "silvallydragon": [],
      "silvallyelectric": [],
      "silvallyfairy": [],
      "silvallyfighting": [],
      "silvallyfire": [],
      "silvallyflying": [],
      "silvallyghost": [],
      "silvallygrass": [],
      "silvallyground": [],
      "silvallyice": [],
      "silvallypoison": [],
      "silvallypsychic": [],
      "silvallyrock": [],
      "silvallysteel": [],
      "silvallywater": [],
      "minior": [],
      "miniororange": [],
      "minioryellow": [],
      "miniorgreen": [],
      "miniorblue": [],
      "miniorindigo": [],
      "miniorviolet": [],
      "miniormeteor": [],
      "komala": [],
      "togedemaru": [
        "Lightning Rod"
      ],
      "mimikyu": [],
      "mimikyubusted": [],
      "mimikyutotem": [],
      "mimikyubustedtotem": [],
      "bruxish": [],
      "drampa": [],
      "drampamega": [],
      "dhelmise": [],
      "jangmoo": [
        "Soundproof"
      ],
      "hakamoo": [
        "Soundproof"
      ],
      "kommoo": [
        "Soundproof"
      ],
      "kommoototem": [],
      "tapukoko": [],
      "tapulele": [],
      "tapubulu": [],
      "tapufini": [],
      "solgaleo": [],
      "lunala": [],
      "nihilego": [],
      "buzzwole": [],
      "pheromosa": [],
      "xurkitree": [],
      "celesteela": [],
      "kartana": [],
      "guzzlord": [],
      "necrozma": [],
      "necrozmaduskmane": [],
      "necrozmadawnwings": [],
      "necrozmaultra": [],
      "magearna": [],
      "magearnaoriginal": [],
      "magearnamega": [],
      "magearnaoriginalmega": [],
      "poipole": [],
      "naganadel": [],
      "stakataka": [],
      "blacephalon": [],
      "grookey": [
        "Overgrow"
      ],
      "thwackey": [
        "Overgrow"
      ],
      "rillaboom": [
        "Overgrow"
      ],
      "rillaboomgmax": [
        "Overgrow"
      ],
      "scorbunny": [
        "Blaze"
      ],
      "raboot": [
        "Blaze"
      ],
      "cinderace": [
        "Blaze"
      ],
      "cinderacegmax": [
        "Blaze"
      ],
      "sobble": [
        "Torrent"
      ],
      "drizzile": [
        "Torrent"
      ],
      "inteleon": [
        "Torrent"
      ],
      "inteleongmax": [
        "Torrent"
      ],
      "skwovet": [],
      "greedent": [],
      "rookidee": [
        "Keen Eye"
      ],
      "corvisquire": [
        "Keen Eye"
      ],
      "corviknight": [
        "Pressure"
      ],
      "corviknightgmax": [
        "Pressure"
      ],
      "blipbug": [
        "Swarm",
        "Compound Eyes"
      ],
      "dottler": [
        "Swarm",
        "Compound Eyes"
      ],
      "orbeetle": [
        "Swarm",
        "Frisk"
      ],
      "orbeetlegmax": [
        "Swarm",
        "Frisk"
      ],
      "nickit": [
        "Run Away",
        "Unburden"
      ],
      "thievul": [
        "Run Away",
        "Unburden"
      ],
      "gossifleur": [],
      "eldegoss": [],
      "wooloo": [
        "Run Away"
      ],
      "dubwool": [
        "Steadfast"
      ],
      "chewtle": [
        "Shell Armor"
      ],
      "drednaw": [
        "Shell Armor"
      ],
      "drednawgmax": [
        "Shell Armor"
      ],
      "yamper": [],
      "boltund": [],
      "rolycoly": [
        "Heatproof"
      ],
      "carkol": [
        "Flame Body"
      ],
      "coalossal": [
        "Flame Body"
      ],
      "coalossalgmax": [
        "Flame Body"
      ],
      "applin": [
        "Gluttony"
      ],
      "flapple": [
        "Gluttony"
      ],
      "flapplegmax": [
        "Gluttony"
      ],
      "appletun": [
        "Gluttony"
      ],
      "appletungmax": [
        "Gluttony"
      ],
      "silicobra": [
        "Shed Skin"
      ],
      "sandaconda": [
        "Shed Skin"
      ],
      "sandacondagmax": [
        "Shed Skin"
      ],
      "cramorant": [],
      "cramorantgulping": [],
      "cramorantgorging": [],
      "arrokuda": [
        "Swift Swim"
      ],
      "barraskewda": [
        "Swift Swim"
      ],
      "toxel": [
        "Static"
      ],
      "toxtricity": [
        "Plus"
      ],
      "toxtricitylowkey": [
        "Minus"
      ],
      "toxtricitygmax": [
        "Plus"
      ],
      "toxtricitylowkeygmax": [
        "Minus"
      ],
      "sizzlipede": [
        "Flash Fire",
        "White Smoke"
      ],
      "centiskorch": [
        "Flash Fire",
        "White Smoke"
      ],
      "centiskorchgmax": [
        "Flash Fire",
        "White Smoke"
      ],
      "clobbopus": [
        "Limber"
      ],
      "grapploct": [
        "Limber"
      ],
      "sinistea": [],
      "sinisteaantique": [],
      "polteageist": [],
      "polteageistantique": [],
      "hatenna": [
        "Anticipation"
      ],
      "hattrem": [
        "Anticipation"
      ],
      "hatterene": [
        "Anticipation"
      ],
      "hatterenegmax": [
        "Anticipation"
      ],
      "impidimp": [
        "Frisk"
      ],
      "morgrem": [
        "Frisk"
      ],
      "grimmsnarl": [
        "Frisk"
      ],
      "grimmsnarlgmax": [
        "Frisk"
      ],
      "obstagoon": [
        "Reckless",
        "Guts"
      ],
      "perrserker": [
        "Battle Armor"
      ],
      "cursola": [],
      "sirfetchd": [
        "Steadfast"
      ],
      "mrrime": [
        "Tangled Feet"
      ],
      "runerigus": [],
      "milcery": [],
      "alcremie": [],
      "alcremierubycream": [],
      "alcremiematchacream": [],
      "alcremiemintcream": [],
      "alcremielemoncream": [],
      "alcremierubyswirl": [],
      "alcremiecaramelswirl": [],
      "alcremierainbowswirl": [],
      "alcremiegmax": [],
      "falinks": [
        "Battle Armor"
      ],
      "falinksmega": [],
      "pincurchin": [
        "Lightning Rod"
      ],
      "snom": [
        "Shield Dust"
      ],
      "frosmoth": [
        "Shield Dust"
      ],
      "stonjourner": [],
      "eiscue": [],
      "eiscuenoice": [],
      "indeedee": [
        "Inner Focus",
        "Synchronize"
      ],
      "indeedeef": [
        "Own Tempo",
        "Synchronize"
      ],
      "morpeko": [],
      "morpekohangry": [],
      "cufant": [],
      "copperajah": [],
      "copperajahgmax": [],
      "dracozolt": [
        "Volt Absorb",
        "Hustle"
      ],
      "arctozolt": [
        "Volt Absorb",
        "Static"
      ],
      "dracovish": [
        "Water Absorb"
      ],
      "arctovish": [
        "Water Absorb",
        "Ice Body"
      ],
      "duraludon": [],
      "duraludongmax": [],
      "dreepy": [
        "Clear Body"
      ],
      "drakloak": [
        "Clear Body"
      ],
      "dragapult": [
        "Clear Body"
      ],
      "zacian": [],
      "zaciancrowned": [],
      "zamazenta": [],
      "zamazentacrowned": [],
      "urshifu": [],
      "urshifurapidstrike": [],
      "urshifugmax": [],
      "urshifurapidstrikegmax": [],
      "regieleki": [],
      "regidrago": [],
      "glastrier": [],
      "spectrier": [],
      "calyrex": [],
      "calyrexice": [],
      "calyrexshadow": [],
      "wyrdeer": [
        "Intimidate",
        "Frisk"
      ],
      "kleavor": [
        "Swarm"
      ],
      "ursaluna": [
        "Guts"
      ],
      "ursalunabloodmoon": [],
      "basculegion": [
        "Adaptability"
      ],
      "basculegionf": [
        "Adaptability"
      ],
      "sneasler": [
        "Pressure"
      ],
      "overqwil": [
        "Poison Point",
        "Swift Swim"
      ],
      "enamorus": [],
      "enamorustherian": [],
      "sprigatito": [
        "Overgrow"
      ],
      "floragato": [
        "Overgrow"
      ],
      "meowscarada": [
        "Overgrow"
      ],
      "fuecoco": [
        "Blaze"
      ],
      "crocalor": [
        "Blaze"
      ],
      "skeledirge": [
        "Blaze"
      ],
      "quaxly": [
        "Torrent"
      ],
      "quaxwell": [
        "Torrent"
      ],
      "quaquaval": [
        "Torrent"
      ],
      "lechonk": [
        "Gluttony"
      ],
      "oinkologne": [
        "Gluttony"
      ],
      "oinkolognef": [
        "Gluttony"
      ],
      "tarountula": [
        "Insomnia"
      ],
      "spidops": [
        "Insomnia"
      ],
      "nymble": [
        "Swarm"
      ],
      "lokix": [
        "Swarm"
      ],
      "pawmi": [
        "Static",
        "Natural Cure"
      ],
      "pawmo": [
        "Volt Absorb",
        "Natural Cure"
      ],
      "pawmot": [
        "Volt Absorb",
        "Natural Cure"
      ],
      "tandemaus": [
        "Run Away",
        "Pickup"
      ],
      "maushold": [],
      "mausholdfour": [],
      "fidough": [
        "Own Tempo"
      ],
      "dachsbun": [],
      "smoliv": [
        "Early Bird"
      ],
      "dolliv": [
        "Early Bird"
      ],
      "arboliva": [],
      "squawkabilly": [
        "Intimidate",
        "Hustle"
      ],
      "squawkabillyblue": [
        "Intimidate",
        "Hustle"
      ],
      "squawkabillyyellow": [
        "Intimidate",
        "Hustle"
      ],
      "squawkabillywhite": [
        "Intimidate",
        "Hustle"
      ],
      "nacli": [
        "Sturdy"
      ],
      "naclstack": [
        "Sturdy"
      ],
      "garganacl": [
        "Sturdy"
      ],
      "charcadet": [
        "Flash Fire"
      ],
      "armarouge": [
        "Flash Fire"
      ],
      "ceruledge": [
        "Flash Fire"
      ],
      "tadbulb": [
        "Own Tempo",
        "Static"
      ],
      "bellibolt": [
        "Static"
      ],
      "wattrel": [
        "Volt Absorb"
      ],
      "kilowattrel": [
        "Volt Absorb"
      ],
      "maschiff": [
        "Intimidate",
        "Run Away"
      ],
      "mabosstiff": [
        "Intimidate"
      ],
      "shroodle": [
        "Unburden"
      ],
      "grafaiai": [
        "Unburden"
      ],
      "bramblin": [],
      "brambleghast": [],
      "toedscool": [],
      "toedscruel": [],
      "klawf": [
        "Shell Armor"
      ],
      "capsakid": [
        "Chlorophyll",
        "Insomnia"
      ],
      "scovillain": [
        "Chlorophyll",
        "Insomnia"
      ],
      "scovillainmega": [],
      "rellor": [
        "Compound Eyes"
      ],
      "rabsca": [
        "Synchronize"
      ],
      "flittle": [
        "Anticipation",
        "Frisk"
      ],
      "espathra": [
        "Frisk"
      ],
      "tinkatink": [
        "Mold Breaker",
        "Own Tempo"
      ],
      "tinkatuff": [
        "Mold Breaker",
        "Own Tempo"
      ],
      "tinkaton": [
        "Mold Breaker",
        "Own Tempo"
      ],
      "wiglett": [],
      "wugtrio": [],
      "bombirdier": [
        "Keen Eye"
      ],
      "palafin": [],
      "palafinhero": [],
      "varoom": [],
      "revavroom": [],
      "cyclizar": [
        "Shed Skin"
      ],
      "orthworm": [],
      "glimmet": [],
      "glimmora": [],
      "greavard": [
        "Pickup"
      ],
      "houndstone": [],
      "flamigo": [
        "Scrappy",
        "Tangled Feet"
      ],
      "cetoddle": [
        "Thick Fat",
        "Snow Cloak"
      ],
      "cetitan": [
        "Thick Fat"
      ],
      "veluza": [
        "Mold Breaker"
      ],
      "dondozo": [
        "Unaware",
        "Oblivious"
      ],
      "tatsugiri": [],
      "tatsugiridroopy": [],
      "tatsugiristretchy": [],
      "tatsugiricurlymega": [],
      "tatsugiridroopymega": [],
      "tatsugiristretchymega": [],
      "annihilape": [
        "Vital Spirit",
        "Inner Focus"
      ],
      "clodsire": [
        "Poison Point",
        "Water Absorb"
      ],
      "farigiraf": [],
      "dudunsparce": [
        "Serene Grace",
        "Run Away"
      ],
      "dudunsparcethreesegment": [
        "Serene Grace",
        "Run Away"
      ],
      "kingambit": [],
      "greattusk": [],
      "screamtail": [],
      "brutebonnet": [],
      "fluttermane": [],
      "slitherwing": [],
      "sandyshocks": [],
      "irontreads": [],
      "ironbundle": [],
      "ironhands": [],
      "ironjugulis": [],
      "ironmoth": [],
      "ironthorns": [],
      "frigibax": [],
      "arctibax": [],
      "baxcalibur": [],
      "baxcaliburmega": [],
      "gimmighoul": [],
      "gholdengo": [],
      "wochien": [],
      "chienpao": [],
      "tinglu": [],
      "chiyu": [],
      "roaringmoon": [],
      "ironvaliant": [],
      "koraidon": [],
      "miraidon": [],
      "walkingwake": [],
      "ironleaves": [],
      "dipplin": [
        "Gluttony"
      ],
      "poltchageist": [],
      "poltchageistartisan": [],
      "sinistcha": [],
      "sinistchamasterpiece": [],
      "okidogi": [],
      "munkidori": [],
      "fezandipiti": [],
      "ogerpon": [],
      "ogerpontealtera": [],
      "ogerponwellspringtera": [],
      "ogerponhearthflametera": [],
      "ogerponcornerstonetera": [],
      "archaludon": [
        "Sturdy"
      ],
      "hydrapple": [],
      "gougingfire": [],
      "ragingbolt": [],
      "ironboulder": [],
      "ironcrown": [],
      "terapagos": [],
      "terapagosterastal": [],
      "terapagosstellar": [],
      "pecharunt": [],
      "syclar": [
        "Compound Eyes",
        "Snow Cloak"
      ],
      "syclant": [
        "Compound Eyes",
        "Mountaineer"
      ],
      "revenankh": [
        "Air Lock"
      ],
      "embirch": [
        "Reckless",
        "Leaf Guard"
      ],
      "flarelm": [
        "Rock Head",
        "Battle Armor"
      ],
      "pyroak": [
        "Rock Head",
        "Battle Armor"
      ],
      "breezi": [
        "Unburden",
        "Own Tempo"
      ],
      "fidgit": [
        "Persistent",
        "Vital Spirit"
      ],
      "rebble": [
        "Levitate",
        "Solid Rock"
      ],
      "tactite": [
        "Levitate",
        "Technician"
      ],
      "stratagem": [
        "Levitate",
        "Technician"
      ],
      "privatyke": [
        "Unaware"
      ],
      "arghonaut": [
        "Unaware"
      ],
      "kitsunoh": [
        "Frisk",
        "Limber"
      ],
      "cyclohm": [
        "Shield Dust",
        "Static"
      ],
      "colossoil": [
        "Rebound",
        "Guts"
      ],
      "krilowatt": [
        "Trace",
        "Magic Guard"
      ],
      "voodoll": [
        "Volt Absorb",
        "Lightning Rod"
      ],
      "voodoom": [
        "Volt Absorb",
        "Lightning Rod"
      ],
      "scratchet": [
        "Scrappy"
      ],
      "tomohawk": [
        "Intimidate"
      ],
      "necturine": [
        "Anticipation"
      ],
      "necturna": [
        "Forewarn"
      ],
      "mollux": [
        "Dry Skin"
      ],
      "cupra": [
        "Shield Dust",
        "Keen Eye"
      ],
      "argalis": [
        "Shed Skin",
        "Compound Eyes"
      ],
      "aurumoth": [
        "No Guard"
      ],
      "brattler": [],
      "malaconda": [],
      "cawdet": [
        "Keen Eye",
        "Volt Absorb"
      ],
      "cawmodore": [
        "Intimidate",
        "Volt Absorb"
      ],
      "volkritter": [
        "Anticipation"
      ],
      "volkraken": [],
      "snugglow": [
        "Storm Drain",
        "Vital Spirit"
      ],
      "plasmanta": [
        "Storm Drain",
        "Vital Spirit"
      ],
      "floatoy": [
        "Water Veil",
        "Heatproof"
      ],
      "caimanoe": [
        "Water Veil",
        "Heatproof"
      ],
      "naviathan": [
        "Water Veil",
        "Heatproof"
      ],
      "crucibelle": [
        "Mold Breaker"
      ],
      "pluffle": [
        "Natural Cure"
      ],
      "kerfluffle": [
        "Natural Cure"
      ],
      "pajantom": [],
      "mumbao": [
        "Trace"
      ],
      "jumbao": [
        "Trace"
      ],
      "fawnifer": [
        "Overgrow"
      ],
      "electrelk": [
        "Overgrow"
      ],
      "caribolt": [
        "Overgrow"
      ],
      "smogecko": [
        "Blaze"
      ],
      "smoguana": [
        "Blaze"
      ],
      "smokomodo": [
        "Blaze"
      ],
      "swirlpool": [
        "Torrent"
      ],
      "coribalis": [
        "Torrent"
      ],
      "snaelstrom": [
        "Torrent"
      ],
      "justyke": [
        "Levitate"
      ],
      "equilibra": [
        "Levitate"
      ],
      "solotl": [
        "Vital Spirit"
      ],
      "astrolotl": [
        "Vital Spirit"
      ],
      "miasmite": [
        "Hyper Cutter"
      ],
      "miasmaw": [
        "Hyper Cutter"
      ],
      "nohface": [
        "Frisk",
        "Limber"
      ],
      "monohm": [
        "Shield Dust",
        "Static"
      ],
      "duohm": [
        "Shield Dust",
        "Static"
      ],
      "dorsoil": [
        "Oblivious",
        "Guts"
      ],
      "protowatt": [
        "Trace",
        "Magic Guard"
      ],
      "venomicon": [],
      "saharascal": [
        "Water Absorb"
      ],
      "saharaja": [
        "Water Absorb",
        "Serene Grace"
      ],
      "ababo": [],
      "scattervein": [
        "Intimidate"
      ],
      "hemogoblin": [
        "Intimidate"
      ],
      "cresceidon": [
        "Rough Skin"
      ],
      "chuggon": [
        "Shell Armor",
        "White Smoke"
      ],
      "draggalong": [
        "White Smoke"
      ],
      "chuggalong": [
        "White Smoke"
      ],
      "flox": [
        "Static",
        "Sticky Hold"
      ],
      "shox": [
        "Sticky Hold"
      ],
      "scraptor": [
        "Early Bird"
      ],
      "obliteryx": [
        "Early Bird"
      ],
      "pokestarsmeargle": [
        "Own Tempo",
        "Technician"
      ],
      "pokestarmt": []
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
    "moveData": {
      "aircutter": {
        "category": "Special",
        "basePower": 55
      },
      "assurance": {
        "category": "Physical",
        "basePower": 50,
        "basePowerCallback": true
      },
      "aurasphere": {
        "category": "Special",
        "basePower": 90
      },
      "baddybad": {
        "category": "Special",
        "basePower": 90
      },
      "blizzard": {
        "category": "Special",
        "basePower": 120,
        "onModifyMove": true
      },
      "bouncybubble": {
        "category": "Special",
        "basePower": 90
      },
      "bubble": {
        "category": "Special",
        "basePower": 20
      },
      "buzzybuzz": {
        "category": "Special",
        "basePower": 90
      },
      "chatter": {
        "category": "Special",
        "basePower": 60,
        "onModifyMove": true
      },
      "crabhammer": {
        "category": "Physical",
        "basePower": 90
      },
      "dracometeor": {
        "category": "Special",
        "basePower": 140
      },
      "dragonpulse": {
        "category": "Special",
        "basePower": 90
      },
      "energyball": {
        "category": "Special",
        "basePower": 80
      },
      "fellstinger": {
        "category": "Physical",
        "basePower": 30
      },
      "fireblast": {
        "category": "Special",
        "basePower": 120
      },
      "firepledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "flamethrower": {
        "category": "Special",
        "basePower": 95
      },
      "flyingpress": {
        "category": "Physical",
        "basePower": 80
      },
      "freezyfrost": {
        "category": "Special",
        "basePower": 90
      },
      "frostbreath": {
        "category": "Special",
        "basePower": 40
      },
      "furycutter": {
        "category": "Physical",
        "basePower": 20,
        "basePowerCallback": true
      },
      "futuresight": {
        "category": "Special",
        "basePower": 100
      },
      "glaciallance": {
        "category": "Physical",
        "basePower": 130
      },
      "glitzyglow": {
        "category": "Special",
        "basePower": 90
      },
      "grasspledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "grassyglide": {
        "category": "Physical",
        "basePower": 70
      },
      "heatwave": {
        "category": "Special",
        "basePower": 100
      },
      "hex": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true
      },
      "hiddenpower": {
        "category": "Special",
        "basePower": 0,
        "basePowerCallback": true
      },
      "hiddenpowerbug": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerdark": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerdragon": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerelectric": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerfighting": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerfire": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerflying": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerghost": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowergrass": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerground": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerice": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerpoison": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerpsychic": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerrock": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowersteel": {
        "category": "Special",
        "basePower": 70
      },
      "hiddenpowerwater": {
        "category": "Special",
        "basePower": 70
      },
      "hurricane": {
        "category": "Special",
        "basePower": 120,
        "onModifyMove": true
      },
      "hydropump": {
        "category": "Special",
        "basePower": 120
      },
      "icebeam": {
        "category": "Special",
        "basePower": 95
      },
      "incinerate": {
        "category": "Special",
        "basePower": 30
      },
      "knockoff": {
        "category": "Physical",
        "basePower": 20
      },
      "leafstorm": {
        "category": "Special",
        "basePower": 140
      },
      "leechlife": {
        "category": "Physical",
        "basePower": 20
      },
      "lick": {
        "category": "Physical",
        "basePower": 20
      },
      "lowsweep": {
        "category": "Physical",
        "basePower": 60
      },
      "lusterpurge": {
        "category": "Special",
        "basePower": 70
      },
      "magmastorm": {
        "category": "Special",
        "basePower": 120
      },
      "meteormash": {
        "category": "Physical",
        "basePower": 100
      },
      "mistball": {
        "category": "Special",
        "basePower": 70
      },
      "muddywater": {
        "category": "Special",
        "basePower": 95
      },
      "multiattack": {
        "category": "Physical",
        "basePower": 90
      },
      "mysticalfire": {
        "category": "Special",
        "basePower": 65
      },
      "overheat": {
        "category": "Special",
        "basePower": 140
      },
      "paraboliccharge": {
        "category": "Special",
        "basePower": 50
      },
      "pinmissile": {
        "category": "Physical",
        "basePower": 14,
        "multihit": [
          2,
          5
        ]
      },
      "powergem": {
        "category": "Special",
        "basePower": 70
      },
      "rapidspin": {
        "category": "Physical",
        "basePower": 20
      },
      "rocktomb": {
        "category": "Physical",
        "basePower": 50
      },
      "sappyseed": {
        "category": "Physical",
        "basePower": 90
      },
      "sizzlyslide": {
        "category": "Physical",
        "basePower": 90
      },
      "skullbash": {
        "category": "Physical",
        "basePower": 100
      },
      "smellingsalts": {
        "category": "Physical",
        "basePower": 60,
        "basePowerCallback": true
      },
      "smog": {
        "category": "Special",
        "basePower": 20
      },
      "snore": {
        "category": "Special",
        "basePower": 40
      },
      "sparklyswirl": {
        "category": "Special",
        "basePower": 90
      },
      "stormthrow": {
        "category": "Physical",
        "basePower": 40
      },
      "strugglebug": {
        "category": "Special",
        "basePower": 30
      },
      "suckerpunch": {
        "category": "Physical",
        "basePower": 80
      },
      "surf": {
        "category": "Special",
        "basePower": 95
      },
      "synchronoise": {
        "category": "Special",
        "basePower": 70
      },
      "tackle": {
        "category": "Physical",
        "basePower": 50
      },
      "technoblast": {
        "category": "Special",
        "basePower": 85
      },
      "thief": {
        "category": "Physical",
        "basePower": 40
      },
      "thunder": {
        "category": "Special",
        "basePower": 120,
        "onModifyMove": true
      },
      "thunderbolt": {
        "category": "Special",
        "basePower": 95
      },
      "vinewhip": {
        "category": "Physical",
        "basePower": 35
      },
      "wakeupslap": {
        "category": "Physical",
        "basePower": 60,
        "basePowerCallback": true
      },
      "waterpledge": {
        "category": "Special",
        "basePower": 50,
        "basePowerCallback": true,
        "onModifyMove": true
      },
      "watershuriken": {
        "category": "Physical",
        "basePower": 15,
        "multihit": [
          2,
          5
        ],
        "basePowerCallback": true
      },
      "wickedblow": {
        "category": "Physical",
        "basePower": 80
      },
      "zippyzap": {
        "category": "Physical",
        "basePower": 50
      }
    },
    "formats": {
      "venusaur": {
        "tier": "(OU)",
        "doublesTier": "DOU"
      },
      "charizard": {
        "tier": "NU",
        "doublesTier": "DOU"
      },
      "wartortle": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "blastoise": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "caterpie": {
        "tier": "LC"
      },
      "metapod": {
        "tier": "NFE"
      },
      "butterfree": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "weedle": {
        "tier": "LC"
      },
      "kakuna": {
        "tier": "NFE"
      },
      "beedrill": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "pidgey": {
        "tier": "LC"
      },
      "pidgeotto": {
        "tier": "NFE"
      },
      "pidgeot": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "rattata": {
        "tier": "LC"
      },
      "raticate": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "spearow": {
        "tier": "LC"
      },
      "fearow": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "arbok": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "pikachu": {
        "tier": "NFE"
      },
      "raichu": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "sandslash": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "nidoranf": {
        "tier": "LC"
      },
      "nidorina": {
        "tier": "NFE"
      },
      "nidoqueen": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "nidoranm": {
        "tier": "LC"
      },
      "nidorino": {
        "tier": "NFE"
      },
      "nidoking": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "clefable": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "vulpix": {
        "tier": "NFE"
      },
      "ninetales": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "wigglytuff": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "zubat": {
        "tier": "LC"
      },
      "golbat": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "crobat": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "vileplume": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "bellossom": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "paras": {
        "tier": "LC"
      },
      "parasect": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "venomoth": {
        "tier": "RUBL",
        "doublesTier": "DUU"
      },
      "diglett": {
        "tier": "LC"
      },
      "dugtrio": {
        "tier": "(OU)",
        "doublesTier": "DUU"
      },
      "persian": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "golduck": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "primeape": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "arcanine": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "poliwrath": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "politoed": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "abra": {
        "tier": "LC"
      },
      "kadabra": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "alakazam": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "machop": {
        "tier": "LC"
      },
      "machoke": {
        "tier": "ZUBL",
        "doublesTier": "NFE"
      },
      "machamp": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "victreebel": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "tentacool": {
        "tier": "PU"
      },
      "tentacruel": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "golem": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "ponyta": {
        "tier": "LC"
      },
      "rapidash": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "slowbro": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "slowking": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "magneton": {
        "tier": "RU",
        "doublesTier": "NFE"
      },
      "magnezone": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "farfetchd": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "dodrio": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "dewgong": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "muk": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "shellder": {
        "tier": "LC"
      },
      "cloyster": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "gastly": {
        "tier": "LC"
      },
      "haunter": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "gengar": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "onix": {
        "tier": "LC"
      },
      "steelix": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "hypno": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "krabby": {
        "tier": "LC"
      },
      "kingler": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "electrode": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "exeggutor": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "cubone": {
        "tier": "LC"
      },
      "marowak": {
        "tier": "ZUBL",
        "doublesTier": "DUU"
      },
      "hitmonlee": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "hitmonchan": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "hitmontop": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "lickitung": {
        "tier": "LC"
      },
      "lickilicky": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "weezing": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "rhydon": {
        "tier": "RU",
        "doublesTier": "NFE"
      },
      "rhyperior": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "chansey": {
        "tier": "UUBL",
        "doublesTier": "NFE"
      },
      "blissey": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "tangela": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "tangrowth": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "kangaskhan": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "kingdra": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "goldeen": {
        "tier": "LC"
      },
      "seaking": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "staryu": {
        "tier": "LC"
      },
      "starmie": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "mimejr": {
        "tier": "LC"
      },
      "mrmime": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "scyther": {
        "tier": "RU",
        "doublesTier": "NFE"
      },
      "scizor": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "smoochum": {
        "tier": "LC"
      },
      "jynx": {
        "tier": "NUBL",
        "doublesTier": "DUU"
      },
      "electabuzz": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "electivire": {
        "tier": "RU",
        "doublesTier": "DOU"
      },
      "magby": {
        "tier": "LC"
      },
      "magmortar": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "pinsir": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "tauros": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "gyarados": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "lapras": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "ditto": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "vaporeon": {
        "tier": "(OU)",
        "doublesTier": "DOU"
      },
      "jolteon": {
        "tier": "(OU)",
        "doublesTier": "DOU"
      },
      "flareon": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "espeon": {
        "tier": "(OU)",
        "doublesTier": "DOU"
      },
      "umbreon": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "leafeon": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "glaceon": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "porygon": {
        "tier": "LC"
      },
      "porygon2": {
        "tier": "UU",
        "doublesTier": "NFE"
      },
      "porygonz": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "omanyte": {
        "tier": "ZUBL",
        "doublesTier": "LC"
      },
      "omastar": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "kabuto": {
        "tier": "LC"
      },
      "kabutops": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "aerodactyl": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "snorlax": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "articuno": {
        "tier": "ZUBL",
        "doublesTier": "DUU"
      },
      "zapdos": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "moltres": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "dragonair": {
        "tier": "ZUBL",
        "doublesTier": "NFE"
      },
      "mew": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "meganium": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "typhlosion": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "feraligatr": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "furret": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "noctowl": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "ledyba": {
        "tier": "LC"
      },
      "ledian": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "ariados": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "lanturn": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "togepi": {
        "tier": "LC"
      },
      "togetic": {
        "tier": "NFE"
      },
      "togekiss": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "natu": {
        "tier": "PU"
      },
      "xatu": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "ampharos": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "azumarill": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "sudowoodo": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "jumpluff": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "ambipom": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "sunflora": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "yanmega": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "quagsire": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "murkrow": {
        "tier": "PU"
      },
      "honchkrow": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "misdreavus": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "mismagius": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "unown": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "wynaut": {
        "tier": "LC"
      },
      "wobbuffet": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "girafarig": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "forretress": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "dunsparce": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "gligar": {
        "tier": "UU",
        "doublesTier": "NFE"
      },
      "gliscor": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "granbull": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "qwilfish": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "shuckle": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "heracross": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "sneasel": {
        "tier": "PU"
      },
      "weavile": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "ursaring": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "magcargo": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "piloswine": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "mamoswine": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "corsola": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "remoraid": {
        "tier": "LC"
      },
      "octillery": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "delibird": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "mantyke": {
        "tier": "LC"
      },
      "mantine": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "skarmory": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "houndoom": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "donphan": {
        "tier": "(OU)",
        "doublesTier": "DUU"
      },
      "stantler": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "smeargle": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "miltank": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "raikou": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "entei": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "suicune": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "tyranitar": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "celebi": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "sceptile": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "torchic": {
        "tier": "LC"
      },
      "combusken": {
        "tier": "PUBL",
        "doublesTier": "DUU"
      },
      "blaziken": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "swampert": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "mightyena": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "zigzagoon": {
        "tier": "LC"
      },
      "linoone": {
        "tier": "PUBL",
        "doublesTier": "DUU"
      },
      "wurmple": {
        "tier": "LC"
      },
      "silcoon": {
        "tier": "NFE"
      },
      "beautifly": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "cascoon": {
        "tier": "NFE"
      },
      "dustox": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "ludicolo": {
        "tier": "NU",
        "doublesTier": "DOU"
      },
      "shiftry": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "taillow": {
        "tier": "LC"
      },
      "swellow": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "pelipper": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "gardevoir": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "gallade": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "masquerain": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "breloom": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "vigoroth": {
        "tier": "PUBL",
        "doublesTier": "NFE"
      },
      "slaking": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "nincada": {
        "tier": "LC"
      },
      "ninjask": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "shedinja": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "whismur": {
        "tier": "LC"
      },
      "loudred": {
        "tier": "NFE"
      },
      "exploud": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "hariyama": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "probopass": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "skitty": {
        "tier": "LC"
      },
      "delcatty": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "sableye": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "mawile": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "aron": {
        "tier": "LC"
      },
      "lairon": {
        "tier": "NFE"
      },
      "aggron": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "medicham": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "electrike": {
        "tier": "LC"
      },
      "manectric": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "plusle": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "minun": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "volbeat": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "illumise": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "budew": {
        "tier": "LC"
      },
      "roselia": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "roserade": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "swalot": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "carvanha": {
        "tier": "LC"
      },
      "sharpedo": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "wailmer": {
        "tier": "LC"
      },
      "wailord": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "camerupt": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "torkoal": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "grumpig": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "spinda": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "flygon": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "cacturne": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "altaria": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "zangoose": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "seviper": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "lunatone": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "solrock": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "whiscash": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "crawdaunt": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "baltoy": {
        "tier": "LC"
      },
      "claydol": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "lileep": {
        "tier": "LC"
      },
      "cradily": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "anorith": {
        "tier": "LC"
      },
      "armaldo": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "milotic": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "castform": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "kecleon": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "banette": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "dusclops": {
        "tier": "UU",
        "doublesTier": "NFE"
      },
      "dusknoir": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "tropius": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "chimecho": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "absol": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "glalie": {
        "tier": "ZUBL",
        "doublesTier": "DUU"
      },
      "froslass": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "spheal": {
        "tier": "LC"
      },
      "sealeo": {
        "tier": "NFE"
      },
      "walrein": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "clamperl": {
        "tier": "LC"
      },
      "huntail": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "gorebyss": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "relicanth": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "luvdisc": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "salamence": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "metang": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "metagross": {
        "tier": "(OU)",
        "doublesTier": "DOU"
      },
      "regirock": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "regice": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "registeel": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "latias": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "latios": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "jirachi": {
        "tier": "OU",
        "doublesTier": "DUber"
      },
      "deoxys": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "deoxysattack": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "deoxysdefense": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "deoxysspeed": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "torterra": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "monferno": {
        "tier": "PU"
      },
      "infernape": {
        "tier": "(OU)",
        "doublesTier": "DOU"
      },
      "empoleon": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "staraptor": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "bidoof": {
        "tier": "LC"
      },
      "bibarel": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "kricketune": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "luxray": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "rampardos": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "bastiodon": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "burmy": {
        "tier": "LC"
      },
      "wormadam": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "wormadamsandy": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "wormadamtrash": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "mothim": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "vespiquen": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "pachirisu": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "floatzel": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "cherubi": {
        "tier": "LC"
      },
      "cherrim": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "gastrodon": {
        "tier": "(OU)",
        "doublesTier": "DOU"
      },
      "drifblim": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "buneary": {
        "tier": "LC"
      },
      "lopunny": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "glameow": {
        "tier": "LC"
      },
      "purugly": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "skuntank": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "bronzor": {
        "tier": "PU"
      },
      "bronzong": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "chatot": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "spiritomb": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "gabite": {
        "tier": "PU"
      },
      "garchomp": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "riolu": {
        "tier": "PUBL",
        "doublesTier": "LC"
      },
      "lucario": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "hippowdon": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "skorupi": {
        "tier": "LC"
      },
      "drapion": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "toxicroak": {
        "tier": "(OU)",
        "doublesTier": "DOU"
      },
      "carnivine": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "lumineon": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "abomasnow": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "rotom": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "rotomheat": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "rotomwash": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "rotomfrost": {
        "tier": "PUBL",
        "doublesTier": "DUU"
      },
      "rotomfan": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "rotommow": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "uxie": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "mesprit": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "azelf": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "heatran": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "regigigas": {
        "tier": "ZUBL",
        "doublesTier": "DUU"
      },
      "cresselia": {
        "tier": "RUBL",
        "doublesTier": "DOU"
      },
      "phione": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "manaphy": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "darkrai": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "shaymin": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "shayminsky": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "victini": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "snivy": {
        "tier": "LC"
      },
      "serperior": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "emboar": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "samurott": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "patrat": {
        "tier": "LC"
      },
      "watchog": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "lillipup": {
        "tier": "LC"
      },
      "herdier": {
        "tier": "NFE"
      },
      "stoutland": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "purrloin": {
        "tier": "LC"
      },
      "liepard": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "pansage": {
        "tier": "LC"
      },
      "simisage": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "pansear": {
        "tier": "LC"
      },
      "simisear": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "panpour": {
        "tier": "LC"
      },
      "simipour": {
        "tier": "PUBL",
        "doublesTier": "DUU"
      },
      "munna": {
        "tier": "LC"
      },
      "musharna": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "pidove": {
        "tier": "LC"
      },
      "tranquill": {
        "tier": "NFE"
      },
      "unfezant": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "zebstrika": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "roggenrola": {
        "tier": "LC"
      },
      "boldore": {
        "tier": "NFE"
      },
      "gigalith": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "woobat": {
        "tier": "LC"
      },
      "swoobat": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "excadrill": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "audino": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "gurdurr": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "conkeldurr": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "tympole": {
        "tier": "LC"
      },
      "palpitoad": {
        "tier": "NFE"
      },
      "seismitoad": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "throh": {
        "tier": "PUBL",
        "doublesTier": "DUU"
      },
      "sawk": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "leavanny": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "venipede": {
        "tier": "LC"
      },
      "whirlipede": {
        "tier": "ZUBL",
        "doublesTier": "NFE"
      },
      "scolipede": {
        "tier": "NUBL",
        "doublesTier": "DUU"
      },
      "whimsicott": {
        "tier": "RU",
        "doublesTier": "DOU"
      },
      "lilligant": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "basculin": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "basculinbluestriped": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "krokorok": {
        "tier": "PU"
      },
      "krookodile": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "darumaka": {
        "tier": "LC"
      },
      "darmanitan": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "maractus": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "dwebble": {
        "tier": "PU"
      },
      "crustle": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "scraggy": {
        "tier": "PU"
      },
      "scrafty": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "sigilyph": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "yamask": {
        "tier": "LC"
      },
      "cofagrigus": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "tirtouga": {
        "tier": "LC"
      },
      "carracosta": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "archen": {
        "tier": "LC"
      },
      "archeops": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "trubbish": {
        "tier": "ZUBL",
        "doublesTier": "LC"
      },
      "garbodor": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "zoroark": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "cinccino": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "gothorita": {
        "tier": "PUBL",
        "doublesTier": "NFE"
      },
      "gothitelle": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "duosion": {
        "tier": "PU"
      },
      "reuniclus": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "swanna": {
        "tier": "PUBL",
        "doublesTier": "DUU"
      },
      "vanillite": {
        "tier": "LC"
      },
      "vanillish": {
        "tier": "NFE"
      },
      "vanilluxe": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "sawsbuck": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "emolga": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "karrablast": {
        "tier": "LC"
      },
      "escavalier": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "amoonguss": {
        "tier": "RU",
        "doublesTier": "DOU"
      },
      "frillish": {
        "tier": "LC"
      },
      "jellicent": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "alomomola": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "galvantula": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "ferroseed": {
        "tier": "RU",
        "doublesTier": "LC"
      },
      "ferrothorn": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "klink": {
        "tier": "LC"
      },
      "klang": {
        "tier": "PU"
      },
      "klinklang": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "eelektross": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "elgyem": {
        "tier": "LC"
      },
      "beheeyem": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "chandelure": {
        "tier": "UUBL",
        "doublesTier": "DOU"
      },
      "fraxure": {
        "tier": "PU"
      },
      "haxorus": {
        "tier": "(OU)",
        "doublesTier": "DUU"
      },
      "beartic": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "cryogonal": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "shelmet": {
        "tier": "LC"
      },
      "accelgor": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "stunfisk": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "mienshao": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "druddigon": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "golurk": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "bisharp": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "bouffalant": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "rufflet": {
        "tier": "LC"
      },
      "braviary": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "vullaby": {
        "tier": "LC"
      },
      "mandibuzz": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "heatmor": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "durant": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "zweilous": {
        "tier": "PU"
      },
      "hydreigon": {
        "tier": "(OU)",
        "doublesTier": "DOU"
      },
      "volcarona": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "cobalion": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "terrakion": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "virizion": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "tornadus": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "tornadustherian": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "thundurus": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "thundurustherian": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "landorus": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "kyurem": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "kyuremblack": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "keldeo": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "keldeoresolute": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "meloetta": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "genesect": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "genesectburn": {
        "tier": "Uber",
        "doublesTier": "(DOU)"
      },
      "genesectchill": {
        "tier": "Uber",
        "doublesTier": "(DOU)"
      },
      "genesectdouse": {
        "tier": "Uber",
        "doublesTier": "(DOU)"
      },
      "genesectshock": {
        "tier": "Uber",
        "doublesTier": "(DOU)"
      },
      "pokestargiant2": {
        "tier": "Illegal"
      },
      "pokestargiantpropo2": {
        "tier": "Illegal"
      }
    },
    "baseStats": {
      "butterfree": {
        "hp": 60,
        "atk": 45,
        "def": 50,
        "spa": 80,
        "spd": 80,
        "spe": 70
      },
      "beedrill": {
        "hp": 65,
        "atk": 80,
        "def": 40,
        "spa": 45,
        "spd": 80,
        "spe": 75
      },
      "pidgeot": {
        "hp": 83,
        "atk": 80,
        "def": 75,
        "spa": 70,
        "spd": 70,
        "spe": 91
      },
      "arbok": {
        "hp": 60,
        "atk": 85,
        "def": 69,
        "spa": 65,
        "spd": 79,
        "spe": 80
      },
      "pikachu": {
        "hp": 35,
        "atk": 55,
        "def": 30,
        "spa": 50,
        "spd": 40,
        "spe": 90
      },
      "raichu": {
        "hp": 60,
        "atk": 90,
        "def": 55,
        "spa": 90,
        "spd": 80,
        "spe": 100
      },
      "nidoqueen": {
        "hp": 90,
        "atk": 82,
        "def": 87,
        "spa": 75,
        "spd": 85,
        "spe": 76
      },
      "nidoking": {
        "hp": 81,
        "atk": 92,
        "def": 77,
        "spa": 85,
        "spd": 75,
        "spe": 85
      },
      "clefable": {
        "hp": 95,
        "atk": 70,
        "def": 73,
        "spa": 85,
        "spd": 90,
        "spe": 60
      },
      "wigglytuff": {
        "hp": 140,
        "atk": 70,
        "def": 45,
        "spa": 75,
        "spd": 50,
        "spe": 45
      },
      "vileplume": {
        "hp": 75,
        "atk": 80,
        "def": 85,
        "spa": 100,
        "spd": 90,
        "spe": 50
      },
      "dugtrio": {
        "hp": 35,
        "atk": 80,
        "def": 50,
        "spa": 50,
        "spd": 70,
        "spe": 120
      },
      "poliwrath": {
        "hp": 90,
        "atk": 85,
        "def": 95,
        "spa": 70,
        "spd": 90,
        "spe": 70
      },
      "alakazam": {
        "hp": 55,
        "atk": 50,
        "def": 45,
        "spa": 135,
        "spd": 85,
        "spe": 120
      },
      "alakazammega": {
        "hp": 55,
        "atk": 50,
        "def": 65,
        "spa": 175,
        "spd": 95,
        "spe": 150
      },
      "victreebel": {
        "hp": 80,
        "atk": 105,
        "def": 65,
        "spa": 100,
        "spd": 60,
        "spe": 70
      },
      "golem": {
        "hp": 80,
        "atk": 110,
        "def": 130,
        "spa": 55,
        "spd": 65,
        "spe": 45
      },
      "farfetchd": {
        "hp": 52,
        "atk": 65,
        "def": 55,
        "spa": 58,
        "spd": 62,
        "spe": 60
      },
      "dodrio": {
        "hp": 60,
        "atk": 110,
        "def": 70,
        "spa": 60,
        "spd": 60,
        "spe": 100
      },
      "electrode": {
        "hp": 60,
        "atk": 50,
        "def": 70,
        "spa": 80,
        "spd": 80,
        "spe": 140
      },
      "exeggutor": {
        "hp": 95,
        "atk": 95,
        "def": 85,
        "spa": 125,
        "spd": 65,
        "spe": 55
      },
      "noctowl": {
        "hp": 100,
        "atk": 50,
        "def": 50,
        "spa": 76,
        "spd": 96,
        "spe": 70
      },
      "ariados": {
        "hp": 70,
        "atk": 90,
        "def": 70,
        "spa": 60,
        "spd": 60,
        "spe": 40
      },
      "ampharos": {
        "hp": 90,
        "atk": 75,
        "def": 75,
        "spa": 115,
        "spd": 90,
        "spe": 55
      },
      "bellossom": {
        "hp": 75,
        "atk": 80,
        "def": 85,
        "spa": 90,
        "spd": 100,
        "spe": 50
      },
      "azumarill": {
        "hp": 100,
        "atk": 50,
        "def": 80,
        "spa": 50,
        "spd": 80,
        "spe": 50
      },
      "jumpluff": {
        "hp": 75,
        "atk": 55,
        "def": 70,
        "spa": 55,
        "spd": 85,
        "spe": 110
      },
      "qwilfish": {
        "hp": 65,
        "atk": 95,
        "def": 75,
        "spa": 55,
        "spd": 55,
        "spe": 85
      },
      "magcargo": {
        "hp": 50,
        "atk": 50,
        "def": 120,
        "spa": 80,
        "spd": 80,
        "spe": 30
      },
      "corsola": {
        "hp": 55,
        "atk": 55,
        "def": 85,
        "spa": 65,
        "spd": 85,
        "spe": 35
      },
      "mantine": {
        "hp": 65,
        "atk": 40,
        "def": 70,
        "spa": 80,
        "spd": 140,
        "spe": 70
      },
      "beautifly": {
        "hp": 60,
        "atk": 70,
        "def": 50,
        "spa": 90,
        "spd": 50,
        "spe": 65
      },
      "swellow": {
        "hp": 60,
        "atk": 85,
        "def": 60,
        "spa": 50,
        "spd": 50,
        "spe": 125
      },
      "pelipper": {
        "hp": 60,
        "atk": 50,
        "def": 100,
        "spa": 85,
        "spd": 70,
        "spe": 65
      },
      "masquerain": {
        "hp": 70,
        "atk": 60,
        "def": 62,
        "spa": 80,
        "spd": 82,
        "spe": 60
      },
      "exploud": {
        "hp": 104,
        "atk": 91,
        "def": 63,
        "spa": 91,
        "spd": 63,
        "spe": 68
      },
      "delcatty": {
        "hp": 70,
        "atk": 65,
        "def": 65,
        "spa": 55,
        "spd": 55,
        "spe": 70
      },
      "volbeat": {
        "hp": 65,
        "atk": 73,
        "def": 55,
        "spa": 47,
        "spd": 75,
        "spe": 85
      },
      "illumise": {
        "hp": 65,
        "atk": 47,
        "def": 55,
        "spa": 73,
        "spd": 75,
        "spe": 85
      },
      "lunatone": {
        "hp": 70,
        "atk": 55,
        "def": 65,
        "spa": 95,
        "spd": 85,
        "spe": 70
      },
      "solrock": {
        "hp": 70,
        "atk": 95,
        "def": 85,
        "spa": 55,
        "spd": 65,
        "spe": 70
      },
      "chimecho": {
        "hp": 65,
        "atk": 50,
        "def": 70,
        "spa": 95,
        "spd": 80,
        "spe": 65
      },
      "staraptor": {
        "hp": 85,
        "atk": 120,
        "def": 70,
        "spa": 50,
        "spd": 50,
        "spe": 100
      },
      "roserade": {
        "hp": 60,
        "atk": 70,
        "def": 55,
        "spa": 125,
        "spd": 105,
        "spe": 90
      },
      "cresselia": {
        "hp": 120,
        "atk": 70,
        "def": 120,
        "spa": 75,
        "spd": 130,
        "spe": 85
      },
      "stoutland": {
        "hp": 85,
        "atk": 100,
        "def": 90,
        "spa": 45,
        "spd": 90,
        "spe": 80
      },
      "unfezant": {
        "hp": 80,
        "atk": 105,
        "def": 80,
        "spa": 65,
        "spd": 55,
        "spe": 93
      },
      "gigalith": {
        "hp": 85,
        "atk": 135,
        "def": 130,
        "spa": 60,
        "spd": 70,
        "spe": 25
      },
      "woobat": {
        "hp": 55,
        "atk": 45,
        "def": 43,
        "spa": 55,
        "spd": 43,
        "spe": 72
      },
      "seismitoad": {
        "hp": 105,
        "atk": 85,
        "def": 75,
        "spa": 85,
        "spd": 75,
        "spe": 74
      },
      "leavanny": {
        "hp": 75,
        "atk": 103,
        "def": 80,
        "spa": 70,
        "spd": 70,
        "spe": 92
      },
      "scolipede": {
        "hp": 60,
        "atk": 90,
        "def": 89,
        "spa": 55,
        "spd": 69,
        "spe": 112
      },
      "krookodile": {
        "hp": 95,
        "atk": 117,
        "def": 70,
        "spa": 65,
        "spd": 70,
        "spe": 92
      },
      "crustle": {
        "hp": 70,
        "atk": 95,
        "def": 125,
        "spa": 65,
        "spd": 75,
        "spe": 45
      },
      "beartic": {
        "hp": 95,
        "atk": 110,
        "def": 80,
        "spa": 70,
        "spd": 80,
        "spe": 50
      },
      "cryogonal": {
        "hp": 70,
        "atk": 50,
        "def": 30,
        "spa": 95,
        "spd": 135,
        "spe": 105
      },
      "aegislash": {
        "hp": 60,
        "atk": 50,
        "def": 150,
        "spa": 50,
        "spd": 150,
        "spe": 60
      },
      "aegislashblade": {
        "hp": 60,
        "atk": 150,
        "def": 50,
        "spa": 150,
        "spd": 50,
        "spe": 60
      },
      "zacian": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zaciancrowned": {
        "hp": 92,
        "atk": 170,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 148
      },
      "zamazenta": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zamazentacrowned": {
        "hp": 92,
        "atk": 130,
        "def": 145,
        "spa": 80,
        "spd": 145,
        "spe": 128
      },
      "pyroak": {
        "hp": 120,
        "atk": 70,
        "def": 105,
        "spa": 95,
        "spd": 90,
        "spe": 60
      },
      "kitsunoh": {
        "hp": 80,
        "atk": 103,
        "def": 85,
        "spa": 55,
        "spd": 80,
        "spe": 110
      },
      "voodoom": {
        "hp": 90,
        "atk": 85,
        "def": 80,
        "spa": 105,
        "spd": 80,
        "spe": 110
      },
      "necturna": {
        "hp": 64,
        "atk": 120,
        "def": 100,
        "spa": 85,
        "spd": 120,
        "spe": 81
      },
      "crucibellemega": {
        "hp": 106,
        "atk": 135,
        "def": 75,
        "spa": 85,
        "spd": 125,
        "spe": 114
      }
    },
    "abilities": {
      "charizardmegax": [],
      "blastoisemega": [],
      "pikachuoriginal": [
        "Static"
      ],
      "pikachuhoenn": [
        "Static"
      ],
      "pikachusinnoh": [
        "Static"
      ],
      "pikachuunova": [
        "Static"
      ],
      "pikachukalos": [
        "Static"
      ],
      "pikachualola": [
        "Static"
      ],
      "pikachupartner": [
        "Static"
      ],
      "raichualola": [],
      "raichumegax": [],
      "sandshrewalola": [
        "Snow Cloak"
      ],
      "sandslashalola": [
        "Snow Cloak"
      ],
      "jigglypuff": [
        "Cute Charm",
        "Friend Guard"
      ],
      "wigglytuff": [
        "Cute Charm",
        "Frisk"
      ],
      "diglettalola": [
        "Sand Veil",
        "Sand Force"
      ],
      "dugtrioalola": [
        "Sand Veil",
        "Sand Force"
      ],
      "meowthgalar": [
        "Pickup",
        "Unnerve"
      ],
      "persianalola": [
        "Technician",
        "Rattled"
      ],
      "growlithehisui": [
        "Intimidate",
        "Flash Fire",
        "Justified"
      ],
      "arcaninehisui": [
        "Intimidate",
        "Flash Fire",
        "Justified"
      ],
      "victreebelmega": [],
      "geodudealola": [
        "Magnet Pull",
        "Sturdy"
      ],
      "graveleralola": [
        "Magnet Pull",
        "Sturdy"
      ],
      "golemalola": [
        "Magnet Pull",
        "Sturdy"
      ],
      "ponytagalar": [
        "Run Away",
        "Anticipation"
      ],
      "rapidashgalar": [
        "Run Away",
        "Anticipation"
      ],
      "slowbrogalar": [
        "Own Tempo",
        "Regenerator"
      ],
      "grimeralola": [
        "Poison Touch",
        "Gluttony"
      ],
      "mukalola": [
        "Poison Touch",
        "Gluttony"
      ],
      "gengar": [
        "Levitate"
      ],
      "koffing": [
        "Levitate"
      ],
      "weezing": [
        "Levitate"
      ],
      "weezinggalar": [
        "Levitate"
      ],
      "kangaskhanmega": [],
      "mrmimegalar": [
        "Vital Spirit",
        "Ice Body"
      ],
      "pinsirmega": [],
      "taurospaldeacombat": [
        "Intimidate",
        "Anger Point"
      ],
      "taurospaldeablaze": [
        "Intimidate",
        "Anger Point"
      ],
      "taurospaldeaaqua": [
        "Intimidate",
        "Anger Point"
      ],
      "aerodactylmega": [],
      "articunogalar": [],
      "zapdos": [
        "Pressure",
        "Lightning Rod"
      ],
      "moltresgalar": [],
      "meganiummega": [],
      "typhlosionhisui": [
        "Blaze",
        "Flash Fire"
      ],
      "feraligatrmega": [],
      "igglybuff": [
        "Cute Charm",
        "Friend Guard"
      ],
      "slowkinggalar": [
        "Own Tempo",
        "Regenerator"
      ],
      "sneaselhisui": [
        "Inner Focus",
        "Keen Eye",
        "Poison Touch"
      ],
      "skarmorymega": [],
      "raikou": [
        "Pressure",
        "Volt Absorb"
      ],
      "entei": [
        "Pressure",
        "Flash Fire"
      ],
      "suicune": [
        "Pressure",
        "Water Absorb"
      ],
      "shiftry": [
        "Chlorophyll",
        "Early Bird",
        "Pickpocket"
      ],
      "wingull": [
        "Keen Eye",
        "Rain Dish"
      ],
      "pelipper": [
        "Keen Eye",
        "Rain Dish"
      ],
      "gardevoirmega": [],
      "plusle": [
        "Plus"
      ],
      "minun": [
        "Minus"
      ],
      "sharpedomega": [],
      "torkoal": [
        "White Smoke",
        "Shell Armor"
      ],
      "altariamega": [],
      "feebas": [
        "Swift Swim",
        "Adaptability"
      ],
      "milotic": [
        "Marvel Scale",
        "Cute Charm"
      ],
      "kecleon": [
        "Color Change"
      ],
      "duskull": [
        "Levitate"
      ],
      "dusclops": [
        "Pressure"
      ],
      "absolmegaz": [],
      "glaliemega": [],
      "salamencemega": [],
      "metagrossmega": [],
      "kyogreprimal": [],
      "groudonprimal": [],
      "rayquazamega": [],
      "piplup": [
        "Torrent",
        "Defiant"
      ],
      "prinplup": [
        "Torrent",
        "Defiant"
      ],
      "empoleon": [
        "Torrent",
        "Defiant"
      ],
      "starly": [
        "Keen Eye"
      ],
      "lucariomegaz": [],
      "gallade": [
        "Steadfast",
        "Justified"
      ],
      "dusknoir": [
        "Pressure"
      ],
      "samurotthisui": [
        "Torrent",
        "Shell Armor"
      ],
      "roggenrola": [
        "Sturdy",
        "Sand Force"
      ],
      "boldore": [
        "Sturdy",
        "Sand Force"
      ],
      "gigalith": [
        "Sturdy",
        "Sand Force"
      ],
      "excadrillmega": [],
      "venipede": [
        "Poison Point",
        "Swarm",
        "Quick Feet"
      ],
      "whirlipede": [
        "Poison Point",
        "Swarm",
        "Quick Feet"
      ],
      "scolipede": [
        "Poison Point",
        "Swarm",
        "Quick Feet"
      ],
      "basculinbluestriped": [
        "Rock Head",
        "Adaptability",
        "Mold Breaker",
        "Reckless"
      ],
      "darmanitangalar": [
        "Zen Mode"
      ],
      "yamaskgalar": [],
      "gothita": [
        "Frisk",
        "Shadow Tag"
      ],
      "gothorita": [
        "Frisk",
        "Shadow Tag"
      ],
      "gothitelle": [
        "Frisk",
        "Shadow Tag"
      ],
      "vanillite": [
        "Ice Body",
        "Weak Armor"
      ],
      "vanillish": [
        "Ice Body",
        "Weak Armor"
      ],
      "vanilluxe": [
        "Ice Body",
        "Weak Armor"
      ],
      "ferrothorn": [
        "Iron Barbs"
      ],
      "eelektrossmega": [],
      "litwick": [
        "Flash Fire",
        "Flame Body",
        "Shadow Tag"
      ],
      "lampent": [
        "Flash Fire",
        "Flame Body",
        "Shadow Tag"
      ],
      "chandelure": [
        "Flash Fire",
        "Flame Body",
        "Shadow Tag"
      ],
      "cubchoo": [
        "Snow Cloak",
        "Rattled"
      ],
      "beartic": [
        "Snow Cloak",
        "Swift Swim"
      ],
      "stunfiskgalar": [],
      "golurkmega": [],
      "braviaryhisui": [
        "Keen Eye",
        "Sheer Force",
        "Defiant"
      ],
      "chespin": [
        "Overgrow"
      ],
      "quilladin": [
        "Overgrow"
      ],
      "chesnaught": [
        "Overgrow"
      ],
      "chesnaughtmega": [],
      "fennekin": [
        "Blaze"
      ],
      "braixen": [
        "Blaze"
      ],
      "delphox": [
        "Blaze"
      ],
      "froakie": [
        "Torrent"
      ],
      "frogadier": [
        "Torrent"
      ],
      "greninja": [
        "Torrent"
      ],
      "greninjabond": [],
      "greninjaash": [],
      "greninjamega": [],
      "bunnelby": [
        "Pickup",
        "Huge Power"
      ],
      "diggersby": [
        "Pickup",
        "Huge Power"
      ],
      "fletchling": [
        "Big Pecks"
      ],
      "fletchinder": [
        "Flame Body"
      ],
      "talonflame": [
        "Flame Body"
      ],
      "vivillonfancy": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonpokeball": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "pyroarmega": [],
      "flabebe": [],
      "floette": [],
      "floetteeternal": [],
      "floettemega": [],
      "florges": [],
      "skiddo": [
        "Sap Sipper"
      ],
      "gogoat": [
        "Sap Sipper"
      ],
      "furfrou": [],
      "meowsticf": [
        "Keen Eye",
        "Infiltrator"
      ],
      "aegislash": [],
      "aegislashblade": [],
      "spritzee": [
        "Healer"
      ],
      "aromatisse": [
        "Healer"
      ],
      "swirlix": [
        "Unburden"
      ],
      "slurpuff": [
        "Unburden"
      ],
      "binacle": [
        "Sniper",
        "Pickpocket"
      ],
      "barbaracle": [
        "Sniper",
        "Pickpocket"
      ],
      "barbaraclemega": [],
      "clauncher": [],
      "clawitzer": [],
      "tyrunt": [
        "Sturdy"
      ],
      "tyrantrum": [
        "Rock Head"
      ],
      "amaura": [
        "Snow Warning"
      ],
      "aurorus": [
        "Snow Warning"
      ],
      "sylveon": [
        "Cute Charm"
      ],
      "dedenne": [
        "Pickup",
        "Plus"
      ],
      "goomy": [
        "Sap Sipper",
        "Hydration"
      ],
      "sliggoo": [
        "Sap Sipper",
        "Hydration"
      ],
      "sliggoohisui": [
        "Sap Sipper",
        "Overcoat"
      ],
      "goodra": [
        "Sap Sipper",
        "Hydration"
      ],
      "goodrahisui": [
        "Sap Sipper",
        "Overcoat"
      ],
      "klefki": [
        "Prankster"
      ],
      "pumpkaboosmall": [
        "Pickup",
        "Frisk"
      ],
      "pumpkaboolarge": [
        "Pickup",
        "Frisk"
      ],
      "gourgeistsmall": [
        "Pickup",
        "Frisk"
      ],
      "gourgeistlarge": [
        "Pickup",
        "Frisk"
      ],
      "avalugghisui": [
        "Ice Body",
        "Sturdy"
      ],
      "xerneas": [],
      "xerneasneutral": [],
      "yveltal": [],
      "zygarde": [],
      "zygarde10": [],
      "zygardecomplete": [],
      "zygardemega": [],
      "hoopa": [],
      "hoopaunbound": [],
      "rowlet": [
        "Overgrow"
      ],
      "dartrix": [
        "Overgrow"
      ],
      "decidueye": [
        "Overgrow"
      ],
      "decidueyehisui": [
        "Overgrow"
      ],
      "popplio": [
        "Torrent"
      ],
      "brionne": [
        "Torrent"
      ],
      "primarina": [
        "Torrent"
      ],
      "yungoos": [
        "Adaptability"
      ],
      "gumshoos": [
        "Adaptability"
      ],
      "charjabug": [],
      "oricorio": [],
      "oricoriopompom": [],
      "oricoriopau": [],
      "oricoriosensu": [],
      "cutiefly": [
        "Honey Gather",
        "Shield Dust"
      ],
      "ribombee": [
        "Honey Gather",
        "Shield Dust"
      ],
      "ribombeetotem": [],
      "lycanrocdusk": [],
      "wishiwashi": [],
      "wishiwashischool": [],
      "mareanie": [
        "Limber",
        "Regenerator"
      ],
      "toxapex": [
        "Limber",
        "Regenerator"
      ],
      "mudbray": [
        "Own Tempo",
        "Inner Focus"
      ],
      "mudsdale": [
        "Own Tempo",
        "Inner Focus"
      ],
      "dewpider": [
        "Water Absorb"
      ],
      "araquanid": [
        "Water Absorb"
      ],
      "araquanidtotem": [],
      "salandit": [
        "Oblivious"
      ],
      "salazzle": [
        "Oblivious"
      ],
      "salazzletotem": [],
      "stufful": [
        "Klutz",
        "Cute Charm"
      ],
      "bewear": [
        "Klutz",
        "Unnerve"
      ],
      "bounsweet": [
        "Leaf Guard",
        "Oblivious"
      ],
      "steenee": [
        "Leaf Guard",
        "Oblivious"
      ],
      "tsareena": [
        "Leaf Guard"
      ],
      "comfey": [
        "Natural Cure"
      ],
      "oranguru": [
        "Inner Focus",
        "Telepathy"
      ],
      "passimian": [
        "Defiant"
      ],
      "wimpod": [],
      "golisopod": [],
      "golisopodmega": [],
      "sandygast": [
        "Sand Veil"
      ],
      "palossand": [
        "Sand Veil"
      ],
      "pyukumuku": [
        "Unaware"
      ],
      "silvally": [],
      "silvallybug": [],
      "silvallydark": [],
      "silvallydragon": [],
      "silvallyelectric": [],
      "silvallyfairy": [],
      "silvallyfighting": [],
      "silvallyfire": [],
      "silvallyflying": [],
      "silvallyghost": [],
      "silvallygrass": [],
      "silvallyground": [],
      "silvallyice": [],
      "silvallypoison": [],
      "silvallypsychic": [],
      "silvallyrock": [],
      "silvallysteel": [],
      "silvallywater": [],
      "minior": [],
      "miniororange": [],
      "minioryellow": [],
      "miniorgreen": [],
      "miniorblue": [],
      "miniorindigo": [],
      "miniorviolet": [],
      "miniormeteor": [],
      "komala": [],
      "mimikyu": [],
      "mimikyubusted": [],
      "mimikyutotem": [],
      "mimikyubustedtotem": [],
      "bruxish": [
        "Wonder Skin"
      ],
      "drampa": [
        "Sap Sipper",
        "Cloud Nine"
      ],
      "drampamega": [],
      "dhelmise": [],
      "jangmoo": [
        "Soundproof",
        "Overcoat"
      ],
      "hakamoo": [
        "Soundproof",
        "Overcoat"
      ],
      "kommoo": [
        "Soundproof",
        "Overcoat"
      ],
      "tapukoko": [],
      "tapulele": [],
      "tapubulu": [],
      "tapufini": [],
      "solgaleo": [],
      "lunala": [],
      "nihilego": [],
      "buzzwole": [],
      "pheromosa": [],
      "xurkitree": [],
      "celesteela": [],
      "kartana": [],
      "guzzlord": [],
      "necrozma": [],
      "necrozmaduskmane": [],
      "necrozmadawnwings": [],
      "necrozmaultra": [],
      "magearna": [],
      "magearnaoriginal": [],
      "magearnamega": [],
      "magearnaoriginalmega": [],
      "poipole": [],
      "naganadel": [],
      "stakataka": [],
      "blacephalon": [],
      "grookey": [
        "Overgrow"
      ],
      "thwackey": [
        "Overgrow"
      ],
      "rillaboom": [
        "Overgrow"
      ],
      "rillaboomgmax": [
        "Overgrow"
      ],
      "scorbunny": [
        "Blaze"
      ],
      "raboot": [
        "Blaze"
      ],
      "cinderace": [
        "Blaze"
      ],
      "cinderacegmax": [
        "Blaze"
      ],
      "skwovet": [
        "Gluttony"
      ],
      "greedent": [
        "Gluttony"
      ],
      "corviknight": [
        "Pressure",
        "Unnerve"
      ],
      "corviknightgmax": [
        "Pressure",
        "Unnerve"
      ],
      "nickit": [
        "Run Away",
        "Unburden"
      ],
      "thievul": [
        "Run Away",
        "Unburden"
      ],
      "gossifleur": [
        "Regenerator",
        "Effect Spore"
      ],
      "eldegoss": [
        "Regenerator",
        "Effect Spore"
      ],
      "wooloo": [
        "Run Away"
      ],
      "dubwool": [
        "Steadfast"
      ],
      "chewtle": [
        "Shell Armor",
        "Swift Swim"
      ],
      "drednaw": [
        "Shell Armor",
        "Swift Swim"
      ],
      "drednawgmax": [
        "Shell Armor",
        "Swift Swim"
      ],
      "yamper": [
        "Rattled"
      ],
      "boltund": [],
      "rolycoly": [
        "Heatproof",
        "Flash Fire"
      ],
      "carkol": [
        "Flame Body",
        "Flash Fire"
      ],
      "coalossal": [
        "Flame Body",
        "Flash Fire"
      ],
      "coalossalgmax": [
        "Flame Body",
        "Flash Fire"
      ],
      "applin": [
        "Gluttony"
      ],
      "flapple": [
        "Gluttony",
        "Hustle"
      ],
      "flapplegmax": [
        "Gluttony",
        "Hustle"
      ],
      "appletun": [
        "Gluttony",
        "Thick Fat"
      ],
      "appletungmax": [
        "Gluttony",
        "Thick Fat"
      ],
      "silicobra": [
        "Shed Skin",
        "Sand Veil"
      ],
      "sandaconda": [
        "Shed Skin",
        "Sand Veil"
      ],
      "sandacondagmax": [
        "Shed Skin",
        "Sand Veil"
      ],
      "cramorant": [],
      "cramorantgulping": [],
      "cramorantgorging": [],
      "arrokuda": [
        "Swift Swim"
      ],
      "barraskewda": [
        "Swift Swim"
      ],
      "toxtricity": [
        "Plus",
        "Technician"
      ],
      "toxtricitylowkey": [
        "Minus",
        "Technician"
      ],
      "toxtricitygmax": [
        "Plus",
        "Technician"
      ],
      "toxtricitylowkeygmax": [
        "Minus",
        "Technician"
      ],
      "perrserker": [
        "Battle Armor"
      ],
      "cursola": [
        "Weak Armor"
      ],
      "mrrime": [
        "Tangled Feet",
        "Ice Body"
      ],
      "runerigus": [],
      "milcery": [],
      "alcremie": [],
      "alcremierubycream": [],
      "alcremiematchacream": [],
      "alcremiemintcream": [],
      "alcremielemoncream": [],
      "alcremierubyswirl": [],
      "alcremiecaramelswirl": [],
      "alcremierainbowswirl": [],
      "alcremiegmax": [],
      "pincurchin": [
        "Lightning Rod"
      ],
      "snom": [
        "Shield Dust"
      ],
      "frosmoth": [
        "Shield Dust"
      ],
      "stonjourner": [],
      "eiscue": [],
      "eiscuenoice": [],
      "indeedee": [
        "Inner Focus",
        "Synchronize"
      ],
      "indeedeef": [
        "Own Tempo",
        "Synchronize"
      ],
      "morpeko": [],
      "morpekohangry": [],
      "arctozolt": [
        "Volt Absorb",
        "Static"
      ],
      "dracovish": [
        "Water Absorb",
        "Sand Rush"
      ],
      "arctovish": [
        "Water Absorb",
        "Ice Body"
      ],
      "duraludon": [
        "Light Metal",
        "Heavy Metal"
      ],
      "duraludongmax": [
        "Light Metal",
        "Heavy Metal"
      ],
      "zacian": [],
      "zaciancrowned": [],
      "zamazenta": [],
      "zamazentacrowned": [],
      "urshifu": [],
      "urshifurapidstrike": [],
      "urshifugmax": [],
      "urshifurapidstrikegmax": [],
      "regieleki": [],
      "regidrago": [],
      "glastrier": [],
      "spectrier": [],
      "calyrexice": [],
      "calyrexshadow": [],
      "kleavor": [
        "Swarm",
        "Sheer Force",
        "Steadfast"
      ],
      "ursaluna": [
        "Guts",
        "Unnerve"
      ],
      "ursalunabloodmoon": [],
      "basculegion": [
        "Rattled",
        "Adaptability",
        "Mold Breaker"
      ],
      "basculegionf": [
        "Rattled",
        "Adaptability",
        "Mold Breaker"
      ],
      "sneasler": [
        "Pressure",
        "Poison Touch"
      ],
      "enamorus": [
        "Healer",
        "Contrary"
      ],
      "sprigatito": [
        "Overgrow"
      ],
      "floragato": [
        "Overgrow"
      ],
      "meowscarada": [
        "Overgrow"
      ],
      "lechonk": [
        "Gluttony",
        "Thick Fat"
      ],
      "oinkologne": [
        "Gluttony",
        "Thick Fat"
      ],
      "oinkolognef": [
        "Gluttony",
        "Thick Fat"
      ],
      "tarountula": [
        "Insomnia"
      ],
      "spidops": [
        "Insomnia"
      ],
      "maushold": [
        "Friend Guard",
        "Technician"
      ],
      "mausholdfour": [
        "Friend Guard",
        "Technician"
      ],
      "dachsbun": [],
      "arboliva": [
        "Harvest"
      ],
      "nacli": [
        "Sturdy",
        "Clear Body"
      ],
      "naclstack": [
        "Sturdy",
        "Clear Body"
      ],
      "garganacl": [
        "Sturdy",
        "Clear Body"
      ],
      "bellibolt": [
        "Static",
        "Damp"
      ],
      "wattrel": [
        "Volt Absorb"
      ],
      "kilowattrel": [
        "Volt Absorb"
      ],
      "maschiff": [
        "Intimidate",
        "Run Away"
      ],
      "mabosstiff": [
        "Intimidate"
      ],
      "bramblin": [
        "Infiltrator"
      ],
      "brambleghast": [
        "Infiltrator"
      ],
      "toedscool": [],
      "toedscruel": [],
      "klawf": [
        "Shell Armor",
        "Regenerator"
      ],
      "scovillainmega": [],
      "espathra": [
        "Frisk",
        "Speed Boost"
      ],
      "wiglett": [
        "Rattled",
        "Sand Veil"
      ],
      "wugtrio": [
        "Rattled",
        "Sand Veil"
      ],
      "bombirdier": [
        "Big Pecks",
        "Keen Eye"
      ],
      "palafin": [],
      "palafinhero": [],
      "orthworm": [
        "Sand Veil"
      ],
      "glimmet": [],
      "glimmora": [],
      "greavard": [
        "Pickup"
      ],
      "houndstone": [
        "Sand Rush"
      ],
      "flamigo": [
        "Scrappy",
        "Tangled Feet"
      ],
      "cetitan": [
        "Thick Fat",
        "Sheer Force"
      ],
      "veluza": [
        "Mold Breaker"
      ],
      "tatsugiri": [
        "Storm Drain"
      ],
      "tatsugiridroopy": [
        "Storm Drain"
      ],
      "tatsugiristretchy": [
        "Storm Drain"
      ],
      "tatsugiricurlymega": [
        "Storm Drain"
      ],
      "tatsugiridroopymega": [
        "Storm Drain"
      ],
      "tatsugiristretchymega": [
        "Storm Drain"
      ],
      "farigiraf": [
        "Sap Sipper"
      ],
      "kingambit": [
        "Defiant",
        "Pressure"
      ],
      "greattusk": [],
      "screamtail": [],
      "brutebonnet": [],
      "fluttermane": [],
      "slitherwing": [],
      "sandyshocks": [],
      "irontreads": [],
      "ironbundle": [],
      "ironhands": [],
      "ironjugulis": [],
      "ironmoth": [],
      "ironthorns": [],
      "frigibax": [
        "Ice Body"
      ],
      "arctibax": [
        "Ice Body"
      ],
      "baxcalibur": [
        "Ice Body"
      ],
      "baxcaliburmega": [],
      "gholdengo": [],
      "wochien": [],
      "chienpao": [],
      "tinglu": [],
      "chiyu": [],
      "roaringmoon": [],
      "ironvaliant": [],
      "koraidon": [],
      "miraidon": [],
      "walkingwake": [],
      "ironleaves": [],
      "dipplin": [
        "Gluttony",
        "Sticky Hold"
      ],
      "poltchageist": [
        "Heatproof"
      ],
      "poltchageistartisan": [
        "Heatproof"
      ],
      "sinistcha": [
        "Heatproof"
      ],
      "sinistchamasterpiece": [
        "Heatproof"
      ],
      "okidogi": [],
      "munkidori": [
        "Frisk"
      ],
      "fezandipiti": [
        "Technician"
      ],
      "ogerpontealtera": [],
      "ogerponwellspringtera": [],
      "ogerponhearthflametera": [],
      "ogerponcornerstonetera": [],
      "archaludon": [
        "Sturdy"
      ],
      "hydrapple": [
        "Regenerator",
        "Sticky Hold"
      ],
      "gougingfire": [],
      "ragingbolt": [],
      "ironboulder": [],
      "ironcrown": [],
      "terapagos": [],
      "terapagosterastal": [],
      "terapagosstellar": [],
      "pecharunt": [],
      "syclant": [
        "Compound Eyes",
        "Mountaineer"
      ],
      "revenankh": [
        "Air Lock",
        "Shed Skin"
      ],
      "pyroak": [
        "Rock Head",
        "Battle Armor"
      ],
      "fidgit": [
        "Persistent",
        "Vital Spirit"
      ],
      "stratagem": [
        "Levitate",
        "Technician"
      ],
      "arghonaut": [
        "Unaware"
      ],
      "kitsunoh": [
        "Frisk",
        "Limber"
      ],
      "cyclohm": [
        "Shield Dust",
        "Static"
      ],
      "colossoil": [
        "Rebound",
        "Guts"
      ],
      "krilowatt": [
        "Trace",
        "Magic Guard"
      ],
      "voodoom": [
        "Volt Absorb",
        "Lightning Rod"
      ],
      "malaconda": [
        "Harvest",
        "Infiltrator"
      ],
      "naviathan": [
        "Water Veil",
        "Heatproof",
        "Light Metal"
      ],
      "pluffle": [
        "Natural Cure",
        "Friend Guard"
      ],
      "kerfluffle": [
        "Natural Cure",
        "Friend Guard"
      ],
      "pajantom": [],
      "electrelk": [
        "Overgrow"
      ],
      "caribolt": [
        "Overgrow"
      ],
      "justyke": [
        "Levitate",
        "Justified"
      ],
      "equilibra": [
        "Levitate",
        "Justified"
      ],
      "solotl": [
        "Regenerator",
        "Vital Spirit"
      ],
      "astrolotl": [
        "Regenerator",
        "Vital Spirit"
      ],
      "miasmite": [
        "Hyper Cutter",
        "Compound Eyes"
      ],
      "miasmaw": [
        "Hyper Cutter",
        "Compound Eyes"
      ],
      "venomicon": [],
      "saharascal": [
        "Water Absorb",
        "Pickpocket"
      ],
      "saharaja": [
        "Water Absorb",
        "Serene Grace"
      ],
      "ababo": [
        "Rattled",
        "Own Tempo"
      ],
      "scattervein": [
        "Intimidate",
        "Own Tempo"
      ],
      "hemogoblin": [
        "Intimidate",
        "Own Tempo"
      ],
      "draggalong": [
        "White Smoke",
        "Slow Start"
      ],
      "chuggalong": [
        "White Smoke",
        "Slow Start"
      ],
      "flox": [
        "Static",
        "Sticky Hold"
      ],
      "shox": [
        "Sticky Hold"
      ],
      "scraptor": [
        "Early Bird",
        "Pickup"
      ],
      "obliteryx": [
        "Early Bird",
        "Sniper"
      ]
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
    "moves": {},
    "moveData": {
      "baddybad": {
        "category": "Special",
        "basePower": 90
      },
      "bouncybubble": {
        "category": "Special",
        "basePower": 90
      },
      "buzzybuzz": {
        "category": "Special",
        "basePower": 90
      },
      "fellstinger": {
        "category": "Physical",
        "basePower": 30
      },
      "flyingpress": {
        "category": "Physical",
        "basePower": 80
      },
      "freezyfrost": {
        "category": "Special",
        "basePower": 90
      },
      "glaciallance": {
        "category": "Physical",
        "basePower": 130
      },
      "glitzyglow": {
        "category": "Special",
        "basePower": 90
      },
      "grassyglide": {
        "category": "Physical",
        "basePower": 70
      },
      "leechlife": {
        "category": "Physical",
        "basePower": 20
      },
      "lusterpurge": {
        "category": "Special",
        "basePower": 70
      },
      "mistball": {
        "category": "Special",
        "basePower": 70
      },
      "multiattack": {
        "category": "Physical",
        "basePower": 90
      },
      "mysticalfire": {
        "category": "Special",
        "basePower": 65
      },
      "paraboliccharge": {
        "category": "Special",
        "basePower": 50
      },
      "rapidspin": {
        "category": "Physical",
        "basePower": 20
      },
      "sappyseed": {
        "category": "Physical",
        "basePower": 90
      },
      "sizzlyslide": {
        "category": "Physical",
        "basePower": 90
      },
      "sparklyswirl": {
        "category": "Special",
        "basePower": 90
      },
      "suckerpunch": {
        "category": "Physical",
        "basePower": 80
      },
      "tackle": {
        "category": "Physical",
        "basePower": 50
      },
      "watershuriken": {
        "category": "Physical",
        "basePower": 15,
        "multihit": [
          2,
          5
        ],
        "basePowerCallback": true
      },
      "wickedblow": {
        "category": "Physical",
        "basePower": 80
      },
      "zippyzap": {
        "category": "Physical",
        "basePower": 50
      }
    },
    "formats": {
      "venusaur": {
        "tier": "RU",
        "doublesTier": "DOU"
      },
      "venusaurmega": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "charizard": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "charizardmegax": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "charizardmegay": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "blastoise": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "blastoisemega": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "caterpie": {
        "tier": "LC"
      },
      "metapod": {
        "tier": "NFE"
      },
      "butterfree": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "weedle": {
        "tier": "LC"
      },
      "kakuna": {
        "tier": "NFE"
      },
      "beedrill": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "beedrillmega": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "pidgey": {
        "tier": "LC"
      },
      "pidgeotto": {
        "tier": "NFE"
      },
      "pidgeot": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "pidgeotmega": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "rattata": {
        "tier": "LC"
      },
      "raticate": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "spearow": {
        "tier": "LC"
      },
      "fearow": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "arbok": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "pikachucosplay": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "pikachurockstar": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "pikachubelle": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "pikachupopstar": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "pikachuphd": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "pikachulibre": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "raichu": {
        "tier": "PU",
        "doublesTier": "DOU"
      },
      "sandslash": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "nidoranf": {
        "tier": "LC"
      },
      "nidorina": {
        "tier": "NFE"
      },
      "nidoqueen": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "nidoranm": {
        "tier": "LC"
      },
      "nidorino": {
        "tier": "NFE"
      },
      "nidoking": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "clefairy": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "clefable": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "vulpix": {
        "tier": "LC"
      },
      "ninetales": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "zubat": {
        "tier": "LC"
      },
      "golbat": {
        "tier": "RU",
        "doublesTier": "NFE"
      },
      "crobat": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "vileplume": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "bellossom": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "paras": {
        "tier": "LC"
      },
      "parasect": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "venomoth": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "diglett": {
        "tier": "LC"
      },
      "dugtrio": {
        "tier": "(OU)",
        "doublesTier": "(DUU)"
      },
      "primeape": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "arcanine": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "poliwrath": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "politoed": {
        "tier": "ZU",
        "doublesTier": "DOU"
      },
      "abra": {
        "tier": "LC"
      },
      "kadabra": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "alakazam": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "alakazammega": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "machop": {
        "tier": "LC"
      },
      "machoke": {
        "tier": "PUBL",
        "doublesTier": "NFE"
      },
      "machamp": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "victreebel": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "tentacruel": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "golem": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "ponyta": {
        "tier": "LC"
      },
      "rapidash": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "slowbro": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "slowbromega": {
        "tier": "(OU)",
        "doublesTier": "(DUU)"
      },
      "slowking": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "magneton": {
        "tier": "RU",
        "doublesTier": "NFE"
      },
      "magnezone": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "farfetchd": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "dodrio": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "muk": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "shellder": {
        "tier": "LC"
      },
      "cloyster": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "gastly": {
        "tier": "LC"
      },
      "haunter": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "gengar": {
        "tier": "(OU)",
        "doublesTier": "DOU"
      },
      "gengarmega": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "onix": {
        "tier": "LC"
      },
      "steelix": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "steelixmega": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "krabby": {
        "tier": "LC"
      },
      "kingler": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "electrode": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "exeggutor": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "cubone": {
        "tier": "LC"
      },
      "marowak": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "hitmonlee": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "hitmonchan": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "hitmontop": {
        "tier": "RU",
        "doublesTier": "DOU"
      },
      "lickitung": {
        "tier": "LC"
      },
      "lickilicky": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "weezing": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "rhydon": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "rhyperior": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "chansey": {
        "tier": "OU",
        "doublesTier": "NFE"
      },
      "blissey": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "tangela": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "tangrowth": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "kangaskhan": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "kangaskhanmega": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "kingdra": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "goldeen": {
        "tier": "LC"
      },
      "seaking": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "staryu": {
        "tier": "LC"
      },
      "starmie": {
        "tier": "(OU)",
        "doublesTier": "(DUU)"
      },
      "mimejr": {
        "tier": "LC"
      },
      "mrmime": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "scizor": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "scizormega": {
        "tier": "OU",
        "doublesTier": "(DOU)"
      },
      "smoochum": {
        "tier": "LC"
      },
      "jynx": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "electivire": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "magby": {
        "tier": "LC"
      },
      "magmortar": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "pinsir": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "pinsirmega": {
        "tier": "(OU)",
        "doublesTier": "(DUU)"
      },
      "tauros": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "gyarados": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "gyaradosmega": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "lapras": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "vaporeon": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "jolteon": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "flareon": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "espeon": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "umbreon": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "leafeon": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "porygon": {
        "tier": "LC"
      },
      "porygon2": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "porygonz": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "omanyte": {
        "tier": "LC"
      },
      "omastar": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "kabuto": {
        "tier": "LC"
      },
      "kabutops": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "aerodactyl": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "aerodactylmega": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "snorlax": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "articuno": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "zapdos": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "moltres": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "dragonite": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "mewtwomegax": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "mewtwomegay": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "mew": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "typhlosion": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "feraligatr": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "ledyba": {
        "tier": "LC"
      },
      "ledian": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "lanturn": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "togepi": {
        "tier": "LC"
      },
      "togetic": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "togekiss": {
        "tier": "UUBL",
        "doublesTier": "DOU"
      },
      "natu": {
        "tier": "LC"
      },
      "xatu": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "ampharos": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "ampharosmega": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "azumarill": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "ambipom": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "yanmega": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "quagsire": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "murkrow": {
        "tier": "NFE"
      },
      "honchkrow": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "misdreavus": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "mismagius": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "unown": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "wynaut": {
        "tier": "LC"
      },
      "wobbuffet": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "girafarig": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "forretress": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "dunsparce": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gligar": {
        "tier": "UU",
        "doublesTier": "NFE"
      },
      "granbull": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "qwilfish": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "shuckle": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "heracross": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "heracrossmega": {
        "tier": "(OU)",
        "doublesTier": "(DUU)"
      },
      "sneasel": {
        "tier": "RU",
        "doublesTier": "NFE"
      },
      "weavile": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "ursaring": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "piloswine": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "mamoswine": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "corsola": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "remoraid": {
        "tier": "LC"
      },
      "octillery": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "mantyke": {
        "tier": "LC"
      },
      "mantine": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "skarmory": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "houndoom": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "houndoommega": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "stantler": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "smeargle": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "miltank": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "raikou": {
        "tier": "(OU)",
        "doublesTier": "(DUU)"
      },
      "entei": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "suicune": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "tyranitar": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "tyranitarmega": {
        "tier": "OU",
        "doublesTier": "(DOU)"
      },
      "celebi": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "sceptile": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "sceptilemega": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "torchic": {
        "tier": "LC"
      },
      "combusken": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "blaziken": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "blazikenmega": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "swampert": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "swampertmega": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "zigzagoon": {
        "tier": "LC"
      },
      "linoone": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "wurmple": {
        "tier": "LC"
      },
      "silcoon": {
        "tier": "NFE"
      },
      "beautifly": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "cascoon": {
        "tier": "NFE"
      },
      "dustox": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "ludicolo": {
        "tier": "NU",
        "doublesTier": "DOU"
      },
      "shiftry": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "taillow": {
        "tier": "LC"
      },
      "swellow": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "pelipper": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "gardevoir": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "gardevoirmega": {
        "tier": "(OU)",
        "doublesTier": "DOU"
      },
      "gallademega": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "breloom": {
        "tier": "(OU)",
        "doublesTier": "DOU"
      },
      "vigoroth": {
        "tier": "PUBL",
        "doublesTier": "NFE"
      },
      "nincada": {
        "tier": "LC"
      },
      "ninjask": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "shedinja": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "whismur": {
        "tier": "LC"
      },
      "loudred": {
        "tier": "NFE"
      },
      "exploud": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "hariyama": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "probopass": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "skitty": {
        "tier": "LC"
      },
      "delcatty": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "sableye": {
        "tier": "RUBL",
        "doublesTier": "DUU"
      },
      "sableyemega": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "mawile": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "mawilemega": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "aron": {
        "tier": "LC"
      },
      "lairon": {
        "tier": "NFE"
      },
      "aggron": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "aggronmega": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "medicham": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "medichammega": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "electrike": {
        "tier": "LC"
      },
      "manectric": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "manectricmega": {
        "tier": "(OU)",
        "doublesTier": "(DUU)"
      },
      "budew": {
        "tier": "LC"
      },
      "roselia": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "roserade": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "carvanha": {
        "tier": "LC"
      },
      "sharpedo": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "sharpedomega": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "wailmer": {
        "tier": "LC"
      },
      "wailord": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "camerupt": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "cameruptmega": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "torkoal": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "grumpig": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "spinda": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "flygon": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "cacturne": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "altaria": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "altariamega": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "zangoose": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "lunatone": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "solrock": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "crawdaunt": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "baltoy": {
        "tier": "LC"
      },
      "claydol": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "lileep": {
        "tier": "LC"
      },
      "cradily": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "anorith": {
        "tier": "LC"
      },
      "armaldo": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "milotic": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "castform": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "kecleon": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "banettemega": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "dusknoir": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "absol": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "absolmega": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "glaliemega": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "froslass": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "spheal": {
        "tier": "LC"
      },
      "sealeo": {
        "tier": "NFE"
      },
      "walrein": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "clamperl": {
        "tier": "LC"
      },
      "huntail": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "gorebyss": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "relicanth": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "salamence": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "salamencemega": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "metang": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "metagrossmega": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "regirock": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "regice": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "latias": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "latiasmega": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "latios": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "latiosmega": {
        "tier": "(OU)",
        "doublesTier": "(DOU)"
      },
      "kyogreprimal": {},
      "groudonprimal": {},
      "rayquazamega": {
        "tier": "AG",
        "doublesTier": "DUber"
      },
      "jirachi": {
        "tier": "(OU)",
        "doublesTier": "DUber"
      },
      "deoxysattack": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "deoxysdefense": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "deoxysspeed": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "torterra": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "monferno": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "infernape": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "prinplup": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "empoleon": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "staraptor": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "bidoof": {
        "tier": "LC"
      },
      "bibarel": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "rampardos": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "burmy": {
        "tier": "LC"
      },
      "wormadam": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "wormadamsandy": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "wormadamtrash": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "mothim": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "floatzel": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "cherubi": {
        "tier": "LC"
      },
      "cherrim": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gastrodon": {
        "tier": "NU",
        "doublesTier": "DOU"
      },
      "drifloon": {
        "tier": "NFE"
      },
      "drifblim": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "buneary": {
        "tier": "LC"
      },
      "lopunny": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "lopunnymega": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "glameow": {
        "tier": "LC"
      },
      "purugly": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "skuntank": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "bronzong": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "chatot": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "spiritomb": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "gabite": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "garchomp": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "garchompmega": {
        "tier": "(OU)",
        "doublesTier": "(DOU)"
      },
      "lucario": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "lucariomega": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "hippowdon": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "skorupi": {
        "tier": "LC"
      },
      "drapion": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "toxicroak": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "carnivine": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "lumineon": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "abomasnow": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "abomasnowmega": {
        "tier": "RUBL",
        "doublesTier": "DUU"
      },
      "rotom": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "rotomheat": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "rotomwash": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "rotomfrost": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "rotomfan": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "rotommow": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "uxie": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "mesprit": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "azelf": {
        "tier": "(OU)",
        "doublesTier": "(DUU)"
      },
      "heatran": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "regigigas": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "giratinaorigin": {},
      "cresselia": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "manaphy": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "darkrai": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "shaymin": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "shayminsky": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "victini": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "snivy": {
        "tier": "LC"
      },
      "serperior": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "emboar": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "samurott": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "patrat": {
        "tier": "LC"
      },
      "watchog": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "lillipup": {
        "tier": "LC"
      },
      "herdier": {
        "tier": "NFE"
      },
      "stoutland": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "purrloin": {
        "tier": "LC"
      },
      "liepard": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "pansage": {
        "tier": "LC"
      },
      "simisage": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "pansear": {
        "tier": "LC"
      },
      "simisear": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "panpour": {
        "tier": "LC"
      },
      "simipour": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "munna": {
        "tier": "LC"
      },
      "musharna": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "pidove": {
        "tier": "LC"
      },
      "tranquill": {
        "tier": "NFE"
      },
      "unfezant": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "zebstrika": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "roggenrola": {
        "tier": "LC"
      },
      "boldore": {
        "tier": "NFE"
      },
      "gigalith": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "woobat": {
        "tier": "LC"
      },
      "swoobat": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "excadrill": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "audino": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "audinomega": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "gurdurr": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "conkeldurr": {
        "tier": "UUBL",
        "doublesTier": "DOU"
      },
      "tympole": {
        "tier": "LC"
      },
      "palpitoad": {
        "tier": "NFE"
      },
      "seismitoad": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "throh": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "sawk": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "leavanny": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "venipede": {
        "tier": "LC"
      },
      "whirlipede": {
        "tier": "NFE"
      },
      "scolipede": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "whimsicott": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "lilligant": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "basculin": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "basculinbluestriped": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "krookodile": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "darumaka": {
        "tier": "LC"
      },
      "darmanitan": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "maractus": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "dwebble": {
        "tier": "LC"
      },
      "crustle": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "scraggy": {
        "tier": "LC"
      },
      "scrafty": {
        "tier": "RU",
        "doublesTier": "DOU"
      },
      "sigilyph": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "yamask": {
        "tier": "LC"
      },
      "cofagrigus": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "tirtouga": {
        "tier": "LC"
      },
      "carracosta": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "archen": {
        "tier": "LC"
      },
      "archeops": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "trubbish": {
        "tier": "LC"
      },
      "garbodor": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "zoroark": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "cinccino": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "reuniclus": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "swanna": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "vanillite": {
        "tier": "LC"
      },
      "vanillish": {
        "tier": "NFE"
      },
      "vanilluxe": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "emolga": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "karrablast": {
        "tier": "LC"
      },
      "escavalier": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "amoonguss": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "frillish": {
        "tier": "LC"
      },
      "jellicent": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "alomomola": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "galvantula": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "ferroseed": {
        "tier": "NU",
        "doublesTier": "LC"
      },
      "ferrothorn": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "klink": {
        "tier": "LC"
      },
      "klang": {
        "tier": "NFE"
      },
      "klinklang": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "eelektross": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "elgyem": {
        "tier": "LC"
      },
      "beheeyem": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "chandelure": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "fraxure": {
        "tier": "ZUBL",
        "doublesTier": "NFE"
      },
      "haxorus": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "cryogonal": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "shelmet": {
        "tier": "LC"
      },
      "accelgor": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "stunfisk": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "mienshao": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "druddigon": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "golurk": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "pawniard": {
        "tier": "PU",
        "doublesTier": "LC"
      },
      "bisharp": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "bouffalant": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "rufflet": {
        "tier": "LC"
      },
      "braviary": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "vullaby": {
        "tier": "PU",
        "doublesTier": "LC"
      },
      "heatmor": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "durant": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "hydreigon": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "volcarona": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "terrakion": {
        "tier": "UUBL",
        "doublesTier": "DOU"
      },
      "virizion": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "tornadus": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "thundurus": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "thundurustherian": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "landorus": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "kyurem": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "kyuremblack": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "keldeo": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "keldeoresolute": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "meloetta": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "genesect": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "genesectburn": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "genesectchill": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "genesectdouse": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "genesectshock": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "chesnaught": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "delphox": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "greninja": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "bunnelby": {
        "tier": "LC"
      },
      "diggersby": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "fletchinder": {
        "tier": "RU",
        "doublesTier": "NFE"
      },
      "talonflame": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "vivillon": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "pyroar": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "florges": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "pancham": {
        "tier": "LC"
      },
      "pangoro": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "furfrou": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "meowsticf": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "honedge": {
        "tier": "LC"
      },
      "doublade": {
        "tier": "UU",
        "doublesTier": "NFE"
      },
      "aegislash": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "spritzee": {
        "tier": "LC"
      },
      "aromatisse": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "swirlix": {
        "tier": "NFE"
      },
      "slurpuff": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "malamar": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "binacle": {
        "tier": "LC"
      },
      "barbaracle": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "dragalge": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "clawitzer": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "helioptile": {
        "tier": "LC"
      },
      "heliolisk": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "tyrunt": {
        "tier": "LC"
      },
      "tyrantrum": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "amaura": {
        "tier": "LC"
      },
      "aurorus": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "sylveon": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "hawlucha": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "goodra": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "klefki": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "trevenant": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "pumpkaboo": {
        "tier": "LC"
      },
      "pumpkaboosmall": {
        "tier": "LC"
      },
      "pumpkaboolarge": {
        "tier": "LC"
      },
      "pumpkaboosuper": {
        "tier": "LC"
      },
      "gourgeist": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gourgeistsmall": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gourgeistlarge": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gourgeistsuper": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "noivern": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "xerneas": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "yveltal": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "zygarde": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "diancie": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "dianciemega": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "hoopa": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "hoopaunbound": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "volcanion": {
        "tier": "OU",
        "doublesTier": "DOU"
      }
    },
    "baseStats": {
      "arbok": {
        "hp": 60,
        "atk": 85,
        "def": 69,
        "spa": 65,
        "spd": 79,
        "spe": 80
      },
      "dugtrio": {
        "hp": 35,
        "atk": 80,
        "def": 50,
        "spa": 50,
        "spd": 70,
        "spe": 120
      },
      "alakazammega": {
        "hp": 55,
        "atk": 50,
        "def": 65,
        "spa": 175,
        "spd": 95,
        "spe": 150
      },
      "farfetchd": {
        "hp": 52,
        "atk": 65,
        "def": 55,
        "spa": 58,
        "spd": 62,
        "spe": 60
      },
      "dodrio": {
        "hp": 60,
        "atk": 110,
        "def": 70,
        "spa": 60,
        "spd": 60,
        "spe": 100
      },
      "electrode": {
        "hp": 60,
        "atk": 50,
        "def": 70,
        "spa": 80,
        "spd": 80,
        "spe": 140
      },
      "exeggutor": {
        "hp": 95,
        "atk": 95,
        "def": 85,
        "spa": 125,
        "spd": 65,
        "spe": 55
      },
      "noctowl": {
        "hp": 100,
        "atk": 50,
        "def": 50,
        "spa": 76,
        "spd": 96,
        "spe": 70
      },
      "ariados": {
        "hp": 70,
        "atk": 90,
        "def": 70,
        "spa": 60,
        "spd": 60,
        "spe": 40
      },
      "qwilfish": {
        "hp": 65,
        "atk": 95,
        "def": 75,
        "spa": 55,
        "spd": 55,
        "spe": 85
      },
      "magcargo": {
        "hp": 50,
        "atk": 50,
        "def": 120,
        "spa": 80,
        "spd": 80,
        "spe": 30
      },
      "corsola": {
        "hp": 55,
        "atk": 55,
        "def": 85,
        "spa": 65,
        "spd": 85,
        "spe": 35
      },
      "mantine": {
        "hp": 65,
        "atk": 40,
        "def": 70,
        "spa": 80,
        "spd": 140,
        "spe": 70
      },
      "swellow": {
        "hp": 60,
        "atk": 85,
        "def": 60,
        "spa": 50,
        "spd": 50,
        "spe": 125
      },
      "pelipper": {
        "hp": 60,
        "atk": 50,
        "def": 100,
        "spa": 85,
        "spd": 70,
        "spe": 65
      },
      "masquerain": {
        "hp": 70,
        "atk": 60,
        "def": 62,
        "spa": 80,
        "spd": 82,
        "spe": 60
      },
      "delcatty": {
        "hp": 70,
        "atk": 65,
        "def": 65,
        "spa": 55,
        "spd": 55,
        "spe": 70
      },
      "volbeat": {
        "hp": 65,
        "atk": 73,
        "def": 55,
        "spa": 47,
        "spd": 75,
        "spe": 85
      },
      "illumise": {
        "hp": 65,
        "atk": 47,
        "def": 55,
        "spa": 73,
        "spd": 75,
        "spe": 85
      },
      "lunatone": {
        "hp": 70,
        "atk": 55,
        "def": 65,
        "spa": 95,
        "spd": 85,
        "spe": 70
      },
      "solrock": {
        "hp": 70,
        "atk": 95,
        "def": 85,
        "spa": 55,
        "spd": 65,
        "spe": 70
      },
      "chimecho": {
        "hp": 65,
        "atk": 50,
        "def": 70,
        "spa": 95,
        "spd": 80,
        "spe": 65
      },
      "cresselia": {
        "hp": 120,
        "atk": 70,
        "def": 120,
        "spa": 75,
        "spd": 130,
        "spe": 85
      },
      "woobat": {
        "hp": 55,
        "atk": 45,
        "def": 43,
        "spa": 55,
        "spd": 43,
        "spe": 72
      },
      "crustle": {
        "hp": 70,
        "atk": 95,
        "def": 125,
        "spa": 65,
        "spd": 75,
        "spe": 45
      },
      "beartic": {
        "hp": 95,
        "atk": 110,
        "def": 80,
        "spa": 70,
        "spd": 80,
        "spe": 50
      },
      "cryogonal": {
        "hp": 70,
        "atk": 50,
        "def": 30,
        "spa": 95,
        "spd": 135,
        "spe": 105
      },
      "aegislash": {
        "hp": 60,
        "atk": 50,
        "def": 150,
        "spa": 50,
        "spd": 150,
        "spe": 60
      },
      "aegislashblade": {
        "hp": 60,
        "atk": 150,
        "def": 50,
        "spa": 150,
        "spd": 50,
        "spe": 60
      },
      "zacian": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zaciancrowned": {
        "hp": 92,
        "atk": 170,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 148
      },
      "zamazenta": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zamazentacrowned": {
        "hp": 92,
        "atk": 130,
        "def": 145,
        "spa": 80,
        "spd": 145,
        "spe": 128
      },
      "pyroak": {
        "hp": 120,
        "atk": 70,
        "def": 105,
        "spa": 95,
        "spd": 90,
        "spe": 60
      },
      "kitsunoh": {
        "hp": 80,
        "atk": 103,
        "def": 85,
        "spa": 55,
        "spd": 80,
        "spe": 110
      },
      "voodoom": {
        "hp": 90,
        "atk": 85,
        "def": 80,
        "spa": 105,
        "spd": 80,
        "spe": 110
      },
      "necturna": {
        "hp": 64,
        "atk": 120,
        "def": 100,
        "spa": 85,
        "spd": 120,
        "spe": 81
      },
      "crucibellemega": {
        "hp": 106,
        "atk": 135,
        "def": 75,
        "spa": 85,
        "spd": 125,
        "spe": 114
      }
    },
    "abilities": {
      "pikachuoriginal": [
        "Static"
      ],
      "pikachuhoenn": [
        "Static"
      ],
      "pikachusinnoh": [
        "Static"
      ],
      "pikachuunova": [
        "Static"
      ],
      "pikachukalos": [
        "Static"
      ],
      "pikachualola": [
        "Static"
      ],
      "pikachupartner": [
        "Static"
      ],
      "raichualola": [],
      "raichumegax": [],
      "sandshrewalola": [
        "Snow Cloak"
      ],
      "sandslashalola": [
        "Snow Cloak"
      ],
      "diglettalola": [
        "Sand Veil",
        "Sand Force"
      ],
      "dugtrioalola": [
        "Sand Veil",
        "Sand Force"
      ],
      "growlithehisui": [
        "Intimidate",
        "Flash Fire",
        "Justified"
      ],
      "arcaninehisui": [
        "Intimidate",
        "Flash Fire",
        "Justified"
      ],
      "victreebelmega": [],
      "geodudealola": [
        "Magnet Pull",
        "Sturdy"
      ],
      "graveleralola": [
        "Magnet Pull",
        "Sturdy"
      ],
      "golemalola": [
        "Magnet Pull",
        "Sturdy"
      ],
      "ponytagalar": [
        "Run Away",
        "Anticipation"
      ],
      "rapidashgalar": [
        "Run Away",
        "Anticipation"
      ],
      "slowbrogalar": [
        "Own Tempo",
        "Regenerator"
      ],
      "grimeralola": [
        "Poison Touch",
        "Gluttony"
      ],
      "mukalola": [
        "Poison Touch",
        "Gluttony"
      ],
      "gengar": [
        "Levitate"
      ],
      "koffing": [
        "Levitate"
      ],
      "weezing": [
        "Levitate"
      ],
      "weezinggalar": [
        "Levitate"
      ],
      "mrmimegalar": [
        "Vital Spirit",
        "Ice Body"
      ],
      "taurospaldeacombat": [
        "Intimidate",
        "Anger Point"
      ],
      "taurospaldeablaze": [
        "Intimidate",
        "Anger Point"
      ],
      "taurospaldeaaqua": [
        "Intimidate",
        "Anger Point"
      ],
      "moltresgalar": [],
      "meganiummega": [],
      "typhlosionhisui": [
        "Blaze",
        "Flash Fire"
      ],
      "feraligatrmega": [],
      "slowkinggalar": [
        "Own Tempo",
        "Regenerator"
      ],
      "sneaselhisui": [
        "Inner Focus",
        "Keen Eye",
        "Poison Touch"
      ],
      "skarmorymega": [],
      "raikou": [
        "Pressure",
        "Volt Absorb"
      ],
      "entei": [
        "Pressure",
        "Flash Fire"
      ],
      "suicune": [
        "Pressure",
        "Water Absorb"
      ],
      "shiftry": [
        "Chlorophyll",
        "Early Bird",
        "Pickpocket"
      ],
      "wingull": [
        "Keen Eye",
        "Rain Dish"
      ],
      "pelipper": [
        "Keen Eye",
        "Rain Dish"
      ],
      "torkoal": [
        "White Smoke",
        "Shell Armor"
      ],
      "absolmegaz": [],
      "piplup": [
        "Torrent",
        "Defiant"
      ],
      "prinplup": [
        "Torrent",
        "Defiant"
      ],
      "empoleon": [
        "Torrent",
        "Defiant"
      ],
      "lucariomegaz": [],
      "gallade": [
        "Steadfast",
        "Justified"
      ],
      "samurotthisui": [
        "Torrent",
        "Shell Armor"
      ],
      "roggenrola": [
        "Sturdy",
        "Sand Force"
      ],
      "boldore": [
        "Sturdy",
        "Sand Force"
      ],
      "gigalith": [
        "Sturdy",
        "Sand Force"
      ],
      "excadrillmega": [],
      "darmanitangalar": [
        "Zen Mode"
      ],
      "yamaskgalar": [],
      "vanillite": [
        "Ice Body",
        "Weak Armor"
      ],
      "vanillish": [
        "Ice Body",
        "Weak Armor"
      ],
      "vanilluxe": [
        "Ice Body",
        "Weak Armor"
      ],
      "eelektrossmega": [],
      "cubchoo": [
        "Snow Cloak",
        "Rattled"
      ],
      "beartic": [
        "Snow Cloak",
        "Swift Swim"
      ],
      "stunfiskgalar": [],
      "golurkmega": [],
      "braviaryhisui": [
        "Keen Eye",
        "Sheer Force",
        "Defiant"
      ],
      "greninja": [
        "Torrent",
        "Protean"
      ],
      "greninjabond": [],
      "greninjaash": [],
      "vivillonfancy": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonpokeball": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "pyroarmega": [],
      "sliggoohisui": [
        "Sap Sipper",
        "Overcoat",
        "Gooey"
      ],
      "goodrahisui": [
        "Sap Sipper",
        "Overcoat",
        "Gooey"
      ],
      "pumpkaboosmall": [
        "Pickup",
        "Frisk"
      ],
      "pumpkaboolarge": [
        "Pickup",
        "Frisk"
      ],
      "gourgeistsmall": [
        "Pickup",
        "Frisk"
      ],
      "gourgeistlarge": [
        "Pickup",
        "Frisk"
      ],
      "zygarde": [
        "Aura Break"
      ],
      "zygarde10": [
        "Aura Break"
      ],
      "zygardecomplete": [],
      "rowlet": [
        "Overgrow"
      ],
      "dartrix": [
        "Overgrow"
      ],
      "decidueye": [
        "Overgrow"
      ],
      "decidueyehisui": [
        "Overgrow"
      ],
      "popplio": [
        "Torrent"
      ],
      "brionne": [
        "Torrent"
      ],
      "primarina": [
        "Torrent"
      ],
      "yungoos": [
        "Strong Jaw",
        "Adaptability"
      ],
      "gumshoos": [
        "Strong Jaw",
        "Adaptability"
      ],
      "charjabug": [],
      "oricorio": [],
      "oricoriopompom": [],
      "oricoriopau": [],
      "oricoriosensu": [],
      "wishiwashi": [],
      "wishiwashischool": [],
      "mareanie": [
        "Limber",
        "Regenerator"
      ],
      "toxapex": [
        "Limber",
        "Regenerator"
      ],
      "mudbray": [
        "Own Tempo",
        "Inner Focus"
      ],
      "mudsdale": [
        "Own Tempo",
        "Inner Focus"
      ],
      "dewpider": [
        "Water Absorb"
      ],
      "araquanid": [
        "Water Absorb"
      ],
      "araquanidtotem": [],
      "salandit": [
        "Oblivious"
      ],
      "salazzle": [
        "Oblivious"
      ],
      "salazzletotem": [],
      "stufful": [
        "Klutz",
        "Cute Charm"
      ],
      "bewear": [
        "Klutz",
        "Unnerve"
      ],
      "tsareena": [
        "Leaf Guard",
        "Sweet Veil"
      ],
      "comfey": [
        "Flower Veil",
        "Natural Cure"
      ],
      "passimian": [
        "Defiant"
      ],
      "wimpod": [],
      "golisopod": [],
      "sandygast": [
        "Sand Veil"
      ],
      "palossand": [
        "Sand Veil"
      ],
      "pyukumuku": [
        "Unaware"
      ],
      "silvally": [],
      "silvallybug": [],
      "silvallydark": [],
      "silvallydragon": [],
      "silvallyelectric": [],
      "silvallyfairy": [],
      "silvallyfighting": [],
      "silvallyfire": [],
      "silvallyflying": [],
      "silvallyghost": [],
      "silvallygrass": [],
      "silvallyground": [],
      "silvallyice": [],
      "silvallypoison": [],
      "silvallypsychic": [],
      "silvallyrock": [],
      "silvallysteel": [],
      "silvallywater": [],
      "minior": [],
      "miniororange": [],
      "minioryellow": [],
      "miniorgreen": [],
      "miniorblue": [],
      "miniorindigo": [],
      "miniorviolet": [],
      "miniormeteor": [],
      "komala": [],
      "mimikyu": [],
      "mimikyubusted": [],
      "mimikyutotem": [],
      "mimikyubustedtotem": [],
      "bruxish": [
        "Strong Jaw",
        "Wonder Skin"
      ],
      "drampa": [
        "Sap Sipper",
        "Cloud Nine"
      ],
      "drampamega": [],
      "dhelmise": [],
      "tapukoko": [],
      "tapulele": [],
      "tapubulu": [],
      "tapufini": [],
      "solgaleo": [],
      "lunala": [],
      "nihilego": [],
      "buzzwole": [],
      "pheromosa": [],
      "xurkitree": [],
      "celesteela": [],
      "kartana": [],
      "guzzlord": [],
      "necrozma": [],
      "necrozmaduskmane": [],
      "necrozmadawnwings": [],
      "necrozmaultra": [],
      "magearna": [],
      "magearnaoriginal": [],
      "magearnamega": [],
      "magearnaoriginalmega": [],
      "poipole": [],
      "naganadel": [],
      "stakataka": [],
      "blacephalon": [],
      "grookey": [
        "Overgrow"
      ],
      "thwackey": [
        "Overgrow"
      ],
      "rillaboom": [
        "Overgrow"
      ],
      "rillaboomgmax": [
        "Overgrow"
      ],
      "scorbunny": [
        "Blaze"
      ],
      "raboot": [
        "Blaze"
      ],
      "cinderace": [
        "Blaze"
      ],
      "cinderacegmax": [
        "Blaze"
      ],
      "corviknight": [
        "Pressure",
        "Unnerve"
      ],
      "corviknightgmax": [
        "Pressure",
        "Unnerve"
      ],
      "nickit": [
        "Run Away",
        "Unburden"
      ],
      "thievul": [
        "Run Away",
        "Unburden"
      ],
      "gossifleur": [
        "Regenerator",
        "Effect Spore"
      ],
      "eldegoss": [
        "Regenerator",
        "Effect Spore"
      ],
      "wooloo": [
        "Run Away",
        "Bulletproof"
      ],
      "dubwool": [
        "Steadfast",
        "Bulletproof"
      ],
      "yamper": [
        "Rattled"
      ],
      "rolycoly": [
        "Heatproof",
        "Flash Fire"
      ],
      "carkol": [
        "Flame Body",
        "Flash Fire"
      ],
      "coalossal": [
        "Flame Body",
        "Flash Fire"
      ],
      "coalossalgmax": [
        "Flame Body",
        "Flash Fire"
      ],
      "applin": [
        "Gluttony",
        "Bulletproof"
      ],
      "flapple": [
        "Gluttony",
        "Hustle"
      ],
      "flapplegmax": [
        "Gluttony",
        "Hustle"
      ],
      "appletun": [
        "Gluttony",
        "Thick Fat"
      ],
      "appletungmax": [
        "Gluttony",
        "Thick Fat"
      ],
      "silicobra": [
        "Shed Skin",
        "Sand Veil"
      ],
      "sandaconda": [
        "Shed Skin",
        "Sand Veil"
      ],
      "sandacondagmax": [
        "Shed Skin",
        "Sand Veil"
      ],
      "cramorant": [],
      "cramorantgulping": [],
      "cramorantgorging": [],
      "arrokuda": [
        "Swift Swim"
      ],
      "barraskewda": [
        "Swift Swim"
      ],
      "toxtricity": [
        "Plus",
        "Technician"
      ],
      "toxtricitylowkey": [
        "Minus",
        "Technician"
      ],
      "toxtricitygmax": [
        "Plus",
        "Technician"
      ],
      "toxtricitylowkeygmax": [
        "Minus",
        "Technician"
      ],
      "perrserker": [
        "Battle Armor",
        "Tough Claws"
      ],
      "cursola": [
        "Weak Armor"
      ],
      "mrrime": [
        "Tangled Feet",
        "Ice Body"
      ],
      "runerigus": [],
      "pincurchin": [
        "Lightning Rod"
      ],
      "snom": [
        "Shield Dust"
      ],
      "frosmoth": [
        "Shield Dust"
      ],
      "stonjourner": [],
      "eiscue": [],
      "eiscuenoice": [],
      "indeedee": [
        "Inner Focus",
        "Synchronize"
      ],
      "indeedeef": [
        "Own Tempo",
        "Synchronize"
      ],
      "morpeko": [],
      "morpekohangry": [],
      "arctozolt": [
        "Volt Absorb",
        "Static"
      ],
      "arctovish": [
        "Water Absorb",
        "Ice Body"
      ],
      "duraludon": [
        "Light Metal",
        "Heavy Metal"
      ],
      "duraludongmax": [
        "Light Metal",
        "Heavy Metal"
      ],
      "zacian": [],
      "zaciancrowned": [],
      "zamazenta": [],
      "zamazentacrowned": [],
      "urshifu": [],
      "urshifurapidstrike": [],
      "urshifugmax": [],
      "urshifurapidstrikegmax": [],
      "regieleki": [],
      "regidrago": [],
      "glastrier": [],
      "spectrier": [],
      "calyrexice": [],
      "calyrexshadow": [],
      "kleavor": [
        "Swarm",
        "Sheer Force",
        "Steadfast"
      ],
      "ursalunabloodmoon": [],
      "basculegion": [
        "Rattled",
        "Adaptability",
        "Mold Breaker"
      ],
      "basculegionf": [
        "Rattled",
        "Adaptability",
        "Mold Breaker"
      ],
      "sneasler": [
        "Pressure",
        "Poison Touch"
      ],
      "enamorus": [
        "Healer",
        "Contrary"
      ],
      "oinkologne": [
        "Gluttony",
        "Thick Fat"
      ],
      "tarountula": [
        "Insomnia"
      ],
      "spidops": [
        "Insomnia"
      ],
      "dachsbun": [
        "Aroma Veil"
      ],
      "arboliva": [
        "Harvest"
      ],
      "nacli": [
        "Sturdy",
        "Clear Body"
      ],
      "naclstack": [
        "Sturdy",
        "Clear Body"
      ],
      "garganacl": [
        "Sturdy",
        "Clear Body"
      ],
      "bellibolt": [
        "Static",
        "Damp"
      ],
      "wattrel": [
        "Volt Absorb",
        "Competitive"
      ],
      "kilowattrel": [
        "Volt Absorb",
        "Competitive"
      ],
      "maschiff": [
        "Intimidate",
        "Run Away"
      ],
      "mabosstiff": [
        "Intimidate"
      ],
      "bramblin": [
        "Infiltrator"
      ],
      "brambleghast": [
        "Infiltrator"
      ],
      "toedscool": [],
      "toedscruel": [],
      "klawf": [
        "Shell Armor",
        "Regenerator"
      ],
      "scovillainmega": [],
      "espathra": [
        "Frisk",
        "Speed Boost"
      ],
      "bombirdier": [
        "Big Pecks",
        "Keen Eye"
      ],
      "palafin": [],
      "palafinhero": [],
      "orthworm": [
        "Sand Veil"
      ],
      "glimmet": [],
      "glimmora": [],
      "greavard": [
        "Pickup"
      ],
      "houndstone": [
        "Sand Rush"
      ],
      "flamigo": [
        "Scrappy",
        "Tangled Feet"
      ],
      "cetitan": [
        "Thick Fat",
        "Sheer Force"
      ],
      "veluza": [
        "Mold Breaker"
      ],
      "tatsugiri": [
        "Storm Drain"
      ],
      "tatsugiridroopy": [
        "Storm Drain"
      ],
      "tatsugiristretchy": [
        "Storm Drain"
      ],
      "tatsugiricurlymega": [
        "Storm Drain"
      ],
      "tatsugiridroopymega": [
        "Storm Drain"
      ],
      "tatsugiristretchymega": [
        "Storm Drain"
      ],
      "farigiraf": [
        "Sap Sipper"
      ],
      "kingambit": [
        "Defiant",
        "Pressure"
      ],
      "greattusk": [],
      "screamtail": [],
      "brutebonnet": [],
      "fluttermane": [],
      "slitherwing": [],
      "sandyshocks": [],
      "irontreads": [],
      "ironbundle": [],
      "ironhands": [],
      "ironjugulis": [],
      "ironmoth": [],
      "ironthorns": [],
      "frigibax": [
        "Ice Body"
      ],
      "arctibax": [
        "Ice Body"
      ],
      "baxcalibur": [
        "Ice Body"
      ],
      "baxcaliburmega": [],
      "gholdengo": [],
      "wochien": [],
      "chienpao": [],
      "tinglu": [],
      "chiyu": [],
      "roaringmoon": [],
      "ironvaliant": [],
      "koraidon": [],
      "miraidon": [],
      "walkingwake": [],
      "ironleaves": [],
      "dipplin": [
        "Gluttony",
        "Sticky Hold"
      ],
      "poltchageist": [
        "Heatproof"
      ],
      "poltchageistartisan": [
        "Heatproof"
      ],
      "sinistcha": [
        "Heatproof"
      ],
      "sinistchamasterpiece": [
        "Heatproof"
      ],
      "okidogi": [],
      "munkidori": [
        "Frisk"
      ],
      "fezandipiti": [
        "Technician"
      ],
      "ogerpontealtera": [],
      "ogerponwellspringtera": [],
      "ogerponhearthflametera": [],
      "ogerponcornerstonetera": [],
      "archaludon": [
        "Sturdy"
      ],
      "hydrapple": [
        "Regenerator",
        "Sticky Hold"
      ],
      "gougingfire": [],
      "ragingbolt": [],
      "ironboulder": [],
      "ironcrown": [],
      "terapagos": [],
      "terapagosterastal": [],
      "terapagosstellar": [],
      "pecharunt": [],
      "syclant": [
        "Compound Eyes",
        "Mountaineer"
      ],
      "revenankh": [
        "Air Lock",
        "Shed Skin"
      ],
      "pyroak": [
        "Rock Head",
        "Battle Armor"
      ],
      "fidgit": [
        "Persistent",
        "Vital Spirit"
      ],
      "stratagem": [
        "Levitate",
        "Technician"
      ],
      "arghonaut": [
        "Unaware"
      ],
      "kitsunoh": [
        "Frisk",
        "Limber"
      ],
      "cyclohm": [
        "Shield Dust",
        "Static"
      ],
      "colossoil": [
        "Rebound",
        "Guts"
      ],
      "krilowatt": [
        "Trace",
        "Magic Guard"
      ],
      "voodoom": [
        "Volt Absorb",
        "Lightning Rod"
      ],
      "malaconda": [
        "Harvest",
        "Infiltrator"
      ],
      "naviathan": [
        "Water Veil",
        "Heatproof",
        "Light Metal"
      ],
      "pajantom": [],
      "electrelk": [
        "Overgrow"
      ],
      "caribolt": [
        "Overgrow"
      ],
      "miasmite": [
        "Hyper Cutter",
        "Compound Eyes"
      ],
      "miasmaw": [
        "Hyper Cutter",
        "Compound Eyes"
      ],
      "venomicon": [],
      "saharascal": [
        "Water Absorb",
        "Pickpocket"
      ],
      "saharaja": [
        "Water Absorb",
        "Serene Grace"
      ],
      "draggalong": [
        "White Smoke",
        "Slow Start"
      ],
      "chuggalong": [
        "White Smoke",
        "Slow Start"
      ],
      "flox": [
        "Static",
        "Sticky Hold"
      ],
      "shox": [
        "Sticky Hold"
      ],
      "scraptor": [
        "Early Bird",
        "Pickup"
      ],
      "obliteryx": [
        "Early Bird",
        "Sniper"
      ]
    }
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
    "moves": {},
    "moveData": {
      "baddybad": {
        "category": "Special",
        "basePower": 90
      },
      "bouncybubble": {
        "category": "Special",
        "basePower": 90
      },
      "buzzybuzz": {
        "category": "Special",
        "basePower": 90
      },
      "freezyfrost": {
        "category": "Special",
        "basePower": 90
      },
      "glaciallance": {
        "category": "Physical",
        "basePower": 130
      },
      "glitzyglow": {
        "category": "Special",
        "basePower": 90
      },
      "grassyglide": {
        "category": "Physical",
        "basePower": 70
      },
      "lusterpurge": {
        "category": "Special",
        "basePower": 70
      },
      "mistball": {
        "category": "Special",
        "basePower": 70
      },
      "multiattack": {
        "category": "Physical",
        "basePower": 90
      },
      "rapidspin": {
        "category": "Physical",
        "basePower": 20
      },
      "sappyseed": {
        "category": "Physical",
        "basePower": 90
      },
      "sizzlyslide": {
        "category": "Physical",
        "basePower": 90
      },
      "sparklyswirl": {
        "category": "Special",
        "basePower": 90
      },
      "wickedblow": {
        "category": "Physical",
        "basePower": 80
      },
      "zippyzap": {
        "category": "Physical",
        "basePower": 50
      }
    },
    "formats": {
      "venusaur": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "venusaurmega": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "charizard": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "charizardmegax": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "charizardmegay": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "blastoise": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "blastoisemega": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "caterpie": {
        "tier": "LC"
      },
      "metapod": {
        "tier": "NFE"
      },
      "butterfree": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "weedle": {
        "tier": "LC"
      },
      "kakuna": {
        "tier": "NFE"
      },
      "beedrill": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "beedrillmega": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "pidgey": {
        "tier": "LC"
      },
      "pidgeotto": {
        "tier": "NFE"
      },
      "pidgeot": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "pidgeotmega": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "rattata": {
        "tier": "LC"
      },
      "rattataalola": {
        "tier": "LC"
      },
      "raticate": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "raticatealola": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "raticatealolatotem": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "spearow": {
        "tier": "LC"
      },
      "fearow": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "raichu": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "raichualola": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "nidoranf": {
        "tier": "LC"
      },
      "nidorina": {
        "tier": "NFE"
      },
      "nidoqueen": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "nidoranm": {
        "tier": "LC"
      },
      "nidorino": {
        "tier": "NFE"
      },
      "nidoking": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "clefairy": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "clefable": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "vulpix": {
        "tier": "NFE"
      },
      "ninetales": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "ninetalesalola": {
        "tier": "UUBL",
        "doublesTier": "DOU"
      },
      "zubat": {
        "tier": "LC"
      },
      "golbat": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "crobat": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "vileplume": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "bellossom": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "paras": {
        "tier": "LC"
      },
      "parasect": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "venomoth": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "diglett": {
        "tier": "LC"
      },
      "dugtrioalola": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "persianalola": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "primeape": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "arcanine": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "politoed": {
        "tier": "ZU",
        "doublesTier": "DOU"
      },
      "abra": {
        "tier": "LC"
      },
      "kadabra": {
        "tier": "ZU",
        "doublesTier": "NFE"
      },
      "alakazam": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "alakazammega": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "machop": {
        "tier": "LC"
      },
      "machoke": {
        "tier": "NFE"
      },
      "machamp": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "victreebel": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "tentacruel": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "ponyta": {
        "tier": "LC"
      },
      "rapidash": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "slowbromega": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "slowking": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "magneton": {
        "tier": "UU",
        "doublesTier": "NFE"
      },
      "magnezone": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "farfetchd": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "dodrio": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "mukalola": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "shellder": {
        "tier": "LC"
      },
      "cloyster": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "gastly": {
        "tier": "LC"
      },
      "haunter": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "gengar": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "gengarmega": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "onix": {
        "tier": "LC"
      },
      "steelix": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "steelixmega": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "krabby": {
        "tier": "LC"
      },
      "kingler": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "exeggutor": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "exeggutoralola": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "cubone": {
        "tier": "LC"
      },
      "marowak": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "marowakalola": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "marowakalolatotem": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "hitmonlee": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "hitmonchan": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "hitmontop": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "lickitung": {
        "tier": "LC"
      },
      "lickilicky": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "weezing": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "rhydon": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "rhyperior": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "chansey": {
        "tier": "OU",
        "doublesTier": "NFE"
      },
      "blissey": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "tangela": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "tangrowth": {
        "tier": "(OU)",
        "doublesTier": "(DUU)"
      },
      "kangaskhan": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "kangaskhanmega": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "kingdra": {
        "tier": "NUBL",
        "doublesTier": "DOU"
      },
      "goldeen": {
        "tier": "LC"
      },
      "seaking": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "staryu": {
        "tier": "LC"
      },
      "starmie": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "mimejr": {
        "tier": "LC"
      },
      "mrmime": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "scyther": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "scizormega": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "smoochum": {
        "tier": "LC"
      },
      "jynx": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "magby": {
        "tier": "LC"
      },
      "magmortar": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "pinsir": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "pinsirmega": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "tauros": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "gyarados": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "gyaradosmega": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "jolteon": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "espeon": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "porygon2": {
        "tier": "RU",
        "doublesTier": "DOU"
      },
      "porygonz": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "omanyte": {
        "tier": "LC"
      },
      "omastar": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "kabuto": {
        "tier": "LC"
      },
      "kabutops": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "aerodactyl": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "aerodactylmega": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "snorlax": {
        "tier": "RU",
        "doublesTier": "DUber"
      },
      "articuno": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "zapdos": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "moltres": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "dragonite": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "mewtwomegax": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "mewtwomegay": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "mew": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "typhlosion": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "feraligatr": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "ledyba": {
        "tier": "LC"
      },
      "ledian": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "lanturn": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "togepi": {
        "tier": "LC"
      },
      "togetic": {
        "tier": "NFE"
      },
      "togekiss": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "natu": {
        "tier": "LC"
      },
      "xatu": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "ampharosmega": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "azumarill": {
        "tier": "(OU)",
        "doublesTier": "DUU"
      },
      "aipom": {
        "tier": "NFE"
      },
      "ambipom": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "quagsire": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "murkrow": {
        "tier": "NFE"
      },
      "honchkrow": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "mismagius": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "unown": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "wynaut": {
        "tier": "LC"
      },
      "wobbuffet": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "girafarig": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "dunsparce": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gligar": {
        "tier": "UU",
        "doublesTier": "NFE"
      },
      "qwilfish": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "shuckle": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "heracross": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "heracrossmega": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "sneasel": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "weavile": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "ursaring": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "piloswine": {
        "tier": "NU",
        "doublesTier": "NFE"
      },
      "mamoswine": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "corsola": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "remoraid": {
        "tier": "LC"
      },
      "octillery": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "mantyke": {
        "tier": "LC"
      },
      "mantine": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "skarmory": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "houndoom": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "houndoommega": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "donphan": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "stantler": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "miltank": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "raikou": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "entei": {
        "tier": "RUBL",
        "doublesTier": "DUU"
      },
      "suicune": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "tyranitar": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "tyranitarmega": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "celebi": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "sceptile": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "sceptilemega": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "torchic": {
        "tier": "LC"
      },
      "combusken": {
        "tier": "ZU",
        "doublesTier": "NFE"
      },
      "blaziken": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "blazikenmega": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "swampert": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "swampertmega": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "zigzagoon": {
        "tier": "LC"
      },
      "linoone": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "wurmple": {
        "tier": "LC"
      },
      "silcoon": {
        "tier": "NFE"
      },
      "beautifly": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "cascoon": {
        "tier": "NFE"
      },
      "dustox": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "ludicolo": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "shiftry": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "taillow": {
        "tier": "LC"
      },
      "swellow": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "wingull": {
        "tier": "NFE"
      },
      "pelipper": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "gardevoir": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "gardevoirmega": {
        "tier": "UUBL",
        "doublesTier": "DOU"
      },
      "gallade": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "gallademega": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "breloom": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "nincada": {
        "tier": "LC"
      },
      "ninjask": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "shedinja": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "whismur": {
        "tier": "LC"
      },
      "loudred": {
        "tier": "NFE"
      },
      "exploud": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "hariyama": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "skitty": {
        "tier": "LC"
      },
      "delcatty": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "sableye": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "sableyemega": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "mawile": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "mawilemega": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "aron": {
        "tier": "LC"
      },
      "lairon": {
        "tier": "NFE"
      },
      "aggron": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "aggronmega": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "medicham": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "medichammega": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "electrike": {
        "tier": "LC"
      },
      "manectric": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "manectricmega": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "budew": {
        "tier": "LC"
      },
      "roselia": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "roserade": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "carvanha": {
        "tier": "LC"
      },
      "sharpedo": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "sharpedomega": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "wailmer": {
        "tier": "LC"
      },
      "wailord": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "cameruptmega": {
        "tier": "NUBL",
        "doublesTier": "DOU"
      },
      "torkoal": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "spinda": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "trapinch": {
        "tier": "NFE"
      },
      "flygon": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "altaria": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "altariamega": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "zangoose": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "lunatone": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "solrock": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "crawdaunt": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "baltoy": {
        "tier": "LC"
      },
      "claydol": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "lileep": {
        "tier": "LC"
      },
      "cradily": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "anorith": {
        "tier": "LC"
      },
      "armaldo": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "milotic": {
        "tier": "RU",
        "doublesTier": "DOU"
      },
      "castform": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "kecleon": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "banettemega": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "dusclops": {
        "tier": "ZU",
        "doublesTier": "NFE"
      },
      "absol": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "absolmega": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "glaliemega": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "froslass": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "spheal": {
        "tier": "LC"
      },
      "sealeo": {
        "tier": "NFE"
      },
      "walrein": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "clamperl": {
        "tier": "LC"
      },
      "huntail": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gorebyss": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "relicanth": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "salamence": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "salamencemega": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "metagross": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "metagrossmega": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "regirock": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "latias": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "latiasmega": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "latios": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "latiosmega": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "kyogreprimal": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "groudonprimal": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "rayquazamega": {
        "tier": "AG",
        "doublesTier": "DUber"
      },
      "jirachi": {
        "tier": "OU",
        "doublesTier": "DUber"
      },
      "deoxysattack": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "deoxysdefense": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "deoxysspeed": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "torterra": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "infernape": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "empoleon": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "staraptor": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "bidoof": {
        "tier": "LC"
      },
      "bibarel": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "burmy": {
        "tier": "LC"
      },
      "wormadam": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "wormadamsandy": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "wormadamtrash": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "mothim": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "floatzel": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "cherubi": {
        "tier": "LC"
      },
      "cherrim": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gastrodon": {
        "tier": "PU",
        "doublesTier": "DOU"
      },
      "drifloon": {
        "tier": "NFE"
      },
      "buneary": {
        "tier": "LC"
      },
      "lopunny": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "lopunnymega": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "glameow": {
        "tier": "LC"
      },
      "purugly": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "skuntank": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "bronzor": {
        "tier": "ZU",
        "doublesTier": "LC"
      },
      "bronzong": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "chatot": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "spiritomb": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "garchomp": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "garchompmega": {
        "tier": "(OU)",
        "doublesTier": "(DOU)"
      },
      "lucario": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "lucariomega": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "hippowdon": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "skorupi": {
        "tier": "LC"
      },
      "drapion": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "toxicroak": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "carnivine": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "abomasnow": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "abomasnowmega": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "rotom": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "rotomheat": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "rotomwash": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "rotomfrost": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "rotommow": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "uxie": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "mesprit": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "azelf": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "heatran": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "giratinaorigin": {},
      "cresselia": {
        "tier": "RU",
        "doublesTier": "DOU"
      },
      "manaphy": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "darkrai": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "shaymin": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "shayminsky": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "victini": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "snivy": {
        "tier": "LC"
      },
      "serperior": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "emboar": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "samurott": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "patrat": {
        "tier": "LC"
      },
      "watchog": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "lillipup": {
        "tier": "LC"
      },
      "herdier": {
        "tier": "NFE"
      },
      "stoutland": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "purrloin": {
        "tier": "LC"
      },
      "liepard": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "pansage": {
        "tier": "LC"
      },
      "simisage": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "pansear": {
        "tier": "LC"
      },
      "simisear": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "panpour": {
        "tier": "LC"
      },
      "simipour": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "munna": {
        "tier": "LC"
      },
      "musharna": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "pidove": {
        "tier": "LC"
      },
      "tranquill": {
        "tier": "NFE"
      },
      "unfezant": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "roggenrola": {
        "tier": "LC"
      },
      "boldore": {
        "tier": "NFE"
      },
      "gigalith": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "woobat": {
        "tier": "LC"
      },
      "swoobat": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "excadrill": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "audino": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "audinomega": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "gurdurr": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "conkeldurr": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "tympole": {
        "tier": "LC"
      },
      "palpitoad": {
        "tier": "NFE"
      },
      "seismitoad": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "throh": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "sawk": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "venipede": {
        "tier": "LC"
      },
      "whirlipede": {
        "tier": "NFE"
      },
      "scolipede": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "whimsicott": {
        "tier": "NU",
        "doublesTier": "DOU"
      },
      "lilligant": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "basculinbluestriped": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "krookodile": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "darumaka": {
        "tier": "LC"
      },
      "darmanitan": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "maractus": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "dwebble": {
        "tier": "LC"
      },
      "crustle": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "scraggy": {
        "tier": "LC"
      },
      "scrafty": {
        "tier": "NU",
        "doublesTier": "DOU"
      },
      "sigilyph": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "yamask": {
        "tier": "LC"
      },
      "cofagrigus": {
        "tier": "NUBL",
        "doublesTier": "DUU"
      },
      "tirtouga": {
        "tier": "LC"
      },
      "carracosta": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "archen": {
        "tier": "LC"
      },
      "archeops": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "trubbish": {
        "tier": "LC"
      },
      "garbodor": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "zoroark": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "cinccino": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "gothita": {
        "tier": "NFE"
      },
      "gothitelle": {
        "tier": "ZU",
        "doublesTier": "DOU"
      },
      "reuniclus": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "vanillite": {
        "tier": "LC"
      },
      "vanillish": {
        "tier": "NFE"
      },
      "vanilluxe": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "emolga": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "karrablast": {
        "tier": "LC"
      },
      "escavalier": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "amoonguss": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "frillish": {
        "tier": "LC"
      },
      "jellicent": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "alomomola": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "galvantula": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "ferroseed": {
        "tier": "PU",
        "doublesTier": "LC"
      },
      "ferrothorn": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "klink": {
        "tier": "LC"
      },
      "klang": {
        "tier": "NFE"
      },
      "klinklang": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "eelektross": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "elgyem": {
        "tier": "LC"
      },
      "beheeyem": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "chandelure": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "haxorus": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "cryogonal": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "shelmet": {
        "tier": "LC"
      },
      "accelgor": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "stunfisk": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "mienshao": {
        "tier": "RUBL",
        "doublesTier": "DUU"
      },
      "druddigon": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "pawniard": {
        "tier": "ZU",
        "doublesTier": "LC"
      },
      "bisharp": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "bouffalant": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "rufflet": {
        "tier": "LC"
      },
      "vullaby": {
        "tier": "LC"
      },
      "mandibuzz": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "heatmor": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "durant": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "hydreigon": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "volcarona": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "terrakion": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "virizion": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "tornadus": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "thundurus": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "thundurustherian": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "landorus": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "kyurem": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "kyuremblack": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "keldeo": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "keldeoresolute": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "meloetta": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "genesect": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "genesectburn": {
        "tier": "Uber",
        "doublesTier": "(DOU)"
      },
      "genesectchill": {
        "tier": "Uber",
        "doublesTier": "(DOU)"
      },
      "genesectdouse": {
        "tier": "Uber",
        "doublesTier": "(DOU)"
      },
      "genesectshock": {
        "tier": "Uber",
        "doublesTier": "(DOU)"
      },
      "chesnaught": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "delphox": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "greninja": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "greninjabond": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "greninjaash": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "bunnelby": {
        "tier": "LC"
      },
      "diggersby": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "talonflame": {
        "tier": "RUBL",
        "doublesTier": "DUU"
      },
      "vivillon": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "vivillonfancy": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "vivillonpokeball": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "pyroar": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "florges": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "pancham": {
        "tier": "LC"
      },
      "pangoro": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "furfrou": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "meowsticf": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "honedge": {
        "tier": "LC"
      },
      "doublade": {
        "tier": "UU",
        "doublesTier": "NFE"
      },
      "aegislash": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "spritzee": {
        "tier": "LC"
      },
      "aromatisse": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "swirlix": {
        "tier": "NFE"
      },
      "slurpuff": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "malamar": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "binacle": {
        "tier": "LC"
      },
      "barbaracle": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "dragalge": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "clawitzer": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "helioptile": {
        "tier": "LC"
      },
      "heliolisk": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "tyrunt": {
        "tier": "LC"
      },
      "tyrantrum": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "amaura": {
        "tier": "LC"
      },
      "aurorus": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "sylveon": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "hawlucha": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "goodra": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "klefki": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "pumpkaboo": {
        "tier": "LC"
      },
      "pumpkaboosmall": {
        "tier": "LC"
      },
      "pumpkaboolarge": {
        "tier": "LC"
      },
      "pumpkaboosuper": {
        "tier": "LC"
      },
      "gourgeist": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gourgeistsmall": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gourgeistlarge": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gourgeistsuper": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "avalugg": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "xerneas": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "yveltal": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "zygarde": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "zygarde10": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "zygardecomplete": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "dianciemega": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "hoopa": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "hoopaunbound": {
        "tier": "UUBL",
        "doublesTier": "DOU"
      },
      "volcanion": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "primarina": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "gumshoostotem": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "vikavolt": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "vikavolttotem": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "crabominable": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "oricorio": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "oricoriopompom": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "oricoriopau": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "oricoriosensu": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "ribombee": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "ribombeetotem": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "lycanroc": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "lycanrocdusk": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "wishiwashi": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "mareanie": {
        "tier": "ZU",
        "doublesTier": "LC"
      },
      "toxapex": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "araquanid": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "araquanidtotem": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "lurantis": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "lurantistotem": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "morelull": {
        "tier": "LC"
      },
      "shiinotic": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "salazzle": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "salazzletotem": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "stufful": {
        "tier": "LC"
      },
      "bewear": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "tsareena": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "comfey": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "oranguru": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "passimian": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "wimpod": {
        "tier": "LC"
      },
      "golisopod": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "palossand": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "pyukumuku": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "typenull": {
        "tier": "ZUBL",
        "doublesTier": "NFE"
      },
      "silvally": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallybug": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallydark": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallydragon": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallyelectric": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallyfairy": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "silvallyfighting": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallyfire": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallyflying": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallyghost": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "silvallygrass": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallyground": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallyice": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallypoison": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallypsychic": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallyrock": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallysteel": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "silvallywater": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "minior": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "turtonator": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "togedemaru": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "togedemarutotem": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "mimikyu": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "mimikyutotem": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "mimikyubustedtotem": {},
      "bruxish": {
        "tier": "NUBL",
        "doublesTier": "DUU"
      },
      "drampa": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "dhelmise": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "kommoo": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "kommoototem": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "tapukoko": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "tapulele": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "tapubulu": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "tapufini": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "nihilego": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "buzzwole": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "pheromosa": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "xurkitree": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "celesteela": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "kartana": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "guzzlord": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "necrozmaultra": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "magearna": {
        "tier": "OU",
        "doublesTier": "DUber"
      },
      "magearnaoriginal": {
        "tier": "Illegal"
      },
      "marshadow": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "poipole": {
        "tier": "NFE"
      },
      "naganadel": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "stakataka": {
        "tier": "RUBL",
        "doublesTier": "DOU"
      },
      "blacephalon": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "zeraora": {
        "tier": "UU",
        "doublesTier": "DOU"
      }
    },
    "baseStats": {
      "cresselia": {
        "hp": 120,
        "atk": 70,
        "def": 120,
        "spa": 75,
        "spd": 130,
        "spe": 85
      },
      "aegislash": {
        "hp": 60,
        "atk": 50,
        "def": 150,
        "spa": 50,
        "spd": 150,
        "spe": 60
      },
      "aegislashblade": {
        "hp": 60,
        "atk": 150,
        "def": 50,
        "spa": 150,
        "spd": 50,
        "spe": 60
      },
      "zacian": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zaciancrowned": {
        "hp": 92,
        "atk": 170,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 148
      },
      "zamazenta": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zamazentacrowned": {
        "hp": 92,
        "atk": 130,
        "def": 145,
        "spa": 80,
        "spd": 145,
        "spe": 128
      },
      "pyroak": {
        "hp": 120,
        "atk": 70,
        "def": 105,
        "spa": 95,
        "spd": 90,
        "spe": 60
      },
      "kitsunoh": {
        "hp": 80,
        "atk": 103,
        "def": 85,
        "spa": 55,
        "spd": 80,
        "spe": 110
      },
      "voodoom": {
        "hp": 90,
        "atk": 85,
        "def": 80,
        "spa": 105,
        "spd": 80,
        "spe": 110
      }
    },
    "abilities": {
      "pikachuoriginal": [
        "Static"
      ],
      "pikachuhoenn": [
        "Static"
      ],
      "pikachusinnoh": [
        "Static"
      ],
      "pikachuunova": [
        "Static"
      ],
      "pikachukalos": [
        "Static"
      ],
      "pikachualola": [
        "Static"
      ],
      "pikachupartner": [
        "Static"
      ],
      "growlithehisui": [
        "Intimidate",
        "Flash Fire",
        "Justified"
      ],
      "arcaninehisui": [
        "Intimidate",
        "Flash Fire",
        "Justified"
      ],
      "ponytagalar": [
        "Run Away",
        "Anticipation"
      ],
      "rapidashgalar": [
        "Run Away",
        "Anticipation"
      ],
      "slowbrogalar": [
        "Own Tempo",
        "Regenerator"
      ],
      "koffing": [
        "Levitate"
      ],
      "weezing": [
        "Levitate"
      ],
      "weezinggalar": [
        "Levitate",
        "Misty Surge"
      ],
      "mrmimegalar": [
        "Vital Spirit",
        "Ice Body"
      ],
      "taurospaldeacombat": [
        "Intimidate",
        "Anger Point"
      ],
      "taurospaldeablaze": [
        "Intimidate",
        "Anger Point"
      ],
      "taurospaldeaaqua": [
        "Intimidate",
        "Anger Point"
      ],
      "meganiummega": [],
      "typhlosionhisui": [
        "Blaze",
        "Flash Fire"
      ],
      "feraligatrmega": [],
      "slowkinggalar": [
        "Own Tempo",
        "Regenerator"
      ],
      "sneaselhisui": [
        "Inner Focus",
        "Keen Eye",
        "Poison Touch"
      ],
      "skarmorymega": [],
      "shiftry": [
        "Chlorophyll",
        "Early Bird",
        "Pickpocket"
      ],
      "absolmegaz": [],
      "piplup": [
        "Torrent",
        "Defiant"
      ],
      "prinplup": [
        "Torrent",
        "Defiant"
      ],
      "empoleon": [
        "Torrent",
        "Defiant"
      ],
      "lucariomegaz": [],
      "gallade": [
        "Steadfast",
        "Justified"
      ],
      "samurotthisui": [
        "Torrent",
        "Shell Armor"
      ],
      "excadrillmega": [],
      "darmanitangalar": [
        "Zen Mode"
      ],
      "yamaskgalar": [],
      "eelektrossmega": [],
      "stunfiskgalar": [],
      "golurkmega": [],
      "braviaryhisui": [
        "Keen Eye",
        "Sheer Force",
        "Defiant"
      ],
      "vivillonfancy": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonpokeball": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "pyroarmega": [],
      "sliggoohisui": [
        "Sap Sipper",
        "Overcoat",
        "Gooey"
      ],
      "goodrahisui": [
        "Sap Sipper",
        "Overcoat",
        "Gooey"
      ],
      "pumpkaboosmall": [
        "Pickup",
        "Frisk"
      ],
      "pumpkaboolarge": [
        "Pickup",
        "Frisk"
      ],
      "gourgeistsmall": [
        "Pickup",
        "Frisk"
      ],
      "gourgeistlarge": [
        "Pickup",
        "Frisk"
      ],
      "decidueyehisui": [
        "Overgrow",
        "Long Reach"
      ],
      "tapukoko": [
        "Electric Surge"
      ],
      "tapulele": [
        "Psychic Surge"
      ],
      "tapubulu": [
        "Grassy Surge"
      ],
      "tapufini": [
        "Misty Surge"
      ],
      "scorbunny": [
        "Blaze"
      ],
      "raboot": [
        "Blaze"
      ],
      "cinderace": [
        "Blaze"
      ],
      "cinderacegmax": [
        "Blaze"
      ],
      "corviknight": [
        "Pressure",
        "Unnerve"
      ],
      "corviknightgmax": [
        "Pressure",
        "Unnerve"
      ],
      "gossifleur": [
        "Regenerator",
        "Effect Spore"
      ],
      "eldegoss": [
        "Regenerator",
        "Effect Spore"
      ],
      "yamper": [
        "Rattled"
      ],
      "rolycoly": [
        "Heatproof",
        "Flash Fire"
      ],
      "carkol": [
        "Flame Body",
        "Flash Fire"
      ],
      "coalossal": [
        "Flame Body",
        "Flash Fire"
      ],
      "coalossalgmax": [
        "Flame Body",
        "Flash Fire"
      ],
      "applin": [
        "Gluttony",
        "Bulletproof"
      ],
      "flapple": [
        "Gluttony",
        "Hustle"
      ],
      "flapplegmax": [
        "Gluttony",
        "Hustle"
      ],
      "appletun": [
        "Gluttony",
        "Thick Fat"
      ],
      "appletungmax": [
        "Gluttony",
        "Thick Fat"
      ],
      "silicobra": [
        "Shed Skin",
        "Sand Veil"
      ],
      "sandaconda": [
        "Shed Skin",
        "Sand Veil"
      ],
      "sandacondagmax": [
        "Shed Skin",
        "Sand Veil"
      ],
      "cramorant": [],
      "cramorantgulping": [],
      "cramorantgorging": [],
      "arrokuda": [
        "Swift Swim"
      ],
      "barraskewda": [
        "Swift Swim"
      ],
      "toxtricity": [
        "Plus",
        "Technician"
      ],
      "toxtricitylowkey": [
        "Minus",
        "Technician"
      ],
      "toxtricitygmax": [
        "Plus",
        "Technician"
      ],
      "toxtricitylowkeygmax": [
        "Minus",
        "Technician"
      ],
      "perrserker": [
        "Battle Armor",
        "Tough Claws"
      ],
      "cursola": [
        "Weak Armor"
      ],
      "mrrime": [
        "Tangled Feet",
        "Ice Body"
      ],
      "runerigus": [],
      "snom": [
        "Shield Dust"
      ],
      "frosmoth": [
        "Shield Dust"
      ],
      "stonjourner": [],
      "eiscue": [],
      "eiscuenoice": [],
      "morpeko": [],
      "morpekohangry": [],
      "duraludon": [
        "Light Metal",
        "Heavy Metal"
      ],
      "duraludongmax": [
        "Light Metal",
        "Heavy Metal"
      ],
      "zacian": [],
      "zaciancrowned": [],
      "zamazenta": [],
      "zamazentacrowned": [],
      "urshifu": [],
      "urshifurapidstrike": [],
      "urshifugmax": [],
      "urshifurapidstrikegmax": [],
      "regieleki": [],
      "regidrago": [],
      "glastrier": [],
      "spectrier": [],
      "calyrexice": [],
      "calyrexshadow": [],
      "kleavor": [
        "Swarm",
        "Sheer Force",
        "Steadfast"
      ],
      "ursalunabloodmoon": [],
      "basculegion": [
        "Rattled",
        "Adaptability",
        "Mold Breaker"
      ],
      "basculegionf": [
        "Rattled",
        "Adaptability",
        "Mold Breaker"
      ],
      "sneasler": [
        "Pressure",
        "Poison Touch"
      ],
      "enamorus": [
        "Healer",
        "Contrary"
      ],
      "oinkologne": [
        "Gluttony",
        "Thick Fat"
      ],
      "dachsbun": [
        "Aroma Veil"
      ],
      "arboliva": [
        "Harvest"
      ],
      "nacli": [
        "Sturdy",
        "Clear Body"
      ],
      "naclstack": [
        "Sturdy",
        "Clear Body"
      ],
      "garganacl": [
        "Sturdy",
        "Clear Body"
      ],
      "bellibolt": [
        "Static",
        "Damp"
      ],
      "wattrel": [
        "Volt Absorb",
        "Competitive"
      ],
      "kilowattrel": [
        "Volt Absorb",
        "Competitive"
      ],
      "mabosstiff": [
        "Intimidate",
        "Stakeout"
      ],
      "bramblin": [
        "Infiltrator"
      ],
      "brambleghast": [
        "Infiltrator"
      ],
      "toedscool": [],
      "toedscruel": [],
      "klawf": [
        "Shell Armor",
        "Regenerator"
      ],
      "scovillainmega": [],
      "espathra": [
        "Frisk",
        "Speed Boost"
      ],
      "bombirdier": [
        "Big Pecks",
        "Keen Eye"
      ],
      "palafin": [],
      "palafinhero": [],
      "orthworm": [
        "Sand Veil"
      ],
      "glimmet": [
        "Corrosion"
      ],
      "glimmora": [
        "Corrosion"
      ],
      "flamigo": [
        "Scrappy",
        "Tangled Feet"
      ],
      "veluza": [
        "Mold Breaker"
      ],
      "tatsugiri": [
        "Storm Drain"
      ],
      "tatsugiridroopy": [
        "Storm Drain"
      ],
      "tatsugiristretchy": [
        "Storm Drain"
      ],
      "tatsugiricurlymega": [
        "Storm Drain"
      ],
      "tatsugiridroopymega": [
        "Storm Drain"
      ],
      "tatsugiristretchymega": [
        "Storm Drain"
      ],
      "farigiraf": [
        "Sap Sipper"
      ],
      "kingambit": [
        "Defiant",
        "Pressure"
      ],
      "greattusk": [],
      "screamtail": [],
      "brutebonnet": [],
      "fluttermane": [],
      "slitherwing": [],
      "sandyshocks": [],
      "irontreads": [],
      "ironbundle": [],
      "ironhands": [],
      "ironjugulis": [],
      "ironmoth": [],
      "ironthorns": [],
      "frigibax": [
        "Ice Body"
      ],
      "arctibax": [
        "Ice Body"
      ],
      "baxcalibur": [
        "Ice Body"
      ],
      "baxcaliburmega": [],
      "gholdengo": [],
      "wochien": [],
      "chienpao": [],
      "tinglu": [],
      "chiyu": [],
      "roaringmoon": [],
      "ironvaliant": [],
      "koraidon": [],
      "miraidon": [],
      "walkingwake": [],
      "ironleaves": [],
      "dipplin": [
        "Gluttony",
        "Sticky Hold"
      ],
      "poltchageist": [
        "Heatproof"
      ],
      "poltchageistartisan": [
        "Heatproof"
      ],
      "sinistcha": [
        "Heatproof"
      ],
      "sinistchamasterpiece": [
        "Heatproof"
      ],
      "okidogi": [],
      "munkidori": [
        "Frisk"
      ],
      "fezandipiti": [
        "Technician"
      ],
      "ogerpontealtera": [],
      "ogerponwellspringtera": [],
      "ogerponhearthflametera": [],
      "ogerponcornerstonetera": [],
      "archaludon": [
        "Stamina",
        "Sturdy"
      ],
      "hydrapple": [
        "Regenerator",
        "Sticky Hold"
      ],
      "gougingfire": [],
      "ragingbolt": [],
      "ironboulder": [],
      "ironcrown": [],
      "terapagos": [],
      "terapagosterastal": [],
      "terapagosstellar": [],
      "pecharunt": [],
      "pyroak": [
        "Rock Head",
        "Battle Armor",
        "White Smoke"
      ],
      "kitsunoh": [
        "Frisk",
        "Limber",
        "Iron Fist"
      ],
      "miasmite": [
        "Hyper Cutter",
        "Compound Eyes"
      ],
      "miasmaw": [
        "Hyper Cutter",
        "Compound Eyes"
      ],
      "saharascal": [
        "Water Absorb",
        "Pickpocket"
      ],
      "saharaja": [
        "Water Absorb",
        "Serene Grace"
      ],
      "draggalong": [
        "White Smoke",
        "Slow Start"
      ],
      "chuggalong": [
        "White Smoke",
        "Slow Start"
      ],
      "flox": [
        "Static",
        "Sticky Hold"
      ],
      "shox": [
        "Sticky Hold"
      ],
      "scraptor": [
        "Early Bird",
        "Pickup"
      ],
      "obliteryx": [
        "Early Bird",
        "Sniper"
      ]
    }
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
    "moves": {},
    "moveData": {
      "glaciallance": {
        "category": "Physical",
        "basePower": 130
      },
      "grassyglide": {
        "category": "Physical",
        "basePower": 70
      },
      "lusterpurge": {
        "category": "Special",
        "basePower": 70
      },
      "mistball": {
        "category": "Special",
        "basePower": 70
      },
      "wickedblow": {
        "category": "Physical",
        "basePower": 80
      }
    },
    "formats": {
      "venusaur": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "venusaurgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "charizard": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "charizardgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "blastoise": {
        "tier": "NUBL",
        "doublesTier": "DUU"
      },
      "blastoisegmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "caterpie": {
        "tier": "LC"
      },
      "metapod": {
        "tier": "NFE"
      },
      "butterfree": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "butterfreegmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "ekans": {
        "tier": "Illegal"
      },
      "arbok": {
        "tier": "Illegal"
      },
      "pikachugmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "raichualola": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "sandshrewalola": {
        "tier": "NUBL",
        "doublesTier": "LC"
      },
      "sandslash": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "sandslashalola": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "nidoranf": {
        "tier": "LC"
      },
      "nidorina": {
        "tier": "NFE"
      },
      "nidoqueen": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "nidoranm": {
        "tier": "LC"
      },
      "nidorino": {
        "tier": "NFE"
      },
      "nidoking": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "clefairy": {
        "tier": "ZU",
        "doublesTier": "NFE"
      },
      "vulpix": {
        "tier": "LC"
      },
      "ninetalesalola": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "zubat": {
        "tier": "LC"
      },
      "golbat": {
        "tier": "NFE"
      },
      "crobat": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "vileplume": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "bellossom": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "venonat": {
        "tier": "Illegal"
      },
      "venomoth": {
        "tier": "Illegal"
      },
      "diglett": {
        "tier": "LC"
      },
      "meowthgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "perrserker": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "mankey": {
        "tier": "Illegal"
      },
      "primeape": {
        "tier": "Illegal"
      },
      "growlithehisui": {
        "tier": "Illegal"
      },
      "arcanine": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "arcaninehisui": {
        "tier": "Illegal"
      },
      "politoed": {
        "tier": "ZU",
        "doublesTier": "DUU"
      },
      "abra": {
        "tier": "LC"
      },
      "kadabra": {
        "tier": "NFE"
      },
      "alakazam": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "machop": {
        "tier": "LC"
      },
      "machoke": {
        "tier": "NFE"
      },
      "machamp": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "machampgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "bellsprout": {
        "tier": "Illegal"
      },
      "weepinbell": {
        "tier": "Illegal"
      },
      "victreebel": {
        "tier": "Illegal"
      },
      "tentacruel": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "geodude": {
        "tier": "Illegal"
      },
      "geodudealola": {
        "tier": "Illegal"
      },
      "graveler": {
        "tier": "Illegal"
      },
      "graveleralola": {
        "tier": "Illegal"
      },
      "golem": {
        "tier": "Illegal"
      },
      "golemalola": {
        "tier": "Illegal"
      },
      "ponyta": {
        "tier": "LC"
      },
      "ponytagalar": {
        "tier": "LC"
      },
      "rapidash": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "rapidashgalar": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "slowbro": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "slowbrogalar": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "magneton": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "magnezone": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "farfetchd": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "farfetchdgalar": {
        "tier": "LC"
      },
      "sirfetchd": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "doduo": {
        "tier": "Illegal"
      },
      "dodrio": {
        "tier": "Illegal"
      },
      "seel": {
        "tier": "Illegal"
      },
      "dewgong": {
        "tier": "Illegal"
      },
      "grimer": {
        "tier": "Illegal"
      },
      "grimeralola": {
        "tier": "Illegal"
      },
      "muk": {
        "tier": "Illegal"
      },
      "mukalola": {
        "tier": "Illegal"
      },
      "shellder": {
        "tier": "LC"
      },
      "cloyster": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "haunter": {
        "tier": "ZUBL",
        "doublesTier": "NFE"
      },
      "gengar": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "gengargmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "onix": {
        "tier": "LC"
      },
      "steelix": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "drowzee": {
        "tier": "Illegal"
      },
      "hypno": {
        "tier": "Illegal"
      },
      "krabby": {
        "tier": "LC"
      },
      "kingler": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "kinglergmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "voltorb": {
        "tier": "Illegal"
      },
      "voltorbhisui": {
        "tier": "Illegal"
      },
      "electrode": {
        "tier": "Illegal"
      },
      "electrodehisui": {
        "tier": "Illegal"
      },
      "exeggutoralola": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "cubone": {
        "tier": "LC"
      },
      "marowak": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "marowakalola": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "hitmonlee": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "hitmontop": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "lickitung": {
        "tier": "LC"
      },
      "lickilicky": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "weezing": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "rhydon": {
        "tier": "ZU",
        "doublesTier": "NFE"
      },
      "rhyperior": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "chansey": {
        "tier": "UU",
        "doublesTier": "NFE"
      },
      "blissey": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "tangela": {
        "tier": "NFE"
      },
      "tangrowth": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "kangaskhan": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "kingdra": {
        "tier": "PUBL",
        "doublesTier": "DUU"
      },
      "goldeen": {
        "tier": "LC"
      },
      "seaking": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "staryu": {
        "tier": "LC"
      },
      "starmie": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "mimejr": {
        "tier": "LC"
      },
      "mrmime": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "mrmimegalar": {
        "tier": "NFE"
      },
      "mrrime": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "scyther": {
        "tier": "PUBL",
        "doublesTier": "NFE"
      },
      "scizor": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "smoochum": {
        "tier": "LC"
      },
      "jynx": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "magmortar": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "pinsir": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "tauros": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "gyarados": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "laprasgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "eeveegmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "jolteon": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "espeon": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "sylveon": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "porygon": {
        "tier": "LC"
      },
      "porygon2": {
        "tier": "RU",
        "doublesTier": "DOU"
      },
      "omanyte": {
        "tier": "LC"
      },
      "omastar": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "kabuto": {
        "tier": "LC"
      },
      "kabutops": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "aerodactyl": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "snorlax": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "snorlaxgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "articunogalar": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "zapdos": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "zapdosgalar": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "moltres": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "moltresgalar": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "dragonite": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "mew": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "chikorita": {
        "tier": "Illegal"
      },
      "bayleef": {
        "tier": "Illegal"
      },
      "meganium": {
        "tier": "Illegal"
      },
      "cyndaquil": {
        "tier": "Illegal"
      },
      "quilava": {
        "tier": "Illegal"
      },
      "typhlosion": {
        "tier": "Illegal"
      },
      "typhlosionhisui": {
        "tier": "Illegal"
      },
      "totodile": {
        "tier": "Illegal"
      },
      "croconaw": {
        "tier": "Illegal"
      },
      "feraligatr": {
        "tier": "Illegal"
      },
      "sentret": {
        "tier": "Illegal"
      },
      "furret": {
        "tier": "Illegal"
      },
      "spinarak": {
        "tier": "Illegal"
      },
      "ariados": {
        "tier": "Illegal"
      },
      "lanturn": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "togepi": {
        "tier": "LC"
      },
      "togetic": {
        "tier": "NFE"
      },
      "togekiss": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "natu": {
        "tier": "LC"
      },
      "xatu": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "mareep": {
        "tier": "Illegal"
      },
      "flaaffy": {
        "tier": "Illegal"
      },
      "ampharos": {
        "tier": "Illegal"
      },
      "hoppip": {
        "tier": "Illegal"
      },
      "skiploom": {
        "tier": "Illegal"
      },
      "jumpluff": {
        "tier": "Illegal"
      },
      "aipom": {
        "tier": "Illegal"
      },
      "ambipom": {
        "tier": "Illegal"
      },
      "sunkern": {
        "tier": "Illegal"
      },
      "sunflora": {
        "tier": "Illegal"
      },
      "yanma": {
        "tier": "Illegal"
      },
      "yanmega": {
        "tier": "Illegal"
      },
      "quagsire": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "murkrow": {
        "tier": "Illegal"
      },
      "honchkrow": {
        "tier": "Illegal"
      },
      "misdreavus": {
        "tier": "Illegal"
      },
      "mismagius": {
        "tier": "Illegal"
      },
      "wynaut": {
        "tier": "LC"
      },
      "wobbuffet": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "girafarig": {
        "tier": "Illegal"
      },
      "pineco": {
        "tier": "Illegal"
      },
      "forretress": {
        "tier": "Illegal"
      },
      "dunsparce": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gligar": {
        "tier": "Illegal"
      },
      "gliscor": {
        "tier": "Illegal"
      },
      "snubbull": {
        "tier": "Illegal"
      },
      "granbull": {
        "tier": "Illegal"
      },
      "qwilfishhisui": {
        "tier": "Illegal"
      },
      "shuckle": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "heracross": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "sneasel": {
        "tier": "ZUBL",
        "doublesTier": "NFE"
      },
      "sneaselhisui": {
        "tier": "Illegal"
      },
      "weavile": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "teddiursa": {
        "tier": "Illegal"
      },
      "ursaring": {
        "tier": "Illegal"
      },
      "slugma": {
        "tier": "Illegal"
      },
      "magcargo": {
        "tier": "Illegal"
      },
      "piloswine": {
        "tier": "ZU",
        "doublesTier": "NFE"
      },
      "mamoswine": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "corsola": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "corsolagalar": {
        "tier": "NFE"
      },
      "cursola": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "remoraid": {
        "tier": "LC"
      },
      "octillery": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "mantyke": {
        "tier": "LC"
      },
      "mantine": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "houndour": {
        "tier": "Illegal"
      },
      "houndoom": {
        "tier": "Illegal"
      },
      "phanpy": {
        "tier": "Illegal"
      },
      "donphan": {
        "tier": "Illegal"
      },
      "stantler": {
        "tier": "Illegal"
      },
      "smeargle": {
        "tier": "Illegal"
      },
      "miltank": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "raikou": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "entei": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "tyranitar": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "celebi": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "sceptile": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "torchic": {
        "tier": "LC"
      },
      "swampert": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "poochyena": {
        "tier": "Illegal"
      },
      "mightyena": {
        "tier": "Illegal"
      },
      "zigzagoon": {
        "tier": "NFE"
      },
      "zigzagoongalar": {
        "tier": "LC"
      },
      "linoone": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "linoonegalar": {
        "tier": "NFE"
      },
      "obstagoon": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "pelipper": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "gallade": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "surskit": {
        "tier": "Illegal"
      },
      "masquerain": {
        "tier": "Illegal"
      },
      "shroomish": {
        "tier": "Illegal"
      },
      "breloom": {
        "tier": "Illegal"
      },
      "slakoth": {
        "tier": "Illegal"
      },
      "vigoroth": {
        "tier": "Illegal"
      },
      "slaking": {
        "tier": "Illegal"
      },
      "nincada": {
        "tier": "LC"
      },
      "ninjask": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "shedinja": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "whismur": {
        "tier": "LC"
      },
      "loudred": {
        "tier": "NFE"
      },
      "exploud": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "makuhita": {
        "tier": "Illegal"
      },
      "hariyama": {
        "tier": "Illegal"
      },
      "nosepass": {
        "tier": "Illegal"
      },
      "probopass": {
        "tier": "Illegal"
      },
      "mawile": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "aron": {
        "tier": "LC"
      },
      "lairon": {
        "tier": "NFE"
      },
      "aggron": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "meditite": {
        "tier": "Illegal"
      },
      "medicham": {
        "tier": "Illegal"
      },
      "electrike": {
        "tier": "LC"
      },
      "manectric": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "plusle": {
        "tier": "Illegal"
      },
      "minun": {
        "tier": "Illegal"
      },
      "volbeat": {
        "tier": "Illegal"
      },
      "illumise": {
        "tier": "Illegal"
      },
      "budew": {
        "tier": "LC"
      },
      "roselia": {
        "tier": "NFE"
      },
      "roserade": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "gulpin": {
        "tier": "Illegal"
      },
      "swalot": {
        "tier": "Illegal"
      },
      "carvanha": {
        "tier": "LC"
      },
      "sharpedo": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "wailmer": {
        "tier": "LC"
      },
      "wailord": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "numel": {
        "tier": "Illegal"
      },
      "camerupt": {
        "tier": "Illegal"
      },
      "torkoal": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "spoink": {
        "tier": "Illegal"
      },
      "grumpig": {
        "tier": "Illegal"
      },
      "flygon": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "cacnea": {
        "tier": "Illegal"
      },
      "cacturne": {
        "tier": "Illegal"
      },
      "altaria": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "zangoose": {
        "tier": "Illegal"
      },
      "seviper": {
        "tier": "Illegal"
      },
      "lunatone": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "solrock": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "crawdaunt": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "baltoy": {
        "tier": "LC"
      },
      "claydol": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "lileep": {
        "tier": "LC"
      },
      "cradily": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "anorith": {
        "tier": "LC"
      },
      "armaldo": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "milotic": {
        "tier": "RU",
        "doublesTier": "DUU"
      },
      "shuppet": {
        "tier": "Illegal"
      },
      "banette": {
        "tier": "Illegal"
      },
      "tropius": {
        "tier": "Illegal"
      },
      "chingling": {
        "tier": "Illegal"
      },
      "chimecho": {
        "tier": "Illegal"
      },
      "absol": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "spheal": {
        "tier": "LC"
      },
      "sealeo": {
        "tier": "NFE"
      },
      "walrein": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "relicanth": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "luvdisc": {
        "tier": "Illegal"
      },
      "salamence": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "metagross": {
        "tier": "RU",
        "doublesTier": "DOU"
      },
      "regirock": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "latios": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "jirachi": {
        "tier": "UU",
        "doublesTier": "DUber"
      },
      "deoxys": {
        "tier": "Illegal"
      },
      "deoxysattack": {
        "tier": "Illegal"
      },
      "deoxysdefense": {
        "tier": "Illegal"
      },
      "deoxysspeed": {
        "tier": "Illegal"
      },
      "turtwig": {
        "tier": "Illegal"
      },
      "grotle": {
        "tier": "Illegal"
      },
      "torterra": {
        "tier": "Illegal"
      },
      "chimchar": {
        "tier": "Illegal"
      },
      "monferno": {
        "tier": "Illegal"
      },
      "infernape": {
        "tier": "Illegal"
      },
      "piplup": {
        "tier": "Illegal"
      },
      "prinplup": {
        "tier": "Illegal"
      },
      "empoleon": {
        "tier": "Illegal"
      },
      "starly": {
        "tier": "Illegal"
      },
      "staravia": {
        "tier": "Illegal"
      },
      "staraptor": {
        "tier": "Illegal"
      },
      "kricketot": {
        "tier": "Illegal"
      },
      "kricketune": {
        "tier": "Illegal"
      },
      "cranidos": {
        "tier": "Illegal"
      },
      "rampardos": {
        "tier": "Illegal"
      },
      "shieldon": {
        "tier": "Illegal"
      },
      "bastiodon": {
        "tier": "Illegal"
      },
      "pachirisu": {
        "tier": "Illegal"
      },
      "buizel": {
        "tier": "Illegal"
      },
      "floatzel": {
        "tier": "Illegal"
      },
      "cherubi": {
        "tier": "NFE"
      },
      "cherrim": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gastrodon": {
        "tier": "NU",
        "doublesTier": "DOU"
      },
      "drifloon": {
        "tier": "NFE"
      },
      "buneary": {
        "tier": "LC"
      },
      "lopunny": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "bronzong": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "garchomp": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "lucario": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "hippowdon": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "skorupi": {
        "tier": "LC"
      },
      "drapion": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "toxicroak": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "finneon": {
        "tier": "Illegal"
      },
      "lumineon": {
        "tier": "Illegal"
      },
      "abomasnow": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "rotomheat": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "rotomfrost": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "rotommow": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "uxie": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "mesprit": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "azelf": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "dialgaorigin": {
        "tier": "Illegal"
      },
      "palkiaorigin": {
        "tier": "Illegal"
      },
      "heatran": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "cresselia": {
        "tier": "NUBL",
        "doublesTier": "DUU"
      },
      "phione": {
        "tier": "Illegal"
      },
      "manaphy": {
        "tier": "Illegal"
      },
      "darkrai": {
        "tier": "Illegal"
      },
      "shaymin": {
        "tier": "Illegal"
      },
      "shayminsky": {
        "tier": "Illegal"
      },
      "arceus": {
        "tier": "Illegal"
      },
      "victini": {
        "tier": "(OU)",
        "doublesTier": "DUU"
      },
      "snivy": {
        "tier": "Illegal"
      },
      "servine": {
        "tier": "Illegal"
      },
      "serperior": {
        "tier": "Illegal"
      },
      "tepig": {
        "tier": "Illegal"
      },
      "pignite": {
        "tier": "Illegal"
      },
      "emboar": {
        "tier": "Illegal"
      },
      "oshawott": {
        "tier": "Illegal"
      },
      "dewott": {
        "tier": "Illegal"
      },
      "samurott": {
        "tier": "Illegal"
      },
      "samurotthisui": {
        "tier": "Illegal"
      },
      "lillipup": {
        "tier": "LC"
      },
      "herdier": {
        "tier": "NFE"
      },
      "stoutland": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "purrloin": {
        "tier": "LC"
      },
      "liepard": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "munna": {
        "tier": "LC"
      },
      "musharna": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "pidove": {
        "tier": "LC"
      },
      "tranquill": {
        "tier": "NFE"
      },
      "unfezant": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "blitzle": {
        "tier": "Illegal"
      },
      "zebstrika": {
        "tier": "Illegal"
      },
      "roggenrola": {
        "tier": "LC"
      },
      "boldore": {
        "tier": "NFE"
      },
      "gigalith": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "woobat": {
        "tier": "NFE"
      },
      "swoobat": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "excadrill": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "audino": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "tympole": {
        "tier": "LC"
      },
      "palpitoad": {
        "tier": "NFE"
      },
      "seismitoad": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "throh": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "sawk": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "sewaddle": {
        "tier": "Illegal"
      },
      "swadloon": {
        "tier": "Illegal"
      },
      "leavanny": {
        "tier": "Illegal"
      },
      "venipede": {
        "tier": "LC"
      },
      "whirlipede": {
        "tier": "NFE"
      },
      "scolipede": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "whimsicott": {
        "tier": "PU",
        "doublesTier": "DOU"
      },
      "lilliganthisui": {
        "tier": "Illegal"
      },
      "basculin": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "basculinbluestriped": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "basculinwhitestriped": {
        "tier": "Illegal"
      },
      "krookodile": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "darumaka": {
        "tier": "LC"
      },
      "darumakagalar": {
        "tier": "LC"
      },
      "darmanitan": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "darmanitanzen": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "darmanitangalar": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "darmanitangalarzen": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "maractus": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "dwebble": {
        "tier": "LC"
      },
      "crustle": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "sigilyph": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "yamask": {
        "tier": "LC"
      },
      "yamaskgalar": {
        "tier": "LC"
      },
      "cofagrigus": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "runerigus": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "tirtouga": {
        "tier": "LC"
      },
      "carracosta": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "archen": {
        "tier": "LC"
      },
      "archeops": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "trubbish": {
        "tier": "LC"
      },
      "garbodor": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "garbodorgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "zoruahisui": {
        "tier": "Illegal"
      },
      "zoroark": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "zoroarkhisui": {
        "tier": "Illegal"
      },
      "cinccino": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "gothita": {
        "tier": "NFE"
      },
      "reuniclus": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "ducklett": {
        "tier": "Illegal"
      },
      "swanna": {
        "tier": "Illegal"
      },
      "vanillite": {
        "tier": "LC"
      },
      "vanillish": {
        "tier": "NFE"
      },
      "vanilluxe": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "deerling": {
        "tier": "Illegal"
      },
      "sawsbuck": {
        "tier": "Illegal"
      },
      "emolga": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "karrablast": {
        "tier": "LC"
      },
      "escavalier": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "amoonguss": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "frillish": {
        "tier": "LC"
      },
      "jellicent": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "alomomola": {
        "tier": "Illegal"
      },
      "galvantula": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "ferroseed": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "ferrothorn": {
        "tier": "OU",
        "doublesTier": "DUU"
      },
      "klink": {
        "tier": "LC"
      },
      "klang": {
        "tier": "NFE"
      },
      "klinklang": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "tynamo": {
        "tier": "Illegal"
      },
      "eelektrik": {
        "tier": "Illegal"
      },
      "eelektross": {
        "tier": "Illegal"
      },
      "elgyem": {
        "tier": "LC"
      },
      "beheeyem": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "chandelure": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "shelmet": {
        "tier": "LC"
      },
      "accelgor": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "stunfisk": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "stunfiskgalar": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "mienshao": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "druddigon": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "golurk": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "bisharp": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "bouffalant": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "braviaryhisui": {
        "tier": "Illegal"
      },
      "vullaby": {
        "tier": "LC"
      },
      "heatmor": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "durant": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "volcarona": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "terrakion": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "virizion": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "tornadus": {
        "tier": "NUBL",
        "doublesTier": "DUU"
      },
      "thundurus": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "kyurem": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "kyuremblack": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "meloetta": {
        "tier": "Illegal"
      },
      "genesect": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "genesectburn": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "genesectchill": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "genesectdouse": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "genesectshock": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "chespin": {
        "tier": "Illegal"
      },
      "quilladin": {
        "tier": "Illegal"
      },
      "chesnaught": {
        "tier": "Illegal"
      },
      "fennekin": {
        "tier": "Illegal"
      },
      "braixen": {
        "tier": "Illegal"
      },
      "delphox": {
        "tier": "Illegal"
      },
      "froakie": {
        "tier": "Illegal"
      },
      "frogadier": {
        "tier": "Illegal"
      },
      "greninja": {
        "tier": "Illegal"
      },
      "greninjabond": {
        "tier": "Illegal"
      },
      "greninjaash": {},
      "bunnelby": {
        "tier": "LC"
      },
      "diggersby": {
        "tier": "RUBL",
        "doublesTier": "(DUU)"
      },
      "talonflame": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "scatterbug": {
        "tier": "Illegal"
      },
      "spewpa": {
        "tier": "Illegal"
      },
      "vivillon": {
        "tier": "Illegal"
      },
      "litleo": {
        "tier": "Illegal"
      },
      "pyroar": {
        "tier": "Illegal"
      },
      "flabebe": {
        "tier": "Illegal"
      },
      "floette": {
        "tier": "Illegal"
      },
      "florges": {
        "tier": "Illegal"
      },
      "skiddo": {
        "tier": "Illegal"
      },
      "gogoat": {
        "tier": "Illegal"
      },
      "pancham": {
        "tier": "LC"
      },
      "pangoro": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "meowsticf": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "honedge": {
        "tier": "LC"
      },
      "doublade": {
        "tier": "PU",
        "doublesTier": "NFE"
      },
      "aegislash": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "aegislashblade": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "spritzee": {
        "tier": "LC"
      },
      "aromatisse": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "swirlix": {
        "tier": "NFE"
      },
      "slurpuff": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "malamar": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "binacle": {
        "tier": "LC"
      },
      "barbaracle": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "dragalge": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "clawitzer": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "helioptile": {
        "tier": "LC"
      },
      "heliolisk": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "tyrunt": {
        "tier": "LC"
      },
      "tyrantrum": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "amaura": {
        "tier": "LC"
      },
      "aurorus": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "hawlucha": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "sliggoohisui": {
        "tier": "Illegal"
      },
      "goodra": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "goodrahisui": {
        "tier": "Illegal"
      },
      "klefki": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "pumpkaboo": {
        "tier": "LC"
      },
      "pumpkaboosmall": {
        "tier": "LC"
      },
      "pumpkaboolarge": {
        "tier": "LC"
      },
      "pumpkaboosuper": {
        "tier": "LC"
      },
      "gourgeist": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gourgeistsmall": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gourgeistlarge": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gourgeistsuper": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "avalugg": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "avalugghisui": {
        "tier": "Illegal"
      },
      "xerneas": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "yveltal": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "zygarde": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "zygarde10": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "zygardecomplete": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "diancie": {
        "tier": "NU",
        "doublesTier": "DOU"
      },
      "hoopa": {
        "tier": "Illegal"
      },
      "hoopaunbound": {
        "tier": "Illegal"
      },
      "volcanion": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "decidueyehisui": {
        "tier": "Illegal"
      },
      "incineroar": {
        "tier": "RU",
        "doublesTier": "DOU"
      },
      "primarina": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "pikipek": {
        "tier": "Illegal"
      },
      "trumbeak": {
        "tier": "Illegal"
      },
      "toucannon": {
        "tier": "Illegal"
      },
      "yungoos": {
        "tier": "Illegal"
      },
      "gumshoos": {
        "tier": "Illegal"
      },
      "vikavolt": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "crabrawler": {
        "tier": "Illegal"
      },
      "crabominable": {
        "tier": "Illegal"
      },
      "oricorio": {
        "tier": "Illegal"
      },
      "oricoriopompom": {
        "tier": "Illegal"
      },
      "oricoriopau": {
        "tier": "Illegal"
      },
      "oricoriosensu": {
        "tier": "Illegal"
      },
      "ribombee": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "lycanroc": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "lycanrocdusk": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "wishiwashi": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "toxapex": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "mudsdale": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "araquanid": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "morelull": {
        "tier": "LC"
      },
      "shiinotic": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "salazzle": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "stufful": {
        "tier": "LC"
      },
      "bewear": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "tsareena": {
        "tier": "NU",
        "doublesTier": "DOU"
      },
      "comfey": {
        "tier": "PU",
        "doublesTier": "DUU"
      },
      "passimian": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "wimpod": {
        "tier": "LC"
      },
      "golisopod": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "palossand": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "pyukumuku": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "typenull": {
        "tier": "NFE"
      },
      "silvally": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallybug": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallydark": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallydragon": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "silvallyelectric": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallyfairy": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "silvallyfighting": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallyfire": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallyflying": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallyghost": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "silvallygrass": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallyground": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "silvallyice": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallypoison": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallypsychic": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallyrock": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "silvallysteel": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "silvallywater": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "minior": {
        "tier": "Illegal"
      },
      "komala": {
        "tier": "Illegal"
      },
      "turtonator": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "togedemaru": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "bruxish": {
        "tier": "Illegal"
      },
      "drampa": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "dhelmise": {
        "tier": "NU",
        "doublesTier": "(DUU)"
      },
      "tapukoko": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "tapulele": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "tapubulu": {
        "tier": "UU",
        "doublesTier": "DUU"
      },
      "tapufini": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "nihilego": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "buzzwole": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "pheromosa": {
        "tier": "Uber",
        "doublesTier": "(DUU)"
      },
      "xurkitree": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "celesteela": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "kartana": {
        "tier": "OU",
        "doublesTier": "DUber"
      },
      "guzzlord": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "necrozma": {
        "tier": "RUBL",
        "doublesTier": "DOU"
      },
      "marshadow": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "poipole": {
        "tier": "NFE"
      },
      "naganadel": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "stakataka": {
        "tier": "NU",
        "doublesTier": "DOU"
      },
      "blacephalon": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "zeraora": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "meltan": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "melmetal": {
        "tier": "OU",
        "doublesTier": "DUber"
      },
      "melmetalgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "thwackey": {
        "tier": "ZU",
        "doublesTier": "NFE"
      },
      "rillaboomgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "cinderace": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "cinderacegmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "inteleongmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "corviknightgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "blipbug": {
        "tier": "LC"
      },
      "dottler": {
        "tier": "NFE"
      },
      "orbeetle": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "orbeetlegmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "nickit": {
        "tier": "LC"
      },
      "thievul": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "gossifleur": {
        "tier": "LC"
      },
      "eldegoss": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "wooloo": {
        "tier": "LC"
      },
      "dubwool": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "drednaw": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "drednawgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "yamper": {
        "tier": "LC"
      },
      "boltund": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "coalossalgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "flapplegmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "appletungmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "sandaconda": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "sandacondagmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "cramorant": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "cramorantgulping": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "cramorantgorging": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "barraskewda": {
        "tier": "OU",
        "doublesTier": "(DUU)"
      },
      "toxtricitylowkey": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "toxtricitygmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "toxtricitylowkeygmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "sizzlipede": {
        "tier": "LC"
      },
      "centiskorch": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "centiskorchgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "clobbopus": {
        "tier": "LC"
      },
      "grapploct": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "sinisteaantique": {
        "tier": "LC"
      },
      "polteageist": {
        "tier": "RU",
        "doublesTier": "(DUU)"
      },
      "hatterene": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "hatterenegmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "grimmsnarl": {
        "tier": "NU",
        "doublesTier": "DUU"
      },
      "grimmsnarlgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "alcremie": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "alcremiegmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "frosmoth": {
        "tier": "PU",
        "doublesTier": "(DUU)"
      },
      "indeedee": {
        "tier": "NUBL",
        "doublesTier": "DUU"
      },
      "indeedeef": {
        "tier": "NUBL",
        "doublesTier": "DOU"
      },
      "morpekohangry": {
        "tier": "ZU",
        "doublesTier": "(DUU)"
      },
      "copperajahgmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "dracozolt": {
        "tier": "UUBL",
        "doublesTier": "DUU"
      },
      "arctozolt": {
        "tier": "UUBL",
        "doublesTier": "(DUU)"
      },
      "dracovish": {
        "tier": "Uber",
        "doublesTier": "DOU"
      },
      "arctovish": {
        "tier": "ZUBL",
        "doublesTier": "(DUU)"
      },
      "duraludon": {
        "tier": "PUBL",
        "doublesTier": "(DUU)"
      },
      "duraludongmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "dragapult": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "zacian": {
        "tier": "AG",
        "doublesTier": "DUber"
      },
      "zaciancrowned": {
        "tier": "AG",
        "doublesTier": "DUber"
      },
      "zamazenta": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "urshifurapidstrike": {
        "tier": "OU",
        "doublesTier": "DOU"
      },
      "urshifugmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "urshifurapidstrikegmax": {
        "tier": "AG",
        "doublesTier": "(DUber)"
      },
      "zarude": {
        "tier": "UU",
        "doublesTier": "(DUU)"
      },
      "regieleki": {
        "tier": "UU",
        "doublesTier": "DOU"
      },
      "regidrago": {
        "tier": "NUBL",
        "doublesTier": "(DUU)"
      },
      "spectrier": {
        "tier": "Uber",
        "doublesTier": "DUU"
      },
      "calyrexshadow": {
        "tier": "Uber",
        "doublesTier": "DUber"
      },
      "wyrdeer": {
        "tier": "Illegal"
      },
      "kleavor": {
        "tier": "Illegal"
      },
      "ursaluna": {
        "tier": "Illegal"
      },
      "basculegion": {
        "tier": "Illegal"
      },
      "basculegionf": {
        "tier": "Illegal"
      },
      "sneasler": {
        "tier": "Illegal"
      },
      "overqwil": {
        "tier": "Illegal"
      },
      "enamorus": {
        "tier": "Illegal"
      },
      "enamorustherian": {
        "tier": "Illegal"
      },
      "pokestargiant2": {
        "tier": "Illegal"
      },
      "pokestargiantpropo2": {
        "tier": "Illegal"
      }
    },
    "baseStats": {
      "cresselia": {
        "hp": 120,
        "atk": 70,
        "def": 120,
        "spa": 75,
        "spd": 130,
        "spe": 85
      },
      "zacian": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zaciancrowned": {
        "hp": 92,
        "atk": 170,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 148
      },
      "zamazenta": {
        "hp": 92,
        "atk": 130,
        "def": 115,
        "spa": 80,
        "spd": 115,
        "spe": 138
      },
      "zamazentacrowned": {
        "hp": 92,
        "atk": 130,
        "def": 145,
        "spa": 80,
        "spd": 145,
        "spe": 128
      },
      "kitsunoh": {
        "hp": 80,
        "atk": 103,
        "def": 85,
        "spa": 55,
        "spd": 80,
        "spe": 110
      }
    },
    "abilities": {
      "growlithehisui": [
        "Intimidate",
        "Flash Fire",
        "Justified"
      ],
      "arcaninehisui": [
        "Intimidate",
        "Flash Fire",
        "Justified"
      ],
      "taurospaldeacombat": [
        "Intimidate",
        "Anger Point"
      ],
      "taurospaldeablaze": [
        "Intimidate",
        "Anger Point"
      ],
      "taurospaldeaaqua": [
        "Intimidate",
        "Anger Point"
      ],
      "meganiummega": [],
      "typhlosionhisui": [
        "Blaze",
        "Flash Fire"
      ],
      "feraligatrmega": [],
      "sneaselhisui": [
        "Inner Focus",
        "Keen Eye",
        "Poison Touch"
      ],
      "shiftry": [
        "Chlorophyll",
        "Early Bird",
        "Pickpocket"
      ],
      "absolmegaz": [],
      "piplup": [
        "Torrent",
        "Defiant"
      ],
      "prinplup": [
        "Torrent",
        "Defiant"
      ],
      "empoleon": [
        "Torrent",
        "Defiant"
      ],
      "lucariomegaz": [],
      "gallade": [
        "Steadfast",
        "Justified"
      ],
      "samurotthisui": [
        "Torrent",
        "Shell Armor"
      ],
      "excadrillmega": [],
      "eelektrossmega": [],
      "braviaryhisui": [
        "Keen Eye",
        "Sheer Force",
        "Defiant"
      ],
      "vivillonfancy": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "vivillonpokeball": [
        "Shield Dust",
        "Compound Eyes"
      ],
      "pyroarmega": [],
      "sliggoohisui": [
        "Sap Sipper",
        "Overcoat",
        "Gooey"
      ],
      "goodrahisui": [
        "Sap Sipper",
        "Overcoat",
        "Gooey"
      ],
      "decidueyehisui": [
        "Overgrow",
        "Long Reach"
      ],
      "kleavor": [
        "Swarm",
        "Sheer Force",
        "Steadfast"
      ],
      "ursalunabloodmoon": [],
      "basculegion": [
        "Rattled",
        "Adaptability",
        "Mold Breaker"
      ],
      "basculegionf": [
        "Rattled",
        "Adaptability",
        "Mold Breaker"
      ],
      "sneasler": [
        "Pressure",
        "Poison Touch"
      ],
      "enamorus": [
        "Healer",
        "Contrary"
      ],
      "oinkologne": [
        "Gluttony",
        "Thick Fat"
      ],
      "dachsbun": [
        "Aroma Veil"
      ],
      "arboliva": [
        "Harvest"
      ],
      "nacli": [
        "Sturdy",
        "Clear Body"
      ],
      "naclstack": [
        "Sturdy",
        "Clear Body"
      ],
      "garganacl": [
        "Sturdy",
        "Clear Body"
      ],
      "bellibolt": [
        "Static",
        "Damp"
      ],
      "wattrel": [
        "Volt Absorb",
        "Competitive"
      ],
      "kilowattrel": [
        "Volt Absorb",
        "Competitive"
      ],
      "mabosstiff": [
        "Intimidate",
        "Stakeout"
      ],
      "bramblin": [
        "Infiltrator"
      ],
      "brambleghast": [
        "Infiltrator"
      ],
      "toedscool": [],
      "toedscruel": [],
      "klawf": [
        "Shell Armor",
        "Regenerator"
      ],
      "scovillainmega": [],
      "espathra": [
        "Frisk",
        "Speed Boost"
      ],
      "bombirdier": [
        "Big Pecks",
        "Keen Eye"
      ],
      "palafin": [],
      "palafinhero": [],
      "orthworm": [
        "Sand Veil"
      ],
      "glimmet": [
        "Corrosion"
      ],
      "glimmora": [
        "Corrosion"
      ],
      "flamigo": [
        "Scrappy",
        "Tangled Feet"
      ],
      "veluza": [
        "Mold Breaker"
      ],
      "tatsugiri": [
        "Storm Drain"
      ],
      "tatsugiridroopy": [
        "Storm Drain"
      ],
      "tatsugiristretchy": [
        "Storm Drain"
      ],
      "tatsugiricurlymega": [
        "Storm Drain"
      ],
      "tatsugiridroopymega": [
        "Storm Drain"
      ],
      "tatsugiristretchymega": [
        "Storm Drain"
      ],
      "farigiraf": [
        "Sap Sipper"
      ],
      "kingambit": [
        "Defiant",
        "Pressure"
      ],
      "greattusk": [],
      "screamtail": [],
      "brutebonnet": [],
      "fluttermane": [],
      "slitherwing": [],
      "sandyshocks": [],
      "irontreads": [],
      "ironbundle": [],
      "ironhands": [],
      "ironjugulis": [],
      "ironmoth": [],
      "ironthorns": [],
      "frigibax": [
        "Ice Body"
      ],
      "arctibax": [
        "Ice Body"
      ],
      "baxcalibur": [
        "Ice Body"
      ],
      "baxcaliburmega": [],
      "gholdengo": [],
      "wochien": [],
      "chienpao": [],
      "tinglu": [],
      "chiyu": [],
      "roaringmoon": [],
      "ironvaliant": [],
      "koraidon": [],
      "miraidon": [],
      "walkingwake": [],
      "ironleaves": [],
      "dipplin": [
        "Gluttony",
        "Sticky Hold"
      ],
      "poltchageist": [
        "Heatproof"
      ],
      "poltchageistartisan": [
        "Heatproof"
      ],
      "sinistcha": [
        "Heatproof"
      ],
      "sinistchamasterpiece": [
        "Heatproof"
      ],
      "okidogi": [],
      "munkidori": [
        "Frisk"
      ],
      "fezandipiti": [
        "Technician"
      ],
      "ogerpontealtera": [],
      "ogerponwellspringtera": [],
      "ogerponhearthflametera": [],
      "ogerponcornerstonetera": [],
      "hydrapple": [
        "Regenerator",
        "Sticky Hold"
      ],
      "gougingfire": [],
      "ragingbolt": [],
      "ironboulder": [],
      "ironcrown": [],
      "terapagos": [],
      "terapagosterastal": [],
      "terapagosstellar": [],
      "pecharunt": [],
      "kitsunoh": [
        "Frisk",
        "Limber",
        "Iron Fist"
      ],
      "draggalong": [
        "White Smoke",
        "Slow Start"
      ],
      "chuggalong": [
        "White Smoke",
        "Slow Start"
      ],
      "flox": [
        "Static",
        "Sticky Hold"
      ],
      "shox": [
        "Sticky Hold"
      ],
      "scraptor": [
        "Early Bird",
        "Pickup"
      ],
      "obliteryx": [
        "Early Bird",
        "Sniper"
      ]
    }
  }
};

export default data;
