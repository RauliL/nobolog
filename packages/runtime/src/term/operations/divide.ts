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
  new NobologRuntimeError(`Cannot divide ${a} with ${b}.`);

const divideVisitor: TermVisitor<Term, Term> = {
  visitBooleanTerm(a: BooleanTerm, b: Term): never {
    throw error(a.type, b.type);
  },

  visitListTerm(a: ListTerm, b: Term): never {
    throw error(a.type, b.type);
  },

  visitNumberTerm(a: NumberTerm, b: Term): NumberTerm {
    if (b.type === "number") {
      const { value: bValue } = b as NumberTerm;

      if (bValue === 0) {
        throw new NobologRuntimeError("Division by zero.");
      }

      return {
        type: "number",
        value: a.value / bValue,
      };
    }

    throw error(a.type, b.type);
  },

  visitStringTerm(a: StringTerm, b: Term): never {
    throw error(a.type, b.type);
  },
};

export const divide = (a: Term, b: Term): Term =>
  visitTerm(a, divideVisitor, b);
