# samp-query

Returns live number of players, hostname and other with nodeJS.

## Install

```
git clone https://github.com/vedrancappone/samp-query
cd samp-query
npm install
```

## Build
```
cd src
tsc samp-query.ts
```

## Usage

```
const info = Query.serverInfo("server-ip");

console.log('Server name: ', info.hostname);
```

## Example
```
import { Query, SAMP_INFO }from "./src/samp-query";

class Test {
    public static async test() {
        const server: SAMP_INFO = await Query.serverInfo("46.174.53.195");

        console.log(`Server name ${server.hostname}`);
    }
}

Test.test();

// output
Server name ZARA | Nedelja / - Proslava Gallardovog rodjendana
```

## Contributing

PRs accepted.
