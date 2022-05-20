import {client, getAccessTokenForTests, repoId,options, repoBaseUrl} from "../config";
import {jest} from '@jest/globals';
import {AdvancedSearchRequest} from "../../src";
import {ODataValueContextOfIListOfContextHit} from '../../src/index';
import {SearchClient} from '../../src/SearchClient';

let searchToken = "test";
describe.skip("Search Tests", () => {
    let token = "";
    beforeEach(async() =>{
        token = await getAccessTokenForTests();
        searchToken = "test2";
    });
    jest.setTimeout(20000);
    afterEach(async() =>{
        if (searchToken != "" || searchToken != null){ 
            await client.cancelOrCloseSearch(repoId,searchToken);
            await new Promise((r) => setTimeout(r, 5000));
        }
        token = "";
    });
    //not done yet
    test.skip("Create Search Operation", async () => {

        //create search
        let request = new AdvancedSearchRequest();
        request.searchCommand = "({LF:Basic ~= \"search text\", option=\"DFANLT\"})";
        var response = await client.createSearchOperation(repoId,request);
        searchToken = response.toJSON().token;
        expect(searchToken).not.toBeNull();
        expect(searchToken).not.toBe("");
        let webURL = response.toJSON().Headers;
        console.log(response);
        console.log(webURL);
    });

    jest.setTimeout(20000);
    test("Get Search Context Hits", async ()=>{
        let request = new AdvancedSearchRequest();
        request.searchCommand = "({LF:Basic ~= \"*\", option=\"DFANLT\"})";
        var searchResponse = await client.createSearchOperation(repoId,request);
        searchToken = searchResponse.toJSON().token;
        expect(searchToken).not.toBeNull();
        expect(searchToken).not.toBe("");
        await new Promise((r) => setTimeout(r, 5000));
        var searchResultsResponse = await client.getSearchResults(repoId,searchToken);
        var searchResults = searchResultsResponse.toJSON().value;
        expect(searchResults).not.toBeNull();
        expect(searchResults.length > 0).toBeTruthy();
        let rowNum = searchResults[0].rowNumber;

        var contextHitResponse = await client.getSearchContextHits(repoId,searchToken,rowNum);
        var contextHits = contextHitResponse.toJSON().value;
        expect(contextHits).not.toBeNull();
    });

    jest.setTimeout(30000);
    test.only("Get Search Context Hits for each Paging", async()=>{
        let client2 = new SearchClient(options, repoBaseUrl);
        let maxPageSize = 20;
        let searchRequest = new AdvancedSearchRequest();
        searchRequest.searchCommand = "({LF:Basic ~= \"search text\", option=\"NLT\"})";
        let searchResponse = await client.createSearchOperation(repoId,searchRequest);
        console.log(searchResponse);
        let searchToken = searchResponse.toJSON().token;
        expect(searchToken).not.toBe("");
        expect(searchToken).not.toBeNull();
        await new Promise((r) => setTimeout(r, 5000));
        var searchResultsResponse = await client.getSearchResults(repoId,searchToken);
        console.log(searchResultsResponse);
        var searchResults = searchResultsResponse.toJSON().value;
        expect(searchResults).not.toBeNull();
        expect(searchResults.length > 0).toBeTruthy();
        let rowNum = searchResults[0].rowNumber;
        let searchContextHits = 0;
        let pages = 0;
        const callback = async(response: ODataValueContextOfIListOfContextHit) =>{
            console.log(response);
            searchContextHits += response.toJSON().value.length;
            pages += 1;
            return true;
        }
        await client2.GetSearchContextHitsForEach(callback, repoId, searchToken, rowNum,undefined,undefined, undefined,undefined,undefined,undefined,maxPageSize);
        expect(searchContextHits).toBeGreaterThan(0);
        expect(pages).toBeGreaterThan(0);
    });

    jest.setTimeout(20000);
    test("Get Search Results", async ()=>{
        let request = new AdvancedSearchRequest();
        request.searchCommand = "({LF:Basic ~= \"search text\", option=\"DFANLT\"})";
        var searchResponse = await client.createSearchOperation(repoId,request);
        searchToken = searchResponse.toJSON().token;
        expect(searchToken).not.toBeNull();
        expect(searchToken).not.toBe("");
        await new Promise((r) => setTimeout(r, 10000));
        var searchResultsResponse = await client.getSearchResults(repoId,searchToken);
        var searchResults = searchResultsResponse.toJSON().value;
        expect(searchResults).not.toBeNull();
    });
    jest.setTimeout(20000);
    test("Get Search Status", async ()=>{
        let request = new AdvancedSearchRequest();
        request.searchCommand = "({LF:Basic ~= \"search text\", option=\"DFANLT\"})";
        var searchResponse = await client.createSearchOperation(repoId,request);
        searchToken = searchResponse.toJSON().token;
        expect(searchToken).not.toBeNull();
        expect(searchToken).not.toBe("");
        await new Promise((r) => setTimeout(r, 5000));
        var searchStatusResponse = await client.getSearchStatus(repoId,searchToken);
        var searchStatus = searchStatusResponse.toJSON();
        expect(searchStatus).not.toBeNull();
        expect(searchStatus.operationToken).toBe(searchToken);
    });
})
