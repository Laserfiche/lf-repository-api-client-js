import { repoId } from '../testHelper.js';
import { DeleteEntryWithAuditReason, Entry, PutTemplateRequest,IRepositoryApiClient } from '../../src/index.js';
import { allFalse, CreateEntry, createTestRepoApiClient } from '../BaseTest.js';

describe('Remove Entries Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  let entry = new Entry();
  _RepositoryApiClient = createTestRepoApiClient();
  afterEach(async () => {
    if (entry != null) {
      let body = new DeleteEntryWithAuditReason();
      let num = Number(entry.id);
      await _RepositoryApiClient.entriesClient.deleteEntryInfo({ repoId, entryId: num, request: body });
    }
  });
  test('Remove Template from Entry Return Entry', async () => {
    // Find a template definition with no required fields
    let template = null;
    let templateDefinitionResponse = await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({
      repoId,
    });
    let templateDefinitions = templateDefinitionResponse.value;
    if (!templateDefinitions) {
      throw new Error('templateDefinitions is undefined');
    }
    expect(templateDefinitions).not.toBeNull();
    expect(templateDefinitions.length).toBeGreaterThan(0);
    for (let i = 0; i < templateDefinitions.length; i++) {
      let templateDefinitionFieldsResponse =
        await _RepositoryApiClient.templateDefinitionsClient.getTemplateFieldDefinitions({
          repoId,
          templateId: templateDefinitions[i].id ?? -1,
        });
      if (templateDefinitionFieldsResponse.value != null && (await allFalse(templateDefinitionFieldsResponse.value))) {
        template = templateDefinitions[i];
        break;
      }
    }
    expect(template).not.toBeNull();

    //Set the template on an entry
    let request = new PutTemplateRequest();
    request.templateName = template?.name;
    entry = await CreateEntry(_RepositoryApiClient, 'APIServerClientIntegrationTest RemoveTemplateFromEntry');
    let setTemplateResponse = await _RepositoryApiClient.entriesClient.writeTemplateValueToEntry({
      repoId,
      entryId: Number(entry.id),
      request,
    });
    expect(setTemplateResponse).not.toBeNull();
    expect(setTemplateResponse.templateName).toBe(template?.name);

    //Delete the template on the entry
    let DeleteTemplateResponse = await _RepositoryApiClient.entriesClient.deleteAssignedTemplate({
      repoId,
      entryId: Number(entry.id),
    });
    let returnedEntry = DeleteTemplateResponse;
    expect(returnedEntry).not.toBeNull();
    expect(returnedEntry.id).toBe(entry.id);
    expect(returnedEntry.templateId).toBe(0);
    expect(returnedEntry.templateName == '' || returnedEntry.templateName == null).toBe(true);
  });
});
