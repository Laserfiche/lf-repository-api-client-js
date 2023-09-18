import * as generated from './index.js';
import * as fsPromise from 'fs/promises';
import { UrlUtils, StringUtils } from '@laserfiche/lf-js-utils';
import {
  UsernamePasswordHandler,
  OAuthClientCredentialsHandler,
  HttpRequestHandler,
  DomainUtils,
  AccessKey,
  ApiException as ApiExceptionCore,
} from '@laserfiche/lf-api-client-core';
import { repositoryId } from '../test/TestHelper.js';
import { url } from 'inspector';
class ClientBase {}
export interface IRepositoryApiClient {
  attributesClient: IAttributesClient;
  auditReasonsClient: generated.IAuditReasonsClient;
  entriesClient: IEntriesClient;
  fieldDefinitionsClient: IFieldDefinitionsClient;
  repositoriesClient: generated.IRepositoriesClient;
  searchesClient: ISearchesClient;
  simpleSearchesClient: generated.ISimpleSearchesClient;
  tagDefinitionsClient: ITagDefinitionsClient;
  tasksClient: generated.ITasksClient;
  templateDefinitionsClient: ITemplateDefinitionsClient;
  linkDefinitionsClient: ILinkDefinitionsClient;
  defaultRequestHeaders: Record<string, string>;
}

// @ts-ignore
export class RepositoryApiClient implements IRepositoryApiClient {
  private baseUrl: string;

  public attributesClient: IAttributesClient;
  public auditReasonsClient: generated.IAuditReasonsClient;
  public entriesClient: IEntriesClient;
  public fieldDefinitionsClient: IFieldDefinitionsClient;
  public repositoriesClient: generated.IRepositoriesClient;
  public searchesClient: ISearchesClient;
  public simpleSearchesClient: generated.ISimpleSearchesClient;
  public tagDefinitionsClient: ITagDefinitionsClient;
  public tasksClient: generated.ITasksClient;
  public templateDefinitionsClient: ITemplateDefinitionsClient;
  public linkDefinitionsClient: ILinkDefinitionsClient;

  private repoClientHandler: RepositoryApiClientHttpHandler;

  /**
   * Get the headers which will be sent with each request.
   */
  public get defaultRequestHeaders(): Record<string, string> {
    return this.repoClientHandler.defaultRequestHeaders;
  }

  /**
   * Set the headers which will be sent with each request.
   */
  public set defaultRequestHeaders(headers: Record<string, string>) {
    this.repoClientHandler.defaultRequestHeaders = headers;
  }

  private constructor(httpRequestHandler: HttpRequestHandler, baseUrlDebug?: string) {
    this.repoClientHandler = new RepositoryApiClientHttpHandler(httpRequestHandler);
    if (this.repoClientHandler){
      this.defaultRequestHeaders['Accept-Encoding'] = 'gzip';
    }
    let fetch = this.repoClientHandler.httpHandler;
    fetch = fetch.bind(this.repoClientHandler);
    let http = {
      fetch,
    };
    this.baseUrl = baseUrlDebug ?? '';
    this.attributesClient = new AttributesClient(this.baseUrl, http);
    this.auditReasonsClient = new generated.AuditReasonsClient(this.baseUrl, http);
    this.entriesClient = new EntriesClient(this.baseUrl, http);
    this.fieldDefinitionsClient = new FieldDefinitionsClient(this.baseUrl, http);
    this.repositoriesClient = new generated.RepositoriesClient(this.baseUrl, http);
    this.searchesClient = new SearchesClient(this.baseUrl, http);
    this.simpleSearchesClient = new generated.SimpleSearchesClient(this.baseUrl, http);
    this.tagDefinitionsClient = new TagDefinitionsClient(this.baseUrl, http);
    this.tasksClient = new generated.TasksClient(this.baseUrl, http);
    this.templateDefinitionsClient = new TemplateDefinitionsClient(this.baseUrl, http);
    this.linkDefinitionsClient = new LinkDefinitionsClient(this.baseUrl, http);
  }

  /**
   * Create a Laserfiche repository client.
   * @param httpRequestHandler The http request handler for the Laserfiche repository client.
   * @param baseUrlDebug (optional) override for the Laserfiche repository API base url.
   */
  public static createFromHttpRequestHandler(
    httpRequestHandler: HttpRequestHandler,
    baseUrlDebug?: string
  ): RepositoryApiClient {
    if (!httpRequestHandler) throw new Error('Argument cannot be null: httpRequestHandler');
    const repoClient = new RepositoryApiClient(httpRequestHandler, baseUrlDebug);
    return repoClient;
  }

  /**
   * Create a Laserfiche repository client that will use Laserfiche Cloud OAuth client credentials to get access tokens.
   * @param servicePrincipalKey The service principal key created for the service principal from the Laserfiche Account Administration.
   * @param accessKey The access key exported from the Laserfiche Developer Console.
   * @param scope (optional) The requested space-delimited scopes for the access token.
   * @param baseUrlDebug (optional) override for the Laserfiche repository API base url.
   */
  public static createFromAccessKey(
    servicePrincipalKey: string,
    accessKey: AccessKey,
    scope?: string,
    baseUrlDebug?: string
  ): RepositoryApiClient {
    const handler = new OAuthClientCredentialsHandler(servicePrincipalKey, accessKey, scope);
    return RepositoryApiClient.createFromHttpRequestHandler(handler, baseUrlDebug);
  }

  /**
   * Create a Laserfiche repository client that will use username and password to get access tokens for Laserfiche API. Password credentials grant type is implemented by the Laserfiche Self-Hosted API server. Not available in cloud.
   * @param repositoryId The repository ID
   * @param username The username
   * @param password The password
   * @param baseUrl API server base URL e.g., https://{APIServerName}/LFRepositoryAPI
   */
  public static createFromUsernamePassword(
    repositoryId: string,
    username: string,
    password: string,
    baseUrl: string
  ): RepositoryApiClient {
    const baseUrlWithoutSlash: string = StringUtils.trimEnd(baseUrl, '/');
    const handler = new UsernamePasswordHandler(repositoryId, username, password, baseUrlWithoutSlash, undefined);
    return new RepositoryApiClient(handler, baseUrlWithoutSlash);
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

async function getNextLinkListing<T>(
  http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> },
  processListing: (response: Response) => Promise<T>,
  nextLink: string,
  maxPageSize?: number
): Promise<T> {
  if (!nextLink) {
    throw new Error('Next Link is undefined');
  }
  const prefer = createMaxPageSizePreferHeaderPayload(maxPageSize);
  const options_ = <RequestInit>{
    method: 'GET',
    headers: {
      Prefer: prefer !== undefined && prefer !== null ? prefer : '',
      Accept: 'application/json',
    },
  };
  const processListingTwo = processListing.bind(http);

  const resp = await http.fetch(nextLink, options_);
  return await processListingTwo(resp);
}

function createMaxPageSizePreferHeaderPayload(maxSize?: number): string | undefined {
  //puts the max size into the prefer header of the GET request
  if (!maxSize) {
    return undefined;
  } else {
    return `maxpagesize=${maxSize}`;
  }
}

export interface IAttributesClient {
  /**
   * It will continue to make the same call to get a list of attributes key value pairs of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.everyone (optional) Boolean value that indicates whether to return attributes key value pairs associated with everyone or the currently authenticated user.
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of attributes key value pairs allowed per API response schema
   */
  listAttributesForEach(args: {
    callback: (response: generated.AttributeCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    everyone?: boolean;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;

  /**
   * Returns the attribute key value pairs using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of attribute keys allowed per API response schema
   * @return Get trustee attribute keys with the next link successfully
   */
  listAttributesNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.AttributeCollectionResponse>;
}

export class AttributesClient extends generated.AttributesClient implements IAttributesClient {
  /**
   * It will continue to make the same call to get a list of attributes key value pairs of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.everyone (optional) Boolean value that indicates whether to return attributes key value pairs associated with everyone or the currently authenticated user.
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of attributes key value pairs allowed per API response schema
   */
  async listAttributesForEach(args: {
    callback: (response: generated.AttributeCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    everyone?: boolean;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repositoryId, everyone, select, orderby, top, skip, count, maxPageSize } = args;
    var response = await this.listAttributes({
      repositoryId,
      everyone,
      prefer: createMaxPageSizePreferHeaderPayload(maxPageSize),
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink) {
      response = await getNextLinkListing<generated.AttributeCollectionResponse>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processListAttributes,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  /**
   * Returns the attribute key value pairs using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection.
   * @param args.maxPageSize (optional) the maximum page size or number of attribute keys allowed per API response schema.
   * @return Get trustee attribute keys with the next link successfully
   */
  async listAttributesNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.AttributeCollectionResponse> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.AttributeCollectionResponse>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processListAttributes,
      nextLink,
      maxPageSize
    );
  }
}

export interface IEntriesClient {
  /**
   * This is a helper for wrapping the CreateMultipartUploadURls and the ImportUploadedParts APIs. 
   * If successful, it returns a taskId which can be used to check the status of the operation or retrieve its result, otherwise, it returns an error.
   * Required OAuth scope: repository.Write
   * @param args.repositoryId The requested repository ID.
   * @param args.entryId The entry ID of the folder that the document will be created in.
   * @param args.file The file to be imported as a new document. 
   * @param args.fileSizeInBytes The length, in bytes, of the file to be imported as a new document. 
   * @param args.mimeType The mime-type of the file to be imported as a new document. 
   * @param args.request The body of the request.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used. The value should be a standard language tag. This may be used when setting field values with tokens.
   * @return A long operation task id.
  */
  startImportEntry(args: {
    repositoryId: string;
    entryId: number;
    file: generated.FileParameter;
    fileSizeInBytes: number;
    mimeType: string;
    request: generated.ImportEntryRequest;
    culture?: string | null | undefined;
  }): Promise<generated.StartTaskResponse>;
  /**
   * It will continue to make the same call to get a list of entry listings of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.entryId The requested entry ID.
   * @param args.groupByEntryType (optional) An optional query parameter used to indicate if the result should be grouped by entry type or not.
   * @param args.fields (optional) Optional array of field names. Field values corresponding to the given field names will be returned for each entry.
   * @param args.formatFieldValues (optional) Boolean for if field values should be formatted. Only applicable if Fields are specified.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting. 
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of entry listings allowed per API response schema.
   */
  listEntriesForEach(args: {
    callback: (response: generated.EntryCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    entryId: number;
    groupByEntryType?: boolean;
    fields?: string[];
    formatFieldValues?: boolean;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;
  /**
   * It will continue to make the same call to get a list of field values of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.entryId The requested entry ID.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.formatValue (optional) An optional query parameter used to indicate if the field values should be formatted.
          The default value is false. 
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting. 
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of field values allowed per API response schema.
   */
  listFieldsForEach(args: {
    callback: (response: generated.FieldCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    entryId: number;
    prefer?: string;
    formatValue?: boolean;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;
  /**
   * It will continue to make the same call to get a list of link values from entry of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.entryId The requested entry ID.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of link values from entry allowed per API response schema.
   */
  listLinksForEach(args: {
    callback: (response: generated.LinkCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    entryId: number;
    prefer?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;
  /**
   * It will continue to make the same call to get a list of tags assigned to entry of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.entryId The requested entry ID.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of tags assigned to entry allowed per API response schema.
   */
  listTagsForEach(args: {
    callback: (response: generated.TagDefinitionCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    entryId: number;
    prefer?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;
  /**
   * Returns the children entries of a folder in the repository using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of entry listings allowed per API response schema
   * @return Get the children entries of a Folder with the next link successfully
   */
  listEntriesNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.EntryCollectionResponse>;
  /**
   * Returns the fields assigned to an entry using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of field values allowed per API response schema
   * @return Get field values with the next link successfully
   */
  listFieldsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.FieldCollectionResponse>;
  /**
   * Get the links assigned to an entry using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of link values from entry allowed per API response schema
   * @return Get links with the next link successfully
   */
  listLinksNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.LinkCollectionResponse>;
  /**
   * Get the tags assigned to an entry using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of tags assigned to entry allowed per API response schema
   * @return Get entry tags with the next link successfully
   */
  listTagsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.TagDefinitionCollectionResponse>;
}
export class EntriesClient extends generated.EntriesClient implements IEntriesClient {
  /**
   * This is a helper for wrapping the CreateMultipartUploadURls and the ImportUploadedParts APIs. 
   * If successful, it returns a taskId which can be used to check the status of the operation or retrieve its result, otherwise, it returns an error.
   * Required OAuth scope: repository.Write
   * @param args.repositoryId The requested repository ID.
   * @param args.entryId The entry ID of the folder that the document will be created in.
   * @param args.file The file to be imported as a new document. 
   * @param args.fileSizeInBytes The length, in bytes, of the file to be imported as a new document. 
   * @param args.mimeType The mime-type of the file to be imported as a new document. 
   * @param args.request The body of the request.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used. The value should be a standard language tag. This may be used when setting field values with tokens.
   * @return A long operation task id.
  */
  async startImportEntry(args: { 
    repositoryId: string;
    entryId: number;
    file: generated.FileParameter;
    fileSizeInBytes: number;
    mimeType: string;
    request: generated.ImportEntryRequest;
    culture?: string | null | undefined;
  }): Promise<generated.StartTaskResponse> {
    // Determine how many parts does the file have, and as a result how many URLs is needed. 
    const [numberOfParts, partSizeInMB] = this.computeSplitInfo(args.fileSizeInBytes);
    // The maximum number of URLs requested in each call to the CreateMultipartUploadUrls API.
    const maxUrlsRequestedInEachIteration = 10;
    const iterations = Math.ceil(numberOfParts / maxUrlsRequestedInEachIteration);
    
    var file = null;
    var eTags = new Array<string>();
    let uploadId = null;
    try 
    {
      file = await fsPromise.open(args.file.fileName, 'r');

      // Iteratively request URLs and write file chunks into the URLs.
      for (let i = 0; i < iterations; i++) {
        // Step 1: Request a batch of URLs by calling the CreateMultipartUploadUrls API.
        var request = this.prepareRequestForCreateMultipartUploadUrlsApi(i, numberOfParts, maxUrlsRequestedInEachIteration, args.file.fileName, args.mimeType, uploadId);
        let response = await this.createMultipartUploadUrls({
          repositoryId: args.repositoryId,
          request: request
        });

        if (i == 0) {
          uploadId = response.uploadId;
        }
        
        // Step 2: Split the file and write the chunks to current batch of URLs.
        var eTagsForThisIteration = await this.writeFileParts(file, partSizeInMB, response.urls);
        eTags.push.apply(eTags, eTagsForThisIteration);
      }

      // Step 3: File chunks are written, and eTags are ready. Call the ImportUploadedParts API.
      var finalRequest = this.prepareRequestForImportUploadedPartsApi(uploadId!, eTags, args.request.name, args.request.autoRename, args.request.pdfOptions, args.request.importAsElectronicDocument, args.request.metadata, args.request.volumeName);
      var response = await this.startImportUploadedParts({
        repositoryId: args.repositoryId,
        entryId: args.entryId,
        request: finalRequest
      });
  
      return generated.StartTaskResponse.fromJS(response);
  
    } finally {
      if (file) {
        file.close();
      }
    }
  }

  /**
   * Prepares and returns the request body for calling the ImportUploadedParts API.
   */
  private prepareRequestForImportUploadedPartsApi(uploadId: string, eTags: string[], name?: string, autoRename?: boolean, pdfOptions?: generated.PdfImportOptions, importAsElectronicDocument?: boolean, metadata?: generated.ImportAsyncMetadata, volumeName?: string): generated.StartImportUploadedPartsRequest {
    var parameters ={
      uploadId: uploadId,
      partETags: eTags,
      name: name,
      autoRename: autoRename,
      pdfOptions: pdfOptions,
      importAsElectronicDocument: importAsElectronicDocument,
      metadata: metadata,
      volumeName: volumeName
    };
    return generated.StartImportUploadedPartsRequest.fromJS(parameters);
  }

  /**
   * Takes a file handler and a set of URLs. Then splits the file from the handler's current position, and writes the file parts to the given URLs.
   * @returns The eTags of the parts written.
   */
  private async writeFileParts(file: fsPromise.FileHandle, partSizeInMB: number, urls?: string[]): Promise<string[]> {
    if (urls) {
      let eTags = new Array<string>(urls?.length);
      for (let i = 0; i < urls.length; i++) {
        var url = urls[i];
        var eTag = await this.writeFilePart(file, partSizeInMB, url);
        eTags[i] = eTag;
      }

      return eTags;
    }
    throw new Error("Writing file part failed.");
  }

  /**
   * Takes a file handler and a single URL, and writes a single file part to the given URL. The size of the part is determiend by the partSizeInMB parameter.
   * @returns The eTag of the part written.
   */
  private async writeFilePart(file: fsPromise.FileHandle, partSizeInMB: number, url: string): Promise<string> {
    const bufferSizeInBytes = partSizeInMB * 1024 * 1024;
    var buffer = new Uint8Array(bufferSizeInBytes);
    var readResult = await file.read(buffer, 0, bufferSizeInBytes);
    var content = readResult.buffer; 
    const response = await fetch(url, {
      method: 'PUT',
      body: content,
      headers: {'Content-Type': 'application/octet-stream'} });
    
    if (response.ok && response.body !== null && response.status == 200) {
      var eTag = response.headers.get("ETag");
      if (eTag) {
        eTag = eTag.substring(1, eTag.length - 1); // Remove heading and trailing double-quotation
        return eTag;
      }
    } 
    
    throw new Error("No ETag.");
  }


  /**
   * Prepares and returns the request body for calling the CreateMultipartUploadUrls API.
   */
  private prepareRequestForCreateMultipartUploadUrlsApi(iterationIndex: number, numberOfParts: number, numberOfUrlsRequestedInEachCall: number, fileName: string, mimeType: string, uploadId? : string | null): generated.CreateMultipartUploadUrlsRequest {
    var parameters = (iterationIndex == 0) ? {
      startingPartNumber: 1,
      numberOfParts: Math.min(numberOfParts, numberOfUrlsRequestedInEachCall),
      fileName: fileName,
      mimeType: mimeType
    } : {
      uploadId: uploadId,
      startingPartNumber: iterationIndex * numberOfUrlsRequestedInEachCall + 1,
      numberOfParts: Math.min(numberOfParts - (iterationIndex * numberOfUrlsRequestedInEachCall), numberOfUrlsRequestedInEachCall),
    };
    return generated.CreateMultipartUploadUrlsRequest.fromJS(parameters);
  }

  /**
   * Takes the file size as input and determies the number of parts and the part size (in MB). 
   */
  private computeSplitInfo(fileSizeInBytes: number): [number, number] {
    const maxFileSizeInGB = 64;

    if (fileSizeInBytes > maxFileSizeInGB * 1024 * 1024 * 1024) 
    {
      throw new Error(`Maximum file size allowed is ${maxFileSizeInGB} GB.`);
    }
    const partSizeInMB = 100;
    const numberOfParts = Math.ceil(fileSizeInBytes / (partSizeInMB * 1024 * 1024));

    return [numberOfParts, partSizeInMB];
  }

  /**
   * It will continue to make the same call to get a list of entry listings of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.entryId The requested entry ID.
   * @param args.groupByEntryType (optional) An optional query parameter used to indicate if the result should be grouped by entry type or not.
   * @param args.fields (optional) Optional array of field names. Field values corresponding to the given field names will be returned for each entry.
   * @param args.formatFieldValues (optional) Boolean for if field values should be formatted. Only applicable if Fields are specified.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting. 
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of entry listings allowed per API response schema.
   */
  async listEntriesForEach(args: {
    callback: (response: generated.EntryCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    entryId: number;
    groupByEntryType?: boolean;
    fields?: string[];
    formatFieldValues?: boolean;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let {
      callback,
      repositoryId,
      entryId,
      groupByEntryType,
      fields,
      formatFieldValues,
      prefer,
      culture,
      select,
      orderby,
      top,
      skip,
      count,
      maxPageSize,
    } = args;
    var response = await this.listEntries({
      repositoryId: repositoryId,
      entryId,
      groupByEntryType,
      fields,
      formatFieldValues,
      prefer: createMaxPageSizePreferHeaderPayload(maxPageSize),
      culture,
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink) {
      response = await getNextLinkListing<generated.EntryCollectionResponse>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processListEntries,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  /**
   * It will continue to make the same call to get a list of field values of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.entryId The requested entry ID.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.formatValue (optional) An optional query parameter used to indicate if the field values should be formatted.
          The default value is false. 
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting. 
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of field values allowed per API response schema.
   */
  async listFieldsForEach(args: {
    callback: (response: generated.FieldCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    entryId: number;
    prefer?: string;
    formatValue?: boolean;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repositoryId, entryId, prefer, formatValue, culture, select, orderby, top, skip, count, maxPageSize } =
      args;
    var response = await this.listFields({
      repositoryId: repositoryId,
      entryId,
      prefer: createMaxPageSizePreferHeaderPayload(maxPageSize),
      formatFieldValues: formatValue,
      culture,
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink) {
      response = await getNextLinkListing<generated.FieldCollectionResponse>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processListFields,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  /**
   * It will continue to make the same call to get a list of link values from entry of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.entryId The requested entry ID.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of link values from entry allowed per API response schema.
   */
  async listLinksForEach(args: {
    callback: (response: generated.LinkCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    entryId: number;
    prefer?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repositoryId, entryId, prefer, select, orderby, top, skip, count, maxPageSize } = args;
    var response = await this.listLinks({
      repositoryId: repositoryId,
      entryId,
      prefer: createMaxPageSizePreferHeaderPayload(maxPageSize),
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink) {
      response = await getNextLinkListing<generated.LinkCollectionResponse>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processListLinks,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  /**
   * It will continue to make the same call to get a list of tags assigned to entry of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.entryId The requested entry ID.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of tags assigned to entry allowed per API response schema.
   */
  async listTagsForEach(args: {
    callback: (response: generated.TagDefinitionCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    entryId: number;
    prefer?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repositoryId, entryId, prefer, select, orderby, top, skip, count, maxPageSize } = args;
    var response = await this.listTags({
      repositoryId: repositoryId,
      entryId,
      prefer: createMaxPageSizePreferHeaderPayload(maxPageSize),
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink) {
      response = await getNextLinkListing<generated.TagDefinitionCollectionResponse>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processListTags,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  /**
   * Returns the children entries of a folder in the repository using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of entry listings allowed per API response schema
   * @return Get the children entries of a Folder with the next link successfully
   */
  async listEntriesNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.EntryCollectionResponse> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.EntryCollectionResponse>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processListEntries,
      nextLink,
      maxPageSize
    );
  }
  /**
   * Returns the fields assigned to an entry using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of field values allowed per API response schema
   * @return Get field values with the next link successfully
   */
  async listFieldsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.FieldCollectionResponse> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.FieldCollectionResponse>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processListFields,
      nextLink,
      maxPageSize
    );
  }
  /**
   * Returns the links assigned to an entry using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of link values from entry allowed per API response schema
   * @return Get links with the next link successfully
   */
  async listLinksNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.LinkCollectionResponse> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.LinkCollectionResponse>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processListLinks,
      nextLink,
      maxPageSize
    );
  }
  /**
   * Returns the entry tags assigned to an entry using a link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of tags assigned to entry allowed per API response schema
   * @return Get entry tags with the next link successfully
   */
  async listTagsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.TagDefinitionCollectionResponse> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.LinkCollectionResponse>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processListTags,
      nextLink,
      maxPageSize
    );
  }
}

export interface IFieldDefinitionsClient {
  /**
   * It will continue to make the same call to get a list of field definitions of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting.  
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of field definitions allowed per API response schema.
   */
  listFieldDefinitionsForEach(args: {
    callback: (response: generated.FieldDefinitionCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;
  /**
   * Returns a paged listing of field definitions available in the specified repository using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of field definitions allowed per API response schema
   * @return Get field definitions with the next link successfully
   */
  listFieldDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.FieldDefinitionCollectionResponse>;
}

export class FieldDefinitionsClient extends generated.FieldDefinitionsClient implements IFieldDefinitionsClient {
  /**
   * It will continue to make the same call to get a list of field definitions of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting.  
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of field definitions allowed per API response schema.
   */
  async listFieldDefinitionsForEach(args: {
    callback: (response: generated.FieldDefinitionCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repositoryId, prefer, culture, select, orderby, top, skip, count, maxPageSize } = args;
    var response = await this.listFieldDefinitions({
      repositoryId: repositoryId,
      prefer: createMaxPageSizePreferHeaderPayload(maxPageSize),
      culture,
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink) {
      response = await getNextLinkListing<generated.FieldDefinitionCollectionResponse>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processListFieldDefinitions,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  /**
   * Returns a paged listing of field definitions available in the specified repository using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of field definitions allowed per API response schema
   * @return Get field definitions with the next link successfully
   */
  async listFieldDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.FieldDefinitionCollectionResponse> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.FieldDefinitionCollectionResponse>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processListFieldDefinitions,
      nextLink,
      maxPageSize
    );
  }
}

export interface ISearchesClient {
  /**
   * It will continue to make the same call to get a list of search results of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.searchToken The requested searchToken.
   * @param args.groupByEntryType (optional) An optional query parameter used to indicate if the result should be grouped by entry type or not.
   * @param args.refresh (optional) If the search listing should be refreshed to show updated values.
   * @param args.fields (optional) Optional array of field names. Field values corresponding to the given field names will be returned for each entry.
   * @param args.formatFieldValues (optional) Boolean for if field values should be formatted. Only applicable if Fields are specified.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting.  
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of search results allowed per API response schema.
   */
  listSearchResultsForEach(args: {
    callback: (response: generated.EntryCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    searchToken: string;
    groupByEntryType?: boolean;
    refresh?: boolean;
    fields?: string[];
    formatFieldValues?: boolean;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;
  /**
   * It will continue to make the same call to get a list of search context hits of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.searchToken The requested searchToken.
   * @param args.rowNumber The search result listing row number to get context hits for.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of search context hits allowed per API response schema.
   */
  listSearchContextHitsForEach(args: {
    callback: (response: generated.SearchContextHitCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    searchToken: string;
    rowNumber: number;
    prefer?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;
  /**
   * Returns a search result listing if the search is completed using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of search results allowed per API response schema
   * @return Get search result with the next link successfully
   */
  listSearchResultsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.EntryCollectionResponse>;
  /**
   * Returns the context hits associated with a search result entry using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of search context hits allowed per API response schema
   * @return Get search context hits with the next link successfully
   */
  listSearchContextHitsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.SearchContextHitCollectionResponse>;
}

export class SearchesClient extends generated.SearchesClient implements ISearchesClient {
  /**
   * It will continue to make the same call to get a list of search results of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.searchToken The requested searchToken.
   * @param args.groupByEntryType (optional) An optional query parameter used to indicate if the result should be grouped by entry type or not.
   * @param args.refresh (optional) If the search listing should be refreshed to show updated values.
   * @param args.fields (optional) Optional array of field names. Field values corresponding to the given field names will be returned for each entry.
   * @param args.formatFieldValues (optional) Boolean for if field values should be formatted. Only applicable if Fields are specified.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting.  
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of search results allowed per API response schema.
   */
  async listSearchResultsForEach(args: {
    callback: (response: generated.EntryCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    searchToken: string;
    groupByEntryType?: boolean;
    refresh?: boolean;
    fields?: string[];
    formatFieldValues?: boolean;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let {
      callback,
      repositoryId,
      searchToken,
      groupByEntryType,
      refresh,
      fields,
      formatFieldValues,
      prefer,
      culture,
      select,
      orderby,
      top,
      skip,
      count,
      maxPageSize,
    } = args;
    var response = await this.listSearchResults({
      repositoryId: repositoryId,
      taskId: searchToken,
      groupByEntryType,
      refresh,
      fields,
      formatFieldValues,
      prefer: createMaxPageSizePreferHeaderPayload(maxPageSize),
      culture,
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink) {
      response = await getNextLinkListing<generated.EntryCollectionResponse>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processListSearchResults,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  /**
   * It will continue to make the same call to get a list of search context hits of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.searchToken The requested searchToken.
   * @param args.rowNumber The search result listing row number to get context hits for.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of search context hits allowed per API response schema.
   */
  async listSearchContextHitsForEach(args: {
    callback: (response: generated.SearchContextHitCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    searchToken: string;
    rowNumber: number;
    prefer?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repositoryId, searchToken, rowNumber, prefer, select, orderby, top, skip, count, maxPageSize } = args;
    var response = await this.listSearchContextHits({
      repositoryId: repositoryId,
      taskId: searchToken,
      rowNumber,
      prefer: createMaxPageSizePreferHeaderPayload(maxPageSize),
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink) {
      response = await getNextLinkListing<generated.SearchContextHitCollectionResponse>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processListSearchContextHits,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  /**
   * Returns a search result listing if the search is completed using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of search results allowed per API response schema
   * @return Get search result with the next link successfully
   */
  async listSearchResultsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.EntryCollectionResponse> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.EntryCollectionResponse>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processListSearchResults,
      nextLink,
      maxPageSize
    );
  }
  /**
   * Returns the context hits associated with a search result entry using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of search context hits allowed per API response schema
   * @return Get search context hits with the next link successfully
   */
  async listSearchContextHitsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.SearchContextHitCollectionResponse> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.SearchContextHitCollectionResponse>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processListSearchContextHits,
      nextLink,
      maxPageSize
    );
  }
}

export interface ITagDefinitionsClient {
  /**
   * It will continue to make the same call to get a list of tag definitions of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting.  
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of tag definitions allowed per API response schema.
   */
  listTagDefinitionsForEach(args: {
    callback: (response: generated.TagDefinitionCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;
  /**
   * Returns all tag definitions in the repository using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of tag definitions allowed per API response schema
   * @return Get tag definitions with the next link successfully
   */
  listTagDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.TagDefinitionCollectionResponse>;
}

export class TagDefinitionsClient extends generated.TagDefinitionsClient implements ITagDefinitionsClient {
  /**
   * It will continue to make the same call to get a list of tag definitions of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting.  
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of tag definitions allowed per API response schema.
   */
  async listTagDefinitionsForEach(args: {
    callback: (response: generated.TagDefinitionCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repositoryId, prefer, culture, select, orderby, top, skip, count, maxPageSize } = args;
    var response = await this.listTagDefinitions({
      repositoryId: repositoryId,
      prefer: createMaxPageSizePreferHeaderPayload(maxPageSize),
      culture,
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink) {
      response = await getNextLinkListing<generated.TagDefinitionCollectionResponse>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processListTagDefinitions,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  /**
   * Returns all tag definitions in the repository using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of tag definitions allowed per API response schema
   * @return Get tag definitions with the next link successfully
   */
  async listTagDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.TagDefinitionCollectionResponse> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.TagDefinitionCollectionResponse>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processListTagDefinitions,
      nextLink,
      maxPageSize
    );
  }
}

export interface ITemplateDefinitionsClient {
  /**
   * It will continue to make the same call to get a list of template definitions of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.templateName (optional) An optional query parameter. Can be used to get a single template definition using the template name.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting.  
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of template definitions allowed per API response schema.
   */
  listTemplateDefinitionsForEach(args: {
    callback: (response: generated.TemplateDefinitionCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    templateName?: string;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;
  /**
   * It will continue to make the same call to get a list of template field definitions of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.templateName (optional) An optional query parameter. Can be used to get a single template definition using the template name.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting.  
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of template field definitions allowed per API response schema.
   */
  listTemplateFieldDefinitionsByTemplateIdForEach(args: {
    callback: (response: generated.TemplateFieldDefinitionCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    templateId: number;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;
  /**
   * It will continue to make the same call to get a list of template field definitions by template name of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.templateName (optional) An optional query parameter. Can be used to get a single template definition using the template name.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting.  
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of template field definitions by template name allowed per API response schema.
   */
  listTemplateFieldDefinitionsByTemplateNameForEach(args: {
    callback: (response: generated.TemplateFieldDefinitionCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    templateName: string;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;
  /**
   * Returns all template definitions (including field definitions) in the repository using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of template definitions allowed per API response schema
   * @return Get template definitions with the next link successfully
   */
  listTemplateDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.TemplateDefinitionCollectionResponse>;
  /**
   * Returns the field definitions assigned to a template definition using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of template field definitions allowed per API response schema
   * @return Get field definitions with the next link successfully
   */
  listTemplateFieldDefinitionsByTemplateIdNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.TemplateFieldDefinitionCollectionResponse>;
  /**
   * Returns the field definitions assigned to a template definition by template name using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of template field definitions by template name allowed per API response schema
   * @return Get field definitions by template name with the next link successfully
   */
  listTemplateFieldDefinitionsByTemplateNameNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.TemplateFieldDefinitionCollectionResponse>;
}

export class TemplateDefinitionsClient
  extends generated.TemplateDefinitionsClient
  implements ITemplateDefinitionsClient
{
  /**
   * Given a maximum page size, it will continue to make the same call to get a list of template definitions of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.templateName (optional) An optional query parameter. Can be used to get a single template definition using the template name.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting.  
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of template definitions allowed per API response schema.
   */
  async listTemplateDefinitionsForEach(args: {
    callback: (response: generated.TemplateDefinitionCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    templateName?: string;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repositoryId, templateName, prefer, culture, select, orderby, top, skip, count, maxPageSize } = args;
    var response = await this.listTemplateDefinitions({
      repositoryId: repositoryId,
      templateName,
      prefer: createMaxPageSizePreferHeaderPayload(maxPageSize),
      culture,
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink) {
      response = await getNextLinkListing<generated.TemplateDefinitionCollectionResponse>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processListTemplateDefinitions,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  /**
   * It will continue to make the same call to get a list of template field definitions of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.templateName (optional) An optional query parameter. Can be used to get a single template definition using the template name.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting.  
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of template field definitions allowed per API response schema.
   */
  async listTemplateFieldDefinitionsByTemplateIdForEach(args: {
    callback: (response: generated.TemplateFieldDefinitionCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    templateId: number;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repositoryId, templateId, prefer, culture, select, orderby, top, skip, count, maxPageSize } = args;
    var response = await this.listTemplateFieldDefinitionsByTemplateId({
      repositoryId: repositoryId,
      templateId,
      prefer: createMaxPageSizePreferHeaderPayload(maxPageSize),
      culture,
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink) {
      response = await getNextLinkListing<generated.TemplateFieldDefinitionCollectionResponse>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processListTemplateFieldDefinitionsByTemplateId,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  /**
   * It will continue to make the same call to get a list of template field definitions by template name of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.templateName (optional) An optional query parameter. Can be used to get a single template definition using the template name.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.culture (optional) An optional query parameter used to indicate the locale that should be used for formatting.
          The value should be a standard language tag. The formatFieldValues query parameter must be set to true, otherwise
          culture will not be used for formatting.  
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of template field definitions by template name allowed per API response schema.
   */
  async listTemplateFieldDefinitionsByTemplateNameForEach(args: {
    callback: (response: generated.TemplateFieldDefinitionCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    templateName: string;
    prefer?: string;
    culture?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repositoryId, templateName, prefer, culture, select, orderby, top, skip, count, maxPageSize } = args;
    var response = await this.listTemplateFieldDefinitionsByTemplateName({
      repositoryId: repositoryId,
      templateName,
      prefer: createMaxPageSizePreferHeaderPayload(maxPageSize),
      culture,
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink) {
      response = await getNextLinkListing<generated.TemplateFieldDefinitionCollectionResponse>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processListTemplateFieldDefinitionsByTemplateName,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }
  /**
   * Returns all template definitions (including field definitions) in the repository using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of template definitions allowed per API response schema
   * @return Get template definitions with the next link successfully
   */
  async listTemplateDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.TemplateDefinitionCollectionResponse> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.TemplateDefinitionCollectionResponse>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processListTemplateDefinitions,
      nextLink,
      maxPageSize
    );
  }
  /**
   * Returns the field definitions assigned to a template definition using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of template field definitions allowed per API response schema
   * @return Get field definitions with the next link successfully
   */
  async listTemplateFieldDefinitionsByTemplateIdNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.TemplateFieldDefinitionCollectionResponse> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.TemplateFieldDefinitionCollectionResponse>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processListTemplateFieldDefinitionsByTemplateId,
      nextLink,
      maxPageSize
    );
  }
  /**
   * Returns the field definitions assigned to a template definition by template name using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of template field definitions by template name allowed per API response schema
   * @return Get field definitions by template name with the next link successfully
   */
  async listTemplateFieldDefinitionsByTemplateNameNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.TemplateFieldDefinitionCollectionResponse> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.TemplateFieldDefinitionCollectionResponse>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processListTemplateFieldDefinitionsByTemplateName,
      nextLink,
      maxPageSize
    );
  }
}

export interface ILinkDefinitionsClient {
  /**
   * It will continue to make the same call to get a list of link definitions of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of link definitions allowed per API response schema.
   */
  listLinkDefinitionsForEach(args: {
    callback: (response: generated.LinkDefinitionCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    prefer?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void>;

  /**
   * Returns all link definitions in the repository using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of link definitions allowed per API response schema
   * @return Get link definitions with the next link successfully
   */
  listLinkDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.LinkDefinitionCollectionResponse>;
}

export class LinkDefinitionsClient extends generated.LinkDefinitionsClient implements ILinkDefinitionsClient {
  /**
   * It will continue to make the same call to get a list of link definitions of a fixed size (i.e. maxpagesize) until it reaches the last page (i.e. when next link is null/undefined) or whenever the callback function returns false.
   * @param args.callback async callback function that will accept the current page results and return a boolean value to either continue or stop paging.
   * @param args.repositoryId The requested repository ID.
   * @param args.prefer (optional) An optional OData header. Can be used to set the maximum page size using odata.maxpagesize.
   * @param args.select (optional) Limits the properties returned in the result.
   * @param args.orderby (optional) Specifies the order in which items are returned. The maximum number of expressions is 5.
   * @param args.top (optional) Limits the number of items returned from a collection.
   * @param args.skip (optional) Excludes the specified number of items of the queried collection from the result.
   * @param args.count (optional) Indicates whether the total count of items within a collection are returned in the result.
   * @param args.maxPageSize (optional) the maximum page size or number of link definitions allowed per API response schema.
   */
  async listLinkDefinitionsForEach(args: {
    callback: (response: generated.LinkDefinitionCollectionResponse) => Promise<boolean>;
    repositoryId: string;
    prefer?: string;
    select?: string;
    orderby?: string;
    top?: number;
    skip?: number;
    count?: boolean;
    maxPageSize?: number;
  }): Promise<void> {
    let { callback, repositoryId, prefer, select, orderby, top, skip, count, maxPageSize } = args;
    var response = await this.listLinkDefinitions({
      repositoryId: repositoryId,
      prefer: createMaxPageSizePreferHeaderPayload(maxPageSize),
      select,
      orderby,
      top,
      skip,
      count,
    });
    let nextLink = response.odataNextLink;
    while ((await callback(response)) && nextLink) {
      response = await getNextLinkListing<generated.LinkDefinitionCollectionResponse>(
        // @ts-ignore: allow sub class to use private variable from the super class
        this.http,
        this.processListLinkDefinitions,
        nextLink,
        maxPageSize
      );
      nextLink = response.odataNextLink;
    }
  }

  /**
   * Returns all link definitions in the repository using a next link
   * @param args.nextLink a url that allows retrieving the next subset of the requested collection
   * @param args.maxPageSize (optional) the maximum page size or number of link definitions allowed per API response schema
   * @return Get link definitions with the next link successfully
   */
  async listLinkDefinitionsNextLink(args: {
    nextLink: string;
    maxPageSize?: number;
  }): Promise<generated.LinkDefinitionCollectionResponse> {
    let { nextLink, maxPageSize } = args;
    return await getNextLinkListing<generated.LinkDefinitionCollectionResponse>(
      // @ts-ignore: allow sub class to use private variable from the super class
      this.http,
      this.processListLinkDefinitions,
      nextLink,
      maxPageSize
    );
  }
}

export class RepositoriesClient extends generated.RepositoriesClient {
  /**
   * Returns the repository resource list that current user has access to given the API server base URL. Only available in Laserfiche Self-Hosted.
   * @param args.baseUrl API server base URL e.g., https://{APIServerName}/LFRepositoryAPI
   * @returns Get the repository resource list successfully.
   */
  public static async getSelfHostedRepositoryList(args: { baseUrl: string }): Promise<generated.RepositoryCollectionResponse> {
    let { baseUrl } = args;
    const baseUrlWithoutSlash: string = StringUtils.trimEnd(baseUrl, '/');
    let http = {
      fetch,
    };
    return await new generated.RepositoriesClient(baseUrlWithoutSlash, http).listRepositories({});
  }
}

export class ProblemDetails extends generated.ProblemDetails {
  extensions: any;
}
export class ApiException extends ApiExceptionCore {
  constructor(message: string, status: number, response: string, headers: { [key: string]: any }, result: any) {
    super(message, status, headers, result);
  }
}
