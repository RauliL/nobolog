import {
  BooleanTerm,
  ListTerm,
  NumberTerm,
  StringTerm,
  Term,
  TermVisitor,
} from "../types";
import { visitTerm } from "../visitor";

const equalsVisitor: TermVisitor<Term, boolean> = {
  visitBooleanTerm(a: BooleanTerm, b: Term): boolean {
    return b.type === "boolean" && a.value === (b as BooleanTerm).value;
  },

  visitListTerm(a: ListTerm, b: Term): boolean {
    if (b.type === "list") {
      const { length } = a.elements;
      const { elements: bElements } = b as ListTerm;

      if (length !== bElements.length) {
        return false;
      }
      for (let i = 0; i < length; ++i) {
        if (!equals(a.elements[i], bElements[i])) {
          return false;
        }
      }

      return true;
    }

    return false;
  },

  visitNumberTerm(a: NumberTerm, b: Term): boolean {
    return b.type === "number" && a.value === (b as NumberTerm).value;
  },

  visitStringTerm(a: StringTerm, b: Term): boolean {
    return b.type === "string" && a.value === (b as StringTerm).value;
  },
};

/**
 * Tests whether two terms are equal.
 */
export const equals = (a: Term, b: Term): boolean =>
  visitTerm(a, equalsVisitor, b);
