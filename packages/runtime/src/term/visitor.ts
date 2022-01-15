import {
  BooleanTerm,
  ListTerm,
  NumberTerm,
  StringTerm,
  Term,
  TermVisitor,
} from "./types";

export const visitTerm = <A = void, R = void>(
  term: Term,
  visitor: TermVisitor<A, R>,
  arg: A
) => {
  switch (term.type) {
    case "boolean":
      return visitor.visitBooleanTerm(term as BooleanTerm, arg);

    case "list":
      return visitor.visitListTerm(term as ListTerm, arg);

    case "number":
      return visitor.visitNumberTerm(term as NumberTerm, arg);

    case "string":
      return visitor.visitStringTerm(term as StringTerm, arg);
  }

  throw new Error(`Unrecognized term type: ${term.type}`);
};
