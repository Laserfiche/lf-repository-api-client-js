/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default  {
  projects: [ 
    {
      preset: 'ts-jest/presets/js-with-ts-esm',
      modulePathIgnorePatterns: ["dist"],
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      globals: {
        'ts-jest': {
          useESM: true,
        },
      },
      testEnvironment: 'node',
      reporters: [ "default", "jest-junit" ],
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      }
    }, 
    {
      preset: 'ts-jest/presets/js-with-ts-esm',
      modulePathIgnorePatterns: ["dist"],
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      globals: {
        'ts-jest': {
          useESM: true,
        },
      },
      testEnvironment: 'jsdom',
      reporters: [ "default", "jest-junit" ],
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      }
    }
  ]
  };