import {Entry,PostEntryChildrenRequest, EntryType, WFieldInfo, PostEntryChildrenEntryType, FileParameter, PostEntryWithEdocMetadataRequest} from "../src";
import {repoId } from './testHelper.js';
import {IRepositoryApiClient} from '../src/ClientBase.js';

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