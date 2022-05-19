import {client, getAccessTokenForTests, repoId, repoBaseUrl,options} from "../config";
import {AdvancedSearchRequest} from "../../src";
import {SearchClient} from '../../src/SearchClient';
import {jest} from '@jest/globals';


describe.skip("Search Tests", () => {
    let token = "";
    beforeEach(async() =>{
        token = await getAccessTokenForTests();
    });
    afterEach(async() =>{
        token = "";
    });

    test("Close Search Operations", async () => {

        //create search
        let request = new AdvancedSearchRequest();
        request.searchCommand = "({LF:Basic ~= \"search text\", option=\"DFANLT\"})";
        var response = await client.createSearchOperation(repoId,request);
        let searchToken = response.toJSON().token;
        expect(searchToken).not.toBeNull();

        //close the search
        var closeSearchResponse = await client.cancelOrCloseSearch(repoId, searchToken);
        expect(closeSearchResponse.toJSON().value).toBe(true);
    });
    jest.setTimeout(30000);
    test("Get Search Results simple Paging", async()=>{
        let client2 = new SearchClient(options, repoBaseUrl);
        let maxPageSize = 1;
        let searchRequest = new AdvancedSearchRequest();
        searchRequest.searchCommand = "({LF:Basic ~= \"search text\", option=\"NLT\"})";
        let searchResponse = await client.createSearchOperation(repoId,searchRequest);
        let searchToken = searchResponse.toJSON().token;
        expect(searchToken).not.toBe("");
        expect(searchToken).not.toBeNull();
        await new Promise((r) => setTimeout(r, 10000));
        let prefer = `maxpagesize=${maxPageSize}`;
        let response = await client.getSearchResults(repoId, searchToken, undefined, undefined, undefined, undefined, prefer);
        expect(response).not.toBeNull();
        let nextLink = response.toJSON()["@odata.nextLink"];
        expect(nextLink).not.toBeNull();
        expect(response.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
        let response2 = await client2.GetSearchResultsNextLink(nextLink,maxPageSize);
        expect(response2).not.toBeNull();
        expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
    });
})
