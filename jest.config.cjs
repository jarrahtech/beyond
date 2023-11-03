module.exports = {
  transform: {'^.+\\.ts?$': 'ts-jest'},
  testEnvironment: 'node',
  testRegex: 'tests/.*\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  //SLOW - transform javascript
  preset: 'ts-jest/presets/js-with-ts-esm',
  //SLOW - transform node modules
  transformIgnorePatterns: [],
  globals: {
    'ts-jest': {
      isolatedModules: true, // to make type check faster
      tsConfig: {            // to have tsc transform .js files
        allowJs: true,
        checkJs: false,
      },
    }
  },
};