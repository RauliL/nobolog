import { BooleanTerm, ListTerm, NumberTerm, StringTerm, Term } from "../types";
import { toString } from "./to-string";

describe("toString()", () => {
  it.each([
    [
      {
        type: "boolean",
        value: true,
      } as BooleanTerm,
      "true",
    ],
    [
      {
        type: "boolean",
        value: false,
      } as BooleanTerm,
      "false",
    ],
    [
      {
        type: "list",
        elements: [
          { type: "number", value: 1 } as NumberTerm,
          { type: "number", value: 2 } as NumberTerm,
          { type: "number", value: 3 } as NumberTerm,
        ],
      } as ListTerm,
      "1, 2, 3",
    ],
    [
      {
        type: "number",
        value: 15.5,
      } as NumberTerm,
      "15.5",
    ],
    [
      {
        type: "string",
        value: "test",
      } as StringTerm,
      "test",
    ],
  ])(
    "should convert term to string representation",
    (term: Term, expectedResult) => {
      expect(toString(term)).toBe(expectedResult);
    }
  );
});
