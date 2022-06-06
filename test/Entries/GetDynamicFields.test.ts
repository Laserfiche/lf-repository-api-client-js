import { OauthAccessKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { GetDynamicFieldLogicValueRequest, ODataValueContextOfIListOfWTemplateInfo } from '../../src/index.js';

describe('Dynamic Fields Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  let entryId: number = 1;
  _RepositoryApiClient = RepositoryApiClient.createFromAccessKey(testServicePrincipalKey, OauthAccessKey);
  test('Get Dynamic Fields Entry', async () => {
    let templateDefinitionResponse: ODataValueContextOfIListOfWTemplateInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({ repoId });
    let templateDefinitions = templateDefinitionResponse.value;
    if (!templateDefinitions) {
      throw new Error('templateDefinitions is undefined');
    }
    expect(templateDefinitions).not.toBeNull;
    expect(templateDefinitions?.length).toBeGreaterThan(0);
    let request = new GetDynamicFieldLogicValueRequest();
    request.templateId = templateDefinitions[0].id;
    let dynamicFieldValueResponse = await _RepositoryApiClient.entriesClient.getDynamicFieldValues({
      repoId,
      entryId,
      request,
    });
    expect(dynamicFieldValueResponse).not.toBeNull;
  });
});
