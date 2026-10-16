import { showdownFormatId } from "@/shared/formats";
import type { SavedTeam } from "@/types";

// pokepast.es: the links it is read from, what its JSON holds, and what is uploaded to it
export const POKEPASTE_URL = "https://pokepast.es";

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
  return {
    paste: paste.replace(/\r\n?/g, "\n"),
    title: typeof title === "string" ? title : "",
    notes: typeof notes === "string" ? notes : "",
  };
}

// A paste as a team under a header like Showdown's backup, so that its title and
// game ("Format: gen9ou" on the first line of the notes, as the site uploads) carry
// over. Like Showdown, an "Untitled" paste has no name.
export function pokepasteTeamText({ paste, title, notes }: Pokepaste) {
  const format = /^Format:\s*(.+)$/i
    .exec(notes.split("\n")[0] ?? "")?.[1]
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const name =
    /^untitled/i.test(title.trim()) ? "" : (
      title
        .replace(/[|\\/]/g, " ")
        .replace(/\s+/g, " ")
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
