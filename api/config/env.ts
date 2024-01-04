export type Env = Record<string, string | undefined>;

export function envService(): Env {
  throw new Error("You must set the env service value before using it");
}
