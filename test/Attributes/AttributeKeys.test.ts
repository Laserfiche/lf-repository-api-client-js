import { testKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient, ODataValueContextOfListOfAttribute } from '../../src/index.js';

describe('Attribute Key Integration Tests', () => {
  let _RepositoryApiClient: IRepositoryApiClient;
  _RepositoryApiClient = RepositoryApiClient.createFromAccessKey(testServicePrincipalKey, testKey);
  test('Get the attribute keys', async () => {
    let result: ODataValueContextOfListOfAttribute =
      await _RepositoryApiClient.attributesClient.getTrusteeAttributeKeyValuePairs({ repoId });
    expect(result).not.toBeNull();
  });

  test('Get the attribute keys next link', async () => {
    let maxPageSize = 1;
    let prefer = `maxpagesize=${maxPageSize}`;
    let result: ODataValueContextOfListOfAttribute =
      await _RepositoryApiClient.attributesClient.getTrusteeAttributeKeyValuePairs({ repoId, prefer });
    expect(result).not.toBeNull();
    expect(result).not.toBeNull();
    let nextLink = result.toJSON()["@odata.nextLink"];
    expect(nextLink).not.toBeNull();
    expect(result.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
    let response2 = await _RepositoryApiClient.attributesClient.getTrusteeAttributeKeyValuePairsNextLink({nextLink,maxPageSize});
    console.log(response2);
    expect(response2).not.toBeNull();
    expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
  });

  test('Get the attribute value by Key', async () => {
    let result: ODataValueContextOfListOfAttribute =
      await _RepositoryApiClient.attributesClient.getTrusteeAttributeKeyValuePairs({ repoId });
    let attributeKeys = result.value;
    if (!attributeKeys) {
      throw new Error('attributeKeys is undefined');
    }
    expect(attributeKeys).not.toBeNull();
    expect(attributeKeys.length).toBeGreaterThan(0);
    let attributeValueResponse = await _RepositoryApiClient.attributesClient.getTrusteeAttributeValueByKey({
      repoId,
      attributeKey: attributeKeys[0].key ?? '',
    });
    expect(attributeValueResponse).not.toBeNull();
    expect(attributeValueResponse).not.toBe('');
  });
});
