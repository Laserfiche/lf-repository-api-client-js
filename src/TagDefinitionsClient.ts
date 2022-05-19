import {ClientOptions} from './ClientHelper';
import {ODataValueContextOfIListOfWTagInfo} from './index';

export class TagDefinitionsClient extends ClientOptions{
    async GetTagDefinitionsForEach(callback: (response: ODataValueContextOfIListOfWTagInfo) => Promise<boolean>, repoId:string, prefer?:string, culture?:string, select?:string, orderby?:string, top?:number,skip?:number,count?:boolean, maxPageSize?:number): Promise<void> {
        var response = await this.getTagDefinitions(repoId, this.CreateMaxPageSizePreferHeaderPayload(maxPageSize), culture, select, orderby, top, skip, count);
        let nextLink = response.odataNextLink;
        while (await callback(response) && nextLink != null)
        {
            response = await this.getNextLinkListing<ODataValueContextOfIListOfWTagInfo>(this.http, this.processGetTagDefinitions, nextLink, maxPageSize);
            nextLink = response.odataNextLink;
        }
    }
    async getTagDefinitionsNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfWTagInfo> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfWTagInfo>(this.http, this.processGetTagDefinitions, nextLink, maxPageSize);
    }
}