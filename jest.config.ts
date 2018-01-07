module.exports = {
  verbose: true,
  globals: {
    'ts-jest': {
      skipBabel: true
    }
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/packages/idly-common/lib',
    '<rootDir>/packages/idly-common/dist',
    '<rootDir>/packages/idly-common/node_modules'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js'
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js']
};
