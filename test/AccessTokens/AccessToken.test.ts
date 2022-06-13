import "isomorphic-fetch";
import { oauthAccessKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { ODataValueOfBoolean, ODataValueOfDateTime } from '../../src/index.js';

describe('Access Token Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  _RepositoryApiClient = RepositoryApiClient.createFromAccessKey(testServicePrincipalKey, oauthAccessKey);
  test('Refresh Server Session', async () => {
    let currentTime: string = new Date().toISOString();
    let refreshResponse: ODataValueOfDateTime = await _RepositoryApiClient.serverSessionClient.refreshServerSession({
      repoId,
    });
    let expireTime: Date | undefined = refreshResponse.value;
    let expireTimeInStr = expireTime?.toString() ?? '';
    expect(expireTime).not.toBeNull;
    expect(currentTime < expireTimeInStr).toBe(true);
  });
  test('Invalidate Server Session', async () => {
    let invalidateResponse: ODataValueOfBoolean =
      await _RepositoryApiClient.serverSessionClient.invalidateServerSession({ repoId });
    expect(invalidateResponse.value).toBe(true);
  });
});
