import {repoId} from './testHelper';
import { IRepositoryApiClient } from '../src/index.js';
import { createTestRepoApiClient } from './BaseTest.js';
let _RepositoryApiClient: IRepositoryApiClient;
_RepositoryApiClient = createTestRepoApiClient();
console.log("before got it!");
export {repoId,_RepositoryApiClient};