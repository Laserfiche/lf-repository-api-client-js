import { repositoryId } from '../TestHelper.js';
import {
  CopyEntryRequest,
  CreateEntryRequest,
  CreateEntryRequestEntryType,
  Entry,
  EntryType,
  StartDeleteEntryRequest,
} from '../../src/index.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';

describe('Copy Entry Test', () => {
  let createdEntries: Array<Entry> = new Array();

  afterEach(async () => {
    for (let i = 0; i < createdEntries.length; i++) {
      if (createdEntries[i]) {
        let body: StartDeleteEntryRequest = new StartDeleteEntryRequest();
        let num: number = Number(createdEntries[i].id);
        await _RepositoryApiClient.entriesClient.startDeleteEntry({ repositoryId: repositoryId, entryId: num, request: body });
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
    createdEntries = [];
  });

  test('Copy Entry Copy Shortcut', async () => {
    // Create new entry
    let newEntryName: string = 'RepositoryApiClientIntegrationTest JS CreateFolder';
    let parentEntryId: number = 1;
    let request: CreateEntryRequest = new CreateEntryRequest();
    request.entryType = CreateEntryRequestEntryType.Folder;
    request.name = newEntryName;
    request.autoRename = true;
    
    let response = await _RepositoryApiClient.entriesClient.createEntry({
      repositoryId: repositoryId,
      entryId: parentEntryId,
      request,
    });
    
    let targetEntry: Entry = response;
    
    expect(targetEntry).not.toBeNull();
    
    createdEntries.push(targetEntry);
    
    expect(parentEntryId).toBe(targetEntry.parentId);
    expect(EntryType.Folder).toBe(targetEntry.entryType);

    // Create a shortcut to the new entry
    newEntryName = 'RepositoryApiClientIntegrationTest JS CreateShortcut';
    request = new CreateEntryRequest();
    request.entryType = CreateEntryRequestEntryType.Shortcut;
    request.name = newEntryName;
    request.targetId = targetEntry.id;
    request.autoRename = true;
    
    response = await _RepositoryApiClient.entriesClient.createEntry({
      repositoryId: repositoryId,
      entryId: parentEntryId,
      request,
    });
    
    let shortcut: Entry = response;
    
    expect(shortcut).not.toBeNull();
    
    createdEntries.push(shortcut);
    
    expect(parentEntryId).toBe(shortcut.parentId);
    expect(EntryType.Shortcut).toBe(shortcut.entryType);

    // Copy Entry
    let copyRequest = new CopyEntryRequest();
    copyRequest.name = 'RepositoryApiClientIntegrationTest JS CopiedEntry';
    copyRequest.sourceId = shortcut.id;
    copyRequest.autoRename = true;
    
    let newEntry: Entry = await _RepositoryApiClient.entriesClient.copyEntry({
      repositoryId: repositoryId,
      entryId: parentEntryId,
      request: copyRequest,
    });
    
    createdEntries.push(newEntry);
    
    expect(newEntry.parentId).toBe(parentEntryId);
    expect(newEntry.entryType).toBe(shortcut.entryType);
  });
});
