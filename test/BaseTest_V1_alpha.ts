import {PostEntryWithEdocMetadataRequest,PostEntryChildrenRequest, EntryType, FileParameter, ODataValueOfIListOfTemplateFieldInfo, TemplateFieldInfo, WFieldInfo, PostEntryChildrenEntryType} from "../src";
import {client, repoId} from "./config";
import { readFileSync } from 'fs';
import FormData from 'form-data';

export async function CreateEntry(client: any, entryName: string | undefined, parentEntryId = 1, autoRename = true){
    var request = new PostEntryChildrenRequest();
    request.entryType = PostEntryChildrenEntryType.Folder;
    request.name = entryName;
    var newEntry = await client.createOrCopyEntry(repoId,parentEntryId,request, autoRename = autoRename);
    expect(newEntry.toJSON()).not.toBeNull();
    expect(newEntry.toJSON().parentId).toBe(parentEntryId);
    expect(newEntry.toJSON().entryType).toBe(EntryType.Folder);
    return newEntry.toJSON();
}

export async function CreateDocument(){
    let parentEntryId = 1;
    let file = "APIServerClientIntegrationTest GetDocumentContent";
    let fileLocation = "//laserfiche.com/fileserver/Temp/Eng/APIServer/IntegrationTest/test.pdf";
    let request = new PostEntryWithEdocMetadataRequest();
    var fileStream = readFileSync(fileLocation,'utf8');
    //console.log(fileStream);
    var electronicDocument: FileParameter = {
        data:fileStream,
        fileName:"test"    
    };
    //console.log(electronicDocument);
    let response = await client.importDocument(repoId,parentEntryId,file,true,"EN",electronicDocument,request);
    let operations = response.toJSON()
    return operations;

}

export async function allFalse(arr:WFieldInfo[]){
    for(let i = 0; i < arr.length;i++){
        if (arr[i].isRequired == true){
            return false;
        }
    }
    return true;
}