type CopyOf = (name: string, number?: bigint) => string;

function unwrap(name: string, form: string) {
  const [prefix = "", suffix = ""] = form.split("{name}");
  if (
    name.length > prefix.length + suffix.length &&
    name.startsWith(prefix) &&
    name.endsWith(suffix)
  ) {
    return name.slice(prefix.length, name.length - suffix.length);
  }
}

// copyOf places the number of each copy after the first, so in every language it stays apart
// from any number in the copied team's own name
export function nextDuplicateName(
  name: string,
  existingNames: readonly string[],
  copyOf: CopyOf,
) {
  let base = name;
  let number = 1n;
  for (const [digits] of name.matchAll(/\d+/g)) {
    const value = BigInt(digits);
    const copied = value >= 2n && unwrap(name, copyOf("{name}", value));
    if (copied) {
      base = copied;
      number += value;
      break;
    }
  }
  for (
    let copied = unwrap(base, copyOf("{name}"));
    copied;
    copied = unwrap(base, copyOf("{name}"))
  ) {
    base = copied;
    number++;
  }
  let candidate = number === 1n ? copyOf(base) : copyOf(base, number);
  while (existingNames.includes(candidate)) {
    candidate = copyOf(base, ++number);
  }
  return candidate;
}
