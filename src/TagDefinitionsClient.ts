import {ClientOptions} from './ClientHelper';
import {ODataValueContextOfIListOfWTagInfo} from './index';

export class TagDefinitionsClient extends ClientOptions{
    async getTagDefinitionsNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfWTagInfo> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfWTagInfo>(this.http, this.processGetTagDefinitions, nextLink, maxPageSize);
    }
}