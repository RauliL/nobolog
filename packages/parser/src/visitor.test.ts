import { mockPosition } from "./state.test";
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
import {
  DeclarationVisitor,
  ExpressionVisitor,
  visitDeclaration,
  visitExpression,
} from "./visitor";

const mockStringExpression: StringExpression = {
  position: mockPosition,
  type: "string",
  value: "",
};

describe("visitExpression()", () => {
  const visitAndExpression = jest.fn().mockReturnValue("test");
  const visitAssignExpression = jest.fn().mockReturnValue("test");
  const visitBinaryExpression = jest.fn().mockReturnValue("test");
  const visitListExpression = jest.fn().mockReturnValue("test");
  const visitNumberExpression = jest.fn().mockReturnValue("test");
  const visitOrExpression = jest.fn().mockReturnValue("test");
  const visitStringExpression = jest.fn().mockReturnValue("test");
  const visitTermExpression = jest.fn().mockReturnValue("test");
  const visitUnaryExpression = jest.fn().mockReturnValue("test");
  const visitVariableExpression = jest.fn().mockReturnValue("test");
  const allVisitorMethods = [
    visitAndExpression,
    visitAssignExpression,
    visitBinaryExpression,
    visitListExpression,
    visitNumberExpression,
    visitOrExpression,
    visitStringExpression,
    visitTermExpression,
    visitUnaryExpression,
    visitVariableExpression,
  ];
  const visitor: ExpressionVisitor<void, void> = {
    visitAndExpression,
    visitAssignExpression,
    visitBinaryExpression,
    visitListExpression,
    visitNumberExpression,
    visitOrExpression,
    visitStringExpression,
    visitTermExpression,
    visitUnaryExpression,
    visitVariableExpression,
  };
  const mockVariableExpression: VariableExpression = {
    position: mockPosition,
    type: "variable",
    name: "test",
  };
  const mockAndExpression: AndExpression = {
    position: mockPosition,
    type: "and",
    leftOperand: mockStringExpression,
    rightOperand: mockStringExpression,
  };
  const mockAssignExpression: AssignExpression = {
    position: mockPosition,
    type: "assign",
    leftOperand: mockVariableExpression,
    rightOperand: mockStringExpression,
  };
  const mockBinaryExpression: BinaryExpression = {
    position: mockPosition,
    type: "binary",
    leftOperand: mockStringExpression,
    operator: "+",
    rightOperand: mockStringExpression,
  };
  const mockListExpression: ListExpression = {
    position: mockPosition,
    type: "list",
    elements: [],
  };
  const mockNumberExpression: NumberExpression = {
    position: mockPosition,
    type: "number",
    value: 0,
  };
  const mockOrExpression: OrExpression = {
    position: mockPosition,
    type: "or",
    leftOperand: mockStringExpression,
    rightOperand: mockStringExpression,
  };
  const mockTermExpression: TermExpression = {
    position: mockPosition,
    type: "term",
    functor: "test",
    arguments: [],
  };
  const mockUnaryExpression: UnaryExpression = {
    position: mockPosition,
    type: "unary",
    operand: mockNumberExpression,
    operator: "-",
  };

  beforeEach(() => allVisitorMethods.forEach((method) => method.mockClear()));

  it.each([
    [mockAndExpression, visitAndExpression],
    [mockAssignExpression, visitAssignExpression],
    [mockBinaryExpression, visitBinaryExpression],
    [mockListExpression, visitListExpression],
    [mockNumberExpression, visitNumberExpression],
    [mockOrExpression, visitOrExpression],
    [mockStringExpression, visitStringExpression],
    [mockTermExpression, visitTermExpression],
    [mockUnaryExpression, visitUnaryExpression],
    [mockVariableExpression, visitVariableExpression],
  ])(
    "should invoke appropriate visitor method",
    (expression, expectedMethod) => {
      expect(visitExpression(expression, visitor, undefined)).toBe("test");

      allVisitorMethods.forEach((method) => {
        if (method === expectedMethod) {
          expect(method).toBeCalled();
        } else {
          expect(method).not.toBeCalled();
        }
      });
    }
  );

  it("should reject unknown expressions", () => {
    const expression: Expression = { ...mockStringExpression };

    Object.defineProperty(expression, "type", { value: "unknown " });

    expect(() =>
      visitExpression(expression, visitor, undefined)
    ).toThrowError();
  });
});

describe("visitDeclaration()", () => {
  const visitClauseDeclaration = jest.fn().mockReturnValue("test");
  const visitQueryDeclaration = jest.fn().mockReturnValue("test");
  const allVisitorMethods = [visitClauseDeclaration, visitQueryDeclaration];
  const visitor: DeclarationVisitor<void, string> = {
    visitClauseDeclaration,
    visitQueryDeclaration,
  };

  const mockClauseDeclaration: ClauseDeclaration = {
    position: mockPosition,
    type: "clause",
    functor: "test",
    arguments: [mockStringExpression],
  };
  const mockQueryDeclaration: QueryDeclaration = {
    position: mockPosition,
    type: "query",
    expression: mockStringExpression,
  };

  beforeEach(() => allVisitorMethods.forEach((method) => method.mockClear()));

  it.each([
    [mockClauseDeclaration, visitClauseDeclaration],
    [mockQueryDeclaration, visitQueryDeclaration],
  ])(
    "should invoke appropriate visitor method",
    (declaration, expectedMethod) => {
      expect(visitDeclaration(declaration, visitor, undefined)).toBe("test");

      allVisitorMethods.forEach((method) => {
        if (method === expectedMethod) {
          expect(method).toBeCalled();
        } else {
          expect(method).not.toBeCalled();
        }
      });
    }
  );

  it("should reject unknown declaration", () => {
    const declaration: Declaration = { ...mockClauseDeclaration };

    Object.defineProperty(declaration, "type", { value: "unknown" });

    expect(() =>
      visitDeclaration(declaration, visitor, undefined)
    ).toThrowError();
  });
});
