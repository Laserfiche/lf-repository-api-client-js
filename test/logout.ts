import { _RepositoryApiClient, repoId } from './CreateSession.js';
afterAll(async () => {
  _RepositoryApiClient.serverSessionClient.invalidateServerSession({ repoId });
});
