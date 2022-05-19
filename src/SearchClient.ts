import {ClientOptions} from './ClientHelper';
import {ODataValueContextOfIListOfContextHit, ODataValueContextOfIListOfODataGetSearchResults} from './index';

export class SearchClient extends ClientOptions{
    async GetSearchResultsNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfODataGetSearchResults> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfODataGetSearchResults>(this.http, this.processGetSearchResults, nextLink, maxPageSize);
    }
    async GetSearchContextHitsNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfIListOfContextHit> {
        return await this.getNextLinkListing<ODataValueContextOfIListOfContextHit>(this.http, this.processGetSearchContextHits, nextLink, maxPageSize);
    }
}