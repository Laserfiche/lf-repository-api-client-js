import {ClientOptions} from './ClientHelper';
import {ODataValueContextOfIListOfWTemplateInfo, ODataValueContextOfIListOfTemplateFieldInfo} from './index';

export class TemplateDefinitionsClient extends ClientOptions{
    async GetTemplateDefinitionsForEach(callback: (response: ODataValueContextOfIListOfWTemplateInfo) => Promise<boolean>, repoId:string, templateName?:string, prefer?:string, culture?:string, select?:string, orderby?:string,top?:number,skip?:number,count?:boolean, maxPageSize?:number): Promise<void> {
        var response = await this.getTemplateDefinitions(repoId, templateName, this.CreateMaxPageSizePreferHeaderPayload(maxPageSize), culture, select, orderby, top, skip, count);
        let nextLink = response.odataNextLink;
        while (await callback(response) && nextLink != null)
        {
            response = await this.getNextLinkListing<ODataValueContextOfIListOfWTemplateInfo>(this.http, this.processGetTemplateDefinitions, nextLink, maxPageSize);
            nextLink = response.odataNextLink;
        }
    }

    async GetTemplateFieldDefinitionsForEach(callback: (response: ODataValueContextOfIListOfTemplateFieldInfo) => Promise<boolean>, repoId:string, templateId:number,prefer?:string,culture?:string, select?:string, orderby?:string, top?:number, skip?:number, count?:boolean,maxPageSize?:number): Promise<void> {
        var response = await this.getTemplateFieldDefinitions(repoId, templateId, this.CreateMaxPageSizePreferHeaderPayload(maxPageSize), culture, select, orderby, top, skip, count);
        let nextLink = response.odataNextLink;
        while (await callback(response) && nextLink != null)
        {
            response = await this.getNextLinkListing<ODataValueContextOfIListOfTemplateFieldInfo>(this.http, this.processGetTemplateFieldDefinitions, nextLink, maxPageSize);
            nextLink = response.odataNextLink;
        }
    }

    async GetTemplateFieldDefinitionsByTemplateNameForEach(callback: (response: ODataValueContextOfIListOfTemplateFieldInfo) => Promise<boolean>, repoId:string, templateName:string, prefer?:string, culture?:string, select?:string, orderby?:string,top?:number,skip?:number, count?:boolean,maxPageSize?:number): Promise<void> {
        var response = await this.getTemplateFieldDefinitionsByTemplateName(repoId, templateName, this.CreateMaxPageSizePreferHeaderPayload(maxPageSize), culture, select, orderby, top, skip, count);
        let nextLink = response.odataNextLink;
        while (await callback(response) && nextLink != null)
        {
            response = await this.getNextLinkListing<ODataValueContextOfIListOfTemplateFieldInfo>(this.http, this.processGetTemplateFieldDefinitionsByTemplateName, nextLink, maxPageSize);
            nextLink = response.odataNextLink;
        }
    }

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