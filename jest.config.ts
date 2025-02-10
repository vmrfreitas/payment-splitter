import type {Config} from 'jest';

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Adjust for your alias setup
  },
  testPathIgnorePatterns: ["/node_modules/", "/src/server.ts"]
};

export default config;