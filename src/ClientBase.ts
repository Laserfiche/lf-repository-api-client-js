import * as generated from './index';
import { UrlUtils } from '@laserfiche/lf-js-utils';
import { OAuthClientCredentialsHandler, HttpRequestHandler, DomainUtils } from '@laserfiche/lf-api-client-core';

class ClientBase {}
export interface IRepositoryApiClient {
  attributesClient: generated.IAttributesClient;
  auditReasonsClient: generated.IAuditReasonsClient;
  entriesClient: generated.IEntriesClient;
  fieldDefinitionsClient: generated.IFieldDefinitionsClient;
  repositoriesClient: generated.IRepositoriesClient;
  searchesClient: generated.ISearchesClient;
  serverSessionClient: generated.IServerSessionClient;
  simpleSearchesClient: generated.ISimpleSearchesClient;
  tagDefinitionsClient: generated.ITagDefinitionsClient;
  tasksClient: generated.ITasksClient;
  templateDefinitionsClient: generated.ITemplateDefinitionsClient;
}
// @ts-ignore
export class RepositoryApiClient {
  private baseUrl: string;

  public attributesClient: generated.IAttributesClient;
  public auditReasonsClient: generated.IAuditReasonsClient;
  public entriesClient: generated.IEntriesClient;
  public fieldDefinitionsClient: generated.IFieldDefinitionsClient;
  public repositoriesClient: generated.IRepositoriesClient;
  public searchesClient: generated.ISearchesClient;
  public serverSessionClient: generated.IServerSessionClient;
  public simpleSearchesClient: generated.ISimpleSearchesClient;
  public tagDefinitionsClient: generated.ITagDefinitionsClient;
  public tasksClient: generated.ITasksClient;
  public templateDefinitionsClient: generated.ITemplateDefinitionsClient;

  private repoClientHandler: RepositoryApiClientHttpHandler;

  public get defaultRequestHeaders(): Record<string, string> {
    return this.repoClientHandler.defaultRequestHeaders;
  }

  public set defaultRequestHeaders(headers: Record<string, string>) {
    this.repoClientHandler.defaultRequestHeaders = headers;
  }

  private constructor(httpRequestHandler: HttpRequestHandler, baseUrlDebug?: string) {
    this.repoClientHandler = new RepositoryApiClientHttpHandler(httpRequestHandler);
    let fetch = this.repoClientHandler.httpHandler;
    fetch = fetch.bind(this.repoClientHandler);
    let http = {
      fetch,
    };

    this.baseUrl = baseUrlDebug ?? '';

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

  public static createClientFromHttpRequestHandler(
    httpRequestHandler: HttpRequestHandler,
    baseUrlDebug?: string
  ): RepositoryApiClient {
    if (!httpRequestHandler) throw new Error('Argument cannot be null: httpRequestHandler');
    let repoClient = new RepositoryApiClient(httpRequestHandler, baseUrlDebug);
    return repoClient;
  }

  public static create(servicePrincipalKey: string, accessKey: string, baseUrlDebug?: string): RepositoryApiClient {
    let handler = new OAuthClientCredentialsHandler(servicePrincipalKey, accessKey);
    if (!baseUrlDebug) {
      let accessKeyDomain: string = JSON.parse(accessKey).domain;
      baseUrlDebug = DomainUtils.getRepositoryEndpoint(accessKeyDomain);
    }
    return RepositoryApiClient.createClientFromHttpRequestHandler(handler, baseUrlDebug);
  }
}

/** @internal */
export class RepositoryApiClientHttpHandler {
  private _httpRequestHandler: HttpRequestHandler;
  public defaultRequestHeaders: Record<string, string>;

  constructor(httpRequestHandler: HttpRequestHandler) {
    this._httpRequestHandler = httpRequestHandler;
    this.defaultRequestHeaders = {};
  }

  public async httpHandler(url: string, init: RequestInit): Promise<Response> {
    const maxRetries = 1;
    let retryCount = 0;
    let shouldRetry = true;

    if (this.defaultRequestHeaders) {
      init.headers = Object.assign({}, this.defaultRequestHeaders, init.headers);
    }

    let response: Response | undefined;
    while (retryCount <= maxRetries && shouldRetry) {
      const beforeSendResult = await this._httpRequestHandler.beforeFetchRequestAsync(url, init);
      let absoluteUrl: string;
      if (url.startsWith('http')) {
        absoluteUrl = url;
      } else {
        const apiBasedAddress = DomainUtils.getRepositoryEndpoint(beforeSendResult.regionalDomain);
        absoluteUrl = UrlUtils.combineURLs(apiBasedAddress, url);
      }

      try {
        response = await fetch(absoluteUrl, init);
        shouldRetry =
          (await this._httpRequestHandler.afterFetchResponseAsync(absoluteUrl, response, init)) ||
          isRetryable(response, init);
        if (!shouldRetry) {
          return response;
        }
      } catch (err) {
        if (retryCount >= maxRetries) {
          throw err;
        }
        shouldRetry = true;
        console.warn(`Retrying fetch due to exception: ${err}`);
      } finally {
        retryCount++;
      }
    }
    if (!response) {
      throw new Error('Undefined response, there is a bug!');
    }
    return response;
  }
}

function isRetryable(response: Response, init: RequestInit): boolean {
  const isIdempotent = init.method != 'POST';
  return (response.status >= 500 || response.status == 408) && isIdempotent;
}
