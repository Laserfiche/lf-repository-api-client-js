import { getNextLinkListing } from './ClientHelper';
import * as generated from './index.js';

export interface IEntriesClientEx extends generated.IEntriesClient {
  getEntryListingNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfEntry>;
  getFieldValuesNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfFieldValue>;
  getLinkValuesFromEntryNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfWEntryLinkInfo>;
  getTagsAssignedToEntryNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfWTagInfo>;
}
export class EntriesClientEx extends generated.EntriesClient implements IEntriesClientEx {
  async getEntryListingNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfEntry> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfIListOfEntry>(
      // @ts-ignore:
      this.http,
      this.processGetEntryListing,
      nextLink,
      maxPageSize
    );
  }

  async getFieldValuesNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfFieldValue> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfIListOfFieldValue>(
      // @ts-ignore:
      this.http,
      this.processGetFieldValues,
      nextLink,
      maxPageSize
    );
  }

  async getLinkValuesFromEntryNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfWEntryLinkInfo> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfIListOfWEntryLinkInfo>(
      // @ts-ignore:
      this.http,
      this.processGetLinkValuesFromEntry,
      nextLink,
      maxPageSize
    );
  }

  async getTagsAssignedToEntryNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfWTagInfo> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfIListOfWEntryLinkInfo>(
      // @ts-ignore:
      this.http,
      this.processGetTagsAssignedToEntry,
      nextLink,
      maxPageSize
    );
  }
}
