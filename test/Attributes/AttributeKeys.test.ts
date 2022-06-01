import { testKey, testServicePrincipalKey, repoId} from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient } from '../../src/ClientBase.js';
import { ODataValueContextOfListOfAttribute } from '../../src/index.js';

describe('Attribute Key Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  beforeEach(() => {
    _RepositoryApiClient = RepositoryApiClient.create(testServicePrincipalKey, JSON.stringify(testKey));
  });

  test('Get the attribute keys', async () => {
    let result: ODataValueContextOfListOfAttribute =
      await _RepositoryApiClient.attributesClient.getTrusteeAttributeKeyValuePairs({ repoId });
    expect(result).not.toBeNull();
  });

  test('Get the attribute value by Key', async () => {
    let result: ODataValueContextOfListOfAttribute =
      await _RepositoryApiClient.attributesClient.getTrusteeAttributeKeyValuePairs({ repoId });
    let attributeKeys = result.toJSON().value;
    expect(attributeKeys).not.toBeNull();
    expect(attributeKeys.length).toBeGreaterThan(0);
    let attributeValueResponse = await _RepositoryApiClient.attributesClient.getTrusteeAttributeValueByKey({
      repoId,
      attributeKey: attributeKeys[0].key,
    });
    expect(attributeValueResponse).not.toBeNull();
    expect(attributeValueResponse).not.toBe('');
  });
});
