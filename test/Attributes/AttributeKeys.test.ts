import {client, getAccessTokenForTests, repoId} from "../config";

describe("Attribute Key Test", () => {

    test("Get the attribute keys", async () => {
        let token = await getAccessTokenForTests();
        //config.client.accessToken = token?.access_token;
        let response = await client.getTrusteeAttributeKeyValuePairs(repoId);
        expect(response).not.toBeNull;
        token = "";
        //config.client.accessToken = "";
    });

    test("Get the attribute value by Key", async () => {
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
})
