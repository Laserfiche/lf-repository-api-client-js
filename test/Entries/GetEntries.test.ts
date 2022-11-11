import { repoId } from '../TestHelper.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';

describe('Get Entries Integration Tests', () => {
  let entryId: number = 1;
  let rootPath: string | null = '\\';
  let nonExistingPath: string | null = '\\Non Existing Path';

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

  test('Get Entry By Full Path Return Root Folder', async () => {
    let result: any = await _RepositoryApiClient.entriesClient.getEntryByPath({
      repoId,
      fullPath: rootPath,
      fallbackToClosestAncestor: false,
    });
    expect(result?.entry.id).toBe(1);
    expect(result?.entry.fullPath).toBe(rootPath);
    expect(result?.entry.entryType).toBe('Folder');
    expect(result?.ancestorEntry).toBeNull;
  });

  test('Get Entry By Full Path Return Ancestor Root Folder', async () => {
    let result: any = await _RepositoryApiClient.entriesClient.getEntryByPath({
      repoId,
      fullPath: nonExistingPath,
      fallbackToClosestAncestor: true,
    });
    expect(result?.ancestorEntry.id).toBe(1);
    expect(result?.ancestorEntry.fullPath).toBe(rootPath);
    expect(result?.ancestorEntry.entryType).toBe('Folder');
    expect(result?.entry).toBeNull;
  });

  // TODO use importDocument instead of hardcode entryId 3 https://github.com/Laserfiche/lf-repository-api-client-js/issues/53
  test('Get Document Content Type Return Content Headers', async () => {
    let result: any = await _RepositoryApiClient.entriesClient.getDocumentContentType({
      repoId,
      entryId: 3,
    });
    expect(result?.status).toBe(200);
    expect(result?.headers['content-type']).toBeDefined();
    expect(result?.headers['content-length']).toBeDefined();
    expect(result?.result).toBeNull();
  });
});
