import { OperatorTokenType } from "@nobolog/lexer";
import {
  AndExpression,
  AssignExpression,
  BinaryExpression,
  ClauseDeclaration,
  Expression,
  ListExpression,
  NumberExpression,
  OrExpression,
  StringExpression,
  TermExpression,
  UnaryExpression,
  UnaryExpressionOperator,
  VariableExpression,
} from "@nobolog/parser";

import { evaluate } from "./evaluate";
import { BooleanTerm, NumberTerm, Term } from "./term";
import { World } from "./world";

describe("evaluate()", () => {
  it.each([
    [
      {
        position: {
          line: 1,
          column: 1,
        },
        type: "term",
        functor: "true",
        arguments: [],
      } as TermExpression,
      {
        position: {
          line: 1,
          column: 1,
        },
        type: "term",
        functor: "true",
        arguments: [],
      } as TermExpression,
      {
        type: "boolean",
        value: true,
      } as BooleanTerm,
    ],
    [
      {
        position: {
          line: 1,
          column: 1,
        },
        type: "term",
        functor: "false",
        arguments: [],
      } as TermExpression,
      {
        position: {
          line: 1,
          column: 1,
        },
        type: "term",
        functor: "true",
        arguments: [],
      } as TermExpression,
      {
        type: "boolean",
        value: false,
      } as BooleanTerm,
    ],
  ])(
    "should be able to evaluate and expression",
    (
      leftOperand: Expression,
      rightOperand: Expression,
      expectedResult: Term
    ) => {
      expect(
        evaluate(
          {
            position: {
              line: 1,
              column: 1,
            },
            type: "and",
            leftOperand,
            rightOperand,
          } as AndExpression,
          new World()
        )
      ).toEqual(expectedResult);
    }
  );

  it("should be able to evaluate assignment expression", () => {
    const world = new World();

    expect(
      evaluate(
        {
          position: {
            line: 1,
            column: 1,
          },
          type: "assign",
          leftOperand: {
            position: {
              line: 1,
              column: 1,
            },
            type: "variable",
            name: "test",
          } as VariableExpression,
          rightOperand: {
            position: {
              line: 1,
              column: 1,
            },
            type: "number",
            value: 5,
          } as NumberExpression,
        } as AssignExpression,
        world
      )
    ).toEqual({
      type: "number",
      value: 5,
    });
    expect(world.getVariable("test")).toEqual({
      type: "number",
      value: 5,
    });
  });

  it.each([
    [
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 1,
      } as NumberExpression,
      "+" as OperatorTokenType,
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 1,
      } as NumberExpression,
      {
        type: "number",
        value: 2,
      } as NumberTerm,
    ],
    [
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 1,
      } as NumberExpression,
      "-" as OperatorTokenType,
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 1,
      } as NumberExpression,
      {
        type: "number",
        value: 0,
      } as NumberTerm,
    ],
    [
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 2,
      } as NumberExpression,
      "*" as OperatorTokenType,
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 6,
      } as NumberExpression,
      {
        type: "number",
        value: 12,
      } as NumberTerm,
    ],
    [
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 12,
      } as NumberExpression,
      "/" as OperatorTokenType,
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 6,
      } as NumberExpression,
      {
        type: "number",
        value: 2,
      } as NumberTerm,
    ],
    [
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 2,
      } as NumberExpression,
      "==" as OperatorTokenType,
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 2,
      } as NumberExpression,
      {
        type: "boolean",
        value: true,
      } as BooleanTerm,
    ],
    [
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 2,
      } as NumberExpression,
      "!=" as OperatorTokenType,
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 2,
      } as NumberExpression,
      {
        type: "boolean",
        value: false,
      } as BooleanTerm,
    ],
    [
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 1,
      } as NumberExpression,
      "<" as OperatorTokenType,
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 5,
      } as NumberExpression,
      {
        type: "boolean",
        value: true,
      } as BooleanTerm,
    ],
    [
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 1,
      } as NumberExpression,
      "<=" as OperatorTokenType,
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 5,
      } as NumberExpression,
      {
        type: "boolean",
        value: true,
      } as BooleanTerm,
    ],
    [
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 1,
      } as NumberExpression,
      ">" as OperatorTokenType,
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 5,
      } as NumberExpression,
      {
        type: "boolean",
        value: false,
      } as BooleanTerm,
    ],
    [
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 1,
      } as NumberExpression,
      ">=" as OperatorTokenType,
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 5,
      } as NumberExpression,
      {
        type: "boolean",
        value: false,
      } as BooleanTerm,
    ],
  ])(
    "should be able to evaluate binary expression",
    (
      leftOperand: Expression,
      operator: OperatorTokenType,
      rightOperand: Expression,
      expectedResult: Term
    ) => {
      expect(
        evaluate(
          {
            position: {
              line: 1,
              column: 1,
            },
            type: "binary",
            leftOperand,
            operator,
            rightOperand,
          } as BinaryExpression,
          new World()
        )
      ).toEqual(expectedResult);
    }
  );

  it("should fail if unknown binary operator is encountered", () => {
    const expression: BinaryExpression = {
      position: { line: 1, column: 1 },
      type: "binary",
      leftOperand: {
        position: { line: 1, column: 1 },
        type: "number",
        value: 1,
      } as NumberExpression,
      operator: "+" as OperatorTokenType,
      rightOperand: {
        position: { line: 1, column: 1 },
        type: "number",
        value: 1,
      } as NumberExpression,
    };

    Reflect.set(expression, "operator", "++//");

    expect(() => evaluate(expression, new World())).toThrowError();
  });

  it("should be able to evaluate list expression", () => {
    expect(
      evaluate(
        {
          position: { line: 1, column: 1 },
          type: "list",
          elements: [
            {
              position: { line: 1, column: 1 },
              type: "number",
              value: 1,
            } as NumberExpression,
          ],
        } as ListExpression,
        new World()
      )
    ).toEqual({
      type: "list",
      elements: [
        {
          type: "number",
          value: 1,
        },
      ],
    });
  });

  it("should be able to evaluate number expression", () => {
    expect(
      evaluate(
        {
          position: { line: 1, column: 1 },
          type: "number",
          value: 5,
        } as NumberExpression,
        new World()
      )
    ).toEqual({
      type: "number",
      value: 5,
    });
  });

  it.each([
    [
      {
        position: {
          line: 1,
          column: 1,
        },
        type: "term",
        functor: "true",
        arguments: [],
      } as TermExpression,
      {
        position: {
          line: 1,
          column: 1,
        },
        type: "term",
        functor: "false",
        arguments: [],
      } as TermExpression,
      {
        type: "boolean",
        value: true,
      } as BooleanTerm,
    ],
    [
      {
        position: {
          line: 1,
          column: 1,
        },
        type: "term",
        functor: "false",
        arguments: [],
      } as TermExpression,
      {
        position: {
          line: 1,
          column: 1,
        },
        type: "term",
        functor: "true",
        arguments: [],
      } as TermExpression,
      {
        type: "boolean",
        value: true,
      } as BooleanTerm,
    ],
  ])(
    "should be able to evaluate or expression",
    (
      leftOperand: Expression,
      rightOperand: Expression,
      expectedResult: Term
    ) => {
      expect(
        evaluate(
          {
            position: { line: 1, column: 1 },
            type: "or",
            leftOperand,
            rightOperand,
          } as OrExpression,
          new World()
        )
      ).toEqual(expectedResult);
    }
  );

  it("should be able to evaluate string expression", () => {
    expect(
      evaluate(
        {
          position: { line: 1, column: 1 },
          type: "string",
          value: "test",
        } as StringExpression,
        new World()
      )
    ).toEqual({
      type: "string",
      value: "test",
    });
  });

  it("should be able to evaluate term expression", () => {
    const world = new World();

    world.addClause({
      position: { line: 1, column: 1 },
      type: "clause",
      functor: "test",
      arguments: [
        {
          position: { line: 1, column: 1 },
          type: "variable",
          name: "X",
        } as VariableExpression,
      ],
    } as ClauseDeclaration);

    expect(
      evaluate(
        {
          position: { line: 1, column: 1 },
          type: "term",
          functor: "test",
          arguments: [
            {
              position: { line: 1, column: 1 },
              type: "number",
              value: 0,
            } as NumberExpression,
          ],
        } as TermExpression,
        world
      )
    ).toEqual({
      type: "boolean",
      value: true,
    });
  });

  it.each([
    [
      "+" as UnaryExpressionOperator,
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 5,
      } as NumberExpression,
      {
        type: "number",
        value: 5,
      } as NumberTerm,
    ],
    [
      "-" as UnaryExpressionOperator,
      {
        position: { line: 1, column: 1 },
        type: "number",
        value: 5,
      } as NumberExpression,
      {
        type: "number",
        value: -5,
      } as NumberTerm,
    ],
    [
      "!" as UnaryExpressionOperator,
      {
        position: { line: 1, column: 1 },
        type: "term",
        functor: "false",
        arguments: [],
      } as TermExpression,
      {
        type: "boolean",
        value: true,
      } as BooleanTerm,
    ],
  ])(
    "should be able to evaluate unary expression",
    (
      operator: UnaryExpressionOperator,
      operand: Expression,
      expectedResult: Term
    ) => {
      expect(
        evaluate(
          {
            position: { line: 1, column: 1 },
            type: "unary",
            operator,
            operand,
          } as UnaryExpression,
          new World()
        )
      ).toEqual(expectedResult);
    }
  );

  it.each(["+" as UnaryExpressionOperator, "-" as UnaryExpressionOperator])(
    "should fail if `+` or `-` unary operator is applied to non-number",
    (operator: UnaryExpressionOperator) => {
      expect(() =>
        evaluate(
          {
            position: { line: 1, column: 1 },
            type: "unary",
            operator,
            operand: {
              position: { line: 1, column: 1 },
              type: "string",
              value: "",
            } as StringExpression,
          } as UnaryExpression,
          new World()
        )
      ).toThrowError();
    }
  );

  it("should fail if unknown unary operator is encountered", () => {
    const expression: UnaryExpression = {
      position: { line: 1, column: 1 },
      type: "unary",
      operator: "-",
      operand: {
        position: { line: 1, column: 1 },
        type: "number",
        value: 5,
      } as NumberExpression,
    };

    Reflect.set(expression, "operator", "++--");

    expect(() => evaluate(expression, new World())).toThrowError();
  });

  it("should be able to evaluate variable expression", () => {
    const world = new World();

    world.setVariable("Test", { type: "number", value: 5 } as NumberTerm);

    expect(
      evaluate(
        {
          position: { line: 1, column: 1 },
          type: "variable",
          name: "Test",
        } as VariableExpression,
        world
      )
    ).toEqual({ type: "number", value: 5 });
  });

  it("should fail if variable isn't known", () => {
    expect(() =>
      evaluate(
        {
          position: { line: 1, column: 1 },
          type: "variable",
          name: "Test",
        } as VariableExpression,
        new World()
      )
    ).toThrowError();
  });
});
