import {
  BooleanTerm,
  ListTerm,
  NumberTerm,
  StringTerm,
  Term,
  TermVisitor,
} from "./types";
import { visitTerm } from "./visitor";

describe("visitTerm()", () => {
  const visitBooleanTerm = jest.fn().mockReturnValue("test");
  const visitListTerm = jest.fn().mockReturnValue("test");
  const visitNumberTerm = jest.fn().mockReturnValue("test");
  const visitStringTerm = jest.fn().mockReturnValue("test");
  const allVisitorMethods = [
    visitBooleanTerm,
    visitListTerm,
    visitNumberTerm,
    visitStringTerm,
  ];
  const visitor: TermVisitor<void, "test"> = {
    visitBooleanTerm,
    visitListTerm,
    visitNumberTerm,
    visitStringTerm,
  };
  const mockBooleanTerm: BooleanTerm = {
    type: "boolean",
    value: false,
  };
  const mockListTerm: ListTerm = {
    type: "list",
    elements: [],
  };
  const mockNumberTerm: NumberTerm = {
    type: "number",
    value: 0,
  };
  const mockStringTerm: StringTerm = {
    type: "string",
    value: "",
  };

  beforeEach(() => allVisitorMethods.forEach((method) => method.mockClear()));

  it.each([
    [mockBooleanTerm, visitBooleanTerm],
    [mockListTerm, visitListTerm],
    [mockNumberTerm, visitNumberTerm],
    [mockStringTerm, visitStringTerm],
  ])("should invoke appropriate visitor method", (term, expectedMethod) => {
    expect(visitTerm(term, visitor, undefined)).toBe("test");

    allVisitorMethods.forEach((method) => {
      if (method === expectedMethod) {
        expect(method).toBeCalled();
      } else {
        expect(method).not.toBeCalled();
      }
    });
  });

  it("should reject unknown terms", () => {
    const term: Term = { ...mockStringTerm };

    Object.defineProperty(term, "type", { value: "unknown" });

    expect(() => visitTerm(term, visitor, undefined)).toThrowError();
  });
});
