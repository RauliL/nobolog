import { BooleanTerm, ListTerm, NumberTerm, StringTerm, Term } from "../types";
import { divide } from "./divide";

describe("divide()", () => {
  it("should divide two numbers", () => {
    expect(
      divide(
        {
          type: "number",
          value: 10,
        } as NumberTerm,
        {
          type: "number",
          value: 2,
        } as NumberTerm
      )
    ).toEqual({ type: "number", value: 5 });
  });

  it("should not allow division by zero", () => {
    expect(() =>
      divide(
        { type: "number", value: 10 } as NumberTerm,
        { type: "number", value: 0 } as NumberTerm
      )
    ).toThrowError();
  });

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
    "should not allow division of number with non-number",
    (rightOperand: Term) => {
      expect(() =>
        divide({ type: "number", value: 10 } as NumberTerm, rightOperand)
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
  ])("should not allow division of non-numbers", (leftOperand: Term) => {
    expect(() =>
      divide(leftOperand, { type: "number", value: 2 } as NumberTerm)
    ).toThrowError();
  });
});
