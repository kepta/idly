module.exports = {
  mapCoverage: true,
  globals: {
    'ts-jest': {
      skipBabel: true,
    },
  },
  roots: ['<rootDir>/packages'],
  testPathIgnorePatterns: [
    '<rootDir>/lib',
    '<rootDir>/packages/.*/node_modules',
    '<rootDir>/packages/.*/lib',
    '<rootDir>/packages/.*/dist',
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)'],
  transform: {
    '^.+\\.js?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
};
