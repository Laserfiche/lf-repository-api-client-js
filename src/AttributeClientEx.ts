import * as generated from './index';
import { getNextLinkListing, CreateMaxPageSizePreferHeaderPayload } from './ClientHelper';
import { ODataValueContextOfListOfAttribute } from './index';
export interface IAttributeClientEx extends generated.IAttributesClient {
  getTrusteeAttributeKeyValuePairsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfListOfAttribute>;
  GetTrusteeAttributeKeyValuePairsForEach(
    args:{callback: (response: ODataValueContextOfListOfAttribute) => Promise<boolean>,
      repoId: string;
      everyone?: boolean;
      select?: string;
      orderby?: string;
      top?: number;
      skip?: number;
      count?: boolean;
      maxPageSize?: number;
    }
  ): Promise<void>;
}

export class AttributesClient extends generated.AttributesClient implements IAttributeClientEx {
  async GetTrusteeAttributeKeyValuePairsForEach(
    args:{callback: (response: ODataValueContextOfListOfAttribute) => Promise<boolean>,
    repoId: string,
    everyone?: boolean,
    select?: string,
    orderby?: string,
    top?: number,
    skip?: number,
    count?: boolean,
    maxPageSize?: number}
  ): Promise<void> {
    let { callback,repoId, everyone,select,orderby,top,skip,count, maxPageSize } = args;
    var response = await this.getTrusteeAttributeKeyValuePairs({
      repoId,
      everyone,
      prefer: CreateMaxPageSizePreferHeaderPayload(maxPageSize),
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink != null) {
      response = await getNextLinkListing<ODataValueContextOfListOfAttribute>(
        // @ts-ignore:
        this.http,
        this.processGetTrusteeAttributeKeyValuePairs,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
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
