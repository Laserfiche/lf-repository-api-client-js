import { ODataValueContextOfListOfAttribute, Client } from './index';
import { options } from '../test/config';
import { ClientOptions } from './ClientHelper';

export class AttributeClient extends ClientOptions {

    async getTrusteeAttributeKeyValuePairsNextLink(nextLink: string, maxPageSize?: number): Promise<ODataValueContextOfListOfAttribute> {
        return await this.getNextLinkListing<ODataValueContextOfListOfAttribute>(this.http, this.processGetTrusteeAttributeKeyValuePairs, nextLink, maxPageSize);
    }
}