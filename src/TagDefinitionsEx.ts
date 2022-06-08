import { CreateMaxPageSizePreferHeaderPayload, getNextLinkListing } from './ClientHelper.js';
import * as generated from './index.js';
export interface ITagDefinitionsEx extends generated.ITagDefinitionsClient {
  GetTagDefinitionsForEach(args: {
    callback: (response: generated.ODataValueContextOfIListOfWTagInfo) => Promise<boolean>;
    repoId: string;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;
  getTagDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfWTagInfo>;
}

export class TagDefinitionsEx extends generated.TagDefinitionsClient {
  async GetTagDefinitionsForEach(args: {
    callback: (response: generated.ODataValueContextOfIListOfWTagInfo) => Promise<boolean>;
    repoId: string;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repoId, prefer, culture, select, orderby, top, skip, count, maxPageSize } = args;
    var response = await this.getTagDefinitions({
      repoId,
      prefer: CreateMaxPageSizePreferHeaderPayload(maxPageSize),
      culture,
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink != null) {
      response = await getNextLinkListing<generated.ODataValueContextOfIListOfWTagInfo>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processGetTagDefinitions,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  async getTagDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfWTagInfo> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfIListOfWTagInfo>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processGetTagDefinitions,
      nextLink,
      maxPageSize
    );
  }
}
