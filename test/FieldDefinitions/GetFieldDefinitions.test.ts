import { repoId } from '../testHelper.js';
import { ODataValueContextOfIListOfWFieldInfo, IRepositoryApiClient, WFieldInfo } from '../../src/index.js';
import { createTestRepoApiClient } from '../BaseTest.js';

describe('Field Definitions Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  beforeEach(async()=>{
    _RepositoryApiClient = createTestRepoApiClient();
  });

  test('Get Field Definitions', async () => {
    let result: ODataValueContextOfIListOfWFieldInfo =
      await _RepositoryApiClient.fieldDefinitionsClient.getFieldDefinitions({ repoId });
    expect(result.value).not.toBeNull();
  });

  test('Get Field Definitions simple paging', async () => {
    let maxPageSize = 1;
    let prefer = `maxpagesize=${maxPageSize}`;
    let response = await _RepositoryApiClient.fieldDefinitionsClient.getFieldDefinitions({ repoId, prefer });
    if (!response.value) {
      throw new Error('response.value is undefined');
    }
    expect(response).not.toBeNull();
    let nextLink: string = response.odataNextLink ?? '';
    expect(nextLink).not.toBeNull();
    expect(response.value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 = await _RepositoryApiClient.fieldDefinitionsClient.getFieldDefinitionsNextLink({
      nextLink,
      maxPageSize,
    });
    if (!response2.value) {
      throw new Error('response2.value is undefined');
    }
    expect(response2).not.toBeNull();
    expect(response2.value.length).toBeLessThanOrEqual(maxPageSize);
  });

  test('Get Field Definitions for each paging', async () => {
    let maxPageSize = 10;
    let entries = 0;
    let pages = 0;
    const callback = async (response: ODataValueContextOfIListOfWFieldInfo) => {
      if (!response.value) {
        throw new Error('response.value is undefined');
      }
      entries += response.value.length;
      pages += 1;
      return true;
    };
    await _RepositoryApiClient.fieldDefinitionsClient.GetFieldDefinitionsForEach({ callback, repoId, maxPageSize });
    expect(entries).toBeGreaterThan(0);
    expect(pages).toBeGreaterThan(0);
  });

  test('Get Field Definitions by Id', async () => {
    let FieldDefResponse: ODataValueContextOfIListOfWFieldInfo =
      await _RepositoryApiClient.fieldDefinitionsClient.getFieldDefinitions({ repoId });
    if (!FieldDefResponse.value) {
      throw new Error('FieldDefResponse.value is undefined');
    }
    let firstFieldDef: WFieldInfo = FieldDefResponse.value[0];
    if (!firstFieldDef) {
      throw new Error('firstFieldDef is undefined');
    }
    expect(firstFieldDef).not.toBeNull();
    let response = await _RepositoryApiClient.fieldDefinitionsClient.getFieldDefinitionById({
      repoId,
      fieldDefinitionId: firstFieldDef.id ?? -1,
    });
    let fieldDef = response;
    expect(fieldDef.id).toBe(firstFieldDef.id);
  });
});
