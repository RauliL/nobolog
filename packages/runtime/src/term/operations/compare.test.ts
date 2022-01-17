import { BooleanTerm, ListTerm, NumberTerm, StringTerm, Term } from "../types";
import { compare } from "./compare";

describe("compare()", () => {
  it.each([
    [
      { type: "number", value: 5 } as NumberTerm,
      { type: "number", value: 10 } as NumberTerm,
      -1,
    ],
    [
      { type: "number", value: 5 } as NumberTerm,
      { type: "number", value: 5 } as NumberTerm,
      0,
    ],
    [
      { type: "number", value: 5 } as NumberTerm,
      { type: "number", value: 1 } as NumberTerm,
      1,
    ],
  ])(
    "should compare two numbers against each other",
    (leftOperand: Term, rightOperand: Term, expectedResult) => {
      expect(compare(leftOperand, rightOperand)).toBe(expectedResult);
    }
  );

  it.each([
    {
      type: "boolean",
      value: false,
    } as BooleanTerm,
    {
      type: "list",
      elements: [],
    } as ListTerm,
    {
      type: "string",
      value: "",
    } as StringTerm,
  ])(
    "should not allow comparison of non-number term with number",
    (rightOperand: Term) => {
      expect(() =>
        compare({ type: "number", value: 5 } as NumberTerm, rightOperand)
      ).toThrowError();
    }
  );

  it.each([
    {
      type: "boolean",
      value: false,
    } as BooleanTerm,
    {
      type: "list",
      elements: [],
    } as ListTerm,
    {
      type: "string",
      value: "",
    } as StringTerm,
  ])(
    "should not allow multiplication from non-number term",
    (leftOperand: Term) => {
      expect(() =>
        compare(leftOperand, { type: "number", value: 5 } as NumberTerm)
      ).toThrowError();
    }
  );
});
