import { repositoryId } from '../TestHelper.js';
import { AuditReasonCollectionResponse } from '../../src/index.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';

describe('Audit Reasons Integration Test', () => {
  test('Get the Audit Reasons', async () => {
    let result: AuditReasonCollectionResponse = await _RepositoryApiClient.auditReasonsClient.listAuditReasons({ repositoryId: repositoryId });
    
    expect(result).not.toBeNull();
    expect(result.value).not.toBeNull();
  });
});
