import {
  AtomToken,
  NumberLiteralToken,
  OperatorTokenType,
  SeparatorTokenType,
  StringLiteralToken,
  Token,
  VariableToken,
} from "@nobolog/lexer";

import { State } from "./state";
import {
  AndExpression,
  AssignExpression,
  BinaryExpression,
  ClauseDeclaration,
  Declaration,
  Expression,
  ListExpression,
  NumberExpression,
  OrExpression,
  QueryDeclaration,
  StringExpression,
  TermExpression,
  UnaryExpression,
  UnaryExpressionOperator,
  VariableExpression,
} from "./types";

const parsePrimaryExpression = (state: State): Expression => {
  if (state.eof()) {
    state.error("Unexpected end of input; Missing expression.");
  }

  switch (state.current().type) {
    case "number": {
      const { position, value } = state.read() as NumberLiteralToken;

      return {
        position,
        type: "number",
        value,
      } as NumberExpression;
    }

    case "string": {
      const { position, value: initialValue } =
        state.read() as StringLiteralToken;
      let value = initialValue;

      while (state.peek("string")) {
        value += (state.read() as StringLiteralToken).value;
      }

      return {
        position,
        type: "string",
        value,
      } as StringExpression;
    }

    case "[": {
      const { position } = state.read();
      const elements = parseExpressionList(state, "]");

      return {
        position,
        type: "list",
        elements,
      } as ListExpression;
    }

    case "atom": {
      const { id: functor, position } = state.read() as AtomToken;
      const args = state.peekRead("(") ? parseExpressionList(state, ")") : [];

      return {
        position,
        type: "term",
        functor,
        arguments: args,
      } as TermExpression;
    }

    case "variable": {
      const { id: name, position } = state.read() as VariableToken;

      return {
        position,
        type: "variable",
        name,
      } as VariableExpression;
    }

    case "(": {
      const { position } = state.read();
      const expression = parseExpression(state);

      if (!state.peekRead(")")) {
        throw state.error(
          "Unterminated parenthesized expression; Missing `)'.",
          position
        );
      }

      return expression;
    }
  }

  throw state.error(
    `Unexpected \`${state.current().type}'; Missing expression.`
  );
};

const parseUnaryExpression = (state: State): Expression => {
  if (state.peek("+") || state.peek("-") || state.peek("!")) {
    const { position, type } = state.read();
    const operand = parseUnaryExpression(state);

    return {
      position,
      type: "unary",
      operator: type as UnaryExpressionOperator,
      operand,
    } as UnaryExpression;
  }

  return parsePrimaryExpression(state);
};

const parseMultiplicativeExpression = (state: State): Expression => {
  let leftOperand = parseUnaryExpression(state);

  while (state.peek("*") || state.peek("/")) {
    const { position, type } = state.read();
    const rightOperand = parseUnaryExpression(state);

    leftOperand = {
      position,
      type: "binary",
      leftOperand,
      operator: type as OperatorTokenType,
      rightOperand,
    } as BinaryExpression;
  }

  return leftOperand;
};

const parseAdditiveExpression = (state: State): Expression => {
  let leftOperand = parseMultiplicativeExpression(state);

  while (state.peek("+") || state.peek("-")) {
    const { position, type } = state.read();
    const rightOperand = parseMultiplicativeExpression(state);

    leftOperand = {
      position,
      type: "binary",
      leftOperand,
      operator: type as OperatorTokenType,
      rightOperand,
    } as BinaryExpression;
  }

  return leftOperand;
};

const parseRelationalExpression = (state: State): Expression => {
  let leftOperand = parseAdditiveExpression(state);

  while (
    state.peek("<") ||
    state.peek(">") ||
    state.peek("<=") ||
    state.peek(">=")
  ) {
    const { position, type } = state.read();
    const rightOperand = parseAdditiveExpression(state);

    leftOperand = {
      position,
      type: "binary",
      leftOperand,
      operator: type as OperatorTokenType,
      rightOperand,
    } as BinaryExpression;
  }

  return leftOperand;
};

