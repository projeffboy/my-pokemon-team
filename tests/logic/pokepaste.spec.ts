import { test, expect } from "@playwright/test";
import {
  parsePokepaste,
  pokepasteId,
  pokepasteTeamText,
  pokepasteUpload,
} from "@/store/pokepaste";
import { parseTeamsText } from "@/store/team-text";
import { createSavedTeam } from "@/shared/team";
import {
  showdownFormatId,
  CAP_FORMAT,
  CHAMPIONS_FORMAT,
} from "@/shared/formats";
import { LEGENDS_ARCEUS, LEGENDS_ZA, LETS_GO } from "@/shared/generation-rules";

const kingdra =
  "Kingdra @ Choice Specs\nAbility: Swift Swim\n- Surf\n- Draco Meteor";

test.describe("pokepasteId", () => {
  test("reads the ID of a line that is only a pokepast.es link", () => {
    for (const [line, id] of [
      ["https://pokepast.es/0123456789abcdef", "0123456789abcdef"],
      ["http://pokepast.es/abc123", "abc123"],
      ["https://www.pokepast.es/abc123", "abc123"],
      ["HTTPS://POKEPAST.ES/AbC123", "AbC123"],
      ["https://pokepast.es/abc123/json", "abc123"],
      ["https://pokepast.es/abc123/raw", "abc123"],
      ["https://pokepast.es/abc123/", "abc123"],
      ["https://pokepast.es/abc123?x=1", "abc123"],
      ["https://pokepast.es/abc123#top", "abc123"],
      ["https://pokepast.es/abc123/json?a=b#c", "abc123"],
      ["  https://pokepast.es/abc123  ", "abc123"],
      ["\thttps://pokepast.es/abc123\r", "abc123"],
    ] as const) {
      expect(pokepasteId(line), line).toBe(id);
    }
  });

  test("rejects other hosts, lookalikes, and lines with anything besides the link", () => {
    for (const line of [
      "",
      "   ",
      "pokepast.es/abc123",
      "https://example.com/abc123",
      "https://pokepast.es.evil.com/abc123",
      "https://pokepast.es.evil.com/",
      "https://notpokepast.es/abc123",
      "https://evilpokepast.es/abc123",
      "https://www.evilpokepast.es/abc123",
      "https://sub.pokepast.es/abc123",
      "https://evil.com/https://pokepast.es/abc123",
      "https://user@pokepast.es/abc123",
      "https://pokepast.es@evil.com/abc123",
      "https://pokepast.es:8080/abc123",
      "ftp://pokepast.es/abc123",
      "javascript://pokepast.es/abc123",
      "https://pokepast.es",
      "https://pokepast.es/",
      "https://pokepast.es/?x=1",
      "https://pokepast.es/abc-123",
      "https://pokepast.es/abc 123",
      "https://pokepast.es/abc123 my team",
      "my team https://pokepast.es/abc123",
      "https://pokepast.es/abc123\nhttps://pokepast.es/def456",
      "Kingdra @ Choice Specs",
    ]) {
      expect(pokepasteId(line), JSON.stringify(line)).toBeUndefined();
    }
  });
});

test.describe("parsePokepaste", () => {
  test("rejects data that is not a paste", () => {
    for (const data of [
      undefined,
      null,
      "Kingdra",
      5,
      true,
      [],
      ["Kingdra"],
      {},
      { title: "Rain", notes: "" },
      { paste: null },
      { paste: 5 },
      { paste: ["Kingdra"] },
      { paste: { text: "Kingdra" } },
    ]) {
      expect(parsePokepaste(data), JSON.stringify(data)).toBeUndefined();
    }
  });

  test("defaults a missing or non-text title and notes to empty", () => {
    const empty = { paste: "Kingdra", title: "", notes: "" };
    expect(parsePokepaste({ paste: "Kingdra" })).toEqual(empty);
    expect(parsePokepaste({ paste: "Kingdra", title: 5, notes: null })).toEqual(
      empty,
    );
    expect(parsePokepaste({ paste: "", title: "", notes: "" })).toEqual({
      ...empty,
      paste: "",
    });
  });

  test("keeps only the paste, title, and notes", () => {
    expect(
      parsePokepaste({
        paste: "Kingdra",
        title: "Rain",
        notes: "Format: gen9ou",
        author: "Someone",
      }),
    ).toEqual({ paste: "Kingdra", title: "Rain", notes: "Format: gen9ou" });
  });

  test("turns CRLF and CR line breaks into line feeds", () => {
    expect(
      parsePokepaste({ paste: "Kingdra\r\n- Surf\r\rGarchomp\r- Outrage\n" })
        ?.paste,
    ).toBe("Kingdra\n- Surf\n\nGarchomp\n- Outrage\n");
  });
});

