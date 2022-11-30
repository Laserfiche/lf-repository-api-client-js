## 1.1.1

### Fixes

- Added `Laserfiche` keyword to `package.json` file
- Updated changelog information in the readme file 

## 1.1.0

### Features

- Added support for Self-hosted API Server

### Fixes

- Fix `IEntriesClient.getDocumentContentType` return type from `Promise<void>` to `Promise<HttpResponseHead<void>>` to allow retrieving response headers.
- Fix `ISimpleSearchesClient.createSimpleSearchOperation` return type from `Promise<ODataValueOfIListOfEntry>` to `Promise<ODataValueContextOfIListOfEntry>` to more accurately represent the response. The `ODataValueContextOfIListOfEntry` type derives from the `ODataValueOfIListOfEntry` type.
- **[BREAKING]**: Fix `FuzzyType` enum values to have string values. Usage of the `FuzzyType` when creating a search using `ISearchesClient.createSearchOperation` does not need to change.

## 1.0.14

### Fixes

- Add missing `403` and `404` status codes to various APIs.
- Change `Entry` type to abstract. Should use the derived types like `Folder`, `Document`, `Shortcut`, and `RecordSeries`.
- Deprecate the `ServerSession` APIs. This applies to the following:
  - `serverSessionClient.createServerSession`
  - `serverSessionClient.refreshServerSession`
  - `serverSessionClient.invalidateServerSession`
- Fixed an issue with optional header parameters being set as empty strings, such as in `exportDocument`
- **[BREAKING]**: `IEntriesClient`
  - Rename `moveOrRenameDocument` to `moveOrRenameEntry` to better represent its capability.
