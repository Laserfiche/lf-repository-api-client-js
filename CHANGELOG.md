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
  - Rename `moveOrRenameDocument` to `moveOrRenameEntryAsync` to better represent its capability.