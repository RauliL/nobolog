import {
  ClauseDeclaration,
  Declaration,
  DeclarationVisitor,
  QueryDeclaration,
  visitDeclaration,
} from "@nobolog/parser";

import { evaluate } from "./evaluate";
import { Term } from "./term";
import { World } from "./world";

const executeVisitor: DeclarationVisitor<World, Term | undefined> = {
  visitClauseDeclaration(
    declaration: ClauseDeclaration,
    world: World
  ): Term | undefined {
    world.addClause(declaration);

    return undefined;
  },

  visitQueryDeclaration(
    declaration: QueryDeclaration,
    world: World
  ): Term | undefined {
    return evaluate(declaration.expression, world);
  },
};

export const execute = (declaration: Declaration, world: World) =>
  visitDeclaration(declaration, executeVisitor, world);
