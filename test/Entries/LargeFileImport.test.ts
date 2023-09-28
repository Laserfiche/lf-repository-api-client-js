import { repositoryId } from '../TestHelper.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';
import { Blob as NodeBlob } from 'buffer';
import { Entry, FileParameter, ImportEntryRequestMetadata, ImportEntryRequest, StartDeleteEntryRequest, StartTaskResponse, TaskStatus } from '../../src/index.js';
import { isBrowser } from '@laserfiche/lf-js-utils/dist/utils/core-utils.js';

describe('Large File Import Integration Tests', () => {
      let createdEntry: Entry | null = null;

      afterEach(async () => {
        if (createdEntry != null) {
          let body: StartDeleteEntryRequest = new StartDeleteEntryRequest();
          await _RepositoryApiClient.entriesClient.startDeleteEntry({ repositoryId: repositoryId, entryId: createdEntry.id!, request: body });
        }
        createdEntry = null;
      });

      test('Importing a 60MB file with assigning a template and tag is successful', async () => {
        let blob: any;
        let edoc : FileParameter;
        if (isBrowser()){
          var fakeFileSizeInMB = 123;
          var fakeFileSizeInBytes = fakeFileSizeInMB * 1024 * 1024 + 3455; // Not used a round value for file size.
          const buffer = new ArrayBuffer(fakeFileSizeInBytes);
          blob = new Blob([buffer], {
            type: "application/pdf",
          });
          edoc = {
            fileName: "FakeFile.pdf",
            data: blob
          }
        } else {
          blob = new NodeBlob([""], {
            type: "application/json",
          });
          edoc = {
            fileName: "test/Entries/sampleFiles/60MB.pdf",
            data: blob
          }
        }

        var fileName = "sample";
        var fileExtension = "pdf";
        var name = `${fileName}.${fileExtension}`;
        var templateName = "Email";
        var tagName = "TestTag";
        var mimeType = "application/pdf";
        var rootEntryId = 1;
        const request = new ImportEntryRequest();
        request.autoRename = true;
        request.name = name;
        var metadata ={
          templateName: templateName,
          tags: [tagName]
        };
    
        request.metadata = ImportEntryRequestMetadata.fromJS(metadata);
        let response: StartTaskResponse = await _RepositoryApiClient.entriesClient.startImportEntry({
          repositoryId,
          entryId: rootEntryId,
          file: edoc,
          mimeType: mimeType,
          request: request
        });

        var response2 = await _RepositoryApiClient.tasksClient.listTasks({
            repositoryId,
            taskIds: [response.taskId!],
        });
        
        expect(response2).not.toBeNull();
        expect(response2.value).not.toBeNull();
        expect(response2.value!.length).toBeGreaterThan(0);
    
        let taskProgress = response2.value![0];
        expect(taskProgress.status).toBe(TaskStatus.Completed);
        
        expect(taskProgress.percentComplete).toBe(100);
        let createdEntryId = taskProgress.result?.entryId;
        createdEntry = await _RepositoryApiClient.entriesClient.getEntry({repositoryId: repositoryId, entryId: createdEntryId!});
        expect(createdEntry).not.toBeNull();
        expect(createdEntry.id).toEqual(createdEntryId);
        expect(createdEntry.name?.startsWith(fileName)).toBeTruthy(); // As autoRename is true, the name of the created entry is not exactly the same as the given name, e.g. it can be 'sample (5).pdf'
        expect(createdEntry.name?.endsWith(fileExtension)).toBeTruthy(); 
        expect(createdEntry.isContainer).toBeFalsy();
        expect(createdEntry.isLeaf).toBeTruthy();
        expect(createdEntry.parentId).toEqual(rootEntryId);

        // Verify the created entry's templateName
        expect(createdEntry.templateName).toEqual(templateName);

        // Verify the created entry's tag
        var tags = await _RepositoryApiClient.entriesClient.listTags({repositoryId: repositoryId, entryId: createdEntryId!});
        expect(tags.value?.length).toEqual(1);
        expect(tags.value![0].name).toEqual(tagName);
      });
  });