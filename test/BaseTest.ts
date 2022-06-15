import {Entry,PostEntryChildrenRequest, EntryType, WFieldInfo, PostEntryChildrenEntryType} from "../src";
import {OAuthAccessKey, repoId, testServicePrincipalKey } from './testHelper.js';
import {IRepositoryApiClient, RepositoryApiClient} from '../src/index.js';
import { OAuthClientCredentialsHandler } from "@laserfiche/lf-api-client-core";
import { BeforeFetchResult } from "@laserfiche/lf-api-client-core/dist/lib/HttpHandlers/BeforeFetchResult";

export async function CreateEntry(client: IRepositoryApiClient, entryName: string | undefined, parentEntryId:number = 1, autoRename:boolean = true):Promise<Entry>{
    var request = new PostEntryChildrenRequest();
    request.entryType = PostEntryChildrenEntryType.Folder;
    request.name = entryName;
    var newEntry = await client.entriesClient.createOrCopyEntry({repoId,entryId:parentEntryId,request, autoRename});
    expect(newEntry).not.toBeNull();
    expect(newEntry.parentId).toBe(parentEntryId);
    expect(newEntry.entryType).toBe(EntryType.Folder);
    return newEntry;
}

export async function allFalse(arr:WFieldInfo[]):Promise<boolean>{
    for(let i = 0; i < arr.length;i++){
        if (arr[i].isRequired == true){
            return false;
        }
    }
    return true;
}
let _RepositoryApiClient: IRepositoryApiClient | undefined;
const preferLoadTest:HeadersInit={
    Accept:'application/json',
    Prefer:'maxpagesize=1',
    LoadTest:'true'
}

const preferLoadTest10:HeadersInit={
    Accept:'application/json',
    Prefer:'maxpagesize=10',
    LoadTest:'true'
}

const loadTest:HeadersInit={
    LoadTest:'true'
}
export function createTestRepoApiClient():IRepositoryApiClient{
    let handler = new TestOAuthClientCredentialsHandler(testServicePrincipalKey, OAuthAccessKey);
    _RepositoryApiClient = _RepositoryApiClient ?? RepositoryApiClient.createFromHttpRequestHandler(handler);
    return _RepositoryApiClient;
}

class TestOAuthClientCredentialsHandler extends OAuthClientCredentialsHandler{
    async beforeFetchRequestAsync(url: string, request: RequestInit): Promise<BeforeFetchResult> {
        //console.log(request);
        let headers:string = JSON.stringify(request.headers);
        let JsonHeaders = JSON.parse(headers);
        JsonHeaders["LoadTest"] = 'true'; 
        //console.log(JsonHeaders);
        request.headers = JsonHeaders;
        console.log(request);
        //let headers2:HeadersInit = JsonHeaders;
        // if (JsonHeaders.Prefer == "maxpagesize=1"){
        //     request.headers = preferLoadTest;
        // } 
        // else if (JsonHeaders.Prefer == "maxpagesize=10"){
        //     request.headers = preferLoadTest10;
        // }
        //console.log(request.headers);
        //for()
        return super.beforeFetchRequestAsync(url,request);
    }
    async afterFetchResponseAsync(url: string, response: Response, request: RequestInit): Promise<boolean> {
        if (response.status === 429){
            console.warn('Rate Limiting Triggered, waiting 75 seconds to clear {http 429}');
          await new Promise((r) => setTimeout(r, 75000));
          return true;
        }
        else{
            return super.afterFetchResponseAsync(url,response, request);
        }
      }
}