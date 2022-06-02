import { testKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { ODataValueContextOfIListOfWTagInfo, WTagInfo } from '../../src/index.js';

describe('Tag Definitions Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey));
  });
  test('Get Tag Definitions', async () => {
    let TagDefinitionsResponse: ODataValueContextOfIListOfWTagInfo =
      await _RepositoryApiClient.tagDefinitionsClient.getTagDefinitions({ repoId });
    expect(TagDefinitionsResponse.value).not.toBeNull;
  });
  test('Get Tag Definitions by Id', async () => {
    let allTagDefinitionsResponse: ODataValueContextOfIListOfWTagInfo =
      await _RepositoryApiClient.tagDefinitionsClient.getTagDefinitions({ repoId });
    let TagDefinitionsResponse = allTagDefinitionsResponse.value;
    if (!TagDefinitionsResponse) {
      throw new Error('TagDefinitionsResponse is undefined');
    }
    let firstTagDefinitionsResponse = TagDefinitionsResponse[0];
    expect(allTagDefinitionsResponse.value).not.toBeNull;
    let tagDefinition: WTagInfo = await _RepositoryApiClient.tagDefinitionsClient.getTagDefinitionById({
      repoId,
      tagId: firstTagDefinitionsResponse.id ?? -1,
    });
    expect(tagDefinition).not.toBeNull;
    expect(tagDefinition.id).toBe(firstTagDefinitionsResponse.id);
  });
});
