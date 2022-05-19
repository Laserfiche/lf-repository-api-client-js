import {ClientOptions} from './ClientHelper';
import {ODataValueContextOfIListOfODataGetEntryChildren, ODataValueContextOfIListOfFieldValue, 
    ODataValueContextOfIListOfWEntryLinkInfo, ODataValueContextOfIListOfWTagInfo} from './index';

export class EntryClient extends ClientOptions {
    async getEntryListingNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfODataGetEntryChildren> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfODataGetEntryChildren>(this.http, this.processGetEntryListing, nextLink, maxPageSize);
    }

    async getFieldValuesNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfFieldValue> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfFieldValue>(this.http, this.processGetFieldValues, nextLink, maxPageSize);
    }

    async getLinkValuesFromEntryNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfWEntryLinkInfo>{
        return await this.getNextLinkListing<ODataValueContextOfIListOfWEntryLinkInfo>(this.http, this.processGetLinkValuesFromEntry, nextLink, maxPageSize);
    }

    async getTagsAssignedToEntryNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfWTagInfo>{
        return await this.getNextLinkListing<ODataValueContextOfIListOfWEntryLinkInfo>(this.http, this.processGetTagsAssignedToEntry, nextLink, maxPageSize);
    }
}