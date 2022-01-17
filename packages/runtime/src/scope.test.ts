import { Scope } from "./scope";
import { NumberTerm } from "./term";

describe("class Scope", () => {
  describe("has()", () => {
    it("should return `true` if the scope has the variable", () => {
      const scope = new Scope();

      scope.set("Test", { type: "number", value: 5 } as NumberTerm);

      expect(scope.has("Test")).toBe(true);
    });

    it("should return `true` if parent scope has the variable", () => {
      const parentScope = new Scope();
      const scope = new Scope(parentScope);

      parentScope.set("Test", { type: "number", value: 5 } as NumberTerm);

      expect(scope.has("Test")).toBe(true);
    });

    it("should return `false` if the variable doesn't exist in the scope chain", () => {
      expect(new Scope(new Scope()).has("Test")).toBe(false);
    });
  });

  describe("get()", () => {
    it("should return value of the variable if it exists locally", () => {
      const scope = new Scope();

      scope.set("Test", { type: "number", value: 5 } as NumberTerm);

      expect(scope.get("Test")).toEqual({ type: "number", value: 5 });
    });

    it("should return value of the variable if it exists in parent scope", () => {
      const parentScope = new Scope();
      const scope = new Scope(parentScope);

      parentScope.set("Test", { type: "number", value: 5 } as NumberTerm);

      expect(scope.get("Test")).toEqual({ type: "number", value: 5 });
    });

    it("should throw exception if the variable doesn't exist in the scope chain", () => {
      expect(() => new Scope().get("Test")).toThrowError();
    });
  });

  describe("set()", () => {
    it("should set variable locally if it doesn't exist in parent scope", () => {
      const parentScope = new Scope();
      const scope = new Scope(parentScope);

      scope.set("Test", { type: "number", value: 5 } as NumberTerm);

      expect(scope.has("Test")).toBe(true);
      expect(parentScope.has("Test")).toBe(false);
    });

    it("should set variable in parent scope if it exist in the scope chain", () => {
      const parentScope = new Scope();
      const scope = new Scope(parentScope);

      parentScope.set("Test", { type: "number", value: 2 } as NumberTerm);
      scope.set("Test", { type: "number", value: 5 } as NumberTerm);

      expect(parentScope.get("Test")).toEqual({ type: "number", value: 5 });
    });

    it("should set variable locally if argument `local` is `true`", () => {
      const parentScope = new Scope();
      const scope = new Scope(parentScope);

      parentScope.set("Test", { type: "number", value: 2 } as NumberTerm);
      scope.set("Test", { type: "number", value: 5 } as NumberTerm, true);

      expect(scope.get("Test")).toEqual({ type: "number", value: 5 });
      expect(parentScope.get("Test")).toEqual({ type: "number", value: 2 });
    });
  });
});
