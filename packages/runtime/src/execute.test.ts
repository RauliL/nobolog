import {
  ClauseDeclaration,
  QueryDeclaration,
  TermExpression,
} from "@nobolog/parser";

import { execute } from "./execute";
import { World } from "./world";

describe("execute()", () => {
  it("should be able to execute clause declaration", () => {
    const world = new World();

    expect(
      execute(
        {
          position: {
            line: 1,
            column: 1,
          },
          type: "clause",
          functor: "test",
          arguments: [],
        } as ClauseDeclaration,
        world
      )
    ).toBeUndefined();

    expect(Reflect.get(world, "clauses").has("test/0")).toBe(true);
  });

  it("should be able to execute query declaration", () => {
    const world = new World();

    expect(
      execute(
        {
          position: {
            line: 1,
            column: 1,
          },
          type: "query",
          expression: {
            position: {
              line: 1,
              column: 1,
            },
            type: "term",
            functor: "true",
            arguments: [],
          } as TermExpression,
        } as QueryDeclaration,
        world
      )
    ).toEqual({
      type: "boolean",
      value: true,
    });
  });
});
