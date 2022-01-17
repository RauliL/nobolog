import { BooleanTerm, ListTerm, NumberTerm, StringTerm } from "../types";
import { toBoolean } from "./to-boolean";

describe("toBoolean()", () => {
  it.each([true, false])(
    "should extract boolean value of boolean term",
    (value) => {
      expect(toBoolean({ type: "boolean", value } as BooleanTerm)).toBe(value);
    }
  );

  it.each([
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
  ])("should treat all non-boolean terms as `true`", (term) => {
    expect(toBoolean(term)).toBe(true);
  });
});