const parseEqualityExpression = (state: State): Expression => {
  let leftOperand = parseRelationalExpression(state);

  while (state.peek("==") || state.peek("!=")) {
    const { position, type } = state.read();
    const rightOperand = parseRelationalExpression(state);

    leftOperand = {
      position,
      type: "binary",
      leftOperand,
      operator: type as OperatorTokenType,
      rightOperand,
    } as BinaryExpression;
  }

  return leftOperand;
};

const parseAssignExpression = (state: State): Expression => {
  const leftOperand = parseEqualityExpression(state);

  if (state.peek("=")) {
    const { position } = state.read();
    const rightOperand = parseEqualityExpression(state);

    if (leftOperand.type !== "variable") {
      throw state.error(
        `Cannot \`${rightOperand.type}' into \`${leftOperand.type}'.`,
        position
      );
    }

    return {
      position,
      type: "assign",
      leftOperand,
      rightOperand,
    } as AssignExpression;
  }

  return leftOperand;
};

const parseOrExpression = (state: State): Expression => {
  let leftOperand = parseAssignExpression(state);

  while (state.peek(";")) {
    const { position } = state.read();
    const rightOperand = parseAssignExpression(state);

    leftOperand = {
      position,
      type: "or",
      leftOperand,
      rightOperand,
    } as OrExpression;
  }

  return leftOperand;
};

const parseAndExpression = (state: State): Expression => {
  let leftOperand = parseOrExpression(state);

  while (state.peek(",")) {
    const { position } = state.read();
    const rightOperand = parseOrExpression(state);

    leftOperand = {
      position,
      type: "and",
      leftOperand,
      rightOperand,
    } as AndExpression;
  }

  return leftOperand;
};

const parseExpression = (state: State): Expression =>
  parseAssignExpression(state);

const parseExpressionList = (
  state: State,
  separator: SeparatorTokenType
): Expression[] => {
  const list: Expression[] = [];

  for (;;) {
    if (state.eof()) {
      throw state.error(`Unterminated expression list; Missing ${separator}.`);
    } else if (state.peekRead(separator)) {
      break;
    } else {
      list.push(parseExpression(state));
      if (!state.peek(",") && !state.peek(separator)) {
        throw state.error(
          `Unterminated expression list; Missing ${separator}.`
        );
      }
      state.peekRead(",");
    }
  }

  return list;
};

const parseDeclarationBody = (state: State): Expression =>
  parseAndExpression(state);

const parseQueryDeclaration = (state: State): QueryDeclaration => {
  const { position } = state.read();
  const expression = parseDeclarationBody(state);

  state.read(".");

  return {
    position,
    type: "query",
    expression,
  };
};

const parseClauseDeclaration = (state: State): ClauseDeclaration => {
  const { id: functor, position } = state.read("atom") as AtomToken;
  const args = state.peekRead("(") ? parseExpressionList(state, ")") : [];
  const body = state.peekRead(":-") ? parseDeclarationBody(state) : undefined;

  state.read(".");

  return {
    position,
    type: "clause",
    functor,
    arguments: args,
    body,
  };
};

const parseDeclaration = (state: State): Declaration => {
  if (state.eof()) {
    throw state.error("Unexpected end of input; Missing declaration.");
  }

  if (state.peek("?-")) {
    return parseQueryDeclaration(state);
  }

  if (state.peek("atom")) {
    return parseClauseDeclaration(state);
  }

  throw state.error(
    `Unexpected ${state.current().type}; Missing declaration.`
  );
};

export const parse = (tokens: Token[]): Declaration[] => {
  const state = new State(tokens);
  const result: Declaration[] = [];

  while (!state.eof()) {
    result.push(parseDeclaration(state));
  }

  return result;
};
