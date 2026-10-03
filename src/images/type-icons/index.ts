import type { PokemonType } from "@/types";
import bug from "./bug.svg";
import dark from "./dark.svg";
import dragon from "./dragon.svg";
import electric from "./electric.svg";
import fairy from "./fairy.svg";
import fighting from "./fighting.svg";
import fire from "./fire.svg";
import flying from "./flying.svg";
import ghost from "./ghost.svg";
import grass from "./grass.svg";
import ground from "./ground.svg";
import ice from "./ice.svg";
import normal from "./normal.svg";
import poison from "./poison.svg";
import psychic from "./psychic.svg";
import rock from "./rock.svg";
import steel from "./steel.svg";
import water from "./water.svg";

// See type-icons-sources.md
const typeIcons: Record<PokemonType, string> = {
  Bug: bug,
  Dark: dark,
  Dragon: dragon,
  Electric: electric,
  Fairy: fairy,
  Fighting: fighting,
  Fire: fire,
  Flying: flying,
  Ghost: ghost,
  Grass: grass,
  Ground: ground,
  Ice: ice,
  Normal: normal,
  Poison: poison,
  Psychic: psychic,
  Rock: rock,
  Steel: steel,
  Water: water,
};

export default typeIcons;
