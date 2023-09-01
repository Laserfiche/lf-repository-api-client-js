import { repositoryId } from '../TestHelper.js';
import {
  CreateEntryRequest,
  CreateEntryRequestEntryType,
  Entry,
  EntryType,
  Shortcut,
  StartDeleteEntryRequest,
} from '../../src/index.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';

describe('Create Entry Tests', () => {
  let createdEntries: Array<Entry> = new Array();

  afterEach(async () => {
    for (let i = 0; i < createdEntries.length; i++) {
      if (createdEntries[i]) {
        let body: StartDeleteEntryRequest = new StartDeleteEntryRequest();
        let num: number = Number(createdEntries[i].id);
        
        await _RepositoryApiClient.entriesClient.startDeleteEntry({ repositoryId: repositoryId, entryId: num, request: body });
      }
    }
    createdEntries = [];
  });

  test('Create Entry Create Folder', async () => {
    let newEntryName: string = 'RepositoryApiClientIntegrationTest JS CreateFolder';
    let parentEntryId: number = 1;
    let request: CreateEntryRequest = new CreateEntryRequest();
    request.entryType = CreateEntryRequestEntryType.Folder;
    request.name = newEntryName;
    request.autoRename = true;
    
    let response: Entry = await _RepositoryApiClient.entriesClient.createEntry({
      repositoryId: repositoryId,
      entryId: parentEntryId,
      request,
    });
    
    let entry: Entry = response;
    
    expect(entry).not.toBeNull();
    
    createdEntries.push(entry);
    
    expect(parentEntryId).toBe(entry.parentId);
    expect(EntryType.Folder).toBe(entry.entryType);
    expect(typeof EntryType).toBe(typeof entry);
  });

  test('Create Entry Create Shortcut', async () => {
    // Create new entry
    let newEntryName: string = 'RepositoryApiClientIntegrationTest JS CreateFolder';
    let parentEntryId: number = 1;
    let request: CreateEntryRequest = new CreateEntryRequest();
    request.entryType = CreateEntryRequestEntryType.Folder;
    request.name = newEntryName;
    request.autoRename = true;
    
    let response: Entry = await _RepositoryApiClient.entriesClient.createEntry({
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
    
    let shortcut: Shortcut = response;
    
    expect(shortcut).not.toBeNull();
    
    createdEntries.push(shortcut);
    
    expect(parentEntryId).toBe(shortcut.parentId);
    expect(EntryType.Shortcut).toBe(shortcut.entryType);
  });
});
