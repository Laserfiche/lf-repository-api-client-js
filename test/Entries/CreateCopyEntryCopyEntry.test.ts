import { repoId } from '../TestHelper2.js';
import {
  CopyAsyncRequest,
  DeleteEntryWithAuditReason,
  Entry,
  EntryType,
  OperationProgress,
  OperationStatus,
  PostEntryChildrenEntryType,
  PostEntryChildrenRequest,
} from '../../src/index.js';
import { CreateEntry } from '../BaseTest.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';

describe('Create Copy Entry Test', () => {
  let createdEntries: Array<Entry> = new Array();

  afterEach(async () => {
    for (let i = 0; i < createdEntries.length; i++) {
      if (createdEntries[i]) {
        let body: DeleteEntryWithAuditReason = new DeleteEntryWithAuditReason();
        let num: number = Number(createdEntries[i].id);
        await _RepositoryApiClient.entriesClient.deleteEntryInfo({ repoId, entryId: num, request: body });
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
    createdEntries = [];
  });

  test('Create Copy Entry Copy Entry', async () => {
    // Create a new folder that contains the created entry
    let testFolderName: string = 'RepositoryApiClientIntegrationTest JS CreateCopyEntry_CopyEntry_test_folder';
    let testFolder: Entry = await CreateEntry(_RepositoryApiClient, testFolderName);

    // Create new entry
    let newEntryName: string = 'RepositoryApiClientIntegrationTest JS CreateFolder';
    let request: PostEntryChildrenRequest = new PostEntryChildrenRequest();
    request.entryType = PostEntryChildrenEntryType.Folder;
    request.name = newEntryName;
    var targetEntry: Entry = await _RepositoryApiClient.entriesClient.createOrCopyEntry({
      repoId,
      entryId: testFolder.id ?? -1,
      request,
      autoRename: true,
    });
    expect(targetEntry).not.toBeNull;
    createdEntries.push(targetEntry);
    expect(targetEntry.parentId).toBe(testFolder.id);
    expect(targetEntry.entryType).toBe(EntryType.Folder);

    // Copy entry
    let copyRequest: CopyAsyncRequest = new CopyAsyncRequest();
    copyRequest.name = 'RepositoryApiClientIntegrationTest JS CopiedEntry';
    copyRequest.sourceId = targetEntry.id;
    let copyResult = await _RepositoryApiClient.entriesClient.copyEntry({
      repoId,
      entryId: testFolder.id ?? -1,
      request: copyRequest,
      autoRename: true,
    });
    let opToken = copyResult.token ?? '';

    // Wait for the copy operation to finish
    await new Promise((r) => setTimeout(r, 5000));
    let opResponse: OperationProgress = await _RepositoryApiClient.tasksClient.getOperationStatusAndProgress({
      repoId,
      operationToken: opToken,
    });
    expect(opResponse.status).toBe(OperationStatus.Completed);

    // Remove the folder that contains the created entry
    let deleteEntryRequest: DeleteEntryWithAuditReason = new DeleteEntryWithAuditReason();
    let deletionResult = await _RepositoryApiClient.entriesClient.deleteEntryInfo({
      repoId,
      entryId: testFolder.id ?? -1,
      request: deleteEntryRequest,
    });
    expect(deletionResult.token).not.toBeNull;
    expect(deletionResult.token).not.toBe('');
  });
});
