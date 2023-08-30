import { repositoryId, authorizationType, baseUrl } from '../TestHelper.js';
import { RepositoryCollectionResponse, RepositoriesClient } from '../../src/index.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import { authorizationTypeEnum } from '../AuthorizationType.js';
import 'isomorphic-fetch';

describe('Repo List Integration Tests', () => {
  test('Get Repo Lists', async () => {
    let RepoListResponse: RepositoryCollectionResponse[] = await _RepositoryApiClient.repositoriesClient.getRepositoryList({});
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
  if (authorizationType == authorizationTypeEnum.APIServerUsernamePassword) {
    test('Get SelfHosted Repo Lists', async () => {
      let SelfHostedRepoList: RepositoryCollectionResponse[] = await RepositoriesClient.getSelfHostedRepositoryList({ baseUrl });
      let foundRepo = false;
      for (let i = 0; i < SelfHostedRepoList.length; i++) {
        if (SelfHostedRepoList[i].repoId?.localeCompare(repositoryId, undefined, { sensitivity: "base" }) === 0) {
          foundRepo = true;
        }
      }
      expect(foundRepo).toBe(true);
    });
  }
});
