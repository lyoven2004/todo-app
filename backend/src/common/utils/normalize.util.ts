export function normalizeName(name: string): string {
  const trimmed = name.trim().toLocaleLowerCase();

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
