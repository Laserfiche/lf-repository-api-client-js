import { ODataValueContextOfListOfAttribute, Client } from './index';
import { ClientOptions } from './ClientHelper';

export class AttributeClient extends ClientOptions {
    
    async GetTrusteeAttributeKeyValuePairsForEach(callback: (response: ODataValueContextOfListOfAttribute) => Promise<boolean>, repoId: string, everyone?: boolean, select?: string, orderby?: string, top?: number, skip?: number, count?: boolean, maxPageSize?: number): Promise<void> {
        var response = await this.getTrusteeAttributeKeyValuePairs(repoId, everyone, this.CreateMaxPageSizePreferHeaderPayload(maxPageSize), select, orderby, top, skip, count);
        let nextLink = response.odataNextLink;
        while (await callback(response) && nextLink != null)
        {
            response = await this.getNextLinkListing<ODataValueContextOfListOfAttribute>(this.http, this.processGetTrusteeAttributeKeyValuePairs, nextLink, maxPageSize);
            nextLink = response.odataNextLink;
        }
    }
    async getTrusteeAttributeKeyValuePairsNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfListOfAttribute> {
        return await this.getNextLinkListing<ODataValueContextOfListOfAttribute>(this.http, this.processGetTrusteeAttributeKeyValuePairs, nextLink, maxPageSize);
    }
}