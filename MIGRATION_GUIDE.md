# Migration Guide
The following guide compares the [@laserfiche/lf-repository-api-client](https://www.npmjs.com/package/@laserfiche/lf-repository-api-client) npm package with the [@laserfiche/lf-repository-api-client-v2](https://www.npmjs.com/package/@laserfiche/lf-repository-api-client-v2) npm package at time of initial release.

The `@laserfiche/lf-repository-api-client` accesses the v1 Laserfiche Repository APIs and the `@laserfiche/lf-repository-api-client-v2` accesses the v2 Laserfiche Repository APIs. Many API function signatures have been updated in the v2 client. See the tables below for the functions in the v1 client that correspond to the functions in the v2 client.

See [here](https://api.laserfiche.com/repository/v2/changelog#2023-10) for more details on the changes between the v1 and v2 Laserfiche Repository APIs.

### Attributes
| @laserfiche/lf-repository-api-client | @laserfiche/lf-repository-api-client-v2 |
|----------------------------------|-------------------------------------|
| [getTrusteeAttributeKeyValuePairs](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IAttributesClient.html#getTrusteeAttributeKeyValuePairs) | [listAttributes](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IAttributesClient.html#listAttributes) |
| [getTrusteeAttributeKeyValuePairsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IAttributesClient.html#getTrusteeAttributeKeyValuePairsForEach) | [listAttributesForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IAttributesClient.html#listAttributesForEach) |
| [getTrusteeAttributeKeyValuePairsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IAttributesClient.html#getTrusteeAttributeKeyValuePairsNextLink) | [listAttributesNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IAttributesClient.html#listAttributesNextLink) |
| [getTrusteeAttributeValueByKey](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IAttributesClient.html#getTrusteeAttributeValueByKey) | [getAttribute](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IAttributesClient.html#getAttribute) |

### AuditReasons
| @laserfiche/lf-repository-api-client | @laserfiche/lf-repository-api-client-v2 |
|----------------------------------|-------------------------------------|
| [getAuditReasons](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IAuditReasonsClient.html#getAuditReasons) | [listAuditReasons](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IAuditReasonsClient.html#listAuditReasons) |

### Entries
| @laserfiche/lf-repository-api-client | @laserfiche/lf-repository-api-client-v2 |
|----------------------------------|-------------------------------------|
| [assignEntryLinks](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#assignEntryLinks) | [setLinks](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#setLinks) |
| [assignFieldValues](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#assignFieldValues) | [setFields](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#setFields) |
| [assignTags](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#assignTags) | [setTags](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#setTags) |
| [copyEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#copyEntry) | [startCopyEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#startCopyEntry) |
| [createOrCopyEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#createOrCopyEntry) | Functionality split into [createEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#createEntry) and [copyEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#copyEntry) |
| [deleteAssignedTemplate](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#deleteAssignedTemplate) | [removeTemplate](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#removeTemplate) |
| [deleteDocument](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#deleteDocument) | [deleteElectronicDocument](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#deleteElectronicDocument) |
| [deleteEntryInfo](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#deleteEntryInfo) | [startDeleteEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#startDeleteEntry) |
| [deletePages](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#deletePages) | [deletePages](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#deletePages) |
| [exportDocument](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#exportDocument) | [exportEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#exportEntry) |
| [exportDocumentWithAuditReason](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#exportDocumentWithAuditReason) | [exportEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#exportEntry) |
| [getDocumentContentType](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getDocumentContentType) | Removed |
| [getDynamicFieldValues](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getDynamicFieldValues) | [listDynamicFieldValues](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#listDynamicFieldValues) |
| [getEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getEntry) | [getEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#getEntry) |
| [getEntryByPath](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getEntryByPath) | [getEntryByPath](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#getEntryByPath) |
| [getEntryListing](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getEntryListing) | [listEntries](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#listEntries) |
| [getEntryListingForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getEntryListingForEach) | [listEntriesForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#listEntriesForEach) |
| [getEntryListingNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getEntryListingNextLink) | [listEntriesNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#listEntriesNextLink) |
| [getFieldValues](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getFieldValues) | [listFields](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#listFields) |
| [getFieldValuesForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getFieldValuesForEach) | [listFieldsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#listFieldsForEach) |
| [getFieldValuesNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getFieldValuesNextLink) | [listFieldsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#listFieldsNextLink) |
| [getLinkValuesFromEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getLinkValuesFromEntry) | [listLinks](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#listLinks) |
| [getLinkValuesFromEntryForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getLinkValuesFromEntryForEach) | [listLinksForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#listLinksForEach) |
| [getLinkValuesFromEntryNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getLinkValuesFromEntryNextLink) | [listLinksNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#listLinksNextLink) |
| [getTagsAssignedToEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getTagsAssignedToEntry) | [listTags](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#listTags) |
| [getTagsAssignedToEntryForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getTagsAssignedToEntryForEach) | [listTagsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#listTagsForEach) |
| [getTagsAssignedToEntryNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#getTagsAssignedToEntryNextLink) | [listTagsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#listTagsNextLink) |
| [importDocument](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#importDocument) | [importEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#importEntry) |
| [moveOrRenameEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#moveOrRenameEntry) | [updateEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#updateEntry) |
| [writeTemplateValueToEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IEntriesClient.html#writeTemplateValueToEntry) | [setTemplate](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#setTemplate) |
| -- | [createMultipartUploadUrls](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#createMultipartUploadUrls) |
| -- | [startImportUploadedParts](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#startImportUploadedParts) |
| -- | [startExportEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IEntriesClient.html#startExportEntry) |

### FieldDefinitions
 @laserfiche/lf-repository-api-client | @laserfiche/lf-repository-api-client-v2 |
|----------------------------------|-------------------------------------|
| [getFieldDefinitionById](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IFieldDefinitionsClient.html#getFieldDefinitionById) | [getFieldDefinition](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IFieldDefinitionsClient.html#getFieldDefinition) |
| [getFieldDefinitions](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IFieldDefinitionsClient.html#getFieldDefinitions) | [listFieldDefinitions](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IFieldDefinitionsClient.html#listFieldDefinitions) |
| [getFieldDefinitionsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IFieldDefinitionsClient.html#getFieldDefinitionsForEach) | [listFieldDefinitionsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IFieldDefinitionsClient.html#listFieldDefinitionsForEach) |
| [getFieldDefinitionsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IFieldDefinitionsClient.html#getFieldDefinitionsNextLink) | [listFieldDefinitionsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IFieldDefinitionsClient.html#listFieldDefinitionsNextLink) |

### LinkDefinitions
 @laserfiche/lf-repository-api-client | @laserfiche/lf-repository-api-client-v2 |
|----------------------------------|-------------------------------------|
| [getLinkDefinitionById](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ILinkDefinitionsClient.html#getLinkDefinitionById) | [getLinkDefinition](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ILinkDefinitionsClient.html#getLinkDefinition) |
| [getLinkDefinitions](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ILinkDefinitionsClient.html#getLinkDefinitions) | [listLinkDefinitions](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ILinkDefinitionsClient.html#listLinkDefinitions) |
| [getLinkDefinitionsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ILinkDefinitionsClient.html#getLinkDefinitionsForEach) | [listLinkDefinitionsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ILinkDefinitionsClient.html#listLinkDefinitionsForEach) |
| [getLinkDefinitionsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ILinkDefinitionsClient.html#getLinkDefinitionsNextLink) | [listLinkDefinitionsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ILinkDefinitionsClient.html#listLinkDefinitionsNextLink) |

### Repositories
 @laserfiche/lf-repository-api-client | @laserfiche/lf-repository-api-client-v2 |
|----------------------------------|-------------------------------------|
| [getRepositoryList](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IRepositoriesClient.html#getRepositoryList) | [listRepositories](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/IRepositoriesClient.html#listRepositories) |
| [getSelfHostedRepositoryList](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/classes/RepositoriesClient.html#getSelfHostedRepositoryList) | [listSelfHostedRepositories](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/classes/RepositoriesClient.html#listSelfHostedRepositories) |

### Searches
 @laserfiche/lf-repository-api-client | @laserfiche/lf-repository-api-client-v2 |
|----------------------------------|-------------------------------------|
| [cancelOrCloseSearch](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ISearchesClient.html#cancelOrCloseSearch) | [cancelTasks](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITasksClient.html#cancelTasks) |
| [createSearchOperation](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ISearchesClient.html#createSearchOperation) | [startSearchEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ISearchesClient.html#startSearchEntry) |
| [getSearchContextHits](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ISearchesClient.html#getSearchContextHits) | [listSearchContextHits](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ISearchesClient.html#listSearchContextHits) |
| [getSearchContextHitsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ISearchesClient.html#getSearchContextHitsForEach) | [listSearchContextHitsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ISearchesClient.html#listSearchContextHitsForEach) |
| [getSearchContextHitsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ISearchesClient.html#getSearchContextHitsNextLink) | [listSearchContextHitsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ISearchesClient.html#listSearchContextHitsNextLink) |
| [getSearchResults](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ISearchesClient.html#getSearchResults) | [listSearchResults](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ISearchesClient.html#listSearchResults) |
| [getSearchResultsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ISearchesClient.html#getSearchResultsForEach) | [listSearchResultsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ISearchesClient.html#listSearchResultsForEach) |
| [getSearchResultsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ISearchesClient.html#getSearchResultsNextLink) | [listSearchResultsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ISearchesClient.html#listSearchResultsNextLink) |
| [getSearchStatus](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ISearchesClient.html#getSearchStatus) | [listTasks](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITasksClient.html#listTasks) |

### ServerSession
The [IServerSessionClient](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/IServerSessionClient.html) has been removed in `@laserfiche/lf-repository-api-client-v2`.

### SimpleSearches
 @laserfiche/lf-repository-api-client | @laserfiche/lf-repository-api-client-v2 |
|----------------------------------|-------------------------------------|
| [createSimpleSearchOperation](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ISimpleSearchesClient.html#createSimpleSearchOperation) | [searchEntry](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ISimpleSearchesClient.html#searchEntry) |

### TagDefinitions
 @laserfiche/lf-repository-api-client | @laserfiche/lf-repository-api-client-v2 |
|----------------------------------|-------------------------------------|
| [getTagDefinitionById](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITagDefinitionsClient.html#getTagDefinitionById) | [getTagDefinition](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITagDefinitionsClient.html#getTagDefinition) |
| [getTagDefinitions](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITagDefinitionsClient.html#getTagDefinitions) | [listTagDefinitions](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITagDefinitionsClient.html#listTagDefinitions) |
| [getTagDefinitionsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITagDefinitionsClient.html#getTagDefinitionsForEach) | [listTagDefinitionsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITagDefinitionsClient.html#listTagDefinitionsForEach) |
| [getTagDefinitionsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITagDefinitionsClient.html#getTagDefinitionsNextLink) | [listTagDefinitionsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITagDefinitionsClient.html#listTagDefinitionsNextLink) |

### Tasks
| @laserfiche/lf-repository-api-client | @laserfiche/lf-repository-api-client-v2 |
|----------------------------------|-------------------------------------|
| [cancelOperation](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITasksClient.html#cancelOperation) | [cancelTasks](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITasksClient.html#cancelTasks) |
| [getOperationStatusAndProgress](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITasksClient.html#getOperationStatusAndProgress) | [listTasks](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITasksClient.html#listTasks) |

### TemplateDefinitions
| @laserfiche/lf-repository-api-client | @laserfiche/lf-repository-api-client-v2 |
|----------------------------------|-------------------------------------|
| [getTemplateDefinitionById](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITemplateDefinitionsClient.html#getTemplateDefinitionById) | [getTemplateDefinition](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITemplateDefinitionsClient.html#getTemplateDefinition) |
| [getTemplateDefinitions](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITemplateDefinitionsClient.html#getTemplateDefinitions) | [listTemplateDefinitions](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITemplateDefinitionsClient.html#listTemplateDefinitions) |
| [getTemplateDefinitionsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITemplateDefinitionsClient.html#getTemplateDefinitionsForEach) | [listTemplateDefinitionsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITemplateDefinitionsClient.html#listTemplateDefinitionsForEach) |
| [getTemplateDefinitionsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITemplateDefinitionsClient.html#getTemplateDefinitionsNextLink) | [listTemplateDefinitionsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITemplateDefinitionsClient.html#listTemplateDefinitionsNextLink) |
| [getTemplateFieldDefinitions](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITemplateDefinitionsClient.html#getTemplateFieldDefinitions) | [listTemplateFieldDefinitionsByTemplateId](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITemplateDefinitionsClient.html#listTemplateFieldDefinitionsByTemplateId) |
| [getTemplateFieldDefinitionsForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITemplateDefinitionsClient.html#getTemplateFieldDefinitionsForEach) | [listTemplateFieldDefinitionsByTemplateIdForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITemplateDefinitionsClient.html#listTemplateFieldDefinitionsByTemplateIdForEach) |
| [getTemplateFieldDefinitionsNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITemplateDefinitionsClient.html#getTemplateFieldDefinitionsNextLink) | [listTemplateFieldDefinitionsByTemplateIdNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITemplateDefinitionsClient.html#listTemplateFieldDefinitionsByTemplateIdNextLink) |
| [getTemplateFieldDefinitionsByTemplateName](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITemplateDefinitionsClient.html#getTemplateFieldDefinitionsByTemplateName) | [listTemplateFieldDefinitionsByTemplateName](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITemplateDefinitionsClient.html#listTemplateFieldDefinitionsByTemplateName) |
| [getTemplateFieldDefinitionsByTemplateNameForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITemplateDefinitionsClient.html#getTemplateFieldDefinitionsByTemplateNameForEach) | [listTemplateFieldDefinitionsByTemplateNameForEach](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITemplateDefinitionsClient.html#listTemplateFieldDefinitionsByTemplateNameForEach) |
| [getTemplateFieldDefinitionsByTemplateNameNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v1/1.x/interfaces/ITemplateDefinitionsClient.html#getTemplateFieldDefinitionsByTemplateNameNextLink) | [listTemplateFieldDefinitionsByTemplateNameNextLink](https://laserfiche.github.io/lf-repository-api-client-js/docs/v2/1.x/interfaces/ITemplateDefinitionsClient.html#listTemplateFieldDefinitionsByTemplateNameNextLink) |
