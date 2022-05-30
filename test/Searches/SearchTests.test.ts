import { testKey, testServicePrincipalKey, repoId, baseUrlDebug } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { AdvancedSearchRequest } from '../../src/index.js';
import {jest} from '@jest/globals'

let searchToken = 'test';
describe.skip('Search Integration Tests Part 2', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey), baseUrlDebug);
  });
  jest.setTimeout(20000);
  afterEach(async () => {
    if (searchToken != '' || searchToken != null) {
      await _RepositoryApiClient.searchesClient.cancelOrCloseSearch({ repoId, searchToken });
      await new Promise((r) => setTimeout(r, 5000));
    }
  });
  // //not done yet
  // test.skip("Create Search Operation", async () => {

  //     //create search
  //     let request = new AdvancedSearchRequest();
  //     request.searchCommand = "({LF:Basic ~= \"search text\", option=\"DFANLT\"})";
  //     var response = await client.createSearchOperation(repoId,request);
  //     searchToken = response.toJSON().token;
  //     expect(searchToken).not.toBeNull();
  //     expect(searchToken).not.toBe("");
  //     let webURL = response.toJSON().Headers;
  //     console.log(response);
  //     console.log(webURL);
  // });

  jest.setTimeout(20000);
  test('Get Search Context Hits', async () => {
    let request = new AdvancedSearchRequest();
    request.searchCommand = '({LF:Basic ~= "*", option="DFANLT"})';
    var searchResponse = await _RepositoryApiClient.searchesClient.createSearchOperation({ repoId, request });
    searchToken = searchResponse.toJSON().token;
    expect(searchToken).not.toBeNull();
    expect(searchToken).not.toBe('');
    await new Promise((r) => setTimeout(r, 5000));
    var searchResultsResponse = await _RepositoryApiClient.searchesClient.getSearchResults({ repoId, searchToken });
    var searchResults = searchResultsResponse.toJSON().value;
    expect(searchResults).not.toBeNull();
    expect(searchResults.length > 0).toBeTruthy();
    let rowNum = searchResults[0].rowNumber;

    var contextHitResponse = await _RepositoryApiClient.searchesClient.getSearchContextHits({
      repoId,
      searchToken,
      rowNumber: rowNum,
    });
    var contextHits = contextHitResponse.toJSON().value;
    expect(contextHits).not.toBeNull();
  });
  jest.setTimeout(20000);
  test('Get Search Results', async () => {
    let request = new AdvancedSearchRequest();
    request.searchCommand = '({LF:Basic ~= "search text", option="DFANLT"})';
    var searchResponse = await _RepositoryApiClient.searchesClient.createSearchOperation({ repoId, request });
    searchToken = searchResponse.toJSON().token;
    expect(searchToken).not.toBeNull();
    expect(searchToken).not.toBe('');
    await new Promise((r) => setTimeout(r, 10000));
    var searchResultsResponse = await _RepositoryApiClient.searchesClient.getSearchResults({ repoId, searchToken });
    var searchResults = searchResultsResponse.toJSON().value;
    expect(searchResults).not.toBeNull();
  });
  jest.setTimeout(20000);
  test('Get Search Status', async () => {
    let request = new AdvancedSearchRequest();
    request.searchCommand = '({LF:Basic ~= "search text", option="DFANLT"})';
    var searchResponse = await _RepositoryApiClient.searchesClient.createSearchOperation({ repoId, request });
    searchToken = searchResponse.toJSON().token;
    expect(searchToken).not.toBeNull();
    expect(searchToken).not.toBe('');
    await new Promise((r) => setTimeout(r, 5000));
    var searchStatusResponse = await _RepositoryApiClient.searchesClient.getSearchStatus({ repoId, searchToken });
    var searchStatus = searchStatusResponse.toJSON();
    expect(searchStatus).not.toBeNull();
    expect(searchStatus.operationToken).toBe(searchToken);
  });
});
