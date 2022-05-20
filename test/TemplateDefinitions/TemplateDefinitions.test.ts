import {client, getAccessTokenForTests, repoId,options, repoBaseUrl} from "../config";
import {TemplateDefinitionsClient} from '../../src/TemplateDefinitionsClient'; 
import {ODataValueContextOfIListOfWTemplateInfo} from '../../src/index';
//import {} from '../../src/ClientHelper';

describe("Template Definitions Test", () => {
    let token:string;
    beforeEach(async()=>{
        token = await getAccessTokenForTests();
    });

    afterEach(async()=>{
        token = "";
    });

    test("Get Template Definition Fields Simple Paging", async()=>{
        let client2 = new TemplateDefinitionsClient(options, repoBaseUrl);
        let maxPageSize = 1;
        let prefer = `maxpagesize=${maxPageSize}`;
        let response = await client.getTemplateDefinitions(repoId,null,prefer);
        expect(response).not.toBeNull();
        let nextLink = response.toJSON()["@odata.nextLink"];
        expect(nextLink).not.toBeNull();
        expect(response.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
        let response2 = await client2.getTemplateDefinitionsNextLink(nextLink,maxPageSize);
        expect(response2).not.toBeNull();
        expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
    });

    test.only("Get Template Definitions for each Paging", async()=>{
        let client2 = new TemplateDefinitionsClient(options, repoBaseUrl);
        let maxPageSize = 20;
        let templateDefinitions = 0;
        let pages = 0;
        const callback = async(response: ODataValueContextOfIListOfWTemplateInfo) =>{
            templateDefinitions += response.toJSON().value.length;
            pages += 1;
            return true;
        }
        await client2.GetTemplateDefinitionsForEach(callback, repoId, undefined, undefined, undefined, undefined, undefined,undefined,undefined,undefined, maxPageSize);
        expect(templateDefinitions).toBeGreaterThan(0);
        expect(pages).toBeGreaterThan(0);
    });

    test.only("Get Template Field Definitions for each Paging", async()=>{
        let client2 = new TemplateDefinitionsClient(options, repoBaseUrl);
        let maxPageSize = 20;
        let templateDefinitions = 0;
        let pages = 0;
        let allTemplateDefinitionResponse = await client2.getTemplateDefinitions(repoId);
        let firstTemplateDefinition = allTemplateDefinitionResponse.toJSON().value[0];
        expect(allTemplateDefinitionResponse).not.toBeNull();
        const callback = async(response: ODataValueContextOfIListOfWTemplateInfo) =>{
            templateDefinitions += response.toJSON().value.length;
            pages += 1;
            return true;
        }
        await client2.GetTemplateFieldDefinitionsForEach(callback, repoId, firstTemplateDefinition.id, undefined, undefined, undefined, undefined,undefined,undefined, undefined,maxPageSize);
        expect(templateDefinitions).toBeGreaterThan(0);
        expect(pages).toBeGreaterThan(0);
    });

    test.only("Get Template Field Definitions By Template Name for each Paging", async()=>{
        let client2 = new TemplateDefinitionsClient(options, repoBaseUrl);
        let maxPageSize = 20;
        let templateDefinitions = 0;
        let pages = 0;
        let allTemplateDefinitionResponse = await client2.getTemplateDefinitions(repoId);
        let firstTemplateDefinition = allTemplateDefinitionResponse.toJSON().value[0];
        expect(allTemplateDefinitionResponse).not.toBeNull();
        const callback = async(response: ODataValueContextOfIListOfWTemplateInfo) =>{
            templateDefinitions += response.toJSON().value.length;
            pages += 1;
            return true;
        }
        await client2.GetTemplateDefinitionsForEach(callback, repoId, firstTemplateDefinition.name, undefined, undefined, undefined, undefined,undefined,undefined,undefined, maxPageSize);
        expect(templateDefinitions).toBeGreaterThan(0);
        expect(pages).toBeGreaterThan(0);
    });
})
