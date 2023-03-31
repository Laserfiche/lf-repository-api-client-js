import { repositoryId, authorizationType, baseUrl } from '../TestHelper.js';
import { RepositoryInfo, RepositoryApiClient } from '../../src/index.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import { authorizationTypeEnum } from '../AuthorizationType.js';
import 'isomorphic-fetch';

describe('Repo List Integration Tests', () => {
  test('Get Repo Lists', async () => {
    let RepoListResponse: RepositoryInfo[] = await _RepositoryApiClient.repositoriesClient.getRepositoryList({});
    let foundRepo = false;
    for (let i = 0; i < RepoListResponse.length; i++) {
      expect(RepoListResponse[i].repoId).not.toBeNull();
      expect(RepoListResponse[i].webclientUrl).not.toBeNull();
      expect(RepoListResponse[i].webclientUrl).toContain(RepoListResponse[i].repoId);
      if (RepoListResponse[i].repoId?.toLowerCase == repositoryId.toLowerCase) {
        foundRepo = true;
      }
    }
    expect(foundRepo).toBe(true);
  });
  if (authorizationType == authorizationTypeEnum.APIServerUsernamePassword) {
    test('Get SelfHosted Repo Lists', async () => {
      let SelfHostedRepoList: RepositoryInfo[] = await RepositoryApiClient.getSelfHostedRepositoryList(baseUrl);
      let foundRepo = false;
      for (let i = 0; i < SelfHostedRepoList.length; i++) {
        expect(SelfHostedRepoList[i].repoId).not.toBeNull();
        expect(SelfHostedRepoList[i].webclientUrl).not.toBeNull();
        expect(SelfHostedRepoList[i].webclientUrl).toContain(SelfHostedRepoList[i].repoId);
        if (SelfHostedRepoList[i].repoId?.toLowerCase == repositoryId.toLowerCase) {
          foundRepo = true;
        }
      }
      expect(foundRepo).toBe(true);
    });
  }
});
