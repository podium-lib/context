# Podium Context

[![Build Status](https://travis-ci.org/podium-lib/context.svg?branch=master)](https://travis-ci.org/podium-lib/context) [![Greenkeeper badge](https://badges.greenkeeper.io/podium-lib/context.svg)](https://greenkeeper.io/)

Module to generate, serialize and de-serialize a Podium Context.

## Installation

```bash
$ npm install @podium/context
```

## Example

Simple Layout server requesting content from a Podlet server:

```js
const request = require('request');
const express = require('express');
const Context = require('@podium/context');

const app = express();

// Set up a context with the name 'myLayout'
const context = new Context({ name: 'myLayout' });

// Attach context middleware to all incomming requests.
// This will run all built in parsers on all requests.
// The context will be stored at: `res.podium.context`
app.use(context.middleware());

// A GET route requesting a Podlet server. The context
// is serialized and appended as HTTP headers to the
// request to the Podlet server.
app.get('/', (req, res) => {
    const headers = Context.serialize({}, res.locals.podium.context);
    request({
        headers: headers,
        method: 'GET',
        url: 'http://some.podlet.finn.no/',
    }).pipe(res);
});

app.listen(8080);
```

Simple Podlet server recieving requests from the Layout server:

```js
const express = require('express');
const Context = require('@podium/context');

const app = express();

// Attach context de-serialize middleware which will
// transform the context into a usable object.
// The context will be stored at: `res.locals.podium.context`
app.use(Context.deserialize());

app.get('/', (req, res) => {
    res.status(200).json(res.locals.podium.context);
});

app.listen(8080);
```

## Description

The Podium Context is used to provide key information from a Layout server to a Podlet server.
This is done by a defined set of HTTP headers which is applied to all requests from a Layout
server to a Podlet server.

This module handles generating wanted key information in the Layout server and seralizing
it into HTTP headers which are passed on to requests to the Podlet servers where the
HTTP headers are once again parsed back into a key / value object with the key information.

There are three parts in this module:

-   Parsers
-   Middleware to run parsers
-   Serializing / deserializing

Each part works as follow:

### Parsers

A parser works on an inbound request to the Layout server. The parser has access to the
HTTP `request` and `response` objects in a Layout server. Upon this a parser builds a
value which will be applied as part of the context which is appended to requests
to Podlet servers.

This module comes with a set of built in parsers which will always be applied.

It's also possible to write custom parsers and append them to the process of constructing
the context.

### Middleware

The middleware is a Connect compatible middleware which runs on all HTTP requests to
the Layout server and runs all registered parsers.

The middleware stores the result of each parser as an object on the response at `res.locals.podium.context`.
This object is "HTTP header like" and can be serialized into headers on an HTTP request
to a Podlet.

### Serializing / deserializing

These are `static` methods used to serialize and deserialize the "HTTP header like"
object from `res.locals.podium.context` into HTTP headers on the HTTP request to a Podlet
and then back into a object on `res.locals.podium.context` in the Podlet server.

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

A name as a `String` to identify the instance. This should be a logical and human readable name
related to the Layout this instance is appended too. This name is passed on to the Podlet
servers as part of the [Requested By](#requested-by) context.

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

Config object passed on to the device type parser. See the [parser docs](#device-type).

#### mountOrigin

Config object passed on to the mount origin parser. See the [parser docs](#mount-origin).

#### mountPathname

Config object passed on to the mount pathname parser. See the [parser docs](#mount-pathname).

#### publicPathname

Config object passed on to the public pathname parser. See the [parser docs](#public-pathname).

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
const express = require('express');
const Context = require('@podium/context');
const Parser = require('my-custom-parser');

const app = express();

const context = new Context('myName');
context.register('myStuff', new Parser('someConfig'));

app.use(context.middleware());

app.get('/', (req, res) => {
    // res.locals.podium.context will now hold the following object:
    // {
    //     'podium-debug': 'false',
    //     'podium-locale': 'no-NO'
    //     'podium-my-stuff': 'value from custom parser'
    // }
});

app.listen(8080);
```

### .middleware()

Connect compatible middleware to execute all parsers in parallel and append the result of each parser
to `res.locals.podium.context`.

This will execute all built in parsers as well as all externally registered (through the `.register()`
method) parsers.

## Static API

The Context constructor has the following static API:

### .serialize(headers, context, podletName)

Takes an "HTTP header-ish" object produced by `.middleware()` (the `res.locals.podium.context` object)
and serializes it into an HTTP header object which can be applied to HTTP requests sent to podlets.

The object stored at `res.locals.podium.context` is "HTTP header-ish" because the value of each key
can be either a `String` or a `Function`. If a key holds a `Function` the serializer will call
the function with the `podletName` argument.

The method takes the following arguments:

| option     | default | type     | required | details                                                                          |
| ---------- | ------- | -------- | -------- | -------------------------------------------------------------------------------- |
| headers    | `null`  | `object` | `true`   | An existing HTTP header object or empty object the context should be merged into |
| context    | `null`  | `object` | `true`   | The object produced by `.middleware()` and stored at `res.locals.podium.context` |
| podletName | `null`  | `string` | `false`  | The name of the podlet the context should be applied to                          |

Example: layout sends context with a request to a podlet

```js
app.get('/', (req, res) => {
    const headers = Context.serialize(
        {},
        res.locals.podium.context,
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

Connect compatible middleware which will parse HTTP headers on inbound requests and turn Podium context headers into a context object stored at `res.locals.podium.context`.

Example: podlet receives request from a layout server

```js
app.use(Context.deserialize());

app.get('/', (req, res) => {
    res.status(200).json(res.locals.podium.context);
});
```

## Internal parsers

This module comes with a set of default parsers which will be applied when `.middleware()` is
run.

Each of these parsers can be configured through with constructor option object by passing an options object to the matching options parameter for the parser in the constructor (see constructor options).

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
This name value is then passed on from the layout to any podlets in the `podium-requested-by` context header which is generated by running this parser.

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

Locale of the requesting browser. When executed by `.middleware()`, this
parser will look for a locale at `res.locals.locale`. If found, this
value will be used. If not found, the default locale will be used.

```js
const context = new Context({
    name: 'myName',
});
const app = express();

app.use((req, res) => {
    res.locals.locale = 'nb-NO';
});

app.use(context.middleware());
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

This module will internally cache its result and the matching UA string in an LRU cache for faster lookup.

#### arguments (optional)

This parser takes an optional config object with the following properties:

| option    | default | type     | required | details                                       |
| --------- | ------- | -------- | -------- | --------------------------------------------- |
| cacheSize | `10000` | `number` | `false`  | Number of UA Strings to keep in the LRU cache |

This config object is passed on to the `deviceType` property on the config
object in the constructor.

### Mount Origin

Context header: `podium-mount-origin`

URL origin of the inbound request to the layout server. The parser will try to parse this value from inbound requests to the layout server. It is
also possible to override the value using config.

The value is a [WHATWG URL](https://url.spec.whatwg.org/) compatible origin
[(illustrated overview)](https://nodejs.org/api/url.html#url_url_strings_and_url_objects).

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

The value is a [WHATWG URL](https://url.spec.whatwg.org/) compatible pathname
[(illustrated overview)](https://nodejs.org/api/url.html#url_url_strings_and_url_objects).

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

URL pathname indicating where a layout server has mounted a proxy to proxy public
traffic to podlets.

The full public pathname is built up joining `pathname` and `prefix` where `pathname` is the pathname to where the proxy is mounted into the HTTP server and `prefix` is a namespace isolating the proxy from other routes defined under the same pathname.

Often `pathname` will be the same value as mount pathname.

The value is a [WHATWG URL](https://url.spec.whatwg.org/) compatible pathname
[(illustrated overview)](https://nodejs.org/api/url.html#url_url_strings_and_url_objects).

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

## A word on URL construction

By adhering to the [WHATWG URL](https://url.spec.whatwg.org/) spec when constructing URLs we can easily compose full URLs by using the [URL module in node.js](https://nodejs.org/api/url.html#url_class_url).

Example:

In a podlet, the origin of a layout server can be found at `res.locals.podium.context.mountOrigin`
and the pathname to the layout can be found at `res.locals.podium.context.mountPathname`.

To get the full URL of where a podlet is used in a layout, we can combine these two by using the [URL module in node.js](https://nodejs.org/api/url.html#url_class_url)
like so:

```js
const { URL } = require('url');
const origin = res.locals.podium.context.mountOrigin;
const pathname = res.locals.podium.context.mountPathname;
const url = new URL(pathname, origin);

console.log(url.href); // prints full URL
```

The same can be done to construct a public URL to the proxy URL:

```js
const { URL } = require('url');
const origin = res.locals.podium.context.mountOrigin;
const pathname = res.locals.podium.context.publicPathname;
const url = new URL(pathname, origin);

console.log(url.href); // prints full to proxy endpoint
```
