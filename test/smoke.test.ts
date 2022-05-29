import { testKey, testServicePrincipalKey, repoId,baseUrlDebug } from './testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient} from '../src/ClientBase.js';
//import { ODataValueContextOfIListOfEntry, RepositoryApiClient, IRepositoryApiClient }  from '../src/index.js';

describe('Repository API Client Smoke Test', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  test('Get Root Folder Children', async () => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey),baseUrlDebug);
    let result:any = await _RepositoryApiClient.entriesClient.getEntryListing({
      repoId,
      entryId: 1
    });
    expect(result?.value?.length).toBeGreaterThan(1);
  });
});
