import { State } from "./state";

describe("class State", () => {
  describe("eof()", () => {
    it("should detect when there are no more characters to be read", () => {
      const state = new State("");

      expect(state.eof()).toBe(true);
    });

    it("should detect when there are more characters to be read", () => {
      const state = new State("foo");

      expect(state.eof()).toBe(false);
    });
  });

  describe("current()", () => {
    it("should return next character, if there is one", () => {
      const state = new State("foo");

      expect(state.current()).toBe("f");
    });

    it("should throw an exception when EOF has been reached", () => {
      const state = new State("");

      expect(() => state.current()).toThrowError();
    });
  });

  describe("read()", () => {
    it("should return \\r\\n as \\n", () => {
      const state = new State("\r\n");

      expect(state.read()).toBe("\n");
    });

    it("should throw an exception when EOF has been reached", () => {
      const state = new State("");

      expect(() => state.read()).toThrowError();
    });

    it("should increase line number when line terminator is encountered", () => {
      const state = new State("\nfoo");

      state.read();

      expect(state.position).toEqual({
        line: 2,
        column: 1,
      });
    });

    it("should increase column number when something else than line terminator is encountered", () => {
      const state = new State("foo");

      state.read();

      expect(state.position).toEqual({
        line: 1,
        column: 2,
      });
    });
  });

  describe("peek()", () => {
    it("should return `false` if there are no more characters to be read", () => {
      const state = new State("");

      expect(state.peek("f")).toBe(false);
      expect(state.peek(/[0-9]/)).toBe(false);
    });

    it("should return `true` if given string matches with the next character", () => {
      const state = new State("foo");

      expect(state.peek("f")).toBe(true);
    });

    it("should return `false` if given string does not match with the next character", () => {
      const state = new State("foo");

      expect(state.peek("a")).toBe(false);
    });

    it("should return `true` if given pattern matches with the next character", () => {
      const state = new State("1234");

      expect(state.peek(/[0-9]/)).toBe(true);
    });

    it("should return `false` if given pattern does not match with the next character", () => {
      const state = new State("foo");

      expect(state.peek(/[0-9]/)).toBe(false);
    });
  });

  describe("peekRead()", () => {
    it("should return `false` if there are no more characters to be read", () => {
      const state = new State("");

      expect(state.peekRead("f")).toBe(false);
      expect(state.peekRead(/[0-9]/)).toBe(false);
      expect(state.position).toEqual({
        line: 1,
        column: 1,
      });
    });

    it("should return `true` if given string matches with the next character", () => {
      const state = new State("foo");

      expect(state.peekRead("f")).toBe(true);
      expect(state).toHaveProperty(["position", "column"], 2);
    });

    it("should return `false` if given string does not match with the next character", () => {
      const state = new State("foo");

      expect(state.peekRead("a")).toBe(false);
      expect(state).toHaveProperty(["position", "column"], 1);
    });

    it("should return `true` if given pattern matches with the next character", () => {
      const state = new State("1234");

      expect(state.peekRead(/[0-9]/)).toBe(true);
      expect(state).toHaveProperty(["position", "column"], 2);
    });

    it("should return `false` if given pattern does not match with the next character", () => {
      const state = new State("foo");

      expect(state.peekRead(/[0-9]/)).toBe(false);
      expect(state).toHaveProperty(["position", "column"], 1);
    });
  });
});
