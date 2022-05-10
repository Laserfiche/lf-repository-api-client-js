import {client, getAccessTokenForTests, repoId} from "../config";
import {jest} from '@jest/globals';
import {AdvancedSearchRequest} from "../../dist";

describe("Search Tests", () => {
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
})
