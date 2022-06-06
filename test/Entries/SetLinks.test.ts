import { OauthAccessKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { DeleteEntryWithAuditReason, Entry, PutLinksRequest, WEntryLinkInfo } from '../../src/index.js';
import { CreateEntry } from '../BaseTest';
import { jest } from '@jest/globals';

describe('Set Entries Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  let createdEntries: Array<Entry> = new Array();
  _RepositoryApiClient = RepositoryApiClient.createFromAccessKey(testServicePrincipalKey, OauthAccessKey);
  jest.setTimeout(200000);
  afterEach(async () => {
    for (let i = 0; i < createdEntries.length; i++) {
      if (createdEntries[i] != null) {
        let body: DeleteEntryWithAuditReason = new DeleteEntryWithAuditReason();
        let num: number = Number(createdEntries[i].id);
        await _RepositoryApiClient.entriesClient.deleteEntryInfo({ repoId, entryId: num, request: body });
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  });
  test('Set Links', async () => {
    let sourceEntry: Entry = await CreateEntry(_RepositoryApiClient, 'APIServerClientIntegrationTest SetLinks Source');
    createdEntries.push(sourceEntry);
    var targetEntry = await CreateEntry(_RepositoryApiClient, 'APIServerClientIntegrationTest SetLinks Target');
    createdEntries.push(targetEntry);
    let putLinks = new PutLinksRequest();
    putLinks.targetId = targetEntry.id;
    putLinks.linkTypeId = 1;
    let request = new Array<Entry>(putLinks);
    let result = await _RepositoryApiClient.entriesClient.assignEntryLinks({
      repoId,
      entryId: sourceEntry.id ?? -1,
      linksToAdd: request,
    });

    let links: WEntryLinkInfo[] | undefined = result.value;
    if (!links) {
      throw new Error('links is undefined');
    }
    expect(links).not.toBeNull;
    expect(request.length).toBe(links.length);
    expect(sourceEntry.id).toBe(links[0].sourceId);
    expect(targetEntry.id).toBe(links[0].targetId);
  });
});
