import {
  AndExpression,
  AssignExpression,
  BinaryExpression,
  Expression,
  ExpressionVisitor,
  ListExpression,
  NumberExpression,
  OrExpression,
  StringExpression,
  TermExpression,
  UnaryExpression,
  VariableExpression,
  visitExpression,
} from "@nobolog/parser";

import { NobologRuntimeError } from "./error";
import {
  ListTerm,
  NumberTerm,
  StringTerm,
  Term,
  operations,
  BooleanTerm,
} from "./term";
import { World } from "./world";

const evaluateVisitor: ExpressionVisitor<World, Term> = {
  visitAndExpression(expression: AndExpression, world: World): Term {
    const leftOperand = visitExpression(expression.leftOperand, this, world);

    if (!operations.toBoolean(leftOperand)) {
      return {
        type: "boolean",
        value: false,
      } as BooleanTerm;
    }

    return visitExpression(expression.rightOperand, this, world);
  },

  visitAssignExpression(expression: AssignExpression, world: World): Term {
    const value = visitExpression(expression.rightOperand, this, world);

    world.setVariable(expression.leftOperand.name, value);

    return value;
  },

  visitBinaryExpression(expression: BinaryExpression, world: World): Term {
    const leftOperand = visitExpression(expression.leftOperand, this, world);
    const rightOperand = visitExpression(expression.rightOperand, this, world);

    switch (expression.operator) {
      case "+":
        return operations.add(leftOperand, rightOperand);

      case "-":
        return operations.substract(leftOperand, rightOperand);

      case "*":
        return operations.multiply(leftOperand, rightOperand);

      case "/":
        return operations.divide(leftOperand, rightOperand);

      case "==":
        return {
          type: "boolean",
          value: operations.equals(leftOperand, rightOperand),
        } as BooleanTerm;

      case "!=":
        return {
          type: "boolean",
          value: !operations.equals(leftOperand, rightOperand),
        } as BooleanTerm;

      case "<":
        return {
          type: "boolean",
          value: operations.compare(leftOperand, rightOperand) < 0,
        } as BooleanTerm;

      case ">":
        return {
          type: "boolean",
          value: operations.compare(leftOperand, rightOperand) > 0,
        } as BooleanTerm;

      case "<=":
        return {
          type: "boolean",
          value: operations.compare(leftOperand, rightOperand) <= 0,
        } as BooleanTerm;

      case ">=":
        return {
          type: "boolean",
          value: operations.compare(leftOperand, rightOperand) >= 0,
        } as BooleanTerm;
    }

    throw new Error(`Unrecognized operator: \`${expression.operator}'.`);
  },

  visitListExpression(expression: ListExpression, world: World): Term {
    return {
      type: "list",
      elements: expression.elements.map((elementExpression) =>
        visitExpression(elementExpression, this, world)
      ),
    } as ListTerm;
  },

  visitNumberExpression(expression: NumberExpression): Term {
    return {
      type: "number",
      value: expression.value,
    } as NumberTerm;
  },

  visitOrExpression(expression: OrExpression, world: World): Term {
    const leftOperand = visitExpression(expression.leftOperand, this, world);

    if (operations.toBoolean(leftOperand)) {
      return {
        type: "boolean",
        value: true,
      } as BooleanTerm;
    }

    return {
      type: "boolean",
      value: operations.toBoolean(
        visitExpression(expression.rightOperand, this, world)
      ),
    } as BooleanTerm;
  },

  visitStringExpression(expression: StringExpression): Term {
    return {
      type: "string",
      value: expression.value,
    } as StringTerm;
  },

  visitTermExpression(expression: TermExpression, world: World): Term {
    return {
      type: "boolean",
      value: world.query(
        expression.functor,
        expression.arguments.map((argumentExpression) =>
          visitExpression(argumentExpression, this, world)
        )
      ),
    } as BooleanTerm;
  },

  visitUnaryExpression(expression: UnaryExpression, world: World): Term {
    const operand = visitExpression(expression.operand, this, world);

    switch (expression.operator) {
      case "+":
        if (operand.type === "number") {
          return {
            type: "number",
            value: +(operand as NumberTerm).value,
          } as NumberTerm;
        } else {
          throw new NobologRuntimeError(
            `Cannot operator on \`${operand.type}'.`
          );
        }

      case "-":
        if (operand.type === "number") {
          return {
            type: "number",
            value: -(operand as NumberTerm).value,
          } as NumberTerm;
        } else {
          throw new NobologRuntimeError(
            `Cannot operator on \`${operand.type}'.`
          );
        }

      case "!":
        return {
          type: "boolean",
          value: !operations.toBoolean(operand),
        } as BooleanTerm;
    }

    throw new Error(`Unrecognized operator: \`${expression.operator}'.`);
  },

  visitVariableExpression(expression: VariableExpression, world: World): Term {
    const { name } = expression;
    const value = world.getVariable(name);

    if (!value) {
      throw new NobologRuntimeError(`Unrecognized variable: \`${name}'`);
    }

    return value;
  },
};

export const evaluate = (expression: Expression, world: World): Term =>
  visitExpression(expression, evaluateVisitor, world);
