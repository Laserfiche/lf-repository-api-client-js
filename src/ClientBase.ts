import * as generated from './index';
import { UrlUtils, JwtUtils } from '@laserfiche/lf-js-utils';
import { GetRepoIdFromUri } from './ClientUtils.js';

// This file is a template copied and pasted into the NSwag index.ts to extend the generated Client classes
// Do not refactor content into different modules because NSwag will not be able to resolve it, since this file is
// just copied and pasted

/**
 * Configuration parameters to create API client
 */
export interface ClientOptions {
    /**
     * Called to prepare the request to the API service
     * Returns the access token
     */
    beforeFetchRequestAsync: (
        url: string,
        request: RequestInit
    ) => Promise<string>;

    /**
     * Called to handle the response from the API service
     * Returns true if the request should be retried
     */
    afterFetchResponseAsync: (
        url: string,
        response: Response,
        request: RequestInit
    ) => Promise<boolean>;
}

class ClientBase {
    
}

// @ts-ignore
class Client extends generated.Client {
    private _baseUrl: string = "";
    private _accessToken?: string;
    private _serverSessionsCreated: { [x: string]: string};
    private beforeFetchRequestAsync: (
        url: string,
        request: RequestInit
    ) => Promise<string>;
    private afterFetchResponseAsync: (
        url: string,
        response: Response,
        request: RequestInit
    ) => Promise<boolean>;
    private serviceBaseUrlDebug: string | undefined;


    constructor(options: ClientOptions, serviceBaseUrlDebug?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        // @ts-ignore
        super();
        let client = this;
        this._serverSessionsCreated = {};

        // @ts-ignore
        this.http = http ? http : {
            fetch: client.httpHandler.bind(this)
        }

        this.beforeFetchRequestAsync = options.beforeFetchRequestAsync;
        this.afterFetchResponseAsync = options.afterFetchResponseAsync;
        this.serviceBaseUrlDebug = serviceBaseUrlDebug;
        // @ts-ignore
        this.baseUrl = "";
    }

    /** @internal */
    private setAuthorizationHeader(options: any) {
        if (this._accessToken) {
            options.headers["Authorization"] = "Bearer " + this._accessToken;
        } else {
            console.warn("Authorization bearer token has not been set.");
        }
    }

    /** @internal */
    private async tryCreateServerSession(url: string) : Promise<string | undefined> {
        url = url.toLowerCase();
        let repoId = GetRepoIdFromUri(url);
        if (repoId && !(repoId in this._serverSessionsCreated) && this._accessToken 
            && !url.endsWith("/serversession/create")) {
            await this.createServerSession(repoId);
        }
        return repoId;
    }

    /** @internal */
    private afterServerSessionCreated(response: Response, repoId: string | undefined) : void {
        let url = response.url.toLowerCase();

        if (response.ok && repoId) {
            if (!(repoId in this._serverSessionsCreated) && url.endsWith("/serversession/create")) {
                this._serverSessionsCreated[repoId] = repoId;
            } else if (url.endsWith("/serversession/invalidate")) {
                delete this._serverSessionsCreated[repoId];
            }
        }
        
        if (response.status === 401 && repoId) {
            delete this._serverSessionsCreated[repoId];
        }
    }


    /** @internal */
    private async getAbsoluteUrlFromToken(accessToken: string, url: string, init: RequestInit): Promise<string> {
        const hasAccessTokenChanged = accessToken !== this._accessToken;
        this._accessToken = accessToken;
        if (this._accessToken) {
            this.setAuthorizationHeader(init);
            try {
                if (hasAccessTokenChanged) {
                    this._baseUrl = this.calcBaseUrl(this._accessToken, this.serviceBaseUrlDebug);
                }

                const absoluteUrl = url.startsWith("http") ? url : UrlUtils.combineURLs(this._baseUrl, url);
                return absoluteUrl;
            } catch {
                throw "There was a problem with the access token."
            }
        }
        throw "Access token not set.";
    }

    /** @internal */
    private calcBaseUrl(accessToken: string, serviceBaseUrlDebug: string | undefined) {
        const jwt = JwtUtils.parseAccessToken(accessToken);
        const accountId = JwtUtils.getAccountIdFromLfJWT(jwt);
        const lfEndpoints = JwtUtils.getLfEndpoints(accountId);
        const baseUrl = serviceBaseUrlDebug ?? lfEndpoints.repositoryApiBaseUrl;
        return baseUrl;
    }

    /** @internal */
    private async httpHandler(url: string, init: RequestInit): Promise<Response | undefined>{
        const maxRetries = 1;
        let retryCount = 0;
        let shouldRetry = true;
        while (retryCount <= maxRetries && shouldRetry) {
            const accessToken = await this.beforeFetchRequestAsync(url, init);
            const absoluteUrl = await this.getAbsoluteUrlFromToken(accessToken, url, init);
            const repoId = await this.tryCreateServerSession(absoluteUrl);

            try {
                let response = await fetch(absoluteUrl, init);
                this.afterServerSessionCreated(response, repoId);
                shouldRetry = await this.afterFetchResponseAsync(absoluteUrl, response, init)
                                || ((response.status >= 500 || response.status == 408)
                                && init.method != "POST");
                if (!shouldRetry) return response;
                retryCount++;
            } catch (err) {
                console.error(err);
            }
        }
        

    }

}

