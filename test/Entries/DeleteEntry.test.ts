import { repoId } from '../testHelper.js';
import { CreateEntry} from '../BaseTest.js';
import { DeleteEntryWithAuditReason } from '../../src/index.js';
import { _RepositoryApiClient } from '../setup.js';

describe('Delete Entries Integration Tests', () => {
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
