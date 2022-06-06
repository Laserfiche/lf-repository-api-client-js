import { getNextLinkListing } from './ClientHelper';
import * as generated from './index.js';
export interface ITemplateDefinitionsEx extends generated.ITemplateDefinitionsClient {
  getTemplateDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfWTemplateInfo>;
  getTemplateFieldDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfTemplateFieldInfo>;
  getTemplateFieldDefinitionsByTemplateNameNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfTemplateFieldInfo>;
}

export class TemplateDefinitionsEx extends generated.TemplateDefinitionsClient {
  async getTemplateDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfWTemplateInfo> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfIListOfWTemplateInfo>(
      // @ts-ignore:
      this.http,
      this.processGetTemplateDefinitions,
      nextLink,
      maxPageSize
    );
  }
  async getTemplateFieldDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfTemplateFieldInfo> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfIListOfTemplateFieldInfo>(
      // @ts-ignore:
      this.http,
      this.processGetTemplateFieldDefinitions,
      nextLink,
      maxPageSize
    );
  }
  async getTemplateFieldDefinitionsByTemplateNameNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfTemplateFieldInfo> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfIListOfTemplateFieldInfo>(
      // @ts-ignore:
      this.http,
      this.processGetTemplateFieldDefinitionsByTemplateName,
      nextLink,
      maxPageSize
    );
  }
}
