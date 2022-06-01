import { testKey, testServicePrincipalKey, repoId} from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { ODataValueOfBoolean, ODataValueOfDateTime } from '../../src/index.js';

describe('Access Token Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey));
  });
  test('Refresh Server Session', async () => {
    let currentTime: string = new Date().toISOString();
    let refreshResponse: ODataValueOfDateTime = await _RepositoryApiClient.serverSessionClient.refreshServerSession({
      repoId,
    });
    let expireTime = refreshResponse.toJSON().value;
    expect(expireTime).not.toBeNull;
    expect(currentTime < expireTime).toBe(true);
  });
  test('Invalidate Server Session', async () => {
    let invalidateResponse: ODataValueOfBoolean =
      await _RepositoryApiClient.serverSessionClient.invalidateServerSession({ repoId });
      expect(invalidateResponse.value).toBe(true);
    });
});
