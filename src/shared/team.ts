import items from "@/data/items";
import type { Team, TeamPokemonProperties } from "@/types";

export function createEmptyTeam(): Team {
  return Array.from({ length: 6 }, (): TeamPokemonProperties => ({
    name: "",
    item: "",
    ability: "",
    move1: "",
    move2: "",
    move3: "",
    move4: "",
  }));
}

export function getAutoSelectedItem(pokemon: string, pokemonItem: string): string {
  if (pokemon) {
    // Auto select mega stone
    if (
      pokemon.includes("mega") &&
      pokemon !== "meganium" &&
      pokemon !== "yanmega"
    ) {
      pokemonItem =
        Object.keys(items).find(
          item =>
            // fuzzy match pokemon name with mega stone name (e.g. blastoisite and blastoise)
            item.slice(0, 5) === pokemon.slice(0, 5),
        ) || "";

      // Fuzzy match will give Charizard Y a Charizardite X
      // Hence this code
      if (pokemon === "charizardmegay" || pokemon === "mewtwomegay") {
        pokemonItem = pokemonItem.replace("x", "y");
      }
      // Same with Sharpedo and Sharp Beak
      else if (pokemon === "sharpedomega") {
        pokemonItem = "sharpedonite";
      }
      // Same with Dragonite and Dragon Fang
      else if (pokemon === "dragonitemega") {
        pokemonItem = "dragoninite";
      } else if (pokemon === "steelixmega") {
        pokemonItem = "steelixite";
      }
    }

    // Auto select plate for Arceus formes
    else if (pokemon.includes("arceus")) {
      const type = pokemon.replace("arceus", "");
      const typeToPlate: Record<string, string> = {
        bug: "insectplate",
        dark: "dreadplate",
        dragon: "dracoplate",
        electric: "zapplate",
        fairy: "pixieplate",
        fighting: "fistplate",
        fire: "flameplate",
        flying: "skyplate",
        ghost: "spookyplate",
        grass: "meadowplate",
        ground: "earthplate",
        ice: "icicleplate",
        normal: "", // no plate for normal type
        poison: "toxicplate",
        psychic: "mindplate",
        rock: "stoneplate",
        steel: "ironplate",
        water: "splashplate",
      };

      pokemonItem = typeToPlate[type] || "";
    }

    // Auto select drive for Genesect
    else if (pokemon.includes("genesect") && pokemon !== "genesect") {
      const driveAdj = pokemon.replace("genesect", "");
      const item = driveAdj + "drive";

      pokemonItem = item;
    }

    // Auto select memory for Silvally
    else if (pokemon.includes("silvally") && pokemon !== "silvally") {
      const type = pokemon.replace("silvally", "");
      const item = type + "memory";

      pokemonItem = item;
    }

    // Pick Griseous Orb for Giratina
    else if (pokemon === "giratinaorigin") {
      pokemonItem = "griseousorb";
    }
  }

  return pokemonItem;
}
