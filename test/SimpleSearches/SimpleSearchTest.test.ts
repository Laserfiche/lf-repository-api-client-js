import { repoId } from '../testHelper.js';
import { SimpleSearchRequest } from '../../src/index.js';
import { _RepositoryApiClient } from '../createSession.js';
import 'isomorphic-fetch';

describe('Simple Search Integration Tests', () => {
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
