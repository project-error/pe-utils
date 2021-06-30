<p align="center">
  <a href="https://projecterror.dev/" rel="noopener" target="_blank"><img width="150" src="https://i.tasoagc.dev/c1pD" alt="Material-UI logo"></a></p>
</p>


<h1 align="center">Project Error Utilities</h1>
<div align="center">
A collection of useful utilities for the v8 ScRT within the CFX platform.
</div>

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/project-error/pe-utils/master/LICENSE)
[![npm next package](https://img.shields.io/npm/v/@project-error/pe-utils/latest.svg)](https://www.npmjs.com/package/@material-ui/core)
![Discord](https://img.shields.io/discord/791854454760013827?label=Our%20Discord)
![David](https://img.shields.io/david/project-error/pe-utils)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=project-error/pe-utils)](https://dependabot.com)

## Installation

This package is available as an [npm package](https://www.npmjs.com/package/@project-error/pe-utils).

```sh
# npm installation
npm install @project-error/pe-utils

# yarn installation
yarn add @project-error/pe-utils
```

⚠️Note: This project is currently in active development and may be unstable for the forseeable
future

## Features
* Promisified net events
* RPC system allowing for remote client calls from the server
* TypeScript wrapped natives allowing for more fluid static typing through generics
* NUI Proxy system that allows for NUI to fetch server side data without breaking the HTTP
request
* TypeScript first with declarations generated from source (vanilla JavaScript is still compatible)
* General wrappers to make development easier within the runtime

## Official Examples
You can find official examples at [this GitHub Repo](https://github.com/project-error/pe-utils-examples). These
are both in TypeScript as well as regular JavaScript

## Function Documentation
Inline documentations is also included for almost all of the current functions
& methods.

### Promisified Net Events
This package adds the ability to utilize promisified net events. Essentially a small promise
wrapper around events. When using this system it is wise to keep in mind that events
are transmitted over UDP and **not** TCP, this can lead to issues if a player has
poor internet speeds. There is a default timeout of 15 seconds which can be lowered or
raised.

**Example**

```ts
// Client Side
import { 
  ClientUtils, 
  RegisterNuiCB, 
  PromiseEventResp 
} from "@project-error/pe-utils";

interface ServerResponseData {
  data1: number,
  data2: number,
  data3: number
}

const clUtils = new ClientUtils()

// NUI Callback wrapped for v8
RegisterNuiCB('someCallbackEvent', async (data: unknown, cb: (any) => void) => {
  try {
    const serverResp = await clUtils.emitNetPromise<PromiseEventResp<ServerResponseData>>('fetchEvent')
    cb(serverResp)
  } catch (e) {
    console.error(`Error encountered: ${e.message}`)
  }
})
```

```ts
// Server Side
import { ServerUtils } from "./sv_utils";
import { ServerPromiseResp } from "./sv_utils.types";

interface IncomingData {
  thing1: string;
  thing2: number;
}

interface ReturnData {
  respData1: number;
  respData2: string;
}

const svUtils = new ServerUtils()

svUtils.onNetPromise<RequestData, ServerPromiseResp<ReturnData>>('fetchEvent', (req, resp) => {
  const playerSrc = req.source
  

  // Do some logic to get resp data on the server

  const respObj: ServerPromiseResp<ReturnData> = {
    status: 'ok',
    data: {
      respData1: 12345,
      respData2: 'adadsadasda',
    }
  }
  // Sent back to the client to resolve
  resp(respObj)
})
```

### RPC System
```ts
// Client Side
interface ServerDataObj {
  coolStuff: string;
  amICool: boolean;
}

clientUtils.registerRPCListener<ServerDataObj>('niceEvent', data => {
  const playerPed = PlayerPedId();
  // This is the optional data sent by the server, you can
  // use it for logic if needed
  console.dir(data);

  const [x, y, z] = GetEntityCoords(playerPed, false);
  // We return an object here to the server with x, y, z
  return { x, y, z };
});
```

```ts
// Server Side
RegisterCommand(
  'debugTest',
  async (src: number) => {
    try {
      // Lets call our RPC and print the result. This is a promise, so we must await
      const coordObj = await svUtils.callClientRPC<Vector3>('niceEvent', src, {
        coolStuff: 'adadadada',
        amICool: false,
      });

      console.log('Returned data:');
      console.dir(coordObj);
    } catch (e) {
      console.error(e);
    }
  },
  false,
);
```

**TODO: Further Explanations**




