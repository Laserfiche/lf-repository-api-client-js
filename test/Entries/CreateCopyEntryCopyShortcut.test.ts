import { testKey, testServicePrincipalKey, repoId} from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import {
  DeleteEntryWithAuditReason,
  Entry,
  EntryType,
  PostEntryChildrenEntryType,
  PostEntryChildrenRequest,
} from '../../src/index.js';
import { jest } from '@jest/globals';

describe('Create Copy Entry Test', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  let createdEntries: Array<Entry> = new Array();
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey));
  });

  jest.setTimeout(200000);
  afterEach(async () => {
    for (let i = 0; i < createdEntries.length; i++) {
      if (createdEntries[i] != null) {
        let body: DeleteEntryWithAuditReason = new DeleteEntryWithAuditReason();
        let num: number = Number(createdEntries[i].id);
        await _RepositoryApiClient.entriesClient.deleteEntryInfo({ repoId, entryId: num, request: body });
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  });
  test('Create Copy Entry Copy Shortcut', async () => {
    //Create new entry
    let newEntryName: string = 'APIServerClientIntegrationTest CreateFolder';
    let parentEntryId: number = 1;
    let request: PostEntryChildrenRequest = new PostEntryChildrenRequest();
    request.entryType = PostEntryChildrenEntryType.Folder;
    request.name = newEntryName;
    let response = await _RepositoryApiClient.entriesClient.createOrCopyEntry({
      repoId,
      entryId: parentEntryId,
      request,
      autoRename: true,
    });
    let targetentry = response.toJSON();
    expect(targetentry).not.toBeNull();
    createdEntries.push(targetentry);
    expect(parentEntryId).toBe(targetentry.parentId);
    expect(EntryType.Folder).toBe(targetentry.entryType);

    //create a shortcut to the new entry
    newEntryName = 'APIServerClientIntegrationTest CreateShortcut';
    request = new PostEntryChildrenRequest();
    request.entryType = PostEntryChildrenEntryType.Shortcut;
    request.name = newEntryName;
    request.targetId = targetentry.id;
    response = await _RepositoryApiClient.entriesClient.createOrCopyEntry({
      repoId,
      entryId: parentEntryId,
      request,
      autoRename: true,
    });
    let shortcut: Entry = response;
    expect(shortcut).not.toBeNull();
    createdEntries.push(shortcut);
    expect(parentEntryId).toBe(shortcut.parentId);
    expect(EntryType.Shortcut).toBe(shortcut.entryType);

    //Copy Entry
    request = new PostEntryChildrenRequest();
    request.name = 'CopiedEntry';
    request.sourceId = shortcut.id;
    let newEntry: Entry = await _RepositoryApiClient.entriesClient.createOrCopyEntry({
      repoId,
      entryId: parentEntryId,
      request,
      autoRename: true,
    });
    createdEntries.push(newEntry);
    expect(newEntry.parentId).toBe(parentEntryId);
    expect(newEntry.entryType).toBe(shortcut.entryType);
  });
});
