import { OauthAccessKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { ODataValueContextOfListOfAttribute } from '../../src/index.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase';

describe('Get Entry Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  let entryId: number = 1;
  _RepositoryApiClient = RepositoryApiClient.createFromAccessKey(testServicePrincipalKey, OauthAccessKey);

  test('Get Entry Field simple paging', async () => {
    let maxPageSize = 1;
    let prefer = `maxpagesize=${maxPageSize}`;
    let response = await _RepositoryApiClient.entriesClient.getFieldValues({ repoId, entryId, prefer });
    expect(response).not.toBeNull();
    let nextLink = response.toJSON()['@odata.nextLink'];
    expect(nextLink).not.toBeNull();
    expect(response.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 = await _RepositoryApiClient.entriesClient.getFieldValuesNextLink({ nextLink, maxPageSize });
    expect(response2).not.toBeNull();
    expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
  });

  test('Get Entry Links simple paging', async () => {
    let maxPageSize = 1;
    let prefer = `maxpagesize=${maxPageSize}`;
    let response = await _RepositoryApiClient.entriesClient.getLinkValuesFromEntry({ repoId, entryId, prefer });
    expect(response).not.toBeNull();
    let nextLink = response.toJSON()['@odata.nextLink'];
    expect(nextLink).not.toBeNull();
    expect(response.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 = await _RepositoryApiClient.entriesClient.getLinkValuesFromEntryNextLink({ nextLink, maxPageSize });
    expect(response2).not.toBeNull();
    expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
  });

  test('Get Entry Listing simple paging', async () => {
    let maxPageSize = 1;
    let prefer = `maxpagesize=${maxPageSize}`;
    let response = await _RepositoryApiClient.entriesClient.getEntryListing({ repoId, entryId, prefer });
    expect(response).not.toBeNull();
    let nextLink = response.toJSON()['@odata.nextLink'];
    expect(nextLink).not.toBeNull();
    expect(response.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 = await _RepositoryApiClient.entriesClient.getEntryListingNextLink({ nextLink, maxPageSize });
    expect(response2).not.toBeNull();
    expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
  });

  test('Get Entry Tags simple paging', async () => {
    let maxPageSize = 1;
    let prefer = `maxpagesize=${maxPageSize}`;
    let response = await _RepositoryApiClient.entriesClient.getTagsAssignedToEntry({ repoId, entryId, prefer });
    expect(response).not.toBeNull();
    let nextLink = response.toJSON()['@odata.nextLink'];
    expect(nextLink).not.toBeNull();
    expect(response.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 = await _RepositoryApiClient.entriesClient.getTagsAssignedToEntryNextLink({ nextLink, maxPageSize });
    expect(response2).not.toBeNull();
    expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
  });
});
