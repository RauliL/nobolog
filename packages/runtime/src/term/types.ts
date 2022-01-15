export type TermType = "boolean" | "list" | "number" | "string";

export type Term = {
  type: TermType;
};

export type BooleanTerm = Term & {
  type: "boolean";
  value: boolean;
};

export type ListTerm = Term & {
  type: "list";
  elements: Term[];
};

export type NumberTerm = Term & {
  type: "number";
  value: number;
};

export type StringTerm = Term & {
  type: "string";
  value: string;
};

export type TermVisitor<A = void, R = void> = {
  visitBooleanTerm(term: BooleanTerm, arg: A): R;
  visitListTerm(term: ListTerm, arg: A): R;
  visitNumberTerm(term: NumberTerm, arg: A): R;
  visitStringTerm(term: StringTerm, arg: A): R;
};
