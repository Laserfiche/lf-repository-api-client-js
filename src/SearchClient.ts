import {ClientOptions} from './ClientHelper';
import {ODataValueContextOfIListOfContextHit, ODataValueContextOfIListOfODataGetSearchResults} from './index';

export class SearchClient extends ClientOptions{
    async GetSearchResultsForEach(callback: (response: ODataValueContextOfIListOfODataGetSearchResults) => Promise<boolean>, repoId:string, searchToken:string, groupByEntryType?:boolean, refresh?:boolean, fields?:string[], formatFields?:boolean, prefer?:string, culture?:string, select?:string, orderby?:string, top?:number,skip?:number, count?:boolean, maxPageSize?:number): Promise<void> {
        var response = await this.getSearchResults(repoId, searchToken, groupByEntryType, refresh, fields, formatFields, this.CreateMaxPageSizePreferHeaderPayload(maxPageSize), culture, select, orderby, top, skip, count);
        let nextLink = response.odataNextLink;
        while (await callback(response) && nextLink != null)
        {
            response = await this.getNextLinkListing<ODataValueContextOfIListOfODataGetSearchResults>(this.http, this.processGetSearchResults, nextLink, maxPageSize);
            nextLink = response.odataNextLink;
        }
    }
    async GetSearchContextHitsForEach(callback: (response: ODataValueContextOfIListOfContextHit) => Promise<boolean>, repoId:string, searchToken:string, rowNumber:number,prefer?:string,select?:string, orderby?:string,top?:number,skip?:number,count?:boolean,maxPageSize?:number): Promise<void> {
        var response = await this.getSearchContextHits(repoId, searchToken, rowNumber, this.CreateMaxPageSizePreferHeaderPayload(maxPageSize), select, orderby, top, skip, count);
        let nextLink = response.odataNextLink;
        while (await callback(response) && nextLink != null)
        {
            response = await this.getNextLinkListing<ODataValueContextOfIListOfContextHit>(this.http, this.processGetSearchContextHits, nextLink, maxPageSize);
            nextLink = response.odataNextLink;
        }
    }
    async GetSearchResultsNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfODataGetSearchResults> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfODataGetSearchResults>(this.http, this.processGetSearchResults, nextLink, maxPageSize);
    }
    async GetSearchContextHitsNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfContextHit> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfContextHit>(this.http, this.processGetSearchContextHits, nextLink, maxPageSize);
    }
}