import { testKey, testServicePrincipalKey, repoId} from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import {
  ODataValueContextOfIListOfTemplateFieldInfo,
  ODataValueContextOfIListOfWTemplateInfo
} from '../../src/index.js';

describe('Template Definitions Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey));
  });
  test('Get Template Definition', async () => {
    let templateDefinitionResponse: ODataValueContextOfIListOfWTemplateInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({ repoId });
    let firstTemplateDefinition = templateDefinitionResponse.toJSON().value[0];
    expect(firstTemplateDefinition).not.toBeNull;
    let result: ODataValueContextOfIListOfWTemplateInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({
        repoId,
        templateName: firstTemplateDefinition.name,
      });
    expect(result).not.toBeNull;
    expect(result.toJSON().value.length).toBe(1);
    expect(result.toJSON().value[0].id).toBe(firstTemplateDefinition.id);
  });
  test('Get Template Definition Fields', async () => {
    let templateDefinitionResponse: ODataValueContextOfIListOfWTemplateInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({ repoId });
    let firstTemplateDefinition = templateDefinitionResponse.toJSON().value[0];
    expect(firstTemplateDefinition).not.toBeNull;
    let result: ODataValueContextOfIListOfTemplateFieldInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateFieldDefinitions({
        repoId,
        templateId: firstTemplateDefinition.id,
      });
    let templateDefinitions = result.value;
    expect(templateDefinitions).not.toBeNull;
    expect(templateDefinitions?.length).toBe(firstTemplateDefinition.fieldCount);
  });

  test('Get Template Definition Fields by Template Name', async () => {
    let templateDefinitionResponse: ODataValueContextOfIListOfWTemplateInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({ repoId });
    let firstTemplateDefinition = templateDefinitionResponse.toJSON().value[0];
    expect(firstTemplateDefinition).not.toBeNull;
    let result: ODataValueContextOfIListOfTemplateFieldInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateFieldDefinitionsByTemplateName({
        repoId,
        templateName: firstTemplateDefinition.name,
      });
    let templateDefinitions = result.value;
    expect(templateDefinitions).not.toBeNull;
    expect(templateDefinitions?.length).toBe(firstTemplateDefinition.fieldCount);
  });

  test('Get Template Definition Fields by Id', async () => {
    let templateDefinitionResponse: ODataValueContextOfIListOfWTemplateInfo =
      await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({ repoId });
    let firstTemplateDefinition = templateDefinitionResponse.toJSON().value[0];
    expect(firstTemplateDefinition).not.toBeNull;
    let result = await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitionById({
      repoId,
      templateId: firstTemplateDefinition.id,
    });
    expect(result).not.toBeNull;
    expect(result.id).toBe(firstTemplateDefinition.id);
  });
});
