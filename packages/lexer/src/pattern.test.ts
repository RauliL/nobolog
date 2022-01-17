import {
  isAtomPart,
  isAtomStart,
  isNumberPart,
  isVariableStart,
} from "./pattern";

describe("isAtomStart", () => {
  it.each(["a", "b", "ä"])(
    "should accept lower case Unicode letters",
    (input) => {
      expect(isAtomStart.test(input)).toBe(true);
    }
  );

  it.each(["A", "_", "1"])(
    "should reject anything that isn't upper case Unicode letter",
    (input) => {
      expect(isAtomStart.test(input)).toBe(false);
    }
  );
});

describe("isAtomPart", () => {
  it.each(["a", "A", "5", "_"])(
    "should accept Unicode letters, digits and underscore",
    (input) => {
      expect(isAtomPart.test(input)).toBe(true);
    }
  );

  it.each(["-", "+", "€", " "])("should reject anything else", (input) => {
    expect(isAtomPart.test(input)).toBe(false);
  });
});

describe("isVariableStart", () => {
  it.each(["A", "Ä", "_"])(
    "should accept upper case Unicode letters and underscore",
    (input) => {
      expect(isVariableStart.test(input)).toBe(true);
    }
  );

  it.each(["a", "5", " "])("should reject anything else", (input) => {
    expect(isVariableStart.test(input)).toBe(false);
  });
});

describe("isNumberPart", () => {
  it.each(["0", "5", "_"])("should accept digits and underscore", (input) => {
    expect(isNumberPart.test(input)).toBe(true);
  });

  it.each([" ", "a", "-"])("should reject anything else", (input) => {
    expect(isNumberPart.test(input)).toBe(false);
  });
});
