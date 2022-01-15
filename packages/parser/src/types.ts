import { OperatorTokenType, Position } from "@nobolog/lexer";

export type LiteralExpressionType = "list" | "number" | "string";

export type ExpressionType =
  | LiteralExpressionType
  | "and"
  | "binary"
  | "or"
  | "term"
  | "unary"
  | "variable"
  | "assign";

export type Expression = {
  position: Position;
  type: ExpressionType;
};

export type LiteralExpression = Expression & {
  type: LiteralExpressionType;
};

export type NumberExpression = LiteralExpression & {
  type: "number";
  value: number;
};

export type StringExpression = LiteralExpression & {
  type: "string";
  value: string;
};

export type ListExpression = LiteralExpression & {
  type: "list";
  elements: Expression[];
};

export type TermExpression = Expression & {
  type: "term";
  functor: string;
  arguments: Expression[];
};

export type BinaryExpression = Expression & {
  type: "binary";
  leftOperand: Expression;
  operator: OperatorTokenType;
  rightOperand: Expression;
};

export type UnaryExpressionOperator = "+" | "-" | "!";

export type UnaryExpression = Expression & {
  type: "unary";
  operator: UnaryExpressionOperator;
  operand: Expression;
};

export type AndExpression = Expression & {
  type: "and";
  leftOperand: Expression;
  rightOperand: Expression;
};

export type OrExpression = Expression & {
  type: "or";
  leftOperand: Expression;
  rightOperand: Expression;
};

export type VariableExpression = Expression & {
  type: "variable";
  name: string;
};

export type AssignExpression = Expression & {
  leftOperand: VariableExpression;
  rightOperand: Expression;
};

export type DeclarationType = "clause" | "query";

export type Declaration = {
  position: Position;
  type: DeclarationType;
};

export type ClauseDeclaration = Declaration & {
  type: "clause";
  functor: string;
  arguments: Expression[];
  body?: Expression;
};

export type QueryDeclaration = Declaration & {
  type: "query";
  expression: Expression;
};
