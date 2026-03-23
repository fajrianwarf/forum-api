module.exports = {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: [
    '**/_test/**/*.test.js',
    '**/_test/**/*.test.ts',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
