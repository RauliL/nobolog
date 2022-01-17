import { BooleanTerm, ListTerm, NumberTerm, StringTerm, Term } from "../types";
import { substract } from "./substract";

describe("substract()", () => {
  it("should substract two numbers", () => {
    expect(
      substract(
        {
          type: "number",
          value: 5,
        } as NumberTerm,
        {
          type: "number",
          value: 3,
        } as NumberTerm
      )
    ).toEqual({
      type: "number",
      value: 2,
    });
  });

  it("should not allow substraction of non-number term from number", () => {
    expect(() =>
      substract(
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
    "should not allow substraction from non-number term",
    (leftOperand: Term) => {
      expect(() =>
        substract(leftOperand, { type: "number", value: 5 } as NumberTerm)
      ).toThrowError();
    }
  );
});
