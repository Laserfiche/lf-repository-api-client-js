
import { repoId } from '../TestHelper.js';
import { FileParameter, PostEntryWithEdocMetadataRequest } from '../../src/index.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import { Blob } from 'buffer';
import 'isomorphic-fetch';
import * as FormData from 'form-data';

// function FormDataMock() {
//   //@ts-ignore
//   this.append = jest.fn();
// }
//   //@ts-ignore
// global.FormData = FormDataMock
describe('Export document integration test', () => {
  test('Export a document does not require range header', async () => {
    const obj = { hello: "world" };
    const blob = new Blob(["hello"], {
      type: "application/json",
    });

    var entryId;
    var request = new PostEntryWithEdocMetadataRequest();

      var edoc : FileParameter = {
        data: blob,
        fileName: "RepositoryApiClientIntegrationTest JS GetDocumentContent"
      }
      const importDocumentRequest = {
        repoId: repoId,
        parentEntryId: 1,
        fileName: "test",
        autoRename: true,
        electronicDocument: edoc,
        request: request
      };
  
      const importDocumentResponse = await _RepositoryApiClient.entriesClient.importDocument({
        ...importDocumentRequest
      });

  
      expect(importDocumentResponse.operations).not.toBeNull();
      expect(importDocumentResponse.operations?.entryCreate?.exceptions?.length).toBe(0);
      expect(importDocumentResponse.operations?.entryCreate?.entryId).not.toBe(0);
      expect(importDocumentResponse.operations?.setEdoc?.exceptions?.length).toBe(0);
      expect(importDocumentResponse.documentLink).not.toBeNull();
      entryId = importDocumentResponse.operations?.entryCreate?.entryId;



    // const exportDocumentRequest = {
    //     repoId: repoId,
    //     entryId: Number(entryId),
    
    //   };
    
    //   const response = await _RepositoryApiClient.entriesClient.exportDocument({
    
    //     ...exportDocumentRequest,
    
    //   });

    //   expect(response.status).toBe(200);
  });
});
