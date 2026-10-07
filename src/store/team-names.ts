export function nextDuplicateName(
  name: string,
  existingNames: readonly string[],
  copyOf: (name: string) => string,
) {
  const [prefix = "", suffix = ""] = copyOf("{name}").split("{name}");
  const numbered = /^(.*) (\d+)$/.exec(name);
  let number = 1;
  let base = name;
  if (numbered) {
    const value = Number(numbered[2]);
    const unnumbered = numbered[1] ?? "";
    if (
      Number.isSafeInteger(value) &&
      value >= 2 &&
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
  let candidate = number === 1 ? copied : `${copied} ${number}`;
  while (existingNames.includes(candidate)) {
    candidate = `${copied} ${++number}`;
  }
  return candidate;
}
