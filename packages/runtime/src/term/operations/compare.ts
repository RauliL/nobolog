import { NobologRuntimeError } from "../../error";
import {
  BooleanTerm,
  ListTerm,
  NumberTerm,
  StringTerm,
  Term,
  TermType,
  TermVisitor,
} from "../types";
import { visitTerm } from "../visitor";

const error = (a: TermType, b: TermType): Error =>
  new NobologRuntimeError(`Cannot compare ${a} with ${b}.`);

const compareVisitor: TermVisitor<Term, number> = {
  visitBooleanTerm(a: BooleanTerm, b: Term): never {
    throw error(a.type, b.type);
  },

  visitListTerm(a: ListTerm, b: Term): never {
    throw error(a.type, b.type);
  },

  visitNumberTerm(a: NumberTerm, b: Term): number {
    if (b.type === "number") {
      const { value: bValue } = b as NumberTerm;

      return a.value > bValue ? 1 : a.value < bValue ? -1 : 0;
    }

    throw error(a.type, b.type);
  },

  visitStringTerm(a: StringTerm, b: Term): never {
    throw error(a.type, b.type);
  },
};

export const compare = (a: Term, b: Term): number =>
  visitTerm(a, compareVisitor, b);
