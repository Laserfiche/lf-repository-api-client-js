import { repoId } from './TestHelper2';
import { IRepositoryApiClient } from '../src/index.js';
import { createTestRepoApiClient } from './BaseTest2.js';
let _RepositoryApiClient: IRepositoryApiClient;
_RepositoryApiClient = createTestRepoApiClient();
export { repoId, _RepositoryApiClient };
