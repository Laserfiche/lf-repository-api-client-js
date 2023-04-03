import { repositoryId } from '../TestHelper.js';
import { RepositoryInfo } from '../../src/index.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';

describe('Repo List Integration Tests', () => {
  test('Get Repo Lists', async () => {
    let RepoListResponse: RepositoryInfo[] = await _RepositoryApiClient.repositoriesClient.getRepositoryList({});
    let foundRepo = false;
    for (let i = 0; i < RepoListResponse.length; i++) {
      expect(RepoListResponse[i].repoId).not.toBeNull();
      expect(RepoListResponse[i].webclientUrl).not.toBeNull();
      expect(RepoListResponse[i].webclientUrl).toContain(RepoListResponse[i].repoId);
      if (RepoListResponse[i].repoId?.localeCompare(repositoryId, undefined, { sensitivity: "base" }) === 0) {
        foundRepo = true;
      }
    }
    expect(foundRepo).toBe(true);
  });
});
