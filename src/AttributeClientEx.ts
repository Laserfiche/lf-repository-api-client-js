import * as generated from './index';
import { getNextLinkListing } from "./ClientHelper";
export interface IAttributeClientEx extends generated.IAttributesClient {
  getTrusteeAttributeKeyValuePairsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfListOfAttribute>;
}
 
export class AttributesClient extends generated.AttributesClient implements IAttributeClientEx{
    async getTrusteeAttributeKeyValuePairsNextLink(args: {
      nextLink: string;
      maxPageSize?: number;
    }): Promise<generated.ODataValueContextOfListOfAttribute> {
      let { nextLink, maxPageSize } = args;
      return await getNextLinkListing<generated.ODataValueContextOfListOfAttribute>(
        // @ts-ignore:
        this.http,
        this.processGetTrusteeAttributeKeyValuePairs,
        nextLink,
        maxPageSize
      );
    }
  }