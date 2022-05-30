import 'dotenv/config';
import { AccessKey } from '@laserfiche/lf-api-client-core';
import { DomainUtils } from '@laserfiche/lf-api-client-core';
export const testServicePrincipalKey: string =
  process.env.DEV_CA_PUBLIC_USE_TESTOAUTHSERVICEPRINCIPAL_SERVICE_PRINCIPAL_KEY ?? '';
if (!testServicePrincipalKey) {
  throw new Error(`Unable to load DEV_CA_PUBLIC_USE_TESTOAUTHSERVICEPRINCIPAL_SERVICE_PRINCIPAL_KEY from .env`);
}
let accessKey: any = process.env.DEV_CA_PUBLIC_USE_INTEGRATION_TEST_ACCESS_KEY;
const reg = /\\\"/g;
accessKey = accessKey?.replace(reg, '"');
accessKey = accessKey?.replace('"{', '{');
accessKey = accessKey?.replace('}"', '}');
export const testKey: AccessKey = JSON.parse(accessKey ?? '');
export const repoId: string = process.env.DEV_CA_PUBLIC_USE_REPOSITORY_ID_1 ?? '';
let domain = JSON.stringify(testKey.domain).replace(/"/g,'');
export const baseUrlDebug:string = DomainUtils.getRepositoryEndpoint(domain);

