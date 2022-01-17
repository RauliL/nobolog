import { BooleanTerm, ListTerm, NumberTerm, StringTerm, Term } from "./term";
import { World } from "./world";

describe("builtin clauses", () => {
  const query = (functor: string, args: Term[] = []) =>
    new World().query(functor, args);

  describe("true/0", () => {
    it("should always return `true`", () => {
      expect(query("true")).toBe(true);
    });
  });

  describe("false/0", () => {
    it("should always return `false`", () => {
      expect(query("false")).toBe(false);
    });
  });

  describe("print/1", () => {
    const logSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);

    beforeEach(() => {
      logSpy.mockClear();
    });

    afterAll(() => {
      logSpy.mockReset();
    });

    it.each([
      [{ type: "boolean", value: true } as BooleanTerm, "true"],
      [
        {
          type: "list",
          elements: [
            { type: "number", value: 1 } as NumberTerm,
            { type: "number", value: 2 } as NumberTerm,
          ],
        } as ListTerm,
        "1, 2",
      ],
      [{ type: "number", value: 5 } as NumberTerm, "5"],
      [{ type: "string", value: "test" } as StringTerm, "test"],
    ])(
      "should invoke `console.log()` with string representation of the argument",
      (arg: Term, expectedCallbackArg: string) => {
        expect(query("print", [arg])).toBe(true);
        expect(logSpy).toBeCalledWith(expectedCallbackArg);
      }
    );
  });
});
