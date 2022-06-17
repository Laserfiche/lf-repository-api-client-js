import { repoId } from '../testHelper.js';
import { ODataValueOfBoolean, ODataValueOfDateTime, IRepositoryApiClient } from '../../src/index.js';
import { createTestRepoApiClient } from '../BaseTest.js';

describe('Access Token Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  beforeEach(async()=>{
    _RepositoryApiClient = createTestRepoApiClient();
  });
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
