import { BooleanTerm, ListTerm, NumberTerm, StringTerm, Term } from "../types";
import { equals } from "./equals";

describe("equals()", () => {
  it.each([
    [
      { type: "boolean", value: true } as BooleanTerm,
      { type: "boolean", value: true } as BooleanTerm,
      true,
    ],
    [
      { type: "boolean", value: true } as BooleanTerm,
      { type: "boolean", value: false } as BooleanTerm,
      false,
    ],
  ])(
    "should test equality of two boolean terms",
    (leftOperand: Term, rightOperand: Term, expectedValue) => {
      expect(equals(leftOperand, rightOperand)).toBe(expectedValue);
    }
  );

  it.each([
    [
      {
        type: "list",
        elements: [
          { type: "number", value: 1 },
          { type: "number", value: 2 },
        ],
      } as ListTerm,
      {
        type: "list",
        elements: [
          { type: "number", value: 1 },
          { type: "number", value: 2 },
        ],
      } as ListTerm,
      true,
    ],
    [
      {
        type: "list",
        elements: [
          { type: "number", value: 1 },
          { type: "number", value: 2 },
        ],
      } as ListTerm,
      {
        type: "list",
        elements: [{ type: "number", value: 1 }],
      } as ListTerm,
      false,
    ],
    [
      {
        type: "list",
        elements: [
          { type: "number", value: 1 },
          { type: "number", value: 2 },
        ],
      } as ListTerm,
      {
        type: "list",
        elements: [
          { type: "number", value: 2 },
          { type: "number", value: 1 },
        ],
      } as ListTerm,
      false,
    ],
  ])(
    "should test equality of two list terms",
    (leftOperand: Term, rightOperand: Term, expectedValue) => {
      expect(equals(leftOperand, rightOperand)).toBe(expectedValue);
    }
  );

  it.each([
    [
      { type: "number", value: 5 } as NumberTerm,
      { type: "number", value: 5 } as NumberTerm,
      true,
    ],
    [
      { type: "number", value: 5 } as NumberTerm,
      { type: "number", value: 4 } as NumberTerm,
      false,
    ],
  ])(
    "should test equality of two number terms",
    (leftOperand: Term, rightOperand: Term, expectedValue) => {
      expect(equals(leftOperand, rightOperand)).toBe(expectedValue);
    }
  );

  it.each([
    [
      { type: "string", value: "foo" } as StringTerm,
      { type: "string", value: "foo" } as StringTerm,
      true,
    ],
    [
      { type: "string", value: "foo" } as StringTerm,
      { type: "string", value: "bar" } as StringTerm,
      false,
    ],
  ])(
    "should test equality of two string terms",
    (leftOperand: Term, rightOperand: Term, expectedValue) => {
      expect(equals(leftOperand, rightOperand)).toBe(expectedValue);
    }
  );

  it.each([
    [
      { type: "boolean", value: false } as BooleanTerm,
      { type: "number", value: 0 } as NumberTerm,
    ],
    [
      { type: "list", elements: [] } as ListTerm,
      { type: "boolean", value: false } as BooleanTerm,
    ],
    [
      { type: "number", value: 0 } as NumberTerm,
      { type: "string", value: "0" } as StringTerm,
    ],
    [
      { type: "string", value: "0" } as StringTerm,
      { type: "number", value: 0 } as NumberTerm,
    ],
  ])(
    "should not consider two different types of terms as equal",
    (leftOperand: Term, rightOperand: Term) => {
      expect(equals(leftOperand, rightOperand)).toBe(false);
    }
  );
});
