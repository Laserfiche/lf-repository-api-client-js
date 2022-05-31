import { testKey, testServicePrincipalKey, repoId, baseUrlDebug } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import {
  DeleteEntryWithAuditReason,
  Entry,
  EntryType,
  PostEntryChildrenEntryType,
  PostEntryChildrenRequest,
  Shortcut,
} from '../../src/index.js';
import { jest } from '@jest/globals';

describe('Create Copy Entry Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  let createdEntries: Array<Entry> = new Array();
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey), baseUrlDebug);
  });

  jest.setTimeout(200000);
  afterEach(async () => {
    for (let i = 0; i < createdEntries.length; i++) {
      if (createdEntries[i] != null) {
        let body:DeleteEntryWithAuditReason = new DeleteEntryWithAuditReason();
        let num:number = Number(createdEntries[i].id);
        await _RepositoryApiClient.entriesClient.deleteEntryInfo({ repoId, entryId: num, request: body });
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  });

  test('Create Copy Entry Create Folder', async () => {
    let newEntryName: string = 'APIServerClientIntegrationTest CreateFolder';
    let parentEntryId: number = 1;
    let request: PostEntryChildrenRequest = new PostEntryChildrenRequest();
    request.entryType = PostEntryChildrenEntryType.Folder;
    request.name = newEntryName;
    let response: Entry = await _RepositoryApiClient.entriesClient.createOrCopyEntry({
      repoId,
      entryId: parentEntryId,
      request,
      autoRename: true,
    });
    let entry = response.toJSON();
    expect(entry).not.toBeNull();
    createdEntries.push(entry);
    expect(parentEntryId).toBe(entry.parentId);
    expect(EntryType.Folder).toBe(entry.entryType);
    expect(typeof EntryType).toBe(typeof entry);
  });

  test('Create Copy Entry Create Shortcut', async () => {
    //Create new entry
    let newEntryName: string = 'APIServerClientIntegrationTest CreateFolder';
    let parentEntryId: number = 1;
    let request: PostEntryChildrenRequest = new PostEntryChildrenRequest();
    request.entryType = PostEntryChildrenEntryType.Folder;
    request.name = newEntryName;
    let response: Entry = await _RepositoryApiClient.entriesClient.createOrCopyEntry({
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
    let shortcut: Shortcut = response.toJSON();
    expect(shortcut).not.toBeNull();
    createdEntries.push(shortcut);
    expect(parentEntryId).toBe(shortcut.parentId);
    expect(EntryType.Shortcut).toBe(shortcut.entryType);
  });
});
