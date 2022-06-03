// import {client, getAccessTokenForTests, repoId,options, repoBaseUrl} from "../config";
// import {TemplateDefinitionsClient} from '../../src/TemplateDefinitionsClient'; 
// //import {} from '../../src/ClientHelper';

// describe("Template Definitions Test", () => {
//     let token:string;
//     beforeEach(async()=>{
//         token = await getAccessTokenForTests();
//     });

//     afterEach(async()=>{
//         token = "";
//     });

//     test("Get Template Definition Fields Simple Paging", async()=>{
//         let client2 = new TemplateDefinitionsClient(options, repoBaseUrl);
//         let maxPageSize = 1;
//         let prefer = `maxpagesize=${maxPageSize}`;
//         let response = await client.getTemplateDefinitions(repoId,null,prefer);
//         expect(response).not.toBeNull();
//         let nextLink = response.toJSON()["@odata.nextLink"];
//         expect(nextLink).not.toBeNull();
//         expect(response.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
//         let response2 = await client2.getTemplateDefinitionsNextLink(nextLink,maxPageSize);
//         expect(response2).not.toBeNull();
//         expect(response2.toJSON().value.length).toBeLessThanOrEqual(maxPageSize);
//     });
// })
