import {ClientOptions} from './ClientHelper';
import {ODataValueContextOfIListOfWFieldInfo} from './index';

export class FieldDefinitionClient extends ClientOptions{
    async GetFieldDefinitionsForEach(callback: (response: ODataValueContextOfIListOfWFieldInfo) => Promise<boolean>, repoId:string, prefer?:string, culture?:string, select?:string,orderby?:string,top?:number,skip?:number, count?:boolean,maxPageSize?:number): Promise<void> {
        var response = await this.getFieldDefinitions(repoId, this.CreateMaxPageSizePreferHeaderPayload(maxPageSize), culture, select, orderby, top, skip, count);
        let nextLink = response.odataNextLink;
        while (await callback(response) && nextLink != null)
        {
            response = await this.getNextLinkListing<ODataValueContextOfIListOfWFieldInfo>(this.http, this.processGetFieldDefinitions, nextLink, maxPageSize);
            nextLink = response.odataNextLink;
        }
    }
    async getFieldDefinitionsNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfWFieldInfo> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfWFieldInfo>(this.http, this.processGetFieldDefinitions, nextLink, maxPageSize);
    }
}