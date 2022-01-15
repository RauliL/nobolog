import { Position } from "./types";

export class NobologSyntaxError extends Error {
  public readonly position?: Position;

  public constructor(message: string, position?: Position) {
    super(
      position ? `${position.line}:${position.column}: ${message}` : message
    );

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = NobologSyntaxError.name;
    this.position = position;
  }
}
