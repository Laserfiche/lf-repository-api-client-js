import { repositoryId } from './TestHelper.js';
import { IRepositoryApiClient } from '../src/index.js';
import { createClient } from './BaseTest.js';
let _RepositoryApiClient: IRepositoryApiClient;
_RepositoryApiClient = createClient();
export { repositoryId, _RepositoryApiClient };
