import { getNextLinkListing } from './ClientHelper';
import * as generated from './index.js';
export interface IFieldDefinitionsClientEx extends generated.IFieldDefinitionsClient {
  getFieldDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfEntry>;
}

export class FieldDefinitionClient extends generated.FieldDefinitionsClient implements IFieldDefinitionsClientEx {
  async getFieldDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfWFieldInfo> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfIListOfWFieldInfo>(
      // @ts-ignore:
      this.http,
      this.processGetFieldDefinitions,
      nextLink,
      maxPageSize
    );
  }
}
