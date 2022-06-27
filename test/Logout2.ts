import { _RepositoryApiClient, repoId } from './CreateSession2.js';
afterAll(async () => {
  _RepositoryApiClient.serverSessionClient.invalidateServerSession({ repoId });
});
