import {
  NobologSyntaxError,
  Position,
  Token,
  TokenType,
} from "@nobolog/lexer";

export class State {
  private readonly tokens: Token[];
  private offset: number;

  public constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.offset = 0;
  }

  public eof(): boolean {
    return this.offset >= this.tokens.length;
  }

  public current(): Token {
    if (this.eof()) {
      throw this.error("Unexpected end of input.");
    }

    return this.tokens[this.offset];
  }

  public read(expected?: TokenType): Token {
    if (!this.eof()) {
      const token = this.tokens[this.offset++];

      if (expected && token.type !== expected) {
        throw this.error(
          `Unexpected \`${token.type}'; Missing \`${expected}'.`
        );
      }

      return token;
    } else if (expected) {
      throw this.error(`Unexpected end of input; Missing \`${expected}'.`);
    }

    throw this.error("Unexpected end of input.");
  }

  public peek(expected: TokenType): boolean {
    return !this.eof() && this.tokens[this.offset].type === expected;
  }

  public peekRead(expected: TokenType): boolean {
    if (this.peek(expected)) {
      this.read();

      return true;
    }

    return false;
  }

  public error(message: string, position?: Position) {
    return new NobologSyntaxError(
      message,
      position ?? this.offset < this.tokens.length
        ? this.tokens[this.offset].position
        : undefined
    );
  }
}
