import { AttributeClient } from './AttributeClient';
import {IODataValueContextOfIListOfODataGetEntryChildren, Client} from './index';

export class ClientOptions extends Client{

    getNextLinkListing<T extends IODataValueContextOfIListOfODataGetEntryChildren>(http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }, processListing: (response: Response) => Promise<T>, nextLink: string, maxPageSize?: number): Promise<T> {
        console.log(nextLink);
        if (!nextLink) {
            throw new Error("Next Link is undefined");
        }
        const prefer = this.CreateMaxPageSizePreferHeaderPayload(maxPageSize);
        //console.log(prefer);
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Prefer": prefer !== undefined && prefer !== null ? prefer : "",
                "Accept": "application/json"
            }
        };
        let processListingTwo = processListing.bind(this);
        console.log(processListingTwo);
        return http.fetch(nextLink, options_).then((_response: Response) => {
            return processListingTwo(_response);
        });

    }
    CreateMaxPageSizePreferHeaderPayload(maxSize?: number): string | undefined {
        //puts the max size into the prefer header of the GET request
        if (!maxSize) {
            return undefined;
        }
        else {
            return `maxpagesize=${maxSize}`;
        }
    }


}