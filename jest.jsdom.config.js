import { authorizationType } from './test/TestHelper.js';
import { authorizationTypeEnum as authType } from './test/AuthorizationType.js';

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest/presets/js-with-ts-esm',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testEnvironment: 'jsdom',
  // reporters: ['default', ['jest-junit', { outputName: 'junit-jsdom.xml' }]],
  reporters: ['default', ['jest-junit', { outputName: authorizationType === authType.CloudAccessKey ? 'junit-jsdom.xml' : 'junit-jsdom-selfhosted.xml' }]],
  setupFiles:['./CreateSession.ts'],
  testTimeout: 200000,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
