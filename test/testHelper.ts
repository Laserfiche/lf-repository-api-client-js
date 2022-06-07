import 'dotenv/config';
import { AccessKey } from '@laserfiche/lf-api-client-core';
import { StringUtils } from '@laserfiche/lf-js-utils';
export const testServicePrincipalKey: string =
  process.env.DEV_CA_PUBLIC_USE_TESTOAUTHSERVICEPRINCIPAL_SERVICE_PRINCIPAL_KEY ?? '';
if (!testServicePrincipalKey) {
  throw new Error(`Unable to load DEV_CA_PUBLIC_USE_TESTOAUTHSERVICEPRINCIPAL_SERVICE_PRINCIPAL_KEY from .env`);
}
let accessKeyBase64: string = process.env.DEV_CA_PUBLIC_USE_INTEGRATION_TEST_ACCESS_KEY ?? '';
if (!accessKeyBase64) {
  throw new Error(`Unable to load accessKey from .env`);
}
export const OAuthAccessKey: AccessKey = JSON.parse(StringUtils.base64toString(accessKeyBase64) ?? '');
export const repoId: string = process.env.DEV_CA_PUBLIC_USE_REPOSITORY_ID_1 ?? '';