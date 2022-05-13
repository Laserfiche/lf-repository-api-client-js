import {BaseClient} from './BaseClient';
import {ODataValueContextOfIListOfODataEntry, ODataValueContextOfIListOfFieldValue, 
    ODataValueContextOfIListOfWEntryLinkInfo, ODataValueContextOfIListOfWTagInfo} from './index';

export class EntryClient extends BaseClient {
    async getEntryListingNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfODataEntry> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfODataEntry>(this.processGetEntryListing, nextLink, maxPageSize);
    }

    async getFieldValuesNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfFieldValue> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfFieldValue>(this.processGetFieldValues, nextLink, maxPageSize);
    }

    async getLinkValuesFromEntryNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfWEntryLinkInfo>{
        return await this.getNextLinkListing<ODataValueContextOfIListOfWEntryLinkInfo>(this.processGetLinkValuesFromEntry, nextLink, maxPageSize);
    }

    async getTagsAssignedToEntryNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfWTagInfo>{
        return await this.getNextLinkListing<ODataValueContextOfIListOfWEntryLinkInfo>(this.processGetTagsAssignedToEntry, nextLink, maxPageSize);
    }
}