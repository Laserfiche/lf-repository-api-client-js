import { OAuthAccessKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { AdvancedSearchRequest, ODataValueContextOfIListOfEntry } from '../../src/index.js';
import { jest } from '@jest/globals';
import { createTestRepoApiClient } from '../BaseTest.js';

describe('Search Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  _RepositoryApiClient = createTestRepoApiClient();
  test('Close Search Operations', async () => {
    //create search
    let request = new AdvancedSearchRequest();
    request.searchCommand = '({LF:Basic ~= "search text", option="DFANLT"})';
    var response = await _RepositoryApiClient.searchesClient.createSearchOperation({ repoId, request });
    let searchToken = response.token;
    expect(searchToken).not.toBeNull();

    //close the search
    var closeSearchResponse = await _RepositoryApiClient.searchesClient.cancelOrCloseSearch({
      repoId,
      searchToken: searchToken ?? '',
    });
    expect(closeSearchResponse.value).toBe(true);
  });

  test('Get Search Results simple Paging', async () => {
    let maxPageSize = 1;
    let searchRequest = new AdvancedSearchRequest();
    searchRequest.searchCommand = '({LF:Basic ~= "search text", option="DFANLT"})';
    let searchResponse = await _RepositoryApiClient.searchesClient.createSearchOperation({
      repoId,
      request: searchRequest,
    });
    let searchToken: string = searchResponse.token ?? '';
    expect(searchToken).not.toBe('');
    expect(searchToken).not.toBeNull();
    await new Promise((r) => setTimeout(r, 5000));
    let prefer = `maxpagesize=${maxPageSize}`;
    let response: ODataValueContextOfIListOfEntry = await _RepositoryApiClient.searchesClient.getSearchResults({
      repoId,
      searchToken,
      prefer,
    });
    if (!response.value) {
      throw new Error('response.value is undefined');
    }
    expect(response).not.toBeNull();
    let nextLink: string = response.odataNextLink ?? '';
    expect(nextLink).not.toBeNull();
    expect(response.value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 = await _RepositoryApiClient.searchesClient.GetSearchResultsNextLink({ nextLink, maxPageSize });
    if (!response2.value) {
      throw new Error('response2.value is undefined');
    }
    expect(response2).not.toBeNull();
    expect(response2.value.length).toBeLessThanOrEqual(maxPageSize);
  });
});
