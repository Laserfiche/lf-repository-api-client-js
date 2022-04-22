# Laserfiche Repository API Client

This package contains the Laserfiche Repository API Client library for Typescript. Before using this library, you will need a properly configured application on the [Laserfiche Developer Console](https://app.laserfiche.com/devconsole/). 

[[_TOC_]]


## Installation

```bash
npm install laserfiche-repository-api-client
```

## Usage

### Service applications

#### 1. Create a Service app on the [Laserfiche Developer Console](https://app.laserfiche.com/devconsole/)
Ensure that the Service app is properly configured with a valid Service Principal and at least one access key.

#### 2. Create a ClientCredentialsOptions object
A ClientCredentialsOptions object is a plain Javascript object with these properties:

```typescript
{
    // The client ID for the application. You can find the client ID 
    // on the Laserfiche Developer Console config page for your application
    clientId: string;

    // The service principal key for the associated service principal user
    // for the application. You can configure service principals in 
    // the Laserfiche Account Administration page under 
    // "Service Principals"
    servicePrincipalKey: string;

    // A valid JWK access key taken from the Laserfiche Developer Console
    // config page for your application. 
    signingKey: JWK;
}
```

The `signingKey` must be a JWK in the following format:
``` typescript
 {
    kty: "EC";
    use: "sig";
    crv: "P-256";
    d: string;
    x: string;
    y: string;
    kid: string;
}
```
Note that a key downloaded or copied directly from the Laserfiche Developer Console will inherently be in this format and thus usable. 

#### 3. Create a new ClientCredentials(ClientCredentialsOptions options) with your ClientCredentialsOptions object
```typescript
let credentials = new ClientCredentials(options);
```
#### 4. Create a new Client for the repository API and authenticate using your ClientCredentials
```typescript
let client = new Client();
await client.authenticate(credentials);
```

If successful, this will set an access token as the bearer token in the Authorization header and you can now make authorized requests to the Laserfiche API.

## Example - Retrieving a repository entry
### 1. Create a ClientCredentials object with your custom ClientCredentialsOptions
``` typescript
import { Client, ClientCredentials } from 'laserfiche-repository-api-client';

// Configure our client credentials info
let signingKey = {
	"kty": "EC",
	"crv": "P-256",
	"use": "sig",
	"kid": "atOfVBe38QD-9Msk1wL0qt5D9YQIM0zWulFqSdTbYGs",
	"x": "r7YyDvPUEstFVTuAih-SyR2Xy626ry44hIOzMkgCA7M",
	"y": "DJOYCafNLXqpTGzxI_9fGNW6czmC_biWxau8VDHUU0o",
	"d": "Yolx3mlDkfIOpVBORzZz2h3ySFsFRibkOELdSxqRDzU"
};
let clientId: string = "rTXtFqwwatWX0qlTdJnUtOi1";
let servicePrincipalKey: string = "KkeSGwKcqoOKH5_8g1RR";

let options = {
    signingKey: signingKey,
    clientId: clientId,
    servicePrincipalKey: servicePrincipalKey
}

let credentials = new ClientCredentials(options);
```
### 2. Initialize a Client and authenticate using your ClientCredentials

``` typescript
// Initialize our client
let client = new Client();

// Retrieve an access token and set it as the bearer token in the Authorization header
console.log("Retrieving access token...");
await client.authenticate(credentials);
```
### 3. Create a new session with the Laserfiche API server
``` typescript
let repoId: string = "r-23456789";

try {
    console.log("Creating server session...");
    await client.create_Server_Session(repoId);
} catch (err) {
    console.log(error);
}
```
### 4. Retrieve an entry from a repository 
``` typescript
let entryId: number = 28370;

try { 
    // Retrieve an entry from the repository
    console.log("Retrieving repository entry...");
    let response = await client.get_Entry_Listing(repoId, entryId);
    console.log(response);
} catch(err) {
    console.log(error);
}
```

You can also run this example yourself by running `npm run example` and checking out the `/example` folder.

## Configuring the client

An abridged version of the `Client` class is as follows. You can set a `baseUrl`, `accessToken`, and an HTTP handler if you wish. For more customized use such as logging and results processing, we've provided some protected methods for you to extend. 

```typescript
export class Client {
    public accessToken?: string;

    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {

    }


    protected beforeFetchRequestAsync(requestInfo: RequestInfo, request: RequestInit, requestHeaders?: HeadersInit): Promise<void> { 
        return Promise.resolve(); 
    } 

    protected afterFetchResponseAsync(requestInfo: RequestInfo, response: Response): Promise<boolean> {
        return Promise.resolve(false);
    }
}
```


### Customizing what happens before a request is made / after a response is received

You can customize what happens before and after a request (ex. for logging diagnostic information, custom results processing, retry on 401s) by extending the `Client` class with the `beforeFetchRequestAsync` and `afterFetchResponseAsync` methods:

```typescript
import { Client } from 'laserfiche-repository-api-client';

export class CustomClient extends Client {
    protected beforeFetchRequestAsync(url: RequestInfo, request: RequestInit, requestHeaders?: HeadersInit): Promise<void> { 
        // Do work here before sending request
        console.log("Transforming options...");

        return Promise.resolve();
    } 

    protected afterFetchResponseAsync(url: RequestInfo, response: Response): Promise<boolean> {
        // Do work here after response is received 
        console.log("Transforming result...")

        // Return true if the request should be retried
        return Promise.resolve(false);
    }
}
```

### Adding a custom JSON.parse() reviver function
You can add a custom reviver function that is passed to JSON.parse() calls:
```typescript
import { Client } from 'laserfiche-repository-api-client';

class CustomClient extends Client {
    constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super(baseUrl, http);

        this.jsonParseReviver = (key: string, value: any) => {
            // Do work here to log or modify parsed values
            return value; 
        };
    }
}
```


## License
[Apache-2.0](https://choosealicense.com/licenses/apache-2.0/)