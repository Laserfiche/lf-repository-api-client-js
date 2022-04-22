import { GetRepoIdFromUri } from './ClientUtils.js'
describe("ClientUtils" , () => 
{
    const sampleApiCall = "http://api.a.clouddev.laserfiche.com/repository/v1/repositories/r-76c66368/entries/1/laserfiche.repository.folder/children";

    test("getRepoIdFromUri returns correct repoId", () => {
        let result = GetRepoIdFromUri(sampleApiCall);
        expect(result).toBe("r-76c66368");
    });
})