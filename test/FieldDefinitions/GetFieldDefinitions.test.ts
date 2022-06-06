import { OAuthAccessKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { ODataValueContextOfIListOfWFieldInfo, WFieldFormat, WFieldInfo } from '../../src/index';

describe('Field Definitions Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  _RepositoryApiClient = RepositoryApiClient.createFromAccessKey(testServicePrincipalKey, OAuthAccessKey);

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
