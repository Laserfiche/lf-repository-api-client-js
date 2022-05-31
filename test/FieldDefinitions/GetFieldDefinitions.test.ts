import { testKey, testServicePrincipalKey, repoId, baseUrlDebug } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { ODataValueContextOfIListOfWFieldInfo } from '../../src/index';

describe('Field Defintions Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey), baseUrlDebug);
  });

  test('Get Field Definitions', async () => {
    let result: ODataValueContextOfIListOfWFieldInfo =
      await _RepositoryApiClient.fieldDefinitionsClient.getFieldDefinitions({ repoId });
    expect(result.value).not.toBeNull();
  });

  test('Get Field Definitions by Id', async () => {
    let FieldDefResponse: ODataValueContextOfIListOfWFieldInfo =
      await _RepositoryApiClient.fieldDefinitionsClient.getFieldDefinitions({ repoId });
    let firstFieldDef = FieldDefResponse.toJSON().value[0];
    expect(firstFieldDef).not.toBeNull();
    let response = await await _RepositoryApiClient.fieldDefinitionsClient.getFieldDefinitionById({
      repoId,
      fieldDefinitionId: firstFieldDef.id,
    });
    let fieldDef = response.toJSON();
    expect(fieldDef.id).toBe(firstFieldDef.id);
  });
});
