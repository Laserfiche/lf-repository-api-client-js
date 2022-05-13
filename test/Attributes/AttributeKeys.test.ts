import {client, getAccessTokenForTests, repoId,options, repoBaseUrl} from "../config";
import {AttributeClient} from '../../src/AttributeClient';
import {BaseClient} from '../../src/BaseClient';

describe("Attribute Key Test", () => {

    test.skip("Get the attribute keys", async () => {
        let token = await getAccessTokenForTests();
        //config.client.accessToken = token?.access_token;
        let response = await client.getTrusteeAttributeKeyValuePairs(repoId);
        expect(response).not.toBeNull;
        token = "";
    });

    test.skip("Get the attribute value by Key", async () => {
        let token = await getAccessTokenForTests();
        //client. = token?.access_token;
        let response = await client.getTrusteeAttributeKeyValuePairs(repoId);
        let attributeKeys = response.toJSON().value;
        expect(attributeKeys).not.toBeNull();
        expect(attributeKeys.length).toBeGreaterThan(0);
        let attributeValueResponse = await client.getTrusteeAttributeValueByKey(repoId,attributeKeys[0].key);
        expect(attributeValueResponse).not.toBeNull();
        expect(attributeValueResponse).not.toBe("");
        token = "";
    });

    test("Get Attribute Simple Paging", async()=>{
        let client2 = new AttributeClient(options, repoBaseUrl);
        let token = await getAccessTokenForTests();
        let maxPageSize = 1;
        let prefer = `maxpagesize=${maxPageSize}`;
        let response = await client2.getTrusteeAttributeKeyValuePairs(repoId,undefined,prefer);
        console.log(response);
        expect(response).not.toBeNull();
        let nextLink = response.toJSON()["@odata.nextLink"];
        console.log(response.toJSON());
        console.log(nextLink);
        console.log(response.value);
        //console.log("test");
        //console.log("test2");
        let response2 = await client2.getTrusteeAttributeKeyValuePairsNextLink(nextLink,maxPageSize);
        //console.log("test3");
        console.log(response2);
        //console.log(response.value.Attribute.length);

    });
})
