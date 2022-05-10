import {client, getAccessTokenForTests, repoId} from "../config";

describe("Get Repo List", () => {
    test("Get Repo Lists", async () => {
        let token = await getAccessTokenForTests();
        
        let RepoListResponse = await client.getRepositoryList();
        let foundrepo = false;
        for (let i = 0; i < RepoListResponse.length;i++){
            expect(RepoListResponse[i].repoId).not.toBeNull();
            expect(RepoListResponse[i].webclientUrl).not.toBeNull();
            expect(RepoListResponse[i].webclientUrl).toContain(RepoListResponse[i].repoId);
            if (RepoListResponse[i].repoId == repoId){
                foundrepo = true;
            }
        }  
        expect(foundrepo).toBe(true);
        token = "";
    });
})
