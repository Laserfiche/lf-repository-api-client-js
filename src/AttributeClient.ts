import { ODataValueContextOfListOfAttribute, ClientOptions } from './index';
import {BaseClient} from './BaseClient';
import { setUncaughtExceptionCaptureCallback } from 'process';

export class AttributeClient extends BaseClient{
    // constructor(){
    //     let options: ClientOptions = {
    //         beforeFetchRequestAsync: this.beforeFetchRequestAsync,
    //         afterFetchResponseAsync: this.afterFetchResponseAsync
    //    }
    //     super(options);
    // }

    async getTrusteeAttributeKeyValuePairsNextLink(nextLink: string, maxPageSize?: number):Promise<ODataValueContextOfListOfAttribute>{
        return await this.getNextLinkListing<ODataValueContextOfListOfAttribute>(this.processGetTrusteeAttributeKeyValuePairs, nextLink, maxPageSize);
    }
}