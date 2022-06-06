import { getNextLinkListing } from './ClientHelper';
import * as generated from './index.js';
export interface ISearchEx extends generated.ISearchesClient {
  GetSearchResultsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfEntry>;
  GetSearchContextHitsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfContextHit>;
}

export class SearchClientEx extends generated.SearchesClient implements ISearchEx {
  async GetSearchResultsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfEntry> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfIListOfEntry>(
      // @ts-ignore:
      this.http,
      this.processGetSearchResults,
      nextLink,
      maxPageSize
    );
  }
  async GetSearchContextHitsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfContextHit> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfIListOfContextHit>(
      // @ts-ignore:
      this.http,
      this.processGetSearchContextHits,
      nextLink,
      maxPageSize
    );
  }
}
