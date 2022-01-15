import { NobologSyntaxError } from "./error";
import { Position } from "./types";

export class State {
  public readonly source: string;
  public offset: number;
  public readonly position: Position;

  public constructor(source: string) {
    this.source = source;
    this.offset = 0;
    this.position = {
      line: 1,
      column: 1,
    };
  }

  public eof(): boolean {
    return this.offset >= this.source.length;
  }

  public current(): string {
    if (this.eof()) {
      throw this.error("Unexpected end of input.");
    }

    return this.source[this.offset];
  }

  public read(): string {
    if (!this.eof()) {
      const c = this.source[this.offset++];

      if (c === "\n" || c === "\r") {
        if (c === "\r") {
          this.peekRead("\n");
        }
        ++this.position.line;
        this.position.column = 1;

        return "\n";
      }
      ++this.position.column;

      return c;
    }

    throw this.error("Unexpected end of input.");
  }

  public peek(expected: string | RegExp): boolean {
    if (!this.eof()) {
      const c = this.source[this.offset];

      return typeof expected === "string" ? c === expected : expected.test(c);
    }

    return false;
  }

  public peekRead(expected: string | RegExp): boolean {
    if (this.peek(expected)) {
      this.read();

      return true;
    }

    return false;
  }

  public error(message: string, position?: Position): Error {
    return new NobologSyntaxError(message, position ?? this.position);
  }
}
