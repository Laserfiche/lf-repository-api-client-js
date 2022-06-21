import {repoId} from './testHelper';
import { IRepositoryApiClient } from '../src/index.js';
import { createTestRepoApiClient } from './BaseTest.js';
let _RepositoryApiClient: IRepositoryApiClient;
_RepositoryApiClient = createTestRepoApiClient();
export {repoId,_RepositoryApiClient};