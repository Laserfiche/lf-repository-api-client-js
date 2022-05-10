import {client, getAccessTokenForTests,repoId} from "../config";

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
})
