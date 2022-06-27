/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest/presets/js-with-ts-esm',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testEnvironment: 'node',
  reporters: ['default', ['jest-junit', { outputName: 'junit-node.xml' }]],
  setupFiles:['./CreateSession.ts'],
  setupFilesAfterEnv:['./Logout.ts'],
  testTimeout: 200000,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
