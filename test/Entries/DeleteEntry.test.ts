import { repoId } from '../testHelper.js';
import { CreateEntry, createTestRepoApiClient } from '../BaseTest.js';
import { DeleteEntryWithAuditReason,IRepositoryApiClient } from '../../src/index.js';

describe.skip('Delete Entries Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  let entryId: number = 1;
  _RepositoryApiClient = createTestRepoApiClient();
  test('Delete Entry', async () => {
    let deleteEntry = await CreateEntry(_RepositoryApiClient, 'APIServerClientIntegrationTest DeleteFolder');
    let body: DeleteEntryWithAuditReason = new DeleteEntryWithAuditReason();
    let result = await _RepositoryApiClient.entriesClient.deleteEntryInfo({
      repoId,
      entryId: deleteEntry.id ?? -1,
      request: body,
    });
    let token: string = result.token ?? '';
    expect(token).not.toBeNull;
    expect(token).not.toBe('');
  });
});
