import { NobologRuntimeError } from "./error";
import { Term } from "./term";

export class Scope {
  public readonly parent?: Scope;
  private variables?: Map<string, Term>;

  public constructor(parent?: Scope) {
    this.parent = parent;
  }

  public has(name: string): boolean {
    if (this.variables?.has(name)) {
      return true;
    }

    return this.parent ? this.parent.has(name) : false;
  }

  public get(name: string): Term {
    if (this.variables) {
      const value = this.variables.get(name);

      if (value) {
        return value;
      }
    }

    if (this.parent) {
      return this.parent.get(name);
    }

    throw new NobologRuntimeError(`Unrecognized variable: \`${name}'.`);
  }

  public set(name: string, value: Term, local = false): void {
    if (this.variables?.has(name)) {
      this.variables.set(name, value);
      return;
    }

    if (!local && this.parent?.has(name)) {
      this.parent.set(name, value);
      return;
    }

    if (!this.variables) {
      this.variables = new Map<string, Term>();
    }

    this.variables.set(name, value);
  }
}
