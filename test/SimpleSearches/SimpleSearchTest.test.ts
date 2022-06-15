import { repoId } from '../testHelper.js';
import { SimpleSearchRequest,IRepositoryApiClient } from '../../src/index.js';
import { createTestRepoApiClient } from '../BaseTest.js';

describe('Simple Search Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  _RepositoryApiClient = createTestRepoApiClient();

  test('Create Simple Search', async () => {
    let request: SimpleSearchRequest = new SimpleSearchRequest();
    request.searchCommand = '({LF:Basic ~= \"search text\", option=\"DFANLT\"})';
    let simpleSearchResponse = await _RepositoryApiClient.simpleSearchesClient.createSimpleSearchOperation({
      repoId,
      request,
    });
    expect(simpleSearchResponse.value).not.toBeNull;
  });
});
