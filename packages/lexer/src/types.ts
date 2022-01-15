export type Position = {
  line: number;
  column: number;
};

export type SeparatorTokenType =
  | ";"
  | ","
  | "."
  | "("
  | ")"
  | "["
  | "]"
  | "?-"
  | ":-";

export type OperatorTokenType =
  | "+"
  | "-"
  | "*"
  | "/"
  | "=="
  | "!="
  | "<"
  | ">"
  | "<="
  | ">="
  | "!"
  | "=";

export type LiteralTokenType = "number" | "string";

export type TokenType =
  | SeparatorTokenType
  | OperatorTokenType
  | LiteralTokenType
  | "atom"
  | "variable";

export type Token = {
  position: Position;
  type: TokenType;
};

export type SeparatorToken = Token & {
  type: SeparatorTokenType;
};

export type OperatorToken = Token & {
  type: OperatorTokenType;
};

export type LiteralToken = Token & {
  type: LiteralTokenType;
};

export type NumberLiteralToken = LiteralToken & {
  type: "number";
  value: number;
};

export type StringLiteralToken = LiteralToken & {
  type: "string";
  value: string;
};

export type AtomToken = Token & {
  type: "atom";
  id: string;
};

export type VariableToken = Token & {
  type: "variable";
  id: string;
};
