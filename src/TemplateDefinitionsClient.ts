import {ClientOptions} from './ClientHelper';
import {ODataValueContextOfIListOfWTemplateInfo, ODataValueContextOfIListOfTemplateFieldInfo} from './index';

export class TemplateDefinitionsClient extends ClientOptions{
    async getTemplateDefinitionsNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfWTemplateInfo> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfWTemplateInfo>(this.http, this.processGetTemplateDefinitions, nextLink, maxPageSize);
    }
    async getTemplateFieldDefinitionsNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfTemplateFieldInfo> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfTemplateFieldInfo>(this.http, this.processGetTemplateFieldDefinitions, nextLink, maxPageSize);
    }
    async getTemplateFieldDefinitionsByTemplateNameNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfTemplateFieldInfo> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfTemplateFieldInfo>(this.http, this.processGetTemplateFieldDefinitionsByTemplateName, nextLink, maxPageSize);
    }
}