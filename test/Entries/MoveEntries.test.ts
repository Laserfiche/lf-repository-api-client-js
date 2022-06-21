import { repoId } from '../testHelper.js';
import { DeleteEntryWithAuditReason, Entry, PatchEntryRequest } from '../../src/index.js';
import { CreateEntry } from '../BaseTest.js';
import { _RepositoryApiClient } from '../createSession.js';

describe('Move Entries Integration Tests', () => {
  let createdEntries: Array<Entry> = new Array();
  afterEach(async () => {
    for (let i = 0; i < createdEntries.length; i++) {
      if (createdEntries[i] != null) {
        let body = new DeleteEntryWithAuditReason();
        let num = Number(createdEntries[i].id);
        await _RepositoryApiClient.entriesClient.deleteEntryInfo({ repoId, entryId: num, request: body });
      }
    }
  });

  test('Move and Rename Entry', async () => {
    let parentFolder: Entry = await CreateEntry(_RepositoryApiClient, 'APIServerClientIntegrationTest ParentFolder');
    createdEntries.push(parentFolder);
    let childFolder: Entry = await CreateEntry(_RepositoryApiClient, 'APIServerClientIntegrationTest ChildFolder');
    createdEntries.push(childFolder);

    let request = new PatchEntryRequest();
    request.parentId = parentFolder.id;
    request.name = 'APIServerClientIntegrationTest MovedFolder';

    let movedEntry: Entry = await _RepositoryApiClient.entriesClient.moveOrRenameDocument({
      repoId,
      entryId: childFolder.id ?? -1,
      request,
      autoRename: true,
    });
    expect(movedEntry).not.toBeNull;
    expect(movedEntry.id).toBe(childFolder.id);
    expect(movedEntry.parentId).toBe(parentFolder.id);
    expect(movedEntry.name).toBe(request.name);
  });
});
