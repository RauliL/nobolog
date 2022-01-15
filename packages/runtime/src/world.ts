import { lex } from "@nobolog/lexer";
import { ClauseDeclaration, VariableExpression, parse } from "@nobolog/parser";

import { Clause, createClauseMap } from "./clause";
import { NobologRuntimeError } from "./error";
import { evaluate } from "./evaluate";
import { execute } from "./execute";
import { Scope } from "./scope";
import { Term, operations } from "./term";

export class World {
  private readonly clauses: Map<string, Clause[]>;
  private currentScope: Scope;

  public constructor() {
    this.clauses = createClauseMap();
    this.currentScope = new Scope();
  }

  public addClause(clause: ClauseDeclaration): void {
    const key = `${clause.functor}/${clause.arguments.length}`;
    let list = this.clauses.get(key);

    if (!list) {
      list = [];
      this.clauses.set(key, list);
    }
    list.push((args: Term[]): boolean => {
      if (clause.arguments.length !== args.length) {
        return false;
      }

      for (let i = 0; i < args.length; ++i) {
        const arg = clause.arguments[i];

        if (arg.type === "variable") {
          continue;
        }

        if (!operations.equals(evaluate(arg, this), args[i])) {
          return false;
        }
      }

      if (clause.body) {
        const scope = this.pushScope();

        for (let i = 0; i < args.length; ++i) {
          const arg = clause.arguments[i];

          if (arg.type === "variable") {
            scope.set((arg as VariableExpression).name, args[i], true);
          }
        }

        try {
          return operations.toBoolean(evaluate(clause.body, this));
        } finally {
          this.popScope();
        }
      }

      return true;
    });
  }

  public setVariable(name: string, value: Term): void {
    this.currentScope.set(name, value);
  }

  public query(functor: string, args: Term[]): boolean {
    const key = `${functor}/${args.length}`;
    const clauses = this.clauses.get(key);

    if (clauses) {
      return clauses.find((clause) => clause(args, this)) != null;
    }

    throw new NobologRuntimeError(
      `Unrecognized clause: \`${functor}/${args.length}'.`
    );
  }

  public eval(source: string): Term | undefined {
    let result: Term | undefined;

    parse(lex(source)).forEach((declaration) => {
      result = execute(declaration, this);
    });

    return result;
  }

  public getVariable(name: string): Term | undefined {
    return this.currentScope.get(name);
  }

  private pushScope(): Scope {
    this.currentScope = new Scope(this.currentScope);

    return this.currentScope;
  }

  private popScope(): void {
    if (!this.currentScope.parent) {
      throw new NobologRuntimeError("Scope stack underflow.");
    }

    this.currentScope = this.currentScope.parent;
  }
}
