import { repositoryId } from '../TestHelper.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';

describe('Get Entries Integration Tests', () => {
  let entryId: number = 1;
  let rootPath: string = '\\';
  let nonExistingPath: string = '\\Non Existing Path';

  test('Get Entry Fields', async () => {
    let entryFieldResponse = await _RepositoryApiClient.entriesClient.listFields({ repositoryId, entryId });
    
    expect(entryFieldResponse?.value).not.toBeNull();
  });
  test('Get Entry Listing', async () => {
    let result: any = await _RepositoryApiClient.entriesClient.listEntries({
      repositoryId,
      entryId,
    });
    
    expect(result?.value?.length).toBeGreaterThan(1);
  });

  test('Get Entry Links', async () => {
    let result: any = await _RepositoryApiClient.entriesClient.listLinks({ repositoryId, entryId });
    
    expect(result?.value).not.toBeNull();
  });

  test('Get Entry Tags', async () => {
    let result: any = await _RepositoryApiClient.entriesClient.listTags({ repositoryId, entryId });
    
    expect(result?.value).not.toBeNull();
  });

  test('Get Entry Return Root Folder', async () => {
    let result: any = await _RepositoryApiClient.entriesClient.getEntry({ repositoryId, entryId });
    
    expect(result?.value).not.toBeNull();
  });

  test('Get Entry By Full Path Return Root Folder', async () => {
    let result: any = await _RepositoryApiClient.entriesClient.getEntryByPath({
      repositoryId,
      fullPath: rootPath,
      fallbackToClosestAncestor: false,
    });
    
    expect(result?.entry.id).toBe(1);
    expect(result?.entry.fullPath).toBe(rootPath);
    expect(result?.entry.entryType).toBe('Folder');
    expect(result?.ancestorEntry).toBeUndefined();
  });

  test('Get Entry By Full Path Return Ancestor Root Folder', async () => {
    let result: any = await _RepositoryApiClient.entriesClient.getEntryByPath({
      repositoryId,
      fullPath: nonExistingPath,
      fallbackToClosestAncestor: true,
    });
    
    expect(result?.ancestorEntry.id).toBe(1);
    expect(result?.ancestorEntry.fullPath).toBe(rootPath);
    expect(result?.ancestorEntry.entryType).toBe('Folder');
    expect(result?.entry).toBeUndefined();
  });

  test('Get Entry Throw Exception', async () => {
    try {
      await _RepositoryApiClient.entriesClient.listEntries({
        repositoryId: "fakeRepo",
        entryId,
      });
    } catch (e: any) {
      expect(e.problemDetails.title).toBeDefined();
      expect(e.problemDetails.title).toEqual(e.message);
      expect(e.problemDetails.status).toBe(404);
      expect(e.status).toBe(404);
      expect(e.problemDetails.operationId).toBeDefined();
      expect(e.problemDetails.type).toBeDefined();
      expect(e.problemDetails.instance).toBeDefined();
      expect(e.problemDetails.errorSource).toBeDefined();
      expect(e.problemDetails.traceId).toBeDefined();
      expect(e.problemDetails.extensions).toBeUndefined();
    }
  })
});