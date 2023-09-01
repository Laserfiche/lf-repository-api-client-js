import { repositoryId, authorizationType } from '../TestHelper.js';
import { Entry, LinkToUpdate, SetLinksRequest, StartDeleteEntryRequest } from '../../src/index.js';
import { CreateEntry } from '../BaseTest.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';

describe('Set Entries Integration Tests', () => {
  let createdEntries: Array<Entry> = new Array();

  afterEach(async () => {
    for (let i = 0; i < createdEntries.length; i++) {
      if (createdEntries[i]) {
        let request = new StartDeleteEntryRequest();
        let entryId = createdEntries[i].id!;
        await _RepositoryApiClient.entriesClient.startDeleteEntry({ repositoryId, entryId, request });
      }
    }
    createdEntries = [];
  });

  test('Set Links', async () => {
    let sourceEntry: Entry = await CreateEntry(
      _RepositoryApiClient,
      'RepositoryApiClientIntegrationTest JS SetLinks Source'
    );
    
    createdEntries.push(sourceEntry);
    var targetEntry = await CreateEntry(_RepositoryApiClient, 'RepositoryApiClientIntegrationTest JS SetLinks Target');
    
    createdEntries.push(targetEntry);
    
    let request = new SetLinksRequest();
    let linkToUpdate = new LinkToUpdate();
    linkToUpdate.linkDefinitionId = 1;
    linkToUpdate.otherEntryId = targetEntry.id;
    request.links = [linkToUpdate];
    
    let result = await _RepositoryApiClient.entriesClient.setLinks({
      repositoryId,
      entryId: sourceEntry.id ?? -1,
      request,
    });

    let links = result.value!;
    
    expect(links).not.toBeNull();
    expect(request.links!.length).toBe(links.length);
    expect(sourceEntry.id).toBe(links[0].sourceId);
    expect(targetEntry.id).toBe(links[0].targetId);
  });
});
