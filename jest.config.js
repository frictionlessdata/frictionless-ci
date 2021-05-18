const jestConfig = {
  displayName: 'node',
  testMatch: ['**/test/**/*.js'],
  testEnvironment: 'node',
  testTimeout: 10000,
  collectCoverage: false,
  coverageReporters: ['text-summary', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      statements: 40,
      lines: 40,
    },
  },
}

export default jestConfig
