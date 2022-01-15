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
  new NobologRuntimeError(`Cannot add ${b} to ${a}.`);

const addVisitor: TermVisitor<Term, Term> = {
  visitBooleanTerm(a: BooleanTerm, b: Term): never {
    throw error(a.type, b.type);
  },

  visitListTerm(a: ListTerm, b: Term): ListTerm {
    if (b.type !== "list") {
      throw error(a.type, b.type);
    }

    return {
      type: "list",
      elements: [...a.elements, ...(b as ListTerm).elements],
    };
  },

  visitNumberTerm(a: NumberTerm, b: Term): NumberTerm {
    if (b.type !== "number") {
      throw error(a.type, b.type);
    }

    return {
      type: "number",
      value: a.value + (b as NumberTerm).value,
    };
  },

  visitStringTerm(a: StringTerm, b: Term): StringTerm {
    if (b.type !== "string") {
      throw error(a.type, b.type);
    }

    return {
      type: "string",
      value: a.value + (b as StringTerm).value,
    };
  },
};

export const add = (a: Term, b: Term): Term => visitTerm(a, addVisitor, b);
