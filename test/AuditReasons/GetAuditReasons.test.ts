import { repoId } from '../testHelper.js';
import { AuditReasons } from '../../src/index.js';
import { _RepositoryApiClient } from '../setup.js';

describe('Audit Reasons Integration Test', () => {
  test('Get the Audit Reasons', async () => {
    let result: AuditReasons = await _RepositoryApiClient.auditReasonsClient.getAuditReasons({ repoId });
    expect(result).not.toBeNull();
    expect(result.deleteEntry).not.toBeNull();
    expect(result.exportDocument).not.toBeNull();
  });
});