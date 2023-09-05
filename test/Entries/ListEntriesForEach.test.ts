import { repositoryId } from '../TestHelper.js';
import {
  FieldCollectionResponse,
  EntryCollectionResponse,
  LinkCollectionResponse,
  TagDefinitionCollectionResponse
} from '../../src/index.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';

describe('List Entry Tests', () => {
  let entryId: number = 1;

  test('List Entries ForEach', async () => {
    let maxPageSize = 10;
    let entries = 0;
    let pages = 0;
    const callback = async (response: EntryCollectionResponse) => {
      if (!response.value) {
        throw new Error('response.value is undefined');
      }
      entries += response.value.length;
      pages += 1;
      return true;
    };
    
    await _RepositoryApiClient.entriesClient.listEntriesForEach({ callback, repositoryId, entryId, maxPageSize });
    
    expect(entries).toBeGreaterThan(0);
    expect(pages).toBeGreaterThan(0);
  });

  test('List Fields ForEach', async () => {
    let maxPageSize = 10;
    let entries = 0;
    let pages = 0;
    const callback = async (response: FieldCollectionResponse) => {
      if (!response.value) {
        throw new Error('response.value is undefined');
      }
      entries += response.value.length;
      pages += 1;
      return true;
    };
    
    await _RepositoryApiClient.entriesClient.listFieldsForEach({ callback, repositoryId, entryId, maxPageSize });
    
    expect(entries).toBeGreaterThan(0);
    expect(pages).toBeGreaterThan(0);
  });

  test('List Links ForEach', async () => {
    let maxPageSize = 10;
    let entries = 0;
    let pages = 0;
    const callback = async (response: LinkCollectionResponse) => {
      if (!response.value) {
        throw new Error('response.value is undefined');
      }
      entries += response.value.length;
      pages += 1;
      return true;
    };
    
    await _RepositoryApiClient.entriesClient.listLinksForEach({ callback, repositoryId, entryId, maxPageSize });
    
    expect(entries).toBeGreaterThan(0);
    expect(pages).toBeGreaterThan(0);
  });

  test('List Tags ForEach', async () => {
    let maxPageSize = 10;
    let entries = 0;
    let pages = 0;
    const callback = async (response: TagDefinitionCollectionResponse) => {
      if (!response.value) {
        throw new Error('response.value is undefined');
      }
      entries += response.value.length;
      pages += 1;
      return true;
    };
    
    await _RepositoryApiClient.entriesClient.listTagsForEach({ callback, repositoryId, entryId, maxPageSize });
    
    expect(entries).toBeGreaterThan(0);
    expect(pages).toBeGreaterThan(0);
  });
});
