const jestConfig = {
  displayName: 'node',
  testMatch: ['**/test/**/*.js'],
  testEnvironment: 'node',
  testTimeout: 10000,
  collectCoverage: false,
  coverageReporters: ['text-summary', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      statements: 10,
      lines: 10,
    },
  },
}

export default jestConfig
