import { repositoryId } from '../TestHelper.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';
import { Blob as NodeBlob } from 'buffer';
import { FileParameter, ImportEntryRequest, StartTaskResponse, TaskStatus } from '../../src/index.js';
import { isBrowser } from '@laserfiche/lf-js-utils/dist/utils/core-utils.js';

describe('Large File Import Integration Tests', () => {

    test('Importing a 60MB file is successful', async () => {
        let blob: any;
        if (isBrowser()){
            blob = new Blob([""], {
                type: "application/json",
              });
        } else {
            blob = new NodeBlob([""], {
                type: "application/json",
              });
        }
        const edoc : FileParameter = {
            fileName: "test/Entries/sampleFiles/60MB.pdf",
            data: blob
          }
          const request = new ImportEntryRequest();
          request.autoRename = true;
          request.name = "sample.pdf";
          let response: StartTaskResponse = await _RepositoryApiClient.entriesClient.startImport({
            fileName: "sample.pdf",
            fileSizeInBytes: 63096545,
            mimeType: "application/pdf",
            repositoryId,
            entryId: 1,
            file: edoc,
            request: request
        });
        await new Promise((r) => setTimeout(r, 30000));

        var response2 = await _RepositoryApiClient.tasksClient.listTasks({
            repositoryId,
            taskIds: [response.taskId!],
        });
        
        expect(response2).not.toBeNull();
        expect(response2.value).not.toBeNull();
        expect(response2.value!.length).toBeGreaterThan(0);
    
        let taskProgress = response2.value![0];
        console.log(response2);
        console.log(taskProgress.errors);
        expect(taskProgress.status).toBe(TaskStatus.Completed);
        expect(taskProgress.percentComplete).toBe(100);
      });

  });