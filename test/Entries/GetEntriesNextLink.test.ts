import { repositoryId } from '../TestHelper.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';

describe('Get Entry Next Links Tests', () => {
  let entryId: number = 1;

  test('Get Entry Field simple paging', async () => {
    let maxPageSize = 1;
    let prefer = `maxpagesize=${maxPageSize}`;
    let response = await _RepositoryApiClient.entriesClient.listFields({ repositoryId, entryId, prefer });
    expect(response).not.toBeNull();
    let nextLink = response.toJSON()['@odata.nextLink'];
    expect(nextLink).not.toBeNull();
    expect(response.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 = await _RepositoryApiClient.entriesClient.listFieldsNextLink({ nextLink, maxPageSize });
    expect(response2).not.toBeNull();
    expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
  });

  test('Get Entry Links simple paging', async () => {
    let maxPageSize = 1;
    let prefer = `maxpagesize=${maxPageSize}`;
    let response = await _RepositoryApiClient.entriesClient.listLinks({ repositoryId, entryId, prefer });
    expect(response).not.toBeNull();
    let nextLink = response.toJSON()['@odata.nextLink'];
    expect(nextLink).not.toBeNull();
    expect(response.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 = await _RepositoryApiClient.entriesClient.listLinksNextLink({ nextLink, maxPageSize });
    expect(response2).not.toBeNull();
    expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
  });

  test('Get Entry Listing simple paging', async () => {
    let maxPageSize = 1;
    let prefer = `maxpagesize=${maxPageSize}`;
    let response = await _RepositoryApiClient.entriesClient.listEntries({ repositoryId, entryId, prefer });
    expect(response).not.toBeNull();
    let nextLink = response.toJSON()['@odata.nextLink'];
    expect(nextLink).not.toBeNull();
    expect(response.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 = await _RepositoryApiClient.entriesClient.listEntriesNextLink({ nextLink, maxPageSize });
    expect(response2).not.toBeNull();
    expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
  });

  test('Get Entry Tags simple paging', async () => {
    let maxPageSize = 1;
    let prefer = `maxpagesize=${maxPageSize}`;
    let response = await _RepositoryApiClient.entriesClient.listTags({ repositoryId, entryId, prefer });
    expect(response).not.toBeNull();
    let nextLink = response.toJSON()['@odata.nextLink'];
    expect(nextLink).not.toBeNull();
    expect(response.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 = await _RepositoryApiClient.entriesClient.listTagsNextLink({ nextLink, maxPageSize });
    expect(response2).not.toBeNull();
    expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
  });
});
