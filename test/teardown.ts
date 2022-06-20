import {_RepositoryApiClient, repoId} from './setup.js';
afterAll(async () => {
    _RepositoryApiClient.serverSessionClient.invalidateServerSession({ repoId });
});