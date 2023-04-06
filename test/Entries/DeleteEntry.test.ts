import { repositoryId } from '../TestHelper.js';
import { CreateEntry } from '../BaseTest.js';
import { DeleteEntryWithAuditReason } from '../../src/index.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';

describe('Delete Entries Integration Tests', () => {
  test('Delete Entry', async () => {
    let deleteEntry = await CreateEntry(_RepositoryApiClient, 'RepositoryApiClientIntegrationTest JS DeleteFolder');
    let body: DeleteEntryWithAuditReason = new DeleteEntryWithAuditReason();
    let result = await _RepositoryApiClient.entriesClient.deleteEntryInfo({
      repoId: repositoryId,
      entryId: deleteEntry.id ?? -1,
      request: body,
    });
    let token: string = result.token ?? '';
    expect(token).not.toBeNull();
    expect(token).not.toBe('');
    // wait for the delete operation to complete
    await new Promise((r) => setTimeout(r, 5000));
  });
});
