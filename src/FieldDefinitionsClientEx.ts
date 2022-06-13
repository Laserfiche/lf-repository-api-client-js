import { CreateMaxPageSizePreferHeaderPayload, getNextLinkListing } from './ClientHelper.js';
import * as generated from './index.js';
export interface IFieldDefinitionsClientEx extends generated.IFieldDefinitionsClient {
  GetFieldDefinitionsForEach(args: {
    callback: (response: generated.ODataValueContextOfIListOfWFieldInfo) => Promise<boolean>;
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
  getFieldDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfEntry>;
}

export class FieldDefinitionClient extends generated.FieldDefinitionsClient implements IFieldDefinitionsClientEx {
  async GetFieldDefinitionsForEach(args: {
    callback: (response: generated.ODataValueContextOfIListOfWFieldInfo) => Promise<boolean>;
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
    var response = await this.getFieldDefinitions({
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
      response = await getNextLinkListing<generated.ODataValueContextOfIListOfWFieldInfo>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processGetFieldDefinitions,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  async getFieldDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfWFieldInfo> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfIListOfWFieldInfo>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processGetFieldDefinitions,
      nextLink,
      maxPageSize
    );
  }
}
