export function isBefore(args: {
  before?: string | null;
  last?: number | null;
  first?: number | null;
  after?: string | null;
  sort?: Record<string, "asc" | "desc">;
  idProp?: string;
}): boolean {
  if (args.before) {
    return true;
  }
  if (args.last) {
    return true;
  }
  return false;
}
