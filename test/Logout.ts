import { _RepositoryApiClient, repositoryId } from './CreateSession.js';
afterAll(async () => {
  _RepositoryApiClient.serverSessionClient.invalidateServerSession({ repoId: repositoryId });
});
