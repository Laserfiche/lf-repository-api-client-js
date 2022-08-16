import 'dotenv/config';
import { AccessKey, createFromBase64EncodedAccessKey } from '@laserfiche/lf-api-client-core';
export const testServicePrincipalKey: string = process.env.SERVICE_PRINCIPAL_KEY ?? '';
if (!testServicePrincipalKey) {
  throw new Error(`Unable to load SERVICE_PRINCIPAL_KEY from .env`);
}
let accessKeyBase64: string = process.env.ACCESS_KEY ?? '';
if (!accessKeyBase64) {
  throw new Error(`Unable to load ACCESS_KEY from .env`);
}
export const OAuthAccessKey: AccessKey = createFromBase64EncodedAccessKey(accessKeyBase64 ?? '');
export const repoId: string = process.env.REPOSITORY_ID ?? '';
export const testHeader: string = process.env.TEST_HEADER ?? '';
