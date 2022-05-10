export default function GetRepoIdFromUri(uri: string){
    const regex = /\/repositories(?:\/|\(')(?<repoId>[a-zA-Z0-9\-]*?)(?:'\))?\//;
    let match = uri.match(regex);
    if (match != null && match.length > 0) {
        return match.groups?.repoId;
    }
}
