import { testKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import {
  ODataValueContextOfIListOfTemplateFieldInfo,
  ODataValueContextOfIListOfWTemplateInfo,
  WTemplateInfo,
} from '../../src/index.js';

describe('Template Definitions Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey));
  });
  test.only('Get Template Definition', async () => {
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
    console.log(templateInfo.id);
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
});
