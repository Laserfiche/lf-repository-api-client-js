import {client, getAccessTokenForTests, repoId} from "../config";

describe("Create access token", () => {

    test("Get the Access Token", async () => {
        let tokenbefore = null;
        let token = await getAccessTokenForTests();
        expect(tokenbefore).toBeNull();
        expect(token).not.toBeNull;
        token = "";
    });

    /*test("Invalidate Server Session", async () => {
        let response = await client.invalidateServerSession(repoId);
        expect(response.toJSON().value).toBe(true);
        await client.createServerSession(repoId); 
        //token = await config.credentials.getAccessToken();
        //config.client.accessToken = token?.access_token;
    });*/

    //no invalidate access token or refersh access token method in the jsclient  
    test("Refresh Server Session test",async()=>{
        let token = await getAccessTokenForTests();
        //config.client.accessToken = token?.access_token;
        let currentTime = new Date();
        let refeshResponse = await client.refreshServerSession(repoId);
        let expireTime = refeshResponse.toJSON().value;
        let expireTimeUTC = new Date(expireTime); 
        expect(expireTime).not.toBeNull();
        expect(currentTime < expireTimeUTC).toBe(true);
        token ="";
    });
})
