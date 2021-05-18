const jestConfig = {
  displayName: 'node',
  testMatch: ['**/test/**/*.js'],
  testEnvironment: 'node',
  testTimeout: 10000,
  collectCoverage: false,
  coverageReporters: ['text-summary', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      statements: 25,
      lines: 25,
    },
  },
}

export default jestConfig
