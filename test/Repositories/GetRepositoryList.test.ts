import { repoId } from '../TestHelper2.js';
import { RepositoryInfo } from '../../src/index.js';
import { _RepositoryApiClient } from '../CreateSession2.js';
import "isomorphic-fetch";

describe('Repo List Integration Tests', () => {
  test('Get Repo Lists', async () => {
    let RepoListResponse: RepositoryInfo[] = await _RepositoryApiClient.repositoriesClient.getRepositoryList({});
    let foundRepo = false;
    for (let i = 0; i < RepoListResponse.length; i++) {
      expect(RepoListResponse[i].repoId).not.toBeNull();
      expect(RepoListResponse[i].webclientUrl).not.toBeNull();
      expect(RepoListResponse[i].webclientUrl).toContain(RepoListResponse[i].repoId);
      if (RepoListResponse[i].repoId == repoId) {
        foundRepo = true;
      }
    }
    expect(foundRepo).toBe(true);
  });
});
