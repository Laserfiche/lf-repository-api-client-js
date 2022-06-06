import { OauthAccessKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import {
  ODataValueContextOfIListOfTemplateFieldInfo,
  ODataValueContextOfIListOfWTemplateInfo,
  WTemplateInfo,
} from '../../src/index.js';

describe('Template Definitions Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  _RepositoryApiClient = RepositoryApiClient.createFromAccessKey(testServicePrincipalKey, OauthAccessKey);
  test('Get Template Definition', async () => {
    let templateDefinitionResponse: ODataValueContextOfIListOfWTemplateInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({ repoId });
    if (!templateDefinitionResponse.value) {
      throw new Error('templateDefinitionResponse.value');
    }
    let firstTemplateDefinition = templateDefinitionResponse.value[0];
    expect(firstTemplateDefinition).not.toBeNull;
    let result: ODataValueContextOfIListOfWTemplateInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({
        repoId,
        templateName: firstTemplateDefinition.name,
      });
    if (!result.value) {
      throw new Error('result.value is undefined');
    }
    let templateInfo: WTemplateInfo = result.value[0];
    expect(result).not.toBeNull;
    expect(result.value.length).toBe(1);
    expect(templateInfo.id).toBe(firstTemplateDefinition.id);
  });
  test('Get Template Definition Fields', async () => {
    let templateDefinitionResponse: ODataValueContextOfIListOfWTemplateInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({ repoId });
    if (!templateDefinitionResponse.value) {
      throw new Error('templateDefinitionResponse.value');
    }
    let firstTemplateDefinition = templateDefinitionResponse.value[0];
    expect(firstTemplateDefinition).not.toBeNull;
    let result: ODataValueContextOfIListOfTemplateFieldInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateFieldDefinitions({
        repoId,
        templateId: firstTemplateDefinition.id ?? -1,
      });
    let templateDefinitions = result.value;
    expect(templateDefinitions).not.toBeNull;
    expect(templateDefinitions?.length).toBe(firstTemplateDefinition.fieldCount);
  });

  test('Get Template Definition Fields Simple Paging', async () => {
    let maxPageSize = 1;
    let prefer = `maxpagesize=${maxPageSize}`;
    let response = await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({ repoId, prefer });
    if (!response.value) {
      throw new Error('response.value is undefined');
    }
    expect(response).not.toBeNull();
    let nextLink = response.odataNextLink ?? '';
    expect(nextLink).not.toBeNull();
    expect(response.value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 = await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitionsNextLink({
      nextLink,
      maxPageSize,
    });
    if (!response2.value) {
      throw new Error('response.value is undefined');
    }
    expect(response2).not.toBeNull();
    expect(response2.value.length).toBeLessThanOrEqual(maxPageSize);
  });

  test('Get Template Definition Fields by Template Name', async () => {
    let templateDefinitionResponse: ODataValueContextOfIListOfWTemplateInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({ repoId });
    if (!templateDefinitionResponse.value) {
      throw new Error('templateDefinitionResponse.value');
    }
    let firstTemplateDefinition = templateDefinitionResponse.value[0];
    expect(firstTemplateDefinition).not.toBeNull;
    let result: ODataValueContextOfIListOfTemplateFieldInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateFieldDefinitionsByTemplateName({
        repoId,
        templateName: firstTemplateDefinition.name ?? '',
      });
    let templateDefinitions = result.value;
    expect(templateDefinitions).not.toBeNull;
    expect(templateDefinitions?.length).toBe(firstTemplateDefinition.fieldCount);
  });

  test('Get Template Field Definition Fields Simple Paging', async () => {
    let maxPageSize = 1;
    let prefer = `maxpagesize=${maxPageSize}`;
    let response = await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({ repoId, prefer });
    if (!response.value) {
      throw new Error('response.value is undefined');
    }
    expect(response).not.toBeNull();
    let nextLink = response.odataNextLink ?? '';
    expect(nextLink).not.toBeNull();
    expect(response.value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 = await _RepositoryApiClient.templateDefinitionsClient.getTemplateFieldDefinitionsNextLink({
      nextLink,
      maxPageSize,
    });
    if (!response2.value) {
      throw new Error('response.value is undefined');
    }
    expect(response2).not.toBeNull();
    expect(response2.value.length).toBeLessThanOrEqual(maxPageSize);
  });

  test('Get Template Definition Fields by Id', async () => {
    let templateDefinitionResponse: ODataValueContextOfIListOfWTemplateInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({ repoId });
    if (!templateDefinitionResponse.value) {
      throw new Error('templateDefinitionResponse.value');
    }
    let firstTemplateDefinition = templateDefinitionResponse.value[0];
    expect(firstTemplateDefinition).not.toBeNull;
    let result = await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitionById({
      repoId,
      templateId: firstTemplateDefinition.id ?? -1,
    });
    expect(result).not.toBeNull;
    expect(result.id).toBe(firstTemplateDefinition.id);
  });

  test('Get Template Field Definition by Template Name Simple Paging', async () => {
    let maxPageSize = 1;
    let prefer = `maxpagesize=${maxPageSize}`;
    let response = await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({ repoId, prefer });
    if (!response.value) {
      throw new Error('response.value is undefined');
    }
    expect(response).not.toBeNull();
    let nextLink = response.odataNextLink ?? '';
    expect(nextLink).not.toBeNull();
    expect(response.value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateFieldDefinitionsByTemplateNameNextLink({
        nextLink,
        maxPageSize,
      });
    if (!response2.value) {
      throw new Error('response.value is undefined');
    }
    expect(response2).not.toBeNull();
    expect(response2.value.length).toBeLessThanOrEqual(maxPageSize);
  });
});
