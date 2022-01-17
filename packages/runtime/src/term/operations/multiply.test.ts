import { BooleanTerm, ListTerm, NumberTerm, StringTerm, Term } from "../types";
import { multiply } from "./multiply";

describe("multiply()", () => {
  it("should multiply two numbers", () => {
    expect(
      multiply(
        {
          type: "number",
          value: 5,
        } as NumberTerm,
        {
          type: "number",
          value: 2,
        } as NumberTerm
      )
    ).toEqual({
      type: "number",
      value: 10,
    });
  });

  it("should not allow multiplication of non-number term from number", () => {
    expect(() =>
      multiply(
        { type: "number", value: 5 } as NumberTerm,
        { type: "boolean", value: false } as BooleanTerm
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
    "should not allow multiplication from non-number term",
    (leftOperand: Term) => {
      expect(() =>
        multiply(leftOperand, { type: "number", value: 5 } as NumberTerm)
      ).toThrowError();
    }
  );
});
