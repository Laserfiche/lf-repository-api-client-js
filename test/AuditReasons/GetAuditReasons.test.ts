import { testKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { AuditReasons } from '../../src/index';

describe('Audit Reasons Integration Test', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.createFromAccessKey(testServicePrincipalKey, JSON.stringify(testKey));
  });

  test('Get the Audit Reasons', async () => {
    let result: AuditReasons = await _RepositoryApiClient.auditReasonsClient.getAuditReasons({ repoId });
    expect(result).not.toBeNull();
    expect(result.deleteEntry).not.toBeNull();
    expect(result.exportDocument).not.toBeNull();
  });
});
