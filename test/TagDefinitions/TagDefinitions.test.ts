import {client, getAccessTokenForTests, repoId,options, repoBaseUrl} from "../config";
import {TagDefinitionsClient} from '../../src/TagDefinitionsClient'; 
//import {} from '../../src/ClientHelper';
import {ODataValueContextOfIListOfWTagInfo} from '../../src/index';

describe("Tag Definitions Test", () => {
    let token:string;
    beforeEach(async()=>{
        token = await getAccessTokenForTests();
    });

    afterEach(async()=>{
        token = "";
    });

    test("Get Tag Definitions Simple Paging", async()=>{
        let client2 = new TagDefinitionsClient(options, repoBaseUrl);
        let maxPageSize = 1;
        let prefer = `maxpagesize=${maxPageSize}`;
        let response = await client.getTagDefinitions(repoId,prefer);
        expect(response).not.toBeNull();
        let nextLink = response.toJSON()["@odata.nextLink"];
        expect(nextLink).not.toBeNull();
        expect(response.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
        let response2 = await client2.getTagDefinitionsNextLink(nextLink,maxPageSize);
        expect(response2).not.toBeNull();
        expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
    });

    test.only("Get Tag Definitions for each Paging", async()=>{
        let client2 = new TagDefinitionsClient(options, repoBaseUrl);
        let maxPageSize = 20;
        let tagDefinitions = 0;
        let pages = 0;
        const callback = async(response: ODataValueContextOfIListOfWTagInfo) =>{
            tagDefinitions += response.toJSON().value.length;
            pages += 1;
            return true;
        }
        await client2.GetTagDefinitionsForEach(callback, repoId, undefined, undefined, undefined, undefined, undefined,undefined,undefined, maxPageSize);
        expect(tagDefinitions).toBeGreaterThan(0);
        expect(pages).toBeGreaterThan(0);
    });
})
