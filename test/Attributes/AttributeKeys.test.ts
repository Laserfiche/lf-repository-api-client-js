import {client, getAccessTokenForTests, repoId,options, repoBaseUrl} from "../config";
import {AttributeClient} from '../../src/AttributeClient'; 
import { ODataValueContextOfListOfAttribute, Client } from '../../src/index';
//import {} from '../../src/ClientHelper';

describe("Attribute Key Test", () => {
    let token:string;
    beforeEach(async()=>{
        token = await getAccessTokenForTests();
    });

    afterEach(async()=>{
        token = "";
    });

    test("Get the attribute keys", async () => {
        let response = await client.getTrusteeAttributeKeyValuePairs(repoId);
        expect(response).not.toBeNull;
    });

    test("Get the attribute value by Key simple paging", async () => {
        let client2 = new AttributeClient(options, repoBaseUrl);
        let maxPageSize = 1;
        let prefer = `maxpagesize=${maxPageSize}`;
        let response = await client.getFieldDefinitions(repoId, prefer);
        expect(response).not.toBeNull();
        let nextLink = response.toJSON()["@odata.nextLink"];
        expect(nextLink).not.toBeNull();
        expect(response.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
        let response2 = await client2.getTrusteeAttributeKeyValuePairsNextLink(nextLink,maxPageSize);
        expect(response2).not.toBeNull();
        expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
    });

    test.only("Get the attributes for each paging", async () => {
        let client2 = new AttributeClient(options, repoBaseUrl);
        let maxPageSize = 20;
        let attributes = 0;
        let pages = 0;
        const callback = async(response: ODataValueContextOfListOfAttribute) =>{
            attributes += response.toJSON().value.length;
            pages += 1
            return true;
        }
        await client2.GetTrusteeAttributeKeyValuePairsForEach(callback,repoId,true,undefined,undefined,undefined, undefined,undefined,maxPageSize);
        console.log(attributes);
        console.log(pages);
        expect(attributes).toBeGreaterThan(0);
        expect(pages).toBeGreaterThan(0);
    });
})
