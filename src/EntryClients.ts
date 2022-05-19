import {ClientOptions} from './ClientHelper';
import {ODataValueContextOfIListOfODataGetEntryChildren, ODataValueContextOfIListOfFieldValue, 
    ODataValueContextOfIListOfWEntryLinkInfo, ODataValueContextOfIListOfWTagInfo} from './index';

export class EntryClient extends ClientOptions {
    async GetEntryListingForEach(callback: (response: ODataValueContextOfIListOfODataGetEntryChildren) => Promise<boolean>, repoId: string, entryId: number, groupByEntryType?: boolean, fields?: string[], formatFields?:boolean, prefer?:string, culture?:string, select?:string, orderby?:string, top?:number, skip?:number, count?:boolean,maxPageSize?:number): Promise<void> {
        var response = await this.getEntryListing(repoId, entryId, groupByEntryType, fields, formatFields, this.CreateMaxPageSizePreferHeaderPayload(maxPageSize), culture, select, orderby, top, skip, count);
        let nextLink = response.odataNextLink;
        while (await callback(response) && nextLink != null)
        {
            response = await this.getNextLinkListing<ODataValueContextOfIListOfODataGetEntryChildren>(this.http, this.processGetEntryListing, nextLink, maxPageSize);
            nextLink = response.odataNextLink;
        }
    }

    async GetFieldValuesForEach(callback: (response: ODataValueContextOfIListOfFieldValue) => Promise<boolean>, repoId: string, entryId:number, prefer?:string, formatValue?:boolean, culture?:string, select?:string, orderby?:string, top?:number, skip?:number, count?:boolean, maxPageSize?:number): Promise<void> {
        var response = await this.getFieldValues(repoId, entryId, this.CreateMaxPageSizePreferHeaderPayload(maxPageSize), formatValue, culture, select, orderby, top, skip, count);
        let nextLink = response.odataNextLink;
        while (await callback(response) && nextLink != null)
        {
            response = await this.getNextLinkListing<ODataValueContextOfIListOfFieldValue>(this.http, this.processGetFieldValues, nextLink, maxPageSize);
            nextLink = response.odataNextLink;
        }
    }

    async GetLinkValuesFromEntryForEach(callback: (response: ODataValueContextOfIListOfWEntryLinkInfo) => Promise<boolean>, repoId:string, entryId:number, prefer?:string, select?:string, orderby?:string, top?:number, skip?:number, count?:boolean, maxPageSize?:number): Promise<void> {
        var response = await this.getLinkValuesFromEntry(repoId, entryId, this.CreateMaxPageSizePreferHeaderPayload(maxPageSize), select, orderby, top, skip, count);
        let nextLink = response.odataNextLink;
        while (await callback(response) && nextLink != null)
        {
            response = await this.getNextLinkListing<ODataValueContextOfIListOfWEntryLinkInfo>(this.http, this.processGetLinkValuesFromEntry, nextLink, maxPageSize);
            nextLink = response.odataNextLink;
        }
    }

    async GetTagsAssignedToEntryForEach(callback: (response: ODataValueContextOfIListOfWTagInfo) => Promise<boolean>, repoId:string, entryId:number, prefer?:string, select?:string, orderby?:string, top?:number, skip?:number, count?:boolean, maxPageSize?:number): Promise<void> {
        var response = await this.getTagsAssignedToEntry(repoId, entryId, this.CreateMaxPageSizePreferHeaderPayload(maxPageSize), select, orderby, top, skip, count);
        let nextLink = response.odataNextLink;
        while (await callback(response) && nextLink != null)
        {
            response = await this.getNextLinkListing<ODataValueContextOfIListOfWTagInfo>(this.http, this.processGetTagsAssignedToEntry, nextLink, maxPageSize);
            nextLink = response.odataNextLink;
        }
    }

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