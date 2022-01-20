const { compilerOptions } = require("@tsconfig/recommended/tsconfig.json");

module.exports = {
  collectCoverageFrom: ["src/**/*.ts", "!src/**/index.ts"],
  coverageReporters: ["lcov", "text", "text-summary"],
  globals: {
    "ts-jest": {
      tsconfig: {
        ...compilerOptions,
      },
    },
  },
  preset: "ts-jest",
  testEnvironment: "node",
};
