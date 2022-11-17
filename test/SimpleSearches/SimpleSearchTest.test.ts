import { repositoryId } from '../TestHelper.js';
import { SimpleSearchRequest } from '../../src/index.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';

describe('Simple Search Integration Tests', () => {

  test('Create Simple Search', async () => {
    let request: SimpleSearchRequest = new SimpleSearchRequest();
    request.searchCommand = "({LF:Basic ~= \"*\", option=\"DFANLT\"})";
    let simpleSearchResponse = await _RepositoryApiClient.simpleSearchesClient.createSimpleSearchOperation({
      repoId: repositoryId,
      request,
    });
    expect(simpleSearchResponse.value).not.toBeNull();
  });

});
