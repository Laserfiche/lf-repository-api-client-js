import { OauthAccessKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { ODataValueContextOfIListOfWTagInfo, WTagInfo } from '../../src/index.js';

describe('Tag Definitions Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  _RepositoryApiClient = RepositoryApiClient.createFromAccessKey(testServicePrincipalKey, OauthAccessKey);
  test('Get Tag Definitions', async () => {
    let TagDefinitionsResponse: ODataValueContextOfIListOfWTagInfo =
      await _RepositoryApiClient.tagDefinitionsClient.getTagDefinitions({ repoId });
    expect(TagDefinitionsResponse.value).not.toBeNull;
  });
  test('Get Tag Definitions Simple Paging', async () => {
    let maxPageSize = 1;
    let prefer = `maxpagesize=${maxPageSize}`;
    let response = await _RepositoryApiClient.tagDefinitionsClient.getTagDefinitions({ repoId, prefer });
    if (!response.value) {
      throw new Error('response.value is undefined');
    }
    expect(response).not.toBeNull();
    let nextLink = response.odataNextLink ?? '';
    expect(nextLink).not.toBeNull();
    expect(response.value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 = await _RepositoryApiClient.tagDefinitionsClient.getTagDefinitionsNextLink({
      nextLink,
      maxPageSize,
    });
    if (!response2.value) {
      throw new Error('response.value is undefined');
    }
    expect(response2).not.toBeNull();
    expect(response2.value.length).toBeLessThanOrEqual(maxPageSize);
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
