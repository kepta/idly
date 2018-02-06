# An insanely fast osm parser

The `idly-faster-osm-parser` is roughly 3kb's gzipped.

This parser parses on the basis of the shape of an .osm file. It tries to avoid using any kind of xml parser and treats the xml as a simple string, hence you can parse gigabytes of data.

Please note it only supports `.osm` files.

### Introduction

```bash
npm install idly-faster-osm-parser
```

### How fast

You can run the benchmarks in the [benchmark](https://github.com/kepta/idly/tree/master/packages/idly-faster-osm-parser/benchmark) folder.
Below is a sample result of processing a 428kb .osm file

| Parsers               |       Time       |
| --------------------- | :--------------: |
| faster-osm-parser     |  0s, 41.30629ms  |
| osmium                | 0s, 50.834623ms  |
| node-faster-osm-parse | 0s, 56.342906ms  |
| iD-xml-parser         | 0s, 126.757749ms |
| osmtogeojson          | 0s, 156.496379ms |

### Browser

The `idly-faster-osm-parser` is roughly 3kb's gzipped. You can import it just like any npm module

Usage

```Javascript
import idlyParser from 'idly-faster-osm-parser'

const XML2 = `
    <?xml version="1.0" encoding="UTF-8"?>
    <osm>
        <node id="1" version="1" changeset="1" lat="0" lon="0" visible="true" timestamp="2009-03-07T03:26:33Z"></node>
    </osm>`;

const items = idlyParser(XML2);
[
//   {
//     attributes: {
//       changeset: '1',
//       timestamp: '2009-03-07T03:26:33Z',
//       uid: undefined,
//       user: undefined,
//       version: '1',
//       visible: true,
//     },
//     id: 'n1',
//     loc: { lon: 0, lat: 0 },
//     tags: {},
//     type: 'node',
//   },
// ];
```

### parser(xmlString, options)

**Returns an array of Osm Entities.**

| Parameter                 |           Type           | Description                                                                                                               |
| ------------------------- | :----------------------: | ------------------------------------------------------------------------------------------------------------------------- |
| xmlString                 |         `string`         | The xml string to parse                                                                                                   |
| options                   |         `Object`         | _*Optional*_. Specifies the fields to return for the resulting object /objects. Omit this parameter to return all fields. |
| options.prependEntityChar | `boolean` (default=true) | prepending `n`, `w`, `r` to the id of entity                                                                              |

### Shape of Entities

```Typescript
interface Node {
   id: EntityId;
   tags: Tags;
   type: EntityType.NODE;
   loc: {
        lat: number;
        lon: number;
    };
   attributes: {
         visible?: boolean;
         version?: string;
         timestamp?: string;
         changeset?: string;
         uid?: string;
         user?: string;
    };
}

interface Way {
    id: EntityId;
    type: EntityType.WAY;
    tags: {
        [index: string]: string;
    };
    nodes: [string];
    attributes: {
         visible?: boolean;
         version?: string;
         timestamp?: string;
         changeset?: string;
         uid?: string;
         user?: string;
    }
}

interface Relation {
    id: EntityId;
    type: EntityType.RELATION;
    tags: {
        [index: string]: string;
    };
    members: [
        {
            id?: string;
            ref?: string;
            type?: string;
            role?: string;
        }
    ];
    attributes: {
         visible?: boolean;
         version?: string;
         timestamp?: string;
         changeset?: string;
         uid?: string;
         user?: string;
    };
}
```
