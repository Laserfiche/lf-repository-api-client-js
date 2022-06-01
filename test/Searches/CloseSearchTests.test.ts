import { testKey, testServicePrincipalKey, repoId} from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { AdvancedSearchRequest } from '../../src/index.js';

describe('Search Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey));
  });
  test('Close Search Operations', async () => {
    //create search
    let request = new AdvancedSearchRequest();
    request.searchCommand = '({LF:Basic ~= "search text", option="DFANLT"})';
    var response = await _RepositoryApiClient.searchesClient.createSearchOperation({ repoId, request });
    let searchToken = response.toJSON().token;
    expect(searchToken).not.toBeNull();

    //close the search
    var closeSearchResponse = await _RepositoryApiClient.searchesClient.cancelOrCloseSearch({ repoId, searchToken });
    expect(closeSearchResponse.toJSON().value).toBe(true);
  });
});
