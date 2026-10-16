import {
  MAX_POKEPASTE_LENGTH,
  parsePokepaste,
  POKEPASTE_URL,
  type Pokepaste,
} from "@/store/pokepaste";

// A paste's title, notes, and text; it throws when the paste cannot be had
export async function fetchPokepaste(
  id: string,
  signal: AbortSignal,
): Promise<Pokepaste> {
  const response = await fetch(`${POKEPASTE_URL}/${id}/json`, { signal });
  if (!response.ok) throw new Error("No such paste");
  const body = await response.text();
  if (body.length > MAX_POKEPASTE_LENGTH) throw new Error("Too long");
  const paste = parsePokepaste(JSON.parse(body));
  if (!paste) throw new Error("Not a paste");
  return paste;
}

// Posts a paste in a new tab, as Showdown's Upload to PokePaste does: pokepast.es answers
// with a redirect to the new paste, which a page cannot read, but a tab can show
export function uploadToPokepaste(fields: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "post";
  form.action = `${POKEPASTE_URL}/create`;
  form.target = "_blank";
  form.rel = "noopener";
  form.hidden = true;
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.append(input);
  }
  document.body.append(form);
  form.submit();
  form.remove();
}
