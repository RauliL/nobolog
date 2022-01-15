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
  VariableExpression,
} from "./types";

export type ExpressionVisitor<A = void, R = void> = {
  visitAndExpression: (expression: AndExpression, arg: A) => R;
  visitAssignExpression: (expression: AssignExpression, arg: A) => R;
  visitBinaryExpression: (expression: BinaryExpression, arg: A) => R;
  visitListExpression: (expression: ListExpression, arg: A) => R;
  visitNumberExpression: (expression: NumberExpression, arg: A) => R;
  visitOrExpression: (expression: OrExpression, arg: A) => R;
  visitStringExpression: (expression: StringExpression, arg: A) => R;
  visitTermExpression: (expression: TermExpression, arg: A) => R;
  visitUnaryExpression: (expression: UnaryExpression, arg: A) => R;
  visitVariableExpression: (expression: VariableExpression, arg: A) => R;
};

export const visitExpression = <A = void, R = void>(
  expression: Expression,
  visitor: ExpressionVisitor<A, R>,
  arg: A
): R => {
  switch (expression.type) {
    case "and":
      return visitor.visitAndExpression(expression as AndExpression, arg);

    case "assign":
      return visitor.visitAssignExpression(
        expression as AssignExpression,
        arg
      );

    case "binary":
      return visitor.visitBinaryExpression(
        expression as BinaryExpression,
        arg
      );

    case "list":
      return visitor.visitListExpression(expression as ListExpression, arg);

    case "number":
      return visitor.visitNumberExpression(
        expression as NumberExpression,
        arg
      );

    case "or":
      return visitor.visitOrExpression(expression as OrExpression, arg);

    case "string":
      return visitor.visitStringExpression(
        expression as StringExpression,
        arg
      );

    case "term":
      return visitor.visitTermExpression(expression as TermExpression, arg);

    case "unary":
      return visitor.visitUnaryExpression(expression as UnaryExpression, arg);

    case "variable":
      return visitor.visitVariableExpression(
        expression as VariableExpression,
        arg
      );
  }

  throw new Error(`Unrecognized expression type: ${expression.type}`);
};

export type DeclarationVisitor<A = void, R = void> = {
  visitClauseDeclaration: (declaration: ClauseDeclaration, arg: A) => R;
  visitQueryDeclaration: (declaration: QueryDeclaration, arg: A) => R;
};

export const visitDeclaration = <A = void, R = void>(
  declaration: Declaration,
  visitor: DeclarationVisitor<A, R>,
  arg: A
): R => {
  switch (declaration.type) {
    case "clause":
      return visitor.visitClauseDeclaration(
        declaration as ClauseDeclaration,
        arg
      );

    case "query":
      return visitor.visitQueryDeclaration(
        declaration as QueryDeclaration,
        arg
      );
  }

  throw new Error(`Unrecognized declaration type: ${declaration.type}`);
};
