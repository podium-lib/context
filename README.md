# Podium Context

Module to generate the context which is passed on requests from a Podium Layout
server to a Podium Podlet server.

[![Dependencies](https://img.shields.io/david/podium-lib/context.svg)](https://david-dm.org/podium-lib/context)
![GitHub Actions status](https://github.com/podium-lib/context/workflows/Run%20Lint%20and%20Tests/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/podium-lib/context/badge.svg)](https://snyk.io/test/github/podium-lib/context)

This module is intended for internal use in Podium and is not a module an end
user would use directly. End users will typically interact with this module
through higher level modules such as the [@podium/layout] module.

## Installation

```bash
$ npm install @podium/context
```

## Example

Generate a context which can be passed on to an http request to a Podlet:

```js
const { HttpIncoming } = require('@podium/utils');
const Context = require('@podium/context');
const http = require('http');

// Set up a context with the name 'myLayout'
const context = new Context({ name: 'myLayout' });

const server = http.createServer(async (req, res) => {
    // Create a HttpIncoming object
    const incoming = new HttpIncoming(req, res);

    // Run context parsers on the request
    const incom = await context.process(incoming);

    // Serialize the context into an object that can be
    // passed on as HTTP headers on each HTTP request
    const headers = Context.serialize({}, incom.context);

    [ ... snip ...]
});

server.listen(8080);
```

## Description

The Podium Context is used to provide key information from a Layout server to a
Podlet server. This is done by a defined set of HTTP headers which is applied to
all requests from a Layout server to a Podlet server.

This module handles generating wanted key information in the Layout server and
seralizing it into HTTP headers which are passed on to requests to the Podlet
servers where the HTTP headers are once again parsed back into a key / value
object with the key information.

There are three parts in this module:

-   Parsers
-   Middleware to run parsers
-   Serializing / deserializing

Each part works as follow:

### Parsers

Parsers operate on inbound requests to a layout server. Each parser is handed an
[HttpIncoming] object for each request. Upon execution a parser builds a value
which will be applied as part of the context and then appended to all requests
made to podlet servers.

This module comes with a set of built in parsers which will always be applied.

It's also possible to write custom parsers and append them to the process of
constructing the context.

### Processing

There is a `.process()` method which takes an [HttpIncoming] object and then
runs it through all registered parsers in parallel.

The result of each parser is stored in an object which is set on the `.context`
property of the [HttpIncoming] object. This object is "HTTP header like" and can
be serialized into headers on an HTTP request to a Podlet.

### Serializing / deserializing

These are `static` methods used to serialize and deserialize the "HTTP header
like" object from `HttpIncoming.context` into HTTP headers on the HTTP request
to a Podlet and then back into a object on `HttpIncoming.context` in the Podlet
server.

## Constructor

Creates a new Podium context instance.

```js
const Context = require('@podium/context');
const context = new Context({ name: 'myName' });
```

The constructor takes the following arguments:

### options

| option         | default | type     | required | details                                |
| -------------- | ------- | -------- | -------- | -------------------------------------- |
| name           | `null`  | `string` | `true`   |                                        |
| debug          | `null`  | `object` | `false`  | [See parser options](#debug)           |
| locale         | `null`  | `object` | `false`  | [See parser options](#locale)          |
| deviceType     | `null`  | `object` | `false`  | [See parser options](#device-type)     |
| mountOrigin    | `null`  | `object` | `false`  | [See parser options](#mount-origin)    |
| mountPathname  | `null`  | `object` | `false`  | [See parser options](#mount-pathname)  |
| publicPathname | `null`  | `object` | `false`  | [See parser options](#public-pathname) |

#### name

A name as a `String` to identify the instance. This should be a logical and
human readable name related to the Layout this instance is appended too. This
name is passed on to the Podlet servers as part of the
[Requested By](#requested-by) context.

The name value must be in camelCase.

Example

```js
const context = new Context({
    name: 'myLayout';
});
```

#### debug

Config object passed on to the debug parser. See the [parser docs](#debug).

#### locale

Config object passed on to the locale parser. See the [parser docs](#locale).

#### deviceType

Config object passed on to the device type parser. See the
[parser docs](#device-type).

#### mountOrigin

Config object passed on to the mount origin parser. See the
[parser docs](#mount-origin).

#### mountPathname

Config object passed on to the mount pathname parser. See the
[parser docs](#mount-pathname).

#### publicPathname

Config object passed on to the public pathname parser. See the
[parser docs](#public-pathname).

## API

The Context instance has the following API:

### .register(name, parser)

Register a Parser for a value that should be appended to the Context.

This method takes the following arguments:

| option | default | type     | required | details                                                                          |
| ------ | ------- | -------- | -------- | -------------------------------------------------------------------------------- |
| name   | `null`  | `string` | `true`   | Unique name of the parser. Used as the key for the parser's value in the context |
| parser | `null`  | `object` | `true`   | The Parser to be registered                                                      |

Example:

```js
const { HttpIncoming } = require('@podium/utils');
const Context = require('@podium/context');
const Parser = require('my-custom-parser');
const http = require('http');

// Set up a context and register the custom parser
const context = new Context({ name: 'myLayout' });
context.register('myStuff', new Parser('someConfig'));

const server = http.createServer(async (req, res) => {
    const incoming = new HttpIncoming(req, res);
    const incom = await context.process(incoming);
    // incom.context will now hold the following object:
    // {
    //     'podium-debug': 'false',
    //     'podium-locale': 'no-NO'
    //     'podium-my-stuff': 'value from custom parser'
    // }
});

server.listen(8080);
```

### .process(HttpIncoming)

Metod for processing a incoming http request. It runs all parsers in parallel
and append the result of each parser to `HttpIncoming.context`.

This will execute all built in parsers as well as all externally registered
(through the `.register()` method) parsers.

Returns a Promise which will resolve with the passed in `HttpIncoming` object.

#### HttpIncoming (required)

An instance of a [HttpIncoming] class.

## Static API

The Context constructor has the following static API:

### .serialize(headers, context, podletName)

Takes an "HTTP header like" object produced by `.process()` (the
`HttpIncoming.context` object) and serializes it into an HTTP header object
which can be applied to HTTP requests sent to podlets.

The object stored at `HttpIncoming.context` is "HTTP header-ish" because the
value of each key can be either a `String` or a `Function`. If a key holds a
`Function` the serializer will call the function with the `podletName` argument.

The method takes the following arguments:

| option     | default | type     | required | details                                                                          |
| ---------- | ------- | -------- | -------- | -------------------------------------------------------------------------------- |
| headers    | `null`  | `object` | `true`   | An existing HTTP header object or empty object the context should be merged into |
| context    | `null`  | `object` | `true`   | The object produced by `.middleware()` and stored at `res.locals.podium.context` |
| podletName | `null`  | `string` | `false`  | The name of the podlet the context should be applied to                          |

Example: layout sends context with a request to a podlet

```js
const server = http.createServer(async (req, res) => {
    const incoming = new HttpIncoming(req, res);
    const incom = await context.process(incoming);

    const headers = Context.serialize(
        {},
        incom.context,
        'somePodlet',
    );
    request({
        headers: headers,
        method: 'GET',
        url: 'http://some.podlet.finn.no/',
    }).pipe(res);
});
```

### .deserialize()

Connect compatible middleware which will parse HTTP headers on inbound requests
and turn Podium context headers into a context object stored at
`res.locals.podium.context`.

Example: podlet receives request from a layout server

```js
app.use(Context.deserialize());

app.get('/', (req, res) => {
    res.status(200).json(res.locals.podium.context);
});
```

## Internal parsers

This module comes with a set of default parsers which will be applied when
`.process()` is run.

Each of these parsers can be configured through the constructor's options object
by passing an options object for the specific parser (see constructor options).

Example of passing options to the built in `debug` parser:

```js
const Context = require('@podium/context');
const context = new Context({
    name: 'myName',
    debug: {
        enabled: true,
    },
});
```

The following parsers are applied by default:

### Requested By

Context header: `podium-requested-by`

Each layout must have a given name to make it more easily human identifiable.
This name value is then passed on from the layout to any podlets in the
`podium-requested-by` context header which is generated by running this parser.

#### arguments (required)

The parser takes a string (required) as the first argument to the constructor.

Example:

```js
const Context = require('@podium/context');
const context = new Context({
    name: 'myName',
});
```

### Debug

Context header: `podium-debug`

Indicates to podlets when the layout server is in debug mode.

#### arguments (optional)

This parser takes an optional config object with the following properties:

| option | default | type      | required | details                                          |
| ------ | ------- | --------- | -------- | ------------------------------------------------ |
| enable | `false` | `boolean` | `false`  | Indicates whether layout is in debug mode or not |

This config object is passed on to the `debug` argument on the context object
constructor.

### Locale

Context header: `podium-locale`

Locale of the requesting browser. When executed by `.process()`, this
parser will look for a locale property at `HttpIncoming.params.locale`.
If found, this value will be used. If not found, the default locale will
be used.

```js
const context = new Context({
    name: 'myName',
});
const app = express();

app.get(await (req, res) => {
    const incoming = new HttpIncoming(req, res, {
        locale: 'nb-NO',
    });
    const incom = await context.process(incoming);

    [ ... snip ...]
});
```

#### arguments (optional)

This parser takes an optional config object with the following properties:

| option | default | type     | required | details                         |
| ------ | ------- | -------- | -------- | ------------------------------- |
| locale | `en-US` | `string` | `false`  | A bcp47 compliant locale String |

This config object is passed on to the `locale` property on the config object
in the constructor.

### Device Type

Context header: `podium-device-type`

A guess at the device type of the requesting browser. Guessing is done by
UA detection and is **not** guaranteed to be accurate.

The output value will be one of the following strings:

-   `desktop`: The device requesting the podlet is probably a desktop computer
    or something with a large screen. This is the **default** if we're not able
    to determine anything more detailed.
-   `tablet`: The device is probably a tablet of some sort, or a device with a
    smaller screen than a desktop.
-   `mobile`: The device is probably a phone of some sort, or a device with a
    smaller screen than a tablet.

This module will internally cache its result and the matching UA string in an
LRU cache for faster lookup.

#### arguments (optional)

This parser takes an optional config object with the following properties:

| option    | default | type     | required | details                                       |
| --------- | ------- | -------- | -------- | --------------------------------------------- |
| cacheSize | `10000` | `number` | `false`  | Number of UA Strings to keep in the LRU cache |

This config object is passed on to the `deviceType` property on the config
object in the constructor.

### Mount Origin

Context header: `podium-mount-origin`

URL origin of the inbound request to the layout server. The parser will try to
parse this value from inbound requests to the layout server. It is also possible
to override the value using config.

The value is a [WHATWG URL] compatible origin [(illustrated overview)](https://nodejs.org/api/url.html#url_url_strings_and_url_objects).

#### arguments (optional)

This parser takes an optional config object with the following properties:

| option | default | type     | required | details                                                                   |
| ------ | ------- | -------- | -------- | ------------------------------------------------------------------------- |
| origin | null    | `string` | `false`  | Origin string that, if present, will override the origin found on request |

Example:

```js
const Context = require('@podium/context');
const context = new Context({
    name: 'myName',
    mountOrigin: {
        origin: 'https://example.org/',
    },
});
```

### Mount Pathname

Context header: `podium-mount-pathname`

URL pathname specifying where a layout is mounted in an HTTP server.

The value is a [WHATWG URL] compatible pathname [(illustrated overview)](https://nodejs.org/api/url.html#url_url_strings_and_url_objects).

#### arguments (optional)

This parser takes an optional config object with the following properties:

| option   | default | type     | required | details                                                         |
| -------- | ------- | -------- | -------- | --------------------------------------------------------------- |
| pathname | '/'     | `string` | `false`  | Pathname specifying where a Layout is mounted in an HTTP server |

Example:

```js
const Context = require('@podium/context');
const context = new Context({
    name: 'myName',
    mountPathname: {
        pathname: '/my/path/name',
    },
});
```

### Public Pathname

Context header: `podium-public-pathname`

URL pathname indicating where a layout server has mounted a proxy to proxy
public traffic to podlets.

The full public pathname is built up joining `pathname` and `prefix` where
`pathname` is the pathname to where the proxy is mounted into the HTTP server
and `prefix` is a namespace isolating the proxy from other routes defined under
the same pathname.

Often `pathname` will be the same value as mount pathname.

The value is a [WHATWG URL] compatible pathname [(illustrated overview)](https://nodejs.org/api/url.html#url_url_strings_and_url_objects).

#### arguments (optional)

This parser takes an optional config object with the following properties:

| option   | default           | type     | required | details                                                                       |
| -------- | ----------------- | -------- | -------- | ----------------------------------------------------------------------------- |
| pathname | '/'               | `string` | `false`  | Pathname where a Proxy is mounted in a HTTP server                            |
| prefix   | 'podium-resource' | `string` | `false`  | Namespace used to isolate the proxy from other routes under the same pathname |

Example:

```js
const Context = require('@podium/context');
const context = new Context({
    name: 'myName',
    publicPathname: {
        pathname: '/my/custom/proxy',
        prefix: 'proxy',
    },
});
```

## License

Copyright (c) 2019 FINN.no

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



[@podium/layout]: https://github.com/podium-lib/layout "@podium/layout"
[HttpIncoming]: https://github.com/podium-lib/utils/blob/master/lib/http-incoming.js "HttpIncoming"
[WHATWG URL]: https://url.spec.whatwg.org/ "WHATWG URL"
