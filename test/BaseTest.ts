import { Entry, PostEntryChildrenRequest, EntryType, WFieldInfo, PostEntryChildrenEntryType } from '../src';
import { OAuthAccessKey, repoId, testServicePrincipalKey, testHeader } from './TestHelper.js';
import { IRepositoryApiClient, RepositoryApiClient } from '../src/index.js';

export async function CreateEntry(
  client: IRepositoryApiClient,
  entryName: string | undefined,
  parentEntryId: number = 1,
  autoRename: boolean = true
): Promise<Entry> {
  var request = new PostEntryChildrenRequest();
  request.entryType = PostEntryChildrenEntryType.Folder;
  request.name = entryName;
  var newEntry = await client.entriesClient.createOrCopyEntry({ repoId, entryId: parentEntryId, request, autoRename });
  expect(newEntry).not.toBeNull();
  expect(newEntry.parentId).toBe(parentEntryId);
  expect(newEntry.entryType).toBe(EntryType.Folder);
  return newEntry;
}

export async function allFalse(arr: WFieldInfo[]): Promise<boolean> {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].isRequired) {
      return false;
    }
  }
  return true;
}
let _RepositoryApiClient: IRepositoryApiClient | undefined;
export function createTestRepoApiClient(): IRepositoryApiClient {
  _RepositoryApiClient = RepositoryApiClient.createFromAccessKey(testServicePrincipalKey, OAuthAccessKey);
  let defaultRequestHeaders: Record<string, string> = { 'X-LF-AppID': 'RepositoryApiClientIntegrationTest JS' };
  if (testHeader) {
    defaultRequestHeaders[testHeader] = 'true';
  }
  _RepositoryApiClient.defaultRequestHeaders = defaultRequestHeaders;
  return _RepositoryApiClient;
}
