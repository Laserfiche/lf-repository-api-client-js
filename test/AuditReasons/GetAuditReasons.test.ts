import { repoId } from '../testHelper.js';
import { IRepositoryApiClient } from '../../src/ClientBase.js';
import { AuditReasons } from '../../src/index.js';
import { createTestRepoApiClient } from '../BaseTest.js';

describe('Audit Reasons Integration Test', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  _RepositoryApiClient = createTestRepoApiClient();

  test('Get the Audit Reasons', async () => {
    let result: AuditReasons = await _RepositoryApiClient.auditReasonsClient.getAuditReasons({ repoId });
    expect(result).not.toBeNull();
    expect(result.deleteEntry).not.toBeNull();
    expect(result.exportDocument).not.toBeNull();
  });
});
