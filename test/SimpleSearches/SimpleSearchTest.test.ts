import { testKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { SimpleSearchRequest } from '../../src/index.js';

describe('Simple Search Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  _RepositoryApiClient = RepositoryApiClient.createFromAccessKey(testServicePrincipalKey, testKey);

  test('Create Simple Search', async () => {
    let request: SimpleSearchRequest = new SimpleSearchRequest();
    request.searchCommand = '({LF:Basic ~= "search text", option="DFANLT"})';
    let simpleSearchResponse = await _RepositoryApiClient.simpleSearchesClient.createSimpleSearchOperation({
      repoId,
      request,
    });
    expect(simpleSearchResponse.value).not.toBeNull;
  });
});
