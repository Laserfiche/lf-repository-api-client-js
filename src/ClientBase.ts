import * as generated from './index.js';
import { UrlUtils } from '@laserfiche/lf-js-utils';
import {
  OAuthClientCredentialsHandler,
  HttpRequestHandler,
  DomainUtils,
  AccessKey,
} from '@laserfiche/lf-api-client-core';
import { IAttributeClientEx, AttributesClient } from './AttributeClientEx';
import { EntriesClientEx, IEntriesClientEx } from './EntriesClientEx.js';
import { IFieldDefinitionsClientEx, FieldDefinitionClient } from './FieldDefinitionsClientEx';
import { ISearchEx, SearchClientEx } from './SearchesClientEx.js';
import { ITagDefinitionsEx, TagDefinitionsEx } from './TagDefinitionsEx.js';
import { ITemplateDefinitionsEx, TemplateDefinitionsEx } from './TemplateDefinitions.js';
class ClientBase {}
export interface IRepositoryApiClient {
  attributesClient: IAttributeClientEx;
  auditReasonsClient: generated.IAuditReasonsClient;
  entriesClient: IEntriesClientEx;
  fieldDefinitionsClient: IFieldDefinitionsClientEx;
  repositoriesClient: generated.IRepositoriesClient;
  searchesClient: ISearchEx;
  serverSessionClient: generated.IServerSessionClient;
  simpleSearchesClient: generated.ISimpleSearchesClient;
  tagDefinitionsClient: ITagDefinitionsEx;
  tasksClient: generated.ITasksClient;
  templateDefinitionsClient: ITemplateDefinitionsEx;
}
// @ts-ignore
export class RepositoryApiClient implements IRepositoryApiClient {
  private baseUrl: string;

  public attributesClient: IAttributeClientEx;
  public auditReasonsClient: generated.IAuditReasonsClient;
  public entriesClient: IEntriesClientEx;
  public fieldDefinitionsClient: IFieldDefinitionsClientEx;
  public repositoriesClient: generated.IRepositoriesClient;
  public searchesClient: ISearchEx;
  public serverSessionClient: generated.IServerSessionClient;
  public simpleSearchesClient: generated.ISimpleSearchesClient;
  public tagDefinitionsClient: ITagDefinitionsEx;
  public tasksClient: generated.ITasksClient;
  public templateDefinitionsClient: ITemplateDefinitionsEx;

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
    this.attributesClient = new AttributesClient(this.baseUrl, http);
    this.auditReasonsClient = new generated.AuditReasonsClient(this.baseUrl, http);
    this.entriesClient = new EntriesClientEx(this.baseUrl, http);
    this.fieldDefinitionsClient = new FieldDefinitionClient(this.baseUrl, http);
    this.repositoriesClient = new generated.RepositoriesClient(this.baseUrl, http);
    this.searchesClient = new SearchClientEx(this.baseUrl, http);
    this.serverSessionClient = new generated.ServerSessionClient(this.baseUrl, http);
    this.simpleSearchesClient = new generated.SimpleSearchesClient(this.baseUrl, http);
    this.tagDefinitionsClient = new TagDefinitionsEx(this.baseUrl, http);
    this.tasksClient = new generated.TasksClient(this.baseUrl, http);
    this.templateDefinitionsClient = new TemplateDefinitionsEx(this.baseUrl, http);
  }

  public static createFromHttpRequestHandler(
    httpRequestHandler: HttpRequestHandler,
    baseUrlDebug?: string
  ): RepositoryApiClient {
    if (!httpRequestHandler) throw new Error('Argument cannot be null: httpRequestHandler');
    let repoClient = new RepositoryApiClient(httpRequestHandler, baseUrlDebug);
    return repoClient;
  }

  public static createFromAccessKey(
    servicePrincipalKey: string,
    accessKey: AccessKey,
    baseUrlDebug?: string
  ): RepositoryApiClient {
    let handler = new OAuthClientCredentialsHandler(servicePrincipalKey, accessKey);
    return RepositoryApiClient.createFromHttpRequestHandler(handler, baseUrlDebug);
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
