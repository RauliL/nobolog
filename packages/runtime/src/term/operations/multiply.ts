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
  new NobologRuntimeError(`Cannot multiply ${a} with ${b}.`);

const multiplyVisitor: TermVisitor<Term, Term> = {
  visitBooleanTerm(a: BooleanTerm, b: Term): never {
    throw error(a.type, b.type);
  },

  visitListTerm(a: ListTerm, b: Term): never {
    throw error(a.type, b.type);
  },

  visitNumberTerm(a: NumberTerm, b: Term): NumberTerm {
    if (b.type !== "number") {
      throw error(a.type, b.type);
    }

    return {
      type: "number",
      value: a.value * (b as NumberTerm).value,
    };
  },

  visitStringTerm(a: StringTerm, b: Term): never {
    throw error(a.type, b.type);
  },
};

export const multiply = (a: Term, b: Term): Term =>
  visitTerm(a, multiplyVisitor, b);
