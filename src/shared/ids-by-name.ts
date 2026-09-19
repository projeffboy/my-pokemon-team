// Inverts a dataset into a name => ID lookup
// E.g. 'Squirtle' => 'squirtle'
export function idsByName(data: Record<string, { name?: string }>) {
  const ids = new Map<string, string>();

  for (const [id, { name }] of Object.entries(data)) {
    if (name !== undefined && !ids.has(name)) ids.set(name, id);
  }

  return ids;
}
