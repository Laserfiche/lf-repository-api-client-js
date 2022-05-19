import {client, getAccessTokenForTests,repoId, entryId, options,repoBaseUrl} from "../config";
import {FieldDefinitionClient} from '../../src/FieldDefinitionClient';

describe("Get Field Defintions", () => {
    let token = "";
    beforeAll(async() =>{
        token = await getAccessTokenForTests();
    });

    afterAll(async()=>{
        token = "";
    });

    test("Get Field Definitions", async () => {
        let FieldDefResponse = await client.getFieldDefinitions(repoId);
        expect(FieldDefResponse.value).not.toBeNull();
    });

    test("Get Field Definitions by Id", async () => {
        let FieldDefResponse = await client.getFieldDefinitions(repoId);
        let firstFieldDef = FieldDefResponse.toJSON().value[0];
        expect(firstFieldDef).not.toBeNull();

        let response = await client.getFieldDefinitionById(repoId, firstFieldDef.id);
        var fieldDef = response.toJSON();
        expect(fieldDef.id).toBe(firstFieldDef.id);
    });

    test("Get Field Definitions simple paging", async()=>{
        let client2 = new FieldDefinitionClient(options, repoBaseUrl);
        let maxPageSize = 1;
        let prefer = `maxpagesize=${maxPageSize}`;
        let response = await client.getFieldDefinitions(repoId, prefer);
        expect(response).not.toBeNull();
        let nextLink = response.toJSON()["@odata.nextLink"];
        expect(nextLink).not.toBeNull();
        expect(response.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
        let response2 = await client2.getFieldDefinitionsNextLink(nextLink,maxPageSize);
        expect(response2).not.toBeNull();
        expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
    });
})
