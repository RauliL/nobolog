import { lex } from "./lexer";

describe("lex()", () => {
  it.each(["# foo", "#\n"])(
    "should skip comments that start with `#'",
    (input) => {
      expect(lex(input)).toEqual([]);
    }
  );

  it("should skip whitespace", () => {
    expect(lex(" \n \t \r\n ")).toEqual([]);
  });

  it.each(["€", "\\u20ac"])(
    "should fail if invalid input is encountered",
    (input) => {
      expect(() => lex(input)).toThrowError();
    }
  );

  describe("number literals", () => {
    it.each([
      ["0", 0],
      ["123", 123],
      ["100_000", 100000],
      ["3.141", 3.141],
      ["5.123_123", 5.123123],
      ["6e4", 60000],
      ["6.5e-4", 0.00065],
      ["6.5e+4", 65000],
    ])("should be able to lex number literals", (input, expectedValue) => {
      const result = lex(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        type: "number",
        value: expectedValue,
      });
    });

    it("should fail if there are missing digits after exponent sign", () => {
      expect(() => lex("5e")).toThrowError();
    });
  });

  describe("string literals", () => {
    it.each([
      ['"foo bar"', "foo bar"],
      ["'foo bar'", "foo bar"],
      ['"foo\\nbar"', "foo\nbar"],
    ])(
      "should be able to lex simple string literals",
      (input, expectedValue) => {
        const result = lex(input);

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          type: "string",
          value: expectedValue,
        });
      }
    );

    it.each(['"foo', "'foo"])(
      "should fail if string literal is unterminated",
      (input) => {
        expect(() => lex(input)).toThrowError();
      }
    );

    it.each([
      ['"\\b"', "\b"],
      ['"\\t"', "\t"],
      ['"\\n"', "\n"],
      ['"\\f"', "\f"],
      ['"\\r"', "\r"],
      ['"\\""', '"'],
      ['"\\\'"', "'"],
      ['"\\\\"', "\\"],
      ['"\\/"', "/"],
      ['"\\u00E4"', "ä"],
      ['"\\u00e4"', "ä"],
    ])("should be able to lex escape sequences", (input, expectedValue) => {
      const result = lex(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        type: "string",
        value: expectedValue,
      });
    });

    it.each(['"\\', '"\\u00', '"\\u000X"', '"\\a"'])(
      "should fail if invalid escape sequence is encountered",
      (input) => {
        expect(() => lex(input)).toThrowError();
      }
    );
  });

  describe("atoms", () => {
    it.each(["foo", "foo_", "foo123"])(
      "should be able to lex atoms",
      (input) => {
        const result = lex(input);

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          type: "atom",
          id: input,
        });
      }
    );

    it.each([
      ["f\\u00e4", "fä"],
      ["\\u00e4", "ä"],
    ])(
      "should be able to lex escape sequences as part of atom",
      (input, expectedId) => {
        const result = lex(input);

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          type: "atom",
          id: expectedId,
        });
      }
    );
  });

  describe("variables", () => {
    it.each(["Foo", "_Foo", "_123"])(
      "should be able to lex variables",
      (input) => {
        const result = lex(input);

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          type: "variable",
          id: input,
        });
      }
    );

    it.each([
      ["_\\u00e4", "_ä"],
      ["\\u00c4", "Ä"],
    ])(
      "should be able to lex escape sequences as part of variable name",
      (input, expectedId) => {
        const result = lex(input);

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          type: "variable",
          id: expectedId,
        });
      }
    );
  });

  describe("separators", () => {
    it.each([";", ".", ",", "(", ")", "[", "]", "?-", ":-"])(
      "should be able to lex known separators",
      (input) => {
        const result = lex(input);

        expect(result).toHaveLength(1);
        expect(result).toHaveProperty([0, "type"], input);
      }
    );

    it.each(["?", ":"])("should reject partial separators", (input) => {
      expect(() => lex(input)).toThrowError();
    });
  });

  describe("operators", () => {
    it.each(["+", "-", "*", "/", "<", "<=", ">", ">=", "=", "==", "!", "!="])(
      "should be able to lex known operators",
      (input) => {
        const result = lex(input);

        expect(result).toHaveLength(1);
        expect(result).toHaveProperty([0, "type"], input);
      }
    );
  });
});
