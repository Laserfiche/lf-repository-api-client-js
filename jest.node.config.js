/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest/presets/js-with-ts-esm',
  globals: {
    'ts-jest': {
      useESM: true,
    }, FormData
  },
  testEnvironment: 'node',
  // reporters: ['default', ['jest-junit', { outputName: 'junit-node.xml' }]],
  reporters: ['default', ['jest-junit', { outputName: process.env.authorizationType === 'CLOUD_ACCESS_KEY' ? 'junit-node.xml' : 'junit-node-selfhosted.xml' }]],
  setupFiles:['./CreateSession.ts'],
  testTimeout: 200000,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
