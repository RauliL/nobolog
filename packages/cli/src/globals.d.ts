declare module "version" {
  export function fetch(
    callback: (err: Error | null, version: string) => void
  ): void;
}
