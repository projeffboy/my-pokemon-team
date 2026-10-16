import { showdownFormatId } from "@/shared/formats";
import type { SavedTeam } from "@/types";
import { parseTeamHeader } from "./team-text";

// pokepast.es: the links it is read from, what its JSON holds, and what is uploaded to it
export const POKEPASTE_URL = "https://pokepast.es";

// A real paste is a few kilobytes of lines under a hundred characters
export const MAX_POKEPASTE_LENGTH = 200_000;
const MAX_LINE_LENGTH = 1000;
// A Showdown box holds 24 pokemon
const MAX_SETS = 24;
const MAX_NAME_LENGTH = 100;

const LINK = /^https?:\/\/(?:www\.)?pokepast\.es\/([a-z0-9]+)(?:[/?#]\S*)?$/i;

// The paste ID of a line that is only a pokepast.es link
export const pokepasteId = (line: string) => LINK.exec(line.trim())?.[1];

export interface Pokepaste {
  paste: string;
  title: string;
  notes: string;
}

// The /json of a paste, or undefined when it is not one
export function parsePokepaste(data: unknown): Pokepaste | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  const { paste, title, notes } = data as Record<string, unknown>;
  if (typeof paste !== "string") return undefined;
  const lines = paste.replace(/\r\n?/g, "\n").split("\n");
  if (lines.some(line => line.length > MAX_LINE_LENGTH)) return undefined;
  // A reply can make the parser slow or the teams many: with headers, blank runs and
  // long lines, which no real paste has, it could freeze the page for minutes
  const kept: string[] = [];
  for (const line of lines) {
    const isBlank = !line.trim();
    if (
      parseTeamHeader(line) ||
      line.trim().startsWith("# mypokemonteam") ||
      (isBlank && !kept.at(-1)?.trim() && kept.length)
    )
      continue;
    kept.push(line);
  }
  const text = kept.join("\n");
  if (text.split(/\n\s*\n/).length > MAX_SETS) return undefined;
  return {
    paste: text,
    title: typeof title === "string" ? title : "",
    notes: typeof notes === "string" ? notes : "",
  };
}

// A paste as a team under a header like Showdown's backup, so that its title and
// game ("Format: gen9ou" on the first line of the notes, as the site uploads) carry
// over. Like Showdown's own default names, "Untitled" and "Untitled 2" are no name.
export function pokepasteTeamText({ paste, title, notes }: Pokepaste) {
  const note = (notes.split(/\r\n?|\n/, 1)[0] ?? "").trim();
  const format =
    note.slice(0, 7).toLowerCase() === "format:" ?
      note
        .slice(7)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
    : "";
  const name =
    /^untitled(?: \d+)?$/i.test(title.trim()) ? "" : (
      title
        .replace(/[|\\/]/g, " ")
        .replace(/\[/g, "(")
        .replace(/\]/g, ")")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, MAX_NAME_LENGTH)
        .trim()
    );
  return `=== ${format ? `[${format}] ` : ""}${name} ===\n\n${paste}`;
}

// What the upload form sends: the team's name, game, and the text in the box
export const pokepasteUpload = (
  {
    name,
    generation,
    format,
  }: Pick<SavedTeam, "name" | "generation" | "format">,
  paste: string,
) => ({
  title: name,
  paste,
  notes: `Format: ${showdownFormatId(generation, format)}`,
});
