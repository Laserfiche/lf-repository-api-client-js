import { testKey, testServicePrincipalKey, repoId, baseUrlDebug } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { ODataValueContextOfIListOfWTagInfo, WTagInfo } from '../../src/index.js';

describe('Tag Definitions Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey), baseUrlDebug);
  });
  test('Get Tag Definitions', async () => {
    let TagDefinitionsResponse: ODataValueContextOfIListOfWTagInfo =
      await _RepositoryApiClient.tagDefinitionsClient.getTagDefinitions({ repoId });
    expect(TagDefinitionsResponse.value).not.toBeNull;
  });
  test('Get Tag Definitions by Id', async () => {
    let allTagDefinitionsResponse: ODataValueContextOfIListOfWTagInfo =
      await _RepositoryApiClient.tagDefinitionsClient.getTagDefinitions({ repoId });
    let firstTagDefinitionsResponse = allTagDefinitionsResponse.toJSON().value[0];
    expect(allTagDefinitionsResponse.value).not.toBeNull;
    let tagDefinition: WTagInfo = await _RepositoryApiClient.tagDefinitionsClient.getTagDefinitionById({
      repoId,
      tagId: firstTagDefinitionsResponse.id,
    });
    expect(tagDefinition).not.toBeNull;
    expect(tagDefinition.id).toBe(firstTagDefinitionsResponse.id);
  });
});
