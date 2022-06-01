import { testKey, testServicePrincipalKey, repoId} from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import {
  CopyAsyncRequest,
  DeleteEntryWithAuditReason,
  Entry,
  EntryType,
  OperationProgress,
  OperationStatus,
  PostEntryChildrenEntryType,
  PostEntryChildrenRequest
} from '../../src/index.js';
import { jest } from '@jest/globals';
import { CreateEntry } from '../BaseTest.js';

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
          let body:DeleteEntryWithAuditReason = new DeleteEntryWithAuditReason();
          let num:number = Number(createdEntries[i].id);
          await _RepositoryApiClient.entriesClient.deleteEntryInfo({ repoId, entryId: num, request: body });
          await new Promise((r) => setTimeout(r, 5000));
        }
      }
    });
  
    jest.setTimeout(20000);
    test('Create Copy Entry Copy Entry', async () => {
      // Create a new folder that contains the created entry
      let testFolderName: string = 'CreateCopyEntry_CopyEntry_test_folder';
      let testFolder: Entry = await CreateEntry(_RepositoryApiClient, testFolderName);
  
      // Create new entry
      let newEntryName: string = 'APIServerClientIntegrationTest CreateFolder';
      let request: PostEntryChildrenRequest = new PostEntryChildrenRequest();
      request.entryType = PostEntryChildrenEntryType.Folder;
      request.name = newEntryName;
      var targetEntry: Entry = await _RepositoryApiClient.entriesClient.createOrCopyEntry({
        repoId,
        entryId: testFolder.toJSON().id,
        request,
        autoRename: true,
      });
      expect(targetEntry).not.toBeNull;
      //Assert.IsNotNull(targetEntry);
      createdEntries.push(targetEntry);
      //Assert.AreEqual(testFolder.Id, targetEntry.ParentId);
      expect(targetEntry.parentId).toBe(testFolder.id);
      //Assert.AreEqual(EntryType.Folder, targetEntry.EntryType);
      expect(targetEntry.entryType).toBe(EntryType.Folder);
  
      // Copy entry
      let copyRequest: CopyAsyncRequest = new CopyAsyncRequest();
      copyRequest.name = 'CopiedEntry';
      copyRequest.sourceId = targetEntry.id;
      let copyResult = await _RepositoryApiClient.entriesClient.copyEntry({
        repoId,
        entryId: testFolder.toJSON().id,
        request: copyRequest,
        autoRename: true,
      });
      var opToken = copyResult.toJSON().token;
  
      // Wait for the copy operation to finish
      await new Promise((r) => setTimeout(r, 5000));
      var opResponse: OperationProgress = await _RepositoryApiClient.tasksClient.getOperationStatusAndProgress({
        repoId,
        operationToken: opToken,
      });
      //Assert.AreEqual(OperationStatus.Completed, opResponse.Status);
      expect(opResponse.status).toBe(OperationStatus.Completed);
  
      // Remove the folder that contains the created entry
      let deleteEntryRequest: DeleteEntryWithAuditReason = new DeleteEntryWithAuditReason();
      let deletionResult = await _RepositoryApiClient.entriesClient.deleteEntryInfo({
        repoId,
        entryId: testFolder.toJSON().id,
        request: deleteEntryRequest,
      });
      //Assert.IsTrue(!string.IsNullOrEmpty(deletionResult.Token));
      expect(deletionResult.token).not.toBeNull;
      expect(deletionResult.token).not.toBe('');
    });
  });
  