import { testKey, testServicePrincipalKey, repoId, baseUrlDebug } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import {
  AcceptedOperation,
  DeleteEntryWithAuditReason,
  Entry,
  ODataValueContextOfIListOfWTagInfo,
  OperationStatus,
  ProblemDetails,
  WTagInfo,
} from '../../src/index.js';
import { CreateEntry } from '../BaseTest.js';
import { jest } from '@jest/globals';

describe('Task Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey), baseUrlDebug);
  });
  jest.setTimeout(20000);
  test('Cancel Operation', async () => {
    let deleteEntry: Entry = await CreateEntry(_RepositoryApiClient, 'APIServerClientIntegrationTest CancelOperation');
    let body: DeleteEntryWithAuditReason = new DeleteEntryWithAuditReason();
    let result: AcceptedOperation = await _RepositoryApiClient.entriesClient.deleteEntryInfo({
      repoId,
      entryId: deleteEntry.toJSON().id,
      request: body,
    });
    let token: string = result.toJSON().token;
    expect(token).not.toBeNull;
    expect(token).not.toBe('');
    try {
      await new Promise((r) => setTimeout(r, 5000));
      await _RepositoryApiClient.tasksClient.cancelOperation({ repoId, operationToken: token });
    } catch (err: any) {
      expect(err.title.includes('Cannot cancel ended operation'));
    }
  });
  jest.setTimeout(20000);
  test('Get Operation Status', async () => {
    let deleteEntry: Entry = await CreateEntry(
      _RepositoryApiClient,
      'APIServerClientIntegrationTest GetOperationStatus'
    );
    let body: DeleteEntryWithAuditReason = new DeleteEntryWithAuditReason();
    let result = await _RepositoryApiClient.entriesClient.deleteEntryInfo({
      repoId,
      entryId: deleteEntry.toJSON().id,
      request: body,
    });
    let token: string = result.toJSON().token;
    expect(token).not.toBeNull;
    expect(token).not.toBe('');
    await new Promise((r) => setTimeout(r, 5000));
    let operationProgress = await _RepositoryApiClient.tasksClient.getOperationStatusAndProgress({
      repoId,
      operationToken: token,
    });
    expect(operationProgress).not.toBeNull;
    expect(operationProgress.status).toBe(OperationStatus.Completed);
    expect(operationProgress.percentComplete).toBe(100);
  });
});
