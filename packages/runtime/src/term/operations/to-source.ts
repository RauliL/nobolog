import {
  BooleanTerm,
  ListTerm,
  NumberTerm,
  StringTerm,
  Term,
  TermVisitor,
} from "../types";
import { visitTerm } from "../visitor";

const toSourceVisitor: TermVisitor<void, string> = {
  visitBooleanTerm(term: BooleanTerm): string {
    return term.value === true ? "true" : "false";
  },

  visitListTerm(term: ListTerm): string {
    return `[${term.elements.map(toSource).join(", ")}]`;
  },

  visitNumberTerm(term: NumberTerm): string {
    return JSON.stringify(term.value);
  },

  visitStringTerm(term: StringTerm): string {
    return JSON.stringify(term.value);
  },
};

/**
 * Converts given term to source code representation, e.g. to format in which
 * the term might appear in source code.
 */
export const toSource = (term: Term): string =>
  visitTerm(term, toSourceVisitor, undefined);
