/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
    preset: 'ts-jest/presets/js-with-ts-esm',
    globals: {
      'ts-jest': {
        useESM: true,
      },
    },
    testEnvironment: 'jsdom',
    reporters: ["default", ["jest-junit", { outputName: "junit-jsdom.xml" }]],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    }
  };