import { repositoryId } from '../TestHelper.js';
import {
  CreateEntryRequest,
  CreateEntryRequestEntryType,
  Entry,
  EntryType,
  StartCopyEntryRequest,
  StartDeleteEntryRequest,
  TaskCollectionResponse,
  TaskStatus,
} from '../../src/index.js';
import { CreateEntry } from '../BaseTest.js';
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
      }
    }
    createdEntries = [];
  });

  test('Copy Entry Copy Entry', async () => {
    // Create a new folder that contains the created entry
    let testFolderName: string = 'RepositoryApiClientIntegrationTest JS CreateCopyEntry_CopyEntry_test_folder';
    let testFolder: Entry = await CreateEntry(_RepositoryApiClient, testFolderName);

    // Create new entry
    let newEntryName: string = 'RepositoryApiClientIntegrationTest JS CreateFolder';
    let request: CreateEntryRequest = new CreateEntryRequest();
    request.name = newEntryName;
    request.autoRename = true;
    request.entryType = CreateEntryRequestEntryType.Folder;
    var targetEntry: Entry = await _RepositoryApiClient.entriesClient.createEntry({
      repositoryId: repositoryId,
      entryId: testFolder.id ?? -1,
      request,
    });
    expect(targetEntry).not.toBeNull();
    createdEntries.push(targetEntry);
    expect(targetEntry.parentId).toBe(testFolder.id);
    expect(targetEntry.entryType).toBe(EntryType.Folder);

    // Copy entry
    let copyRequest: StartCopyEntryRequest = new StartCopyEntryRequest();
    copyRequest.name = 'RepositoryApiClientIntegrationTest JS CopiedEntry';
    copyRequest.sourceId = targetEntry.id!;
    copyRequest.autoRename = true;
    let copyResult = await _RepositoryApiClient.entriesClient.startCopyEntry({
      repositoryId: repositoryId,
      entryId: testFolder.id ?? -1,
      request: copyRequest,
    });

    expect(copyResult).not.toBeNull();

    let taskId = copyResult.taskId ?? '';

    // Wait for the copy operation to finish
    await new Promise((r) => setTimeout(r, 5000));
    let opResponse: TaskCollectionResponse = await _RepositoryApiClient.tasksClient.listTasks({
      repositoryId: repositoryId,
      taskIds: [taskId],
    });

    expect(opResponse.value).not.toBeNull();
    expect(opResponse.value!.length > 0);

    let taskProgress = opResponse.value![0];
    expect(taskProgress.status).toBe(TaskStatus.Completed);
    
    // Remove the folder that contains the created entry
    let deleteEntryRequest: StartDeleteEntryRequest = new StartDeleteEntryRequest();
    let deletionResult = await _RepositoryApiClient.entriesClient.startDeleteEntry({
      repositoryId: repositoryId,
      entryId: testFolder.id ?? -1,
      request: deleteEntryRequest,
    });
    expect(deletionResult).not.toBeNull();
  });
});
