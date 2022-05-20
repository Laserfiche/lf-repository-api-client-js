import {client, getAccessTokenForTests, repoId,options, repoBaseUrl, entryId} from "../config";
import {EntryClient} from '../../src/EntryClients'; 
import {ODataValueContextOfIListOfFieldValue, ODataValueContextOfIListOfODataGetEntryChildren, 
    ODataValueContextOfIListOfWEntryLinkInfo,ODataValueContextOfIListOfWTagInfo} from '../../src/index';
//import {} from '../../src/ClientHelper';

describe("Get Entry Tests", () => {
    let token:string;
    let client2:EntryClient;
    beforeEach(async()=>{
        token = await getAccessTokenForTests();
        client2 = new EntryClient(options, repoBaseUrl);
    });

    afterEach(async()=>{
        token = "";
    });

    test("Get Entry Listing for each paging", async()=>{
        let client2 = new EntryClient(options, repoBaseUrl);
        let maxPageSize = 20;
        let entries = 0;
        let pages = 0;
        const callback = async(response: ODataValueContextOfIListOfODataGetEntryChildren) =>{
            entries += response.toJSON().value.length;
            pages += 1;
            return true;
        }
        await client2.GetEntryListingForEach(callback,repoId,entryId, undefined,undefined,undefined,undefined, undefined,undefined,undefined,undefined,undefined,undefined,maxPageSize);
        expect(entries).toBeGreaterThan(0);
        expect(pages).toBeGreaterThan(0);
    });

    test("Get Entry Field for each paging", async()=>{
        let client2 = new EntryClient(options, repoBaseUrl);
        let maxPageSize = 20;
        let entries = 0;
        let pages = 0;
        const callback = async(response: ODataValueContextOfIListOfFieldValue) =>{
            entries += response.toJSON().value.length;
            pages += 1;
            return true;
        }
        await client2.GetFieldValuesForEach(callback,repoId,entryId, undefined,undefined,undefined,undefined, undefined,undefined,undefined,undefined,maxPageSize);
        expect(entries).toBeGreaterThan(0);
        expect(pages).toBeGreaterThan(0);
    });

    test("Get Entry Links for each paging", async()=>{
        let client2 = new EntryClient(options, repoBaseUrl);
        let maxPageSize = 20;
        let entries = 0;
        let pages = 0;
        const callback = async(response: ODataValueContextOfIListOfWEntryLinkInfo) =>{
            entries += response.toJSON().value.length;
            pages += 1;
            return true;
        }
        await client2.GetLinkValuesFromEntryForEach(callback, repoId, entryId, undefined, undefined, undefined, undefined, undefined, undefined, maxPageSize);
        expect(entries).toBeGreaterThan(0);
        expect(pages).toBeGreaterThan(0);
    });

    test("Get Entry Tags for each paging", async()=>{
        let client2 = new EntryClient(options, repoBaseUrl);
        let maxPageSize = 20;
        let entries = 0;
        let pages = 0;
        const callback = async(response: ODataValueContextOfIListOfWTagInfo) =>{
            entries += response.toJSON().value.length;
            pages += 1;
            return true;
        }
        await client2.GetTagsAssignedToEntryForEach(callback, repoId, entryId, undefined, undefined, undefined, undefined,undefined, undefined, maxPageSize);
        expect(entries).toBeGreaterThan(0);
        expect(pages).toBeGreaterThan(0);
    });
})
