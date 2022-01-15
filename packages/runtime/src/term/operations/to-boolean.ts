import { BooleanTerm, Term, TermVisitor } from "../types";
import { visitTerm } from "../visitor";

const toBooleanVisitor: TermVisitor<void, boolean> = {
  visitBooleanTerm(term: BooleanTerm): boolean {
    return term.value;
  },

  visitListTerm(): boolean {
    return true;
  },

  visitNumberTerm(): boolean {
    return true;
  },

  visitStringTerm(): boolean {
    return true;
  },
};

export const toBoolean = (term: Term): boolean =>
  visitTerm(term, toBooleanVisitor, undefined);
