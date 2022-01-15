import {
  BooleanTerm,
  ListTerm,
  NumberTerm,
  StringTerm,
  Term,
  TermVisitor,
} from "../types";
import { visitTerm } from "../visitor";

const toStringVisitor: TermVisitor<void, string> = {
  visitBooleanTerm(term: BooleanTerm): string {
    return term.value === true ? "true" : "false";
  },

  visitListTerm(term: ListTerm): string {
    return `[${term.elements.map(toString).join(", ")}]`;
  },

  visitNumberTerm(term: NumberTerm): string {
    return `${term.value}`;
  },

  visitStringTerm(term: StringTerm): string {
    return JSON.stringify(term.value);
  },
};

/**
 * Converts given term to string representation.
 */
export const toString = (term: Term): string =>
  visitTerm(term, toStringVisitor, undefined);
