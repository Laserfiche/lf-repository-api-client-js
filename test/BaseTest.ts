import {Entry,PostEntryChildrenRequest, EntryType, WFieldInfo, PostEntryChildrenEntryType, FileParameter} from "../src";
import { testKey, testServicePrincipalKey, repoId,baseUrlDebug } from './testHelper.js';
import { RepositoryApiClient, IRepositoryApiClient} from '../src/ClientBase.js';
import * as fs from 'fs';
import FormData from 'form-data';

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

// export async function CreateDocument(){
//     let parentEntryId = 1;
//     let file = "APIServerClientIntegrationTest GetDocumentContent";
//     let fileLocation = "//laserfiche.com/fileserver/Temp/Eng/APIServer/IntegrationTest/test.pdf";
//     let request = new PostEntryWithEdocMetadataRequest();
//     var fileStream = readFileSync(fileLocation,'utf8');
//     //console.log(fileStream);
//     var electronicDocument: FileParameter = {
//         data:fileStream,
//         fileName:"test"    
//     };
//     //console.log(electronicDocument);
//     let response = await client.importDocument(repoId,parentEntryId,file,true,"EN",electronicDocument,request);
//     let operations = response.toJSON()
//     return operations;

// }

export async function allFalse(arr:WFieldInfo[]):Promise<boolean>{
    for(let i = 0; i < arr.length;i++){
        if (arr[i].isRequired == true){
            return false;
        }
    }
    return true;
}