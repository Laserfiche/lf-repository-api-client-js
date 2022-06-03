import * as generated from './index.js';
import { UrlUtils } from '@laserfiche/lf-js-utils';
import {
  OAuthClientCredentialsHandler,
  HttpRequestHandler,
  DomainUtils,
  AccessKey,
} from '@laserfiche/lf-api-client-core';
import { getNextLinkListing } from './ClientHelper.js';
export interface IRepositoryApiClient {
  attributesClient: IAttributesClient;
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
export class RepositoryApiClient implements IRepositoryApiClient {
  private baseUrl: string;

  public attributesClient: IAttributesClient;
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
    this.attributesClient = new AttributesClient(this.baseUrl, http);
    this.auditReasonsClient = new generated.AuditReasonsClient(this.baseUrl, http);
    this.entriesClient = new generated.EntriesClient(this.baseUrl, http);
    this.fieldDefinitionsClient = new generated.FieldDefinitionsClient(this.baseUrl, http);
    this.repositoriesClient = new generated.RepositoriesClient(this.baseUrl, http);
    this.searchesClient = new generated.SearchesClient(this.baseUrl, http);
    this.serverSessionClient = new generated.ServerSessionClient(this.baseUrl, http);
    this.simpleSearchesClient = new generated.SimpleSearchesClient(this.baseUrl, http);
    this.tagDefinitionsClient = new generated.TagDefinitionsClient(this.baseUrl, http);
    this.tasksClient = new generated.TasksClient(this.baseUrl, http);
    this.templateDefinitionsClient = new generated.TemplateDefinitionsClient(this.baseUrl, http);
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

export interface IAttributesClient {
  getTrusteeAttributeKeyValuePairsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfListOfAttribute>;
}
export class AttributesClient extends generated.AttributesClient {
  async getTrusteeAttributeKeyValuePairsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.ODataValueContextOfListOfAttribute> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.ODataValueContextOfListOfAttribute>(
      // @ts-ignore:
      this.http,
      this.processGetTrusteeAttributeKeyValuePairs,
      nextLink,
      maxPageSize
    );
  }
}

export interface IEntriesClientEx extends generated.IEntriesClient {
  getEntryListingNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfEntry>;
  getFieldValuesNextLink(
    nextLink: string,
    maxPageSize?: number
  ): Promise<generated.ODataValueContextOfIListOfFieldValue>;
  getLinkValuesFromEntryNextLink(
    nextLink: string,
    maxPageSize?: number
  ): Promise<generated.ODataValueContextOfIListOfWEntryLinkInfo>;
  getTagsAssignedToEntryNextLink(
    nextLink: string,
    maxPageSize?: number
  ): Promise<generated.ODataValueContextOfIListOfWTagInfo>;
}
export class EntriesClientEx extends generated.EntriesClient implements IEntriesClientEx {
  private _http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
  constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
    super(baseUrl, http);
    if (!http) {
      throw new Error(`http is undefined`);
    }
    this._http = http;
  }
  async getEntryListingNextLink(
    nextLink: string,
    maxPageSize?: number
  ): Promise<generated.ODataValueContextOfIListOfEntry> {
    return await getNextLinkListing<generated.ODataValueContextOfIListOfEntry>(
      this._http,
      this.processGetEntryListing,
      nextLink,
      maxPageSize
    );
  }

  async getFieldValuesNextLink(
    nextLink: string,
    maxPageSize?: number
  ): Promise<generated.ODataValueContextOfIListOfFieldValue> {
    return await getNextLinkListing<generated.ODataValueContextOfIListOfFieldValue>(
      this._http,
      this.processGetFieldValues,
      nextLink,
      maxPageSize
    );
  }

  async getLinkValuesFromEntryNextLink(
    nextLink: string,
    maxPageSize?: number
  ): Promise<generated.ODataValueContextOfIListOfWEntryLinkInfo> {
    return await getNextLinkListing<generated.ODataValueContextOfIListOfWEntryLinkInfo>(
      this._http,
      this.processGetLinkValuesFromEntry,
      nextLink,
      maxPageSize
    );
  }

  async getTagsAssignedToEntryNextLink(
    nextLink: string,
    maxPageSize?: number
  ): Promise<generated.ODataValueContextOfIListOfWTagInfo> {
    return await getNextLinkListing<generated.ODataValueContextOfIListOfWEntryLinkInfo>(
      this._http,
      this.processGetTagsAssignedToEntry,
      nextLink,
      maxPageSize
    );
  }
}

export interface IFieldDefinitionsEx extends generated.IFieldDefinitionsClient {
  getEntryListingNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfEntry>;
}

export class FieldDefinitionClient extends generated.FieldDefinitionsClient{
  private _http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
  constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
    super(baseUrl, http);
    if (!http) {
      throw new Error(`http is undefined`);
    }
    this._http = http;
  }
    async getFieldDefinitionsNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfWFieldInfo> {
        return await getNextLinkListing<generated.ODataValueContextOfIListOfWFieldInfo>(this._http, this.processGetFieldDefinitions, nextLink, maxPageSize);
    }
}

export interface ISearchEx extends generated.ISearchesClient {
  GetSearchResultsNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfEntry>;
  GetSearchContextHitsNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfContextHit>;
}

export class SearchClient extends generated.SearchesClient{
  private _http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
  constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
    super(baseUrl, http);
    if (!http) {
      throw new Error(`http is undefined`);
    }
    this._http = http;
  }
    async GetSearchResultsNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfEntry> {
        return await getNextLinkListing<generated.ODataValueContextOfIListOfEntry>(this._http, this.processGetSearchResults, nextLink, maxPageSize);
    }
    async GetSearchContextHitsNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfContextHit> {
        return await getNextLinkListing<generated.ODataValueContextOfIListOfContextHit>(this._http, this.processGetSearchContextHits, nextLink, maxPageSize);
    }
}


export interface ITagDefinitionsEx extends generated.ITagDefinitionsClient {
  getTagDefinitionsNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfWTagInfo>;
}

export class TagDefinitionsEx extends generated.TagDefinitionsClient{
  private _http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
  constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
    super(baseUrl, http);
    if (!http) {
      throw new Error(`http is undefined`);
    }
    this._http = http;
  }
  async getTagDefinitionsNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfWTagInfo> {
    return await getNextLinkListing<generated.ODataValueContextOfIListOfWTagInfo>(this._http, this.processGetTagDefinitions, nextLink, maxPageSize);
}
}

export interface ITemplateDefinitionsEx extends generated.ITemplateDefinitionsClient {
  getTemplateDefinitionsNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfWTemplateInfo>;
  getTemplateFieldDefinitionsNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfTemplateFieldInfo>;
  getTemplateFieldDefinitionsByTemplateNameNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfTemplateFieldInfo>;
}

export class TemplateDefinitionsEx extends generated.TemplateDefinitionsClient{
  private _http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
  constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
    super(baseUrl, http);
    if (!http) {
      throw new Error(`http is undefined`);
    }
    this._http = http;
  }
    async getTemplateDefinitionsNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfWTemplateInfo> {
        return await getNextLinkListing<generated.ODataValueContextOfIListOfWTemplateInfo>(this._http, this.processGetTemplateDefinitions, nextLink, maxPageSize);
    }
    async getTemplateFieldDefinitionsNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfTemplateFieldInfo> {
        return await getNextLinkListing<generated.ODataValueContextOfIListOfTemplateFieldInfo>(this._http, this.processGetTemplateFieldDefinitions, nextLink, maxPageSize);
    }
    async getTemplateFieldDefinitionsByTemplateNameNextLink(nextLink: string, maxPageSize?: number): Promise<generated.ODataValueContextOfIListOfTemplateFieldInfo> {
        return await getNextLinkListing<generated.ODataValueContextOfIListOfTemplateFieldInfo>(this._http, this.processGetTemplateFieldDefinitionsByTemplateName, nextLink, maxPageSize);
    }
}