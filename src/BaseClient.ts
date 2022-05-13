import {Client, IODataValueContextOfIListOfODataEntry, ODataValueContextOfIListOfFieldValue} from './index';

export class BaseClient extends Client{
    async getNextLinkListing<T extends IODataValueContextOfIListOfODataEntry>(processListing: (response: Response) => Promise<T>, nextLink: string, maxPageSize?: number): Promise<T> {
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
        //console.log(options_);
        //console.log(nextLink);
        //console.log(processListing);
        return this.http.fetch(nextLink, options_).then((_response: Response) => {
            return processListing(_response);
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