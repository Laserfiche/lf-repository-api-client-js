import {ClientOptions} from './ClientHelper';
import {ODataValueContextOfIListOfWFieldInfo} from './index';

export class FieldDefinitionClient extends ClientOptions{
    async getFieldDefinitionsNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfWFieldInfo> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfWFieldInfo>(this.http, this.processGetFieldDefinitions, nextLink, maxPageSize);
    }
}