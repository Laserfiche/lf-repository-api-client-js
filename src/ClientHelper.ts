import {IODataValueContextOfIListOfEntry} from './index';

export async function getNextLinkListing<T extends IODataValueContextOfIListOfEntry>(http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }, processListing: (response: Response) => Promise<T>, nextLink: string, maxPageSize?: number): Promise<T> {
        if (!nextLink) {
            throw new Error("Next Link is undefined");
        }
        const prefer = CreateMaxPageSizePreferHeaderPayload(maxPageSize);
        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Prefer": prefer !== undefined && prefer !== null ? prefer : "",
                "Accept": "application/json"
            }
        };
        console.log(processListing);
        let processListingTwo = processListing.bind(http);
        return http.fetch(nextLink, options_).then((_response: Response) => {
            return processListingTwo(_response);
        });


function CreateMaxPageSizePreferHeaderPayload(maxSize?: number): string | undefined {
        //puts the max size into the prefer header of the GET request
        if (!maxSize) {
            return undefined;
        }
        else {
            return `maxpagesize=${maxSize}`;
        }
    }
}