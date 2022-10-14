
import { repoId } from '../TestHelper.js';
import { _RepositoryApiClient } from '../CreateSession.js';
import 'isomorphic-fetch';

describe('Export document integration test', () => {
  test('Export a document does not require range header', async () => {
    const exportDocumentRequest = {
        repoId: repoId,
        entryId: Number(19356),
    
      };
    
      const response = await _RepositoryApiClient.entriesClient.exportDocument({
    
        ...exportDocumentRequest,
    
      });

      expect(response.status).toBe(200);
  });
});