test.describe("pokepasteTeamText", () => {
  test("puts the title and the game of the Format note in a header", () => {
    expect(
      pokepasteTeamText({
        paste: kingdra,
        title: "Rain",
        notes: "Format: gen9ou",
      }),
    ).toBe(`=== [gen9ou] Rain ===\n\n${kingdra}`);
  });

  test("reads the Format note from the first line only, in any case and spelling", () => {
    const header = (notes: string) =>
      pokepasteTeamText({ paste: kingdra, title: "Rain", notes }).split(
        "\n",
      )[0];
    expect(header("Format: gen8ou\nGood luck!")).toBe("=== [gen8ou] Rain ===");
    expect(header("format:   Gen 8 OU  ")).toBe("=== [gen8ou] Rain ===");
    expect(header("FORMAT: gen9-doubles-ou")).toBe(
      "=== [gen9doublesou] Rain ===",
    );
    expect(header("Format: gen9")).toBe("=== [gen9] Rain ===");
    expect(header("Good luck!\nFormat: gen8ou")).toBe("=== Rain ===");
    expect(header("")).toBe("=== Rain ===");
    expect(header("Format:")).toBe("=== Rain ===");
    expect(header("Format: ???")).toBe("=== Rain ===");
    expect(header("My format: gen8ou")).toBe("=== Rain ===");
  });

  test("gives an Untitled paste no name", () => {
    for (const title of ["Untitled", " untitled ", "UNTITLED", ""]) {
      expect(
        pokepasteTeamText({ paste: kingdra, title, notes: "Format: gen9ou" }),
        JSON.stringify(title),
      ).toMatch(/^=== \[gen9ou\]\s+===\n\n/);
      const [team] = parseTeamsText(
        pokepasteTeamText({ paste: kingdra, title, notes: "Format: gen8ou" }),
      );
      expect(team, JSON.stringify(title)).toMatchObject({
        name: "",
        generation: 8,
        format: "OU: Over Used",
      });
    }
  });

  test("gives only Showdown's default names no name", () => {
    const name = (title: string) =>
      parseTeamsText(
        pokepasteTeamText({ paste: kingdra, title, notes: "Format: gen9ou" }),
      )[0]?.name;
    expect(name("Untitled 3")).toBe("");
    expect(name("Untitled Hyper Offense")).toBe("Untitled Hyper Offense");
    expect(name("Untitled-ish")).toBe("Untitled-ish");
  });

  test("keeps a title in square brackets as a name instead of reading it as the game", () => {
    for (const notes of ["", "Format: gen8ou"]) {
      const [team] = parseTeamsText(
        pokepasteTeamText({ paste: kingdra, title: "[Gen 1 OU] Rain", notes }),
      );
      expect(team?.name, notes).toBe("(Gen 1 OU) Rain");
      expect(team?.generation, notes).toBe(notes ? 8 : 9);
    }
  });

  test("gives a header without brackets when there is no Format note", () => {
    const text = pokepasteTeamText({
      paste: kingdra,
      title: "Rain",
      notes: "",
    });
    expect(text).toBe(`=== Rain ===\n\n${kingdra}`);
    expect(
      parseTeamsText(text, { generation: 4, format: "UU: Under Used" }),
    ).toMatchObject([
      { name: "Rain", generation: 4, format: "UU: Under Used" },
    ]);
    expect(
      pokepasteTeamText({ paste: kingdra, title: "", notes: "" }).split(
        "\n",
      )[0],
    ).toMatch(/^===\s+===$/);
  });

  test("turns slashes and pipes in the title into spaces, so that no folder is unwrapped", () => {
    expect(
      pokepasteTeamText({
        paste: kingdra,
        title: "Ladder/Rain | Sand\\Sun",
        notes: "Format: gen9ou",
      }).split("\n")[0],
    ).toBe("=== [gen9ou] Ladder Rain Sand Sun ===");
    expect(
      parseTeamsText(
        pokepasteTeamText({
          paste: kingdra,
          title: "Smogon/Rain/Sand",
          notes: "Format: gen9ou",
        }),
      )[0]?.name,
    ).toBe("Smogon Rain Sand");
  });

  test("cannot split its header or add teams through the title", () => {
    for (const title of [
      "Rain\n=== [gen1] Evil ===\nMew",
      "Rain\r\n\r\n=== Evil ===\r\n",
      "=== [gen1] Evil ===",
      "===",
      "=== ===",
      "Rain ===\n=== Sand",
      "\n\n=== [gen1ou] Evil ===\n\nGarchomp\n",
      "Rain === [gen1] Evil ===",
    ]) {
      const text = pokepasteTeamText({
        paste: kingdra,
        title,
        notes: "Format: gen8ou",
      });
      expect(text.match(/^===.*===$/gm), JSON.stringify(title)).toHaveLength(1);
      expect(text.startsWith("=== [gen8ou] "), JSON.stringify(title)).toBe(
        true,
      );
      const teams = parseTeamsText(text);
      expect(teams, JSON.stringify(title)).toHaveLength(1);
      expect(teams[0], JSON.stringify(title)).toMatchObject({
        generation: 8,
        format: "OU: Over Used",
      });
      expect(
        teams[0]?.team.map(({ name }) => name).filter(Boolean),
        JSON.stringify(title),
      ).toEqual(["kingdra"]);
    }
  });

  test("keeps the title's own words, once its spaces are tidied", () => {
    expect(
      pokepasteTeamText({
        paste: kingdra,
        title: "  Rain   Dance\t(OU) 雨\n",
        notes: "Format: gen9ou",
      }).split("\n")[0],
    ).toBe("=== [gen9ou] Rain Dance (OU) 雨 ===");
  });

  test("round trips through parseTeamsText with the title, generation, and format", () => {
    for (const [format, generation, tier] of [
      ["gen9ou", 9, "OU: Over Used"],
      ["gen8ou", 8, "OU: Over Used"],
      ["gen9", 9, ""],
      ["gen4", 4, ""],
      ["gen7doublesou", 7, "Doubles OU"],
      ["gen5lc", 5, "Little Cup (LC)"],
      ["gen9ubers", 9, "Uber"],
      ["gen9championsregmc", 9, CHAMPIONS_FORMAT],
    ] as const) {
      const teams = parseTeamsText(
        pokepasteTeamText({
          paste: kingdra,
          title: "Rain Dance",
          notes: `Format: ${format}\nNotes`,
        }),
      );
      expect(teams, format).toHaveLength(1);
      expect(teams[0], format).toMatchObject({
        name: "Rain Dance",
        generation,
        format: tier,
      });
      expect(teams[0]?.team[0], format).toMatchObject({
        name: "kingdra",
        item: "choicespecs",
        move1: "surf",
        move2: "dracometeor",
      });
    }
  });

  test("splits a paste of more than six pokemon into teams of six under the same game", () => {
    const names = [
      "Garchomp",
      "Kingdra",
      "Torkoal",
      "Pikachu",
      "Eevee",
      "Snorlax",
      "Lapras",
      "Ditto",
    ];
    const paste = names.map(name => `${name}\n- Tackle`).join("\r\n\r\n");
    const parsed = parsePokepaste({
      paste,
      title: "Big Box",
      notes: "Format: gen8ou",
    });
    expect(parsed).toBeDefined();
    const teams = parseTeamsText(pokepasteTeamText(parsed!));
    expect(
      teams.map(({ name, generation, format, team }) => [
        name,
        generation,
        format,
        team.map(({ name }) => name).filter(Boolean),
      ]),
    ).toEqual([
      [
        "Big Box",
        8,
        "OU: Over Used",
        ["garchomp", "kingdra", "torkoal", "pikachu", "eevee", "snorlax"],
      ],
      ["Big Box (2)", 8, "OU: Over Used", ["lapras", "ditto"]],
    ]);
  });

  test("a paste without pokemon gives no team", () => {
    expect(
      parseTeamsText(
        pokepasteTeamText({
          paste: "Not a pokemon @ Leftovers",
          title: "Rain",
          notes: "Format: gen9ou",
        }),
      ),
    ).toEqual([]);
  });
});

