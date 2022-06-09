import { CreateMaxPageSizePreferHeaderPayload, getNextLinkListing } from './ClientHelper.js';
import * as generated from './index.js';

export interface IEntriesClientEx extends generated.IEntriesClient {
  GetEntryListingForEach(args: {
    callback: (response: generated.ODataValueContextOfIListOfEntry) => Promise<boolean>;
    repoId: string;
    entryId: number;
    groupByEntryType?: boolean;
    fields?: string[];
    formatFields?: boolean;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;

  GetFieldValuesForEach(args: {
    callback: (response: generated.ODataValueContextOfIListOfFieldValue) => Promise<boolean>;
    repoId: string;
    entryId: number;
    prefer?: string;
    formatValue?: boolean;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;

  GetLinkValuesFromEntryForEach(args: {
    callback: (response: generated.ODataValueContextOfIListOfWEntryLinkInfo) => Promise<boolean>;
    repoId: string;
    entryId: number;
    prefer?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;

  GetTagsAssignedToEntryForEach(args: {
    callback: (response: generated.ODataValueContextOfIListOfWTagInfo) => Promise<boolean>;
    repoId: string;
    entryId: number;
    prefer?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;

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
  async GetEntryListingForEach(args: {
    callback: (response: generated.ODataValueContextOfIListOfEntry) => Promise<boolean>;
    repoId: string;
    entryId: number;
    groupByEntryType?: boolean;
    fields?: string[];
    formatFields?: boolean;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let {
      callback,
      repoId,
      entryId,
      groupByEntryType,
      fields,
      formatFields,
      prefer,
      culture,
      select,
      orderby,
      top,
      skip,
      count,
      maxPageSize,
    } = args;
    var response = await this.getEntryListing({
      repoId,
      entryId,
      groupByEntryType,
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
      response = await getNextLinkListing<generated.ODataValueContextOfIListOfEntry>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processGetEntryListing,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }

  async GetFieldValuesForEach(args: {
    callback: (response: generated.ODataValueContextOfIListOfFieldValue) => Promise<boolean>;
    repoId: string;
    entryId: number;
    prefer?: string;
    formatValue?: boolean;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repoId, entryId, prefer, formatValue, culture, select, orderby, top, skip, count, maxPageSize } =
      args;
    var response = await this.getFieldValues({
      repoId,
      entryId,
      prefer: CreateMaxPageSizePreferHeaderPayload(maxPageSize),
      formatValue,
      culture,
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink != null) {
      response = await getNextLinkListing<generated.ODataValueContextOfIListOfFieldValue>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processGetFieldValues,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }

  async GetLinkValuesFromEntryForEach(args: {
    callback: (response: generated.ODataValueContextOfIListOfWEntryLinkInfo) => Promise<boolean>;
    repoId: string;
    entryId: number;
    prefer?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repoId, entryId, prefer, select, orderby, top, skip, count, maxPageSize } = args;
    var response = await this.getLinkValuesFromEntry({
      repoId,
      entryId,
      prefer: CreateMaxPageSizePreferHeaderPayload(maxPageSize),
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink != null) {
      response = await getNextLinkListing<generated.ODataValueContextOfIListOfWEntryLinkInfo>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processGetLinkValuesFromEntry,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }

  async GetTagsAssignedToEntryForEach(args: {
    callback: (response: generated.ODataValueContextOfIListOfWTagInfo) => Promise<boolean>;
    repoId: string;
    entryId: number;
    prefer?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repoId, entryId, prefer, select, orderby, top, skip, count, maxPageSize } = args;
    var response = await this.getTagsAssignedToEntry({
      repoId,
      entryId,
      prefer: CreateMaxPageSizePreferHeaderPayload(maxPageSize),
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
        this.processGetTagsAssignedToEntry,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }

  async getEntryListingNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfIListOfEntry> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfIListOfEntry>(
      // @ts-ignore: allow sub class to use private variable from the super class
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
      // @ts-ignore: allow sub class to use private variable from the super class
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
      // @ts-ignore: allow sub class to use private variable from the super class
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
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processGetTagsAssignedToEntry,
      nextLink,
      maxPageSize
    );
  }
}
