import { testKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';

describe('Get Entries Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  let entryId: number = 1;
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey));
  });
  test('Get Entry Fields', async () => {
    let entryFieldResponse = await _RepositoryApiClient.entriesClient.getFieldValues({ repoId, entryId });
    expect(entryFieldResponse?.value).not.toBeNull;
  });

  test('Get Entry Listing', async () => {
    let result: any = await _RepositoryApiClient.entriesClient.getEntryListing({
      repoId,
      entryId,
    });
    expect(result?.value?.length).toBeGreaterThan(1);
  });

  test('Get Entry Links', async () => {
    let result: any = await _RepositoryApiClient.entriesClient.getLinkValuesFromEntry({ repoId, entryId });
    expect(result?.value).not.toBeNull;
  });

  test('Get Entry Tags', async () => {
    let result: any = await _RepositoryApiClient.entriesClient.getTagsAssignedToEntry({ repoId, entryId });
    expect(result?.value).not.toBeNull;
  });

  test('Get Entry Return Root Folder', async () => {
    let result: any = await _RepositoryApiClient.entriesClient.getEntry({ repoId, entryId });
    expect(result?.value).not.toBeNull;
  });
});
