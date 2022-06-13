import { repoId } from '../testHelper.js';
import { RepositoryInfo,IRepositoryApiClient } from '../../src/index.js';
import { createTestRepoApiClient } from '../BaseTest.js';
import "isomorphic-fetch";

describe('Repo List Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  _RepositoryApiClient = createTestRepoApiClient();
  //create from request handler
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
