import { BooleanTerm, ListTerm, NumberTerm, StringTerm, Term } from "../types";
import { add } from "./add";

describe("add()", () => {
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
      type: "number",
      value: 0,
    } as NumberTerm,
    {
      type: "string",
      value: "",
    } as StringTerm,
  ])(
    "should not allow addition of boolean with anything",
    (rightOperand: Term) => {
      expect(() =>
        add({ type: "boolean", value: false } as BooleanTerm, rightOperand)
      ).toThrowError();
    }
  );

  it("should allow addition of two lists", () => {
    expect(
      add(
        {
          type: "list",
          elements: [{ type: "number", value: 1 } as NumberTerm],
        } as ListTerm,
        {
          type: "list",
          elements: [{ type: "number", value: 2 } as NumberTerm],
        } as ListTerm
      )
    ).toEqual({
      type: "list",
      elements: [
        {
          type: "number",
          value: 1,
        },
        {
          type: "number",
          value: 2,
        },
      ],
    });
  });

  it("should allow addition of two numbers", () => {
    expect(
      add(
        { type: "number", value: 5 } as NumberTerm,
        { type: "number", value: 2 } as NumberTerm
      )
    ).toEqual({ type: "number", value: 7 });
  });

  it("should allow addition of two strings", () => {
    expect(
      add(
        { type: "string", value: "foo" } as StringTerm,
        { type: "string", value: "bar" } as StringTerm
      )
    ).toEqual({ type: "string", value: "foobar" });
  });

  it.each([
    [
      {
        type: "list",
        elements: [],
      } as ListTerm,
      {
        type: "number",
        value: 0,
      } as NumberTerm,
    ],
    [
      {
        type: "number",
        value: 0,
      } as NumberTerm,
      {
        type: "boolean",
        value: false,
      } as BooleanTerm,
    ],
    [
      {
        type: "string",
        value: "",
      } as StringTerm,
      {
        type: "list",
        elements: [],
      } as ListTerm,
    ],
  ])(
    "should not allow addition of two different types of terms",
    (leftOperand: Term, rightOperand: Term) => {
      expect(() => add(leftOperand, rightOperand)).toThrowError();
    }
  );
});
