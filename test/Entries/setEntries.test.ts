import { testKey, testServicePrincipalKey, repoId, baseUrlDebug } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import {
  DeleteEntryWithAuditReason,
  Entry,
  FieldToUpdate,
  PutLinksRequest,
  PutTagRequest,
  ValueToUpdate,
  WFieldType,
} from '../../src/index.js';
import { jest } from '@jest/globals';
import { CreateEntry } from '../BaseTest';

describe('Set Entries Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  var entry = new Entry();
  let createdEntries: Array<Entry> = new Array();
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

  test('Set fields test', async () => {
    let field = null;
    let fieldValue = 'a';
    let fieldDefinitionsResponse = await _RepositoryApiClient.fieldDefinitionsClient.getFieldDefinitions({ repoId });
    let fieldDefinitions = fieldDefinitionsResponse.toJSON().value;
    expect(fieldDefinitions).not.toBeNull();
    for (let i = 0; i < fieldDefinitions.length; i++) {
      if (
        fieldDefinitions[i].fieldType == WFieldType.String &&
        (fieldDefinitions[i].constraint == '' || fieldDefinitions[i].constraint == null) &&
        fieldDefinitions[i].length >= 1
      ) {
        field = fieldDefinitions[i];
        break;
      }
    }
    expect(field).not.toBeNull();
    console.log(field);
    console.log(field?.name);
    let value = new ValueToUpdate();
    value.value = fieldValue;
    value.position = 1;
    let name = new FieldToUpdate();
    name.values = [value];
    let requestBody = { [field.name]: name };
    entry = await CreateEntry(_RepositoryApiClient, 'APIServerClientIntegrationTest SetFields');
    let num = Number(entry.id);
    let response = await _RepositoryApiClient.entriesClient.assignFieldValues({
      repoId,
      entryId: num,
      fieldsToUpdate: requestBody,
    });
    let fields = response.toJSON().value;
    expect(fields).not.toBeNull();
    expect(fields.length).toBe(1);
    expect(fields[0].fieldName).toBe(field.name);
  });

  test('Set Tags Test', async () => {
    let tagDefinitionsResponse = await _RepositoryApiClient.tagDefinitionsClient.getTagDefinitions({ repoId });
    let tagDefinitions = tagDefinitionsResponse.toJSON().value;
    expect(tagDefinitions).not.toBeNull();
    expect(tagDefinitions.length).toBeGreaterThan(0);
    let tag = tagDefinitions[0].name;
    let request = new PutTagRequest();
    request.tags = new Array(tag);
    entry = await CreateEntry(_RepositoryApiClient, 'APIServerClientIntegrationTest SetTags');
    let num = Number(entry.id);
    let response = await _RepositoryApiClient.entriesClient.assignTags({ repoId, entryId: num, tagsToAdd: request });
    let tags = response.toJSON().value;
    expect(tags).not.toBeNull();
    expect(response.toJSON().value.length).toBe(tags.length);
    expect(tag).toBe(tags[0].name);
  });

  test('Set Links Test', async () => {
    let sourceEntry: Entry = await CreateEntry(_RepositoryApiClient, 'APIServerClientIntegrationTest SetLinks Source');
    createdEntries.push(sourceEntry);
    var targetEntry = await CreateEntry(_RepositoryApiClient, 'APIServerClientIntegrationTest SetLinks Target');
    createdEntries.push(targetEntry);
    let putLinks = new PutLinksRequest();
    putLinks.targetId = targetEntry.id;
    putLinks.linkTypeId = 1;
    let request = new Array<Entry>(putLinks);

    let result = await _RepositoryApiClient.entriesClient.assignEntryLinks({
      repoId,
      entryId: sourceEntry.toJSON().id,
      linksToAdd: request,
    });

    let links = result.toJSON().value;
    expect(links).not.toBeNull;
    expect(request.length).toBe(links.length);
    expect(sourceEntry.id).toBe(links[0].sourceId);
    expect(targetEntry.id).toBe(links[0].targetId);
  });
});
