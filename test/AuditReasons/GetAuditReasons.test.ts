import {client, getAccessTokenForTests, repoId} from "../config";

describe("Get Audit Reasons", () => {

    test("Get the attribute keys", async () => {
        let token = await getAccessTokenForTests();
        //config.client.accessToken = token?.access_token;
        let auditReasonResponse = await client.getAuditReasons(repoId);
        
        expect(auditReasonResponse).not.toBeNull();
        expect(auditReasonResponse.deleteEntry).not.toBeNull();
        expect(auditReasonResponse.exportDocument).not.toBeNull();
        token = "";
    });
})
