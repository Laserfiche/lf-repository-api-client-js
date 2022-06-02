import { testKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { CreateEntry } from '../BaseTest.js';
import { DeleteEntryWithAuditReason } from '../../src/index.js';

describe('Delete Entries Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  let entryId: number = 1;
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey));
  });
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
