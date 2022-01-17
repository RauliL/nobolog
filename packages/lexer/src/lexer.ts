import {
  isAtomPart,
  isAtomStart,
  isNumberPart,
  isVariableStart,
} from "./pattern";
import { State } from "./state";
import {
  AtomToken,
  NumberLiteralToken,
  OperatorTokenType,
  SeparatorTokenType,
  StringLiteralToken,
  Token,
  VariableToken,
} from "./types";

const lexEscapeSequence = (state: State): string => {
  let c: string;

  if (state.eof()) {
    throw state.error("Unterminated escape sequence.");
  }
  switch ((c = state.read())) {
    case "b":
      return "\b";

    case "t":
      return "\t";

    case "n":
      return "\n";

    case "f":
      return "\f";

    case "r":
      return "\r";

    case '"':
    case "'":
    case "\\":
    case "/":
      return c;

    case "u": {
      let result = 0;

      for (let i = 0; i < 4; ++i) {
        if (state.eof()) {
          throw state.error("Unterminated escape sequence.");
        } else if (!state.peek(/[a-fA-F0-9]/)) {
          throw state.error("Illegal Unicode hex escape sequence.");
        }
        if (state.peek(/[A-F]/)) {
          result =
            result * 16 +
            ((state.read().codePointAt(0) ?? 0) -
              ("A".codePointAt(0) ?? 0) +
              10);
        } else if (state.peek(/[a-f]/)) {
          result =
            result * 16 +
            ((state.read().codePointAt(0) ?? 0) -
              ("a".codePointAt(0) ?? 0) +
              10);
        } else {
          result =
            result * 16 +
            ((state.read().codePointAt(0) ?? 0) - ("0".codePointAt(0) ?? 0));
        }
      }

      return String.fromCodePoint(result);
    }

    default:
      throw state.error("Unrecognized escape sequence.");
  }
};

const lexNumberLiteral = (state: State): NumberLiteralToken => {
  const position = { ...state.position };
  let isFloat = false;
  let buffer = "";
  let value: number;
  const readDigits = () => {
    do {
      const c = state.read();

      if (c !== "_") {
        buffer += c;
      }
    } while (state.peek(isNumberPart));
  };
  const readExponent = () => {
    buffer += state.read();
    if (state.peek(/[+-]/)) {
      buffer += state.read();
    }
    if (!state.peek(/\d/)) {
      throw state.error("Missing digits after `e'.");
    }
    readDigits();
  };

  readDigits();

  if (
    state.peek(".") &&
    state.offset + 1 < state.source.length &&
    /\d/.test(state.source[state.offset + 1])
  ) {
    isFloat = true;
    buffer += state.read();
    readDigits();
    if (state.peek(/e/i)) {
      readExponent();
    }
  } else if (state.peek(/e/i)) {
    isFloat = true;
    readExponent();
  }

  if (isFloat) {
    value = parseFloat(buffer);
  } else {
    value = parseInt(buffer, 10);
  }

  if (isNaN(value)) {
    throw state.error(`${isFloat ? "Float" : "Integer"} overflow.`, position);
  }

  return {
    position,
    type: "number",
    value,
  };
};

const lexStringLiteral = (state: State): StringLiteralToken => {
  const position = { ...state.position };
  let value = "";
  const separator = state.read();
  let c;

  for (;;) {
    if (state.eof()) {
      throw state.error(
        "Unexpected end of input inside string literal.",
        position
      );
    }
    c = state.read();
    if (c === separator) {
      break;
    } else if (c === "\\") {
      value += lexEscapeSequence(state);
    } else {
      value += c;
    }
  }

  return {
    position,
    type: "string",
    value,
  };
};

const lexIdentifier = (
  state: State,
  type: "atom" | "variable"
): AtomToken | VariableToken => {
  const position = { ...state.position };
  let id = state.read();

  for (;;) {
    if (state.peek(isAtomPart)) {
      id += state.read();
    } else if (state.peekRead("\\")) {
      id += lexEscapeSequence(state);
    } else {
      break;
    }
  }

  return {
    position,
    type,
    id,
  };
};

export const lex = (source: string): Token[] => {
  const state = new State(source);
  const tokens: Token[] = [];

  while (!state.eof()) {
    // Skip comments.
    if (state.peekRead("#")) {
      while (!state.eof()) {
        if (state.peekRead(/[\r\n]/)) {
          break;
        }
        state.read();
      }
      continue;
    }

    // Skip whitespace.
    if (state.peekRead(/\s/)) {
      continue;
    }

    switch (state.current()) {
      case ";":
      case ".":
      case ",":
      case "(":
      case ")":
      case "[":
      case "]":
        tokens.push({
          position: { ...state.position },
          type: state.read() as SeparatorTokenType,
        });
        continue;

      case "+":
      case "-":
      case "*":
      case "/":
        tokens.push({
          position: { ...state.position },
          type: state.read() as OperatorTokenType,
        });
        continue;

      case "<":
      case ">":
      case "!":
      case "=": {
        const position = { ...state.position };
        let type = state.read() as OperatorTokenType;

        if (state.peekRead("=")) {
          type = `${type}=` as OperatorTokenType;
        }
        tokens.push({ position, type });
        continue;
      }

      case "?": {
        const position = { ...state.position };

        state.read();
        if (!state.peekRead("-")) {
          throw state.error("Unexpected `?'; Did you mean `?-'?", position);
        }
        tokens.push({
          position,
          type: "?-",
        });
        continue;
      }

      case ":": {
        const position = { ...state.position };

        state.read();
        if (!state.peekRead("-")) {
          throw state.error("Unexpected `:'; Did you mean `:-'?", position);
        }
        tokens.push({
          position,
          type: ":-",
        });
        continue;
      }

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        tokens.push(lexNumberLiteral(state));
        continue;

      case '"':
      case "'":
        tokens.push(lexStringLiteral(state));
        continue;
    }

    if (state.peek(isAtomStart)) {
      tokens.push(lexIdentifier(state, "atom"));
      continue;
    }

    if (state.peek(isVariableStart)) {
      tokens.push(lexIdentifier(state, "variable"));
      continue;
    }

    throw state.error("Unexpected input.");
  }

  return tokens;
};
