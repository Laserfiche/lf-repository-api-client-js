import { OAuthAccessKey, testServicePrincipalKey, repoId } from '../testHelper.js';
import {ODataValueContextOfIListOfFieldValue, ODataValueContextOfIListOfEntry, 
    ODataValueContextOfIListOfWEntryLinkInfo,ODataValueContextOfIListOfWTagInfo} from '../../src/index';
import { IRepositoryApiClient, RepositoryApiClient } from '../../src/ClientBase.js';

describe("Get Entry Tests", () => {
    let _RepositoryApiClient: IRepositoryApiClient;
    _RepositoryApiClient = RepositoryApiClient.createFromAccessKey(testServicePrincipalKey, OAuthAccessKey);
    let entryId: number = 1;

    test("Get Entry Listing for each paging", async()=>{
        let maxPageSize = 20;
        let entries = 0;
        let pages = 0;
        const callback = async(response: ODataValueContextOfIListOfEntry) =>{
            entries += response.toJSON().value.length;
            pages += 1;
            return true;
        }
        await _RepositoryApiClient.entriesClient.GetEntryListingForEach({callback,repoId, entryId, maxPageSize});
        expect(entries).toBeGreaterThan(0);
        expect(pages).toBeGreaterThan(0);
    });

    test("Get Entry Field for each paging", async()=>{
        let maxPageSize = 20;
        let entries = 0;
        let pages = 0;
        const callback = async(response: ODataValueContextOfIListOfFieldValue) =>{
            entries += response.toJSON().value.length;
            pages += 1;
            return true;
        }
        await _RepositoryApiClient.entriesClient.GetFieldValuesForEach({callback,repoId,entryId, maxPageSize});
        expect(entries).toBeGreaterThan(0);
        expect(pages).toBeGreaterThan(0);
    });

    test("Get Entry Links for each paging", async()=>{
        let maxPageSize = 20;
        let entries = 0;
        let pages = 0;
        const callback = async(response: ODataValueContextOfIListOfWEntryLinkInfo) =>{
            entries += response.toJSON().value.length;
            pages += 1;
            return true;
        }
        await _RepositoryApiClient.entriesClient.GetLinkValuesFromEntryForEach({callback, repoId, entryId, maxPageSize});
        expect(entries).toBeGreaterThan(0);
        expect(pages).toBeGreaterThan(0);
    });

    test("Get Entry Tags for each paging", async()=>{
        let maxPageSize = 20;
        let entries = 0;
        let pages = 0;
        const callback = async(response: ODataValueContextOfIListOfWTagInfo) =>{
            entries += response.toJSON().value.length;
            pages += 1;
            return true;
        }
        await _RepositoryApiClient.entriesClient.GetTagsAssignedToEntryForEach({callback, repoId, entryId, maxPageSize});
        expect(entries).toBeGreaterThan(0);
        expect(pages).toBeGreaterThan(0);
    });
})
