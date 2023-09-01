import { repositoryId } from '../TestHelper.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';
import { SearchEntryRequest } from '../../src/index.js';

describe('Simple Search Integration Tests', () => {

  test('Create Simple Search', async () => {
    let request = new SearchEntryRequest();
    request.searchCommand = "({LF:Basic ~= \"search text\", option=\"DFANLT\"})";
    let simpleSearchResponse = await _RepositoryApiClient.simpleSearchesClient.searchEntry({
      repositoryId,
      request,
    });
    expect(simpleSearchResponse.value).not.toBeNull();
  });

});
