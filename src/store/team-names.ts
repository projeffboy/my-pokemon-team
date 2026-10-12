export function nextDuplicateName(
  name: string,
  existingNames: readonly string[],
  copyOf: (name: string) => string,
) {
  const [prefix = "", suffix = ""] = copyOf("{name}").split("{name}");
  const numbered = /^(.*) (\d+)$/.exec(name);
  let number = 1n;
  let base = name;
  if (numbered) {
    const value = BigInt(numbered[2] ?? "0");
    const unnumbered = numbered[1] ?? "";
    if (
      value >= 2n &&
      unnumbered.startsWith(prefix) &&
      unnumbered.endsWith(suffix)
    ) {
      base = unnumbered;
      number = value;
    }
  }
  while (
    base.startsWith(prefix) &&
    base.endsWith(suffix) &&
    base.length > prefix.length + suffix.length
  ) {
    base = base.slice(prefix.length, base.length - suffix.length);
    number++;
  }
  const copied = copyOf(base);
  let candidate = number === 1n ? copied : `${copied} ${number}`;
  while (existingNames.includes(candidate)) {
    candidate = `${copied} ${++number}`;
  }
  return candidate;
}
