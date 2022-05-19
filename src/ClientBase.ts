import * as generated from './index';
import { UrlUtils } from '@laserfiche/lf-js-utils';
import { OAuthClientCredentialsHandler, HttpRequestHandler } from '@laserfiche/lf-api-client-core';

class ClientBase {
    
}

// @ts-ignore
class RepositoryApiClient extends generated.Client {
    private baseUrl: string;

    public attributesClient: generated.IAttributesClient
    public auditReasonsClient: generated.IAuditReasonsClient 
    public entriesClient: generated.IEntriesClient 
    public fieldDefinitionsClient: generated.IFieldDefinitionsClient  
    public repositoriesClient: generated.IRepositoriesClient 
    public searchesClient: generated.ISearchesClient 
    public serverSessionClient: generated.IServerSessionClient  
    public simpleSearchesClient: generated.ISimpleSearchesClient 
    public tagDefinitionsClient: generated.ITagDefinitionsClient 
    public tasksClient: generated.ITasksClient 
    public templateDefinitionsClient: generated.ITemplateDefinitionsClient 

    private constructor(baseUrlDebug?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super();

        this.baseUrl = baseUrlDebug ?? "";

        this.attributesClient = new generated.AttributesClient(baseUrlDebug, http);
        this.auditReasonsClient = new generated.AuditReasonsClient(baseUrlDebug, http);
        this.entriesClient = new generated.EntriesClient(baseUrlDebug, http);
        this.fieldDefinitionsClient = new generated.FieldDefinitionsClient(baseUrlDebug, http);
        this.repositoriesClient = new generated.RepositoriesClient(baseUrlDebug, http);
        this.searchesClient = new generated.SearchesClient(baseUrlDebug, http);
        this.serverSessionClient = new generated.ServerSessionClient(baseUrlDebug, http);
        this.simpleSearchesClient = new generated.SimpleSearchesClient(baseUrlDebug, http);
        this.tagDefinitionsClient = new generated.TagDefinitionsClient(baseUrlDebug, http);
        this.tasksClient = new generated.TasksClient(baseUrlDebug, http);
        this.templateDefinitionsClient = new generated.TemplateDefinitionsClient(baseUrlDebug, http);
    }

    public static createClientFromHttpRequestHandler(httpRequestHandler: HttpRequestHandler, baseUrlDebug?: string): RepositoryApiClient {
        if (!httpRequestHandler) 
            throw new Error("Argument cannot be null: httpRequestHandler");
        
        let repoClientHandler = new RepositoryApiClientHttpHandler(httpRequestHandler);
        let httpHandler = {
            fetch: repoClientHandler.httpHandler
        }
        let repoClient = new RepositoryApiClient(baseUrlDebug, httpHandler);

        return repoClient;
    }

    public static createClientFromClientCredentialsHandler(servicePrincipalKey: string, accessKey: string, baseUrlDebug?: string): RepositoryApiClient {
        let handler = new OAuthClientCredentialsHandler(accessKey, servicePrincipalKey);
        return RepositoryApiClient.createClientFromHttpRequestHandler(handler, baseUrlDebug);
    }
}

/** @internal */
export class RepositoryApiClientHttpHandler {
    private _httpRequestHandler: HttpRequestHandler;
    
    constructor(httpRequestHandler: HttpRequestHandler) {
       this._httpRequestHandler = httpRequestHandler; 
    }

    public async httpHandler(url: string, init: RequestInit): Promise<Response>{
        const maxRetries = 1;
        let retryCount = 0;
        let shouldRetry = true;
        let lastResponse;
        while (retryCount <= maxRetries && shouldRetry) {
            const beforeSendResult = await this._httpRequestHandler.beforeFetchRequestAsync(url, init);
            const absoluteUrl = UrlUtils.combineURLs(beforeSendResult.regionalDomain, url);
    
            try {
                let response = await fetch(absoluteUrl, init);
                lastResponse = response;
                shouldRetry = await this._httpRequestHandler.afterFetchResponseAsync(absoluteUrl, response, init)
                                || ((response.status >= 500 || response.status == 408)
                                && init.method != "POST");
                if (!shouldRetry) return response;
                retryCount++;
            } catch (err) {
                console.error(err);
            }
        }
        return lastResponse ?? await fetch(url, init);
    }
}




