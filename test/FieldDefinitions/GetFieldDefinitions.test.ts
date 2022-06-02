import { testKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { ODataValueContextOfIListOfWFieldInfo, WFieldFormat, WFieldInfo } from '../../src/index';

describe('Field Definitions Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  _RepositoryApiClient = RepositoryApiClient.createFromAccessKey(testServicePrincipalKey, testKey);

  test('Get Field Definitions', async () => {
    let result: ODataValueContextOfIListOfWFieldInfo =
      await _RepositoryApiClient.fieldDefinitionsClient.getFieldDefinitions({ repoId });
    expect(result.value).not.toBeNull();
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
    let response = await await _RepositoryApiClient.fieldDefinitionsClient.getFieldDefinitionById({
      repoId,
      fieldDefinitionId: firstFieldDef.id ?? -1,
    });
    let fieldDef = response;
    expect(fieldDef.id).toBe(firstFieldDef.id);
  });
});
