import { getNextLinkListing } from './ClientHelper';
import * as generated from './index.js';
export interface ITagDefinitionsEx extends generated.ITagDefinitionsClient {
  getTagDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfWTagInfo>;
}

export class TagDefinitionsEx extends generated.TagDefinitionsClient {
  async getTagDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfWTagInfo> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfIListOfWTagInfo>(
      // @ts-ignore:
      this.http,
      this.processGetTagDefinitions,
      nextLink,
      maxPageSize
    );
  }
}
