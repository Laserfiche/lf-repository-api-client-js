import { repoId } from '../testHelper.js';
import { GetDynamicFieldLogicValueRequest, ODataValueContextOfIListOfWTemplateInfo,IRepositoryApiClient } from '../../src/index.js';
import { createTestRepoApiClient } from '../BaseTest.js';

describe('Dynamic Fields Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  let entryId: number = 1;
  beforeEach(async()=>{
    _RepositoryApiClient = createTestRepoApiClient();
  });
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
