import { repoId } from '../TestHelper2.js';
import { AcceptedOperation, DeleteEntryWithAuditReason, Entry, OperationStatus } from '../../src/index.js';
import { CreateEntry } from '../BaseTest2.js';
import { _RepositoryApiClient } from '../CreateSession2.js';
import 'isomorphic-fetch';

describe('Task Integration Tests', () => {
  test('Cancel Operation', async () => {
    let deleteEntry: Entry = await CreateEntry(
      _RepositoryApiClient,
      'RepositoryApiClientIntegrationTest JS CancelOperation'
    );
    let body: DeleteEntryWithAuditReason = new DeleteEntryWithAuditReason();
    let result: AcceptedOperation = await _RepositoryApiClient.entriesClient.deleteEntryInfo({
      repoId,
      entryId: deleteEntry.id ?? -1,
      request: body,
    });
    let token: string | undefined = result.token;
    expect(token).not.toBeNull;
    expect(token).not.toBe('');
    try {
      await new Promise((r) => setTimeout(r, 5000));
      await _RepositoryApiClient.tasksClient.cancelOperation({ repoId, operationToken: token ?? '' });
    } catch (err: any) {
      expect(err.title.includes('Cannot cancel ended operation'));
    }
  });

  test('Get Operation Status', async () => {
    let deleteEntry: Entry = await CreateEntry(
      _RepositoryApiClient,
      'RepositoryApiClientIntegrationTest JS GetOperationStatus'
    );
    let body: DeleteEntryWithAuditReason = new DeleteEntryWithAuditReason();
    let result = await _RepositoryApiClient.entriesClient.deleteEntryInfo({
      repoId,
      entryId: deleteEntry.id ?? -1,
      request: body,
    });
    let token: string | undefined = result.token;
    expect(token).not.toBeNull;
    expect(token).not.toBe('');
    await new Promise((r) => setTimeout(r, 5000));
    let operationProgress = await _RepositoryApiClient.tasksClient.getOperationStatusAndProgress({
      repoId,
      operationToken: token ?? '',
    });
    expect(operationProgress).not.toBeNull;
    expect(operationProgress.status).toBe(OperationStatus.Completed);
    expect(operationProgress.percentComplete).toBe(100);
  });
});