test.describe("pokepasteUpload", () => {
  test("sends the team's name, the text in the box, and the game as the note", () => {
    expect(
      pokepasteUpload(
        { name: "Rain Dance", generation: 9, format: "" },
        kingdra,
      ),
    ).toEqual({ title: "Rain Dance", paste: kingdra, notes: "Format: gen9" });
    expect(
      pokepasteUpload(
        { name: "Rain Dance", generation: 9, format: "OU: Over Used" },
        "Kingdra",
      ),
    ).toEqual({
      title: "Rain Dance",
      paste: "Kingdra",
      notes: "Format: gen9ou",
    });
    expect(
      pokepasteUpload(
        { name: "Old Rain", generation: 8, format: "OU: Over Used" },
        "Kingdra",
      ).notes,
    ).toBe("Format: gen8ou");
  });

  test("sends the box as written, edits and unnamed teams included", () => {
    const paste = "  Kingdra\r\n- Surf\n\n\nKingdra\t(typed by hand)  ";
    expect(
      pokepasteUpload({ name: "", generation: 3, format: "" }, paste),
    ).toEqual({ title: "", paste, notes: "Format: gen3" });
  });

  test("names the game of every kind of team", () => {
    for (const [generation, format, id] of [
      [9, "Doubles OU", "gen9doublesou"],
      [7, "Doubles UU", "gen7doublesuu"],
      [5, "Little Cup (LC)", "gen5lc"],
      [9, "Uber", "gen9ubers"],
      [9, CAP_FORMAT, "gen9cap"],
      [9, CHAMPIONS_FORMAT, "gen9champions"],
      [7, LETS_GO, "gen7letsgo"],
      [8, LEGENDS_ARCEUS, "gen8legendsarceus"],
      [9, LEGENDS_ZA, "gen9legendsza"],
      [1, "", "gen1"],
    ] as const) {
      expect(showdownFormatId(generation, format)).toBe(id);
      expect(
        pokepasteUpload({ name: "Team", generation, format }, "Kingdra").notes,
        id,
      ).toBe(`Format: ${id}`);
    }
  });

  test("an uploaded team downloads as the same name, generation, and format", () => {
    for (const [generation, format] of [
      [9, ""],
      [9, "OU: Over Used"],
      [8, "OU: Over Used"],
      [7, "Doubles UU"],
      [5, "Little Cup (LC)"],
      [2, "OU: Over Used"],
      [9, CHAMPIONS_FORMAT],
      [7, LETS_GO],
      [8, LEGENDS_ARCEUS],
      [9, LEGENDS_ZA],
    ] as const) {
      const team = createSavedTeam({ name: "Rain Dance", generation, format });
      const { title, paste, notes } = pokepasteUpload(team, kingdra);
      const teams = parseTeamsText(pokepasteTeamText({ title, paste, notes }));
      expect(teams, `${generation} ${format}`).toHaveLength(1);
      expect(teams[0], `${generation} ${format}`).toMatchObject({
        name: "Rain Dance",
        generation,
        format,
      });
    }
  });
});
