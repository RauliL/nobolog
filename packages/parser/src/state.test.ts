import {
  Position,
  SeparatorToken,
  SeparatorTokenType,
  TokenType,
} from "@nobolog/lexer";

import { State } from "./state";

export const mockPosition: Readonly<Position> = {
  line: 1,
  column: 1,
};

const mockSeparatorToken: Readonly<SeparatorToken> = {
  position: mockPosition,
  type: ".",
};

describe("class State", () => {
  describe("eof()", () => {
    it("should detect when there are no more tokens to be read", () => {
      const state = new State([]);

      expect(state.eof()).toBe(true);
    });

    it("should detect when there are more tokens to be read", () => {
      const state = new State([mockSeparatorToken]);

      expect(state.eof()).toBe(false);
    });
  });

  describe("current()", () => {
    it("should return next token, if there is one", () => {
      const state = new State([mockSeparatorToken]);

      expect(state.current()).toBe(mockSeparatorToken);
    });

    it("should throw an exception when there are no more tokens to be read", () => {
      const state = new State([]);

      expect(() => state.current()).toThrowError();
    });
  });

  describe("read()", () => {
    it.each([undefined, "+" as TokenType])(
      "should throw an exception when there are no more tokens to be read",
      (expectedType?: TokenType) => {
        const state = new State([]);

        expect(() => state.read(expectedType)).toThrowError();
      }
    );

    it("should throw exception if next token doesn't match with the given token type", () => {
      const state = new State([{ ...mockSeparatorToken, type: ";" }]);

      expect(() => state.read(")")).toThrowError();
    });
  });

  describe("peek()", () => {
    it("should return `false` if there are no more tokens to be read", () => {
      const state = new State([]);

      expect(state.peek("+")).toBe(false);
    });

    it.each([
      "," as SeparatorTokenType,
      "." as SeparatorTokenType,
      ";" as SeparatorTokenType,
    ])(
      "should return `true` if next token matches with the given type",
      (expectedType: SeparatorTokenType) => {
        const state = new State([
          { ...mockSeparatorToken, type: expectedType },
        ]);

        expect(state.peek(expectedType)).toBe(true);
      }
    );
  });

  describe("peekRead()", () => {
    it("should return `false` if there are no more tokens to be read", () => {
      const state = new State([]);

      expect(state.peekRead("+")).toBe(false);
      expect(state).toHaveProperty("offset", 0);
    });

    it.each([
      "," as SeparatorTokenType,
      "." as SeparatorTokenType,
      ";" as SeparatorTokenType,
    ])(
      "should return `true` if next token matches with the given type",
      (expectedType: SeparatorTokenType) => {
        const state = new State([
          { ...mockSeparatorToken, type: expectedType },
        ]);

        expect(state.peekRead(expectedType)).toBe(true);
        expect(state).toHaveProperty("offset", 1);
      }
    );
  });
});
