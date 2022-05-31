import { testKey, testServicePrincipalKey, repoId, baseUrlDebug } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { CreateEntry } from '../BaseTest.js';
import { DeleteEntryWithAuditReason } from '../../src/index.js';

describe('Delete Entries Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  let entryId: number = 1;
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey), baseUrlDebug);
  });
  test('Delete Entry', async () => {
    let deleteEntry = await CreateEntry(_RepositoryApiClient, "APIServerClientIntegrationTest DeleteFolder")
    let body: DeleteEntryWithAuditReason = new DeleteEntryWithAuditReason();
    let result = await _RepositoryApiClient.entriesClient.deleteEntryInfo({
      repoId,
      entryId: deleteEntry.toJSON().id,
      request: body,
    });
    let token:string = result.toJSON().token;
    expect(token).not.toBeNull;
    expect(token).not.toBe("");
  });
});