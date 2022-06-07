import {Entry,PostEntryChildrenRequest, EntryType, WFieldInfo, PostEntryChildrenEntryType} from "../src";
import {OAuthAccessKey, repoId, testServicePrincipalKey } from './testHelper.js';
import {IRepositoryApiClient, RepositoryApiClient} from '../src/ClientBase.js';
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
export function createTestRepoApiClient():IRepositoryApiClient{
    let handler = new TestOAuthClientCredentialsHandler(testServicePrincipalKey, OAuthAccessKey);
    _RepositoryApiClient = _RepositoryApiClient ?? RepositoryApiClient.createFromHttpRequestHandler(handler);
    return _RepositoryApiClient;
}

class TestOAuthClientCredentialsHandler extends OAuthClientCredentialsHandler{
    async beforeFetchRequestAsync(url: string, request: RequestInit): Promise<BeforeFetchResult> {
        return super.beforeFetchRequestAsync(url,request);
    }
    async afterFetchResponseAsync(url: string, response: Response, request: RequestInit): Promise<boolean> {
        if (response.status === 429){
            console.warn('Rate Limiting Triggered, waiting 60 seconds to clear {http 429}');
          await new Promise((r) => setTimeout(r, 60000));
          return true;
        }
        else{
            return super.afterFetchResponseAsync(url,response, request);
        }
      }
}