module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  collectCoverageFrom: [
    "**/*.{ts,tsx,js,jsx}", // todos tus archivos
    "!node_modules/**", // excluye node_modules
    "!coverage/**", // excluye coverage
    "!public/**", // opcional: assets
    "!jest.setup.ts", // setup
    "!jest.config.js",
    "!next.config.ts",
    "!**/*.d.ts", // definiciones de tipos
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "/public/", "/jest.setup.ts"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.next/", // si es Next.js
    "/public/",
  ],
};
