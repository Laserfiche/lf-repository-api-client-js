import { CreateMaxPageSizePreferHeaderPayload, getNextLinkListing } from './ClientHelper';
import * as generated from './index.js';
import { ODataValueContextOfIListOfContextHit, ODataValueContextOfIListOfEntry } from './index.js';
export interface ISearchEx extends generated.ISearchesClient {
  GetSearchResultsForEach(
    callback: (response: ODataValueContextOfIListOfEntry) => Promise<boolean>,
    repoId: string,
    searchToken: string,
    groupByEntryType?: boolean,
    refresh?: boolean,
    fields?: string[],
    formatFields?: boolean,
    prefer?: string,
    culture?: string,
    select?: string,
    orderby?: string,
    top?: number,
    skip?: number,
    count?: boolean,
    maxPageSize?: number
  ): Promise<void>;
  GetSearchContextHitsForEach(
    callback: (response: ODataValueContextOfIListOfContextHit) => Promise<boolean>,
    repoId: string,
    searchToken: string,
    rowNumber: number,
    prefer?: string,
    select?: string,
    orderby?: string,
    top?: number,
    skip?: number,
    count?: boolean,
    maxPageSize?: number
  ): Promise<void>;
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
  async GetSearchResultsForEach(
    callback: (response: ODataValueContextOfIListOfEntry) => Promise<boolean>,
    repoId: string,
    searchToken: string,
    groupByEntryType?: boolean,
    refresh?: boolean,
    fields?: string[],
    formatFields?: boolean,
    prefer?: string,
    culture?: string,
    select?: string,
    orderby?: string,
    top?: number,
    skip?: number,
    count?: boolean,
    maxPageSize?: number
  ): Promise<void> {
    var response = await this.getSearchResults({
      repoId,
      searchToken,
      groupByEntryType,
      refresh,
      fields,
      formatFields,
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
      response = await getNextLinkListing<ODataValueContextOfIListOfEntry>(
        // @ts-ignore:
        this.http,
        this.processGetSearchResults,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  async GetSearchContextHitsForEach(
    callback: (response: ODataValueContextOfIListOfContextHit) => Promise<boolean>,
    repoId: string,
    searchToken: string,
    rowNumber: number,
    prefer?: string,
    select?: string,
    orderby?: string,
    top?: number,
    skip?: number,
    count?: boolean,
    maxPageSize?: number
  ): Promise<void> {
    var response = await this.getSearchContextHits({
      repoId,
      searchToken,
      rowNumber,
      prefer: CreateMaxPageSizePreferHeaderPayload(maxPageSize),
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink != null) {
      response = await getNextLinkListing<ODataValueContextOfIListOfContextHit>(
        // @ts-ignore:
        this.http,
        this.processGetSearchContextHits,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
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
