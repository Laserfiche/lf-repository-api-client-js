import { testKey, testServicePrincipalKey, repoId, baseUrlDebug } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { DeleteEntryWithAuditReason, Entry, PutTemplateRequest} from '../../src/index.js';
import { allFalse, CreateEntry } from '../BaseTest.js';

describe('Remove Entries Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  let entry = new Entry();
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey), baseUrlDebug);
  });
  afterEach(async () => {
    if (entry != null) {
      let body = new DeleteEntryWithAuditReason();
      let num = Number(entry.id);
      await _RepositoryApiClient.entriesClient.deleteEntryInfo({ repoId, entryId: num, request: body });
    }
  });
  test("Remove Template from Entry Return Entry",async()=>{
    // Find a template definition with no required fields
    let template = null;
    let templateDefinitionResponse = await _RepositoryApiClient.templateDefinitionsClient.getTemplateDefinitions({repoId});
    let templateDefinitions = templateDefinitionResponse.toJSON().value;
    expect(templateDefinitions).not.toBeNull();
    expect(templateDefinitions.length).toBeGreaterThan(0);
    for (let i = 0; i < templateDefinitions.length;i++){
        let templateDefinitionFeildsResponse = await _RepositoryApiClient.templateDefinitionsClient.getTemplateFieldDefinitions({repoId,templateId:templateDefinitions[i].id});
        if (templateDefinitionFeildsResponse.toJSON().value != null && allFalse(templateDefinitionFeildsResponse.toJSON().value)){
            template = templateDefinitions[i];
            break;
        }
    }
    expect(template).not.toBeNull();

    //Set the template on an entry
    let request = new PutTemplateRequest();
    request.templateName = template?.name;
    entry = await CreateEntry(_RepositoryApiClient, "APIServerClientIntegrationTest RemoveTemplateFromEntry");
    let setTemplateResponse = await _RepositoryApiClient.entriesClient.writeTemplateValueToEntry({repoId,entryId: Number(entry.id),request});
    expect(setTemplateResponse.toJSON()).not.toBeNull();
    expect(setTemplateResponse.toJSON().templateName).toBe(template.name);

    //Delete the templaye on the entry
    let DeleteTemplateReponse = await _RepositoryApiClient.entriesClient.deleteAssignedTemplate({repoId,entryId:Number(entry.id)});
    let returnedEntry = DeleteTemplateReponse.toJSON();
    expect(returnedEntry).not.toBeNull();
    expect(returnedEntry.id).toBe(entry.id);
    expect(returnedEntry.templateId).toBe(0);
    expect(returnedEntry.templateName == '' || returnedEntry.templateName == null).toBe(true);
});
});