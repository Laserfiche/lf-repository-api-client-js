import 'dotenv/config';
import { authorizationTypeEnum } from './AuthorizationType';
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
export const repositoryId: string = process.env.REPOSITORY_ID ?? '';
export const testHeader: string = process.env.TEST_HEADER ?? '';
export const authorizationType: authorizationTypeEnum = (process.env.AUTHORIZATION_TYPE ??
  authorizationTypeEnum.None) as authorizationTypeEnum;

// Self Hosted connection parameters
export const username: string = process.env.APISERVER_USERNAME ?? '';
export const password: string = process.env.APISERVER_PASSWORD ?? '';
export const baseUrl: string = process.env.APISERVER_REPOSITORY_API_BASE_URL ?? '';
