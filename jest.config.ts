export default {
  clearMocks: true,
  coverageProvider: "v8",
  globalSetup: "<rootDir>/__tests__/global-setup.ts",
  globalTeardown: "<rootDir>/__tests__/global-teardown.ts",
  testEnvironment: "node",
  testMatch: [
    "**/__tests__/**/*.test.[tj]s?(x)"
  ]
}
