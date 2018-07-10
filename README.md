# Podium Context

Module to generate, serialize and de-serialize a Podium Context.

## Installation

```bash
$ npm install @podium/context
```


## Example

Simple Layout server requesting a Podlet server:

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
// is serialized and appended as http headers to the
// request to the Podlet server.
app.get('/', (req, res) => {
    const headers = Context.serialize({}, res.podium.context);
    request({
        headers: headers,
        method: 'GET',
        url: 'http://some.podlet.finn.no/'
    }).pipe(res);
});

app.listen(8080);
```

Simple Podlet server recieving requests from the Layout server:

```js
const express = require('express');
const Context = require('@podium/context');

const app = express();

// Attache context de-serialize middelware which will
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
it into HTTP headers which is passed on to the requests to the Podlet servers where the
HTTP headers again is parsed back into a key / value object with the key information.

There are three parts in this module:

 * Parser
 * Middleware to run parsers
 * Serializing / deserializing

Each part work as follow:

### Parsers

A parser work on a inbound request in the Layout server. The parser has access to the
http `request` and `response` objects in a Layout server. Upon this a parser builds a
value which will be applied as part of the context which is appended to the requests
to the Podlet servers.

This module come with a set of built in parsers which will always be applied.

Its possible to write custom parsers and append them to the process of constructing
the context.

### Middleware

The middleware is an Express middleware which is set on the Express instanse in the Layout
server and run all registered parsers on each request.

The middleware store the result of each parser as an object on the `res.locals.podium.context`.
This object is "http header like" and can be copied as headers on a http request to a
Podlet.

### Serializing / deserializing

These are `static` methods used to append and extract the "http header like" object
from `res.locals.podium.context` into a http request to Podlet and then back into
`res.locals.podium.context` in the Podlet server.


## Constructor

Create a new Podium Context instance.

```js
const Context = require('@podium/context');
const context = new Context({ name: 'myName' });
```

The constructor take the following arguments:

### options

| option         | default   | type     | required |
| -------------- | --------- | -------- | -------- |
| name           | `null`    | `string` | `true`   |
| debug          | `null`    | `object` | `false`  |
| locale         | `null`    | `object` | `false`  |
| deviceType     | `null`    | `object` | `false`  |
| mountOrigin    | `null`    | `object` | `false`  |
| mountPathname  | `null`    | `object` | `false`  |
| publicPathname | `null`    | `object` | `false`  |

#### name

A name as a `String` to identify the instance. This should be a logic and human readable name
related to the Layout this instance is appended too. This name is passed on to the Podlet
servers as part of the [Requested By](https://github.schibsted.io/Podium/context#requested-by) context.
The name value must be in camelCase.

Example

```js
const context = new Context({
    name: 'myLayout';
});
```

#### debug

Config object passed on to the debug parser. See [parsers doc](https://github.schibsted.io/Podium/context#debug).

#### locale

Config object passed on to the locale parser. See [parsers doc](https://github.schibsted.io/Podium/context#locale).

#### deviceType

Config object passed on to the device type parser. See [parsers doc](https://github.schibsted.io/Podium/context#device-type).

#### mountOrigin

Config object passed on to the mount origin parser. See [parsers doc](https://github.schibsted.io/Podium/context#mount-origin).

#### mountPathname

Config object passed on to the mount pathname parser. See [parsers doc](https://github.schibsted.io/Podium/context#mount-pathname).

#### publicPathname

Config object passed on to the public pathname parser. See [parsers doc](https://github.schibsted.io/Podium/context#public-pathname).


## API

The Context instance have the following API:


### .register(name, parser)

Register a Parser which should be appended to the Context. See Implementing a Parser for how
to implement a custom parser.

The method takes the following arguments:

 * name - `String` - Unique name of the parser. Will be used as the key for the parsers value in the context. Required.
 * parser - `Object` - The Parser to be registered.

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

Express middelware to execute all Parsers in paralell and append the result of each parser
to `res.locals.podium.context`.

This will execute all built in parsers and all externally registered, through the `.register()`
method, parsers.

The object stored at `res.locals.podium.context` is "http header-ish" and must be run through the
static `.serialize()` method to be applied to a http header object.


## Static API

The Context constructor have the following static API:

### .serialize(headers, context, podletName)

Takes a "http header-ish" Object produced by `.middleware()`, and stored at `res.locals.podium.context`,
and serializes it into a http header Object which can be applied to a http request to a Podlet.

The Object stored at `res.locals.podium.context` is "http header-ish" because the value of each key
can be either a `String` or a `Function`. If a key holds a `Function` the serializer will call
the function with the `podletName` argument.

The method takes the following arguments:

 * headers - `Object` - An existing http header Object or empty Object the contect should be meged into. Required.
 * context - `Object` - The Object produced by `.middleware()`, stored at `res.locals.podium.context`. Required.
 * podletName - `String` - The name of the podlet the context should be applied too. Optional.

Example in Layout server:

```js
app.get('/', (req, res) => {
    const headers = Context.serialize({}, res.locals.podium.context, 'somePodlet');
    request({
        headers: headers,
        method: 'GET',
        url: 'http://some.podlet.finn.no/'
    }).pipe(res);
});
```

### .deserialize()

Express middelware which will parse http headers on an inbound request in a Podlet server and
turn context headers into a context object stored at `res.locals.podium.context`.

Example in Podlet server:

```js
app.use(Context.deserialize());

app.get('/', (req, res) => {
    res.status(200).json(res.locals.podium.context);
});
```


## Internal parsers

This module comes with a set of default parsers which will be applied when `.middleware()` is
run.

Each of these parsers can be configured through the constructor by passing a config object to
the matching config parameter on the constructor (see constructor options).

Example of passing a config to the built in `debug` parser:

```js
const Context = require('@podium/context');
const context = new Context('myName', {
    debug: {
        enabled: true
    }
});
```

The following parsers are applied by default:

### Requested By

Each layout should have given name to ease the process of identifying it by a human.
Such a name is passed on from a layout to a podlet by this parser. By doing so, its
possible to have a loose identifier for whom are requesting a podlet.

Output value from this parser is stored on the `podium-requested-by` header.

#### arguments (required)

This parser takes an required String as the first argument on the constructor.

Example:

```js
const Context = require('@podium/context');
const context = new Context('myName');
```

### Debug

Indicator for communicating that a layout server are in debug mode to podlets.
Output value from this parser is stored on the `podium-debug` header. Default
value is `false`.

#### arguments (optional)

This parser takes an optional config object with the following properties:

 * enable - `Boolean` - Value to indicate if one are in debug mode or not.

This config object is passed on to the `debug` property on the config object
on the constructor.

### Locale

Locale of the requesting browser. Output value from this parser is stored on
the `podium-locale` header. Default value is `en-EN`.

When executed by `.middleware()`, this parser will look for a locale at
`res.locals.locale`. If found, this value will be used. If not found, the
default locale will be used.

```js
const context = new Context('myName');
const app = express();

app.use((req, res) => {
    res.locals.locale = 'nb-NO';
});

app.use(context.middleware());
```

#### arguments (optional)

This parser takes an optional config object with the following properties:

 * locale - `String` - Default locale. A bcp47 compliant locale String.

This config object is passed on to the `locale` property on the config object
on the constructor.

### Device Type

A guess at the device type of the requesting browser. Guessing is done by
UA detection and is **not** guaranteed to be accurate.

Output value from this parser is stored on the `podium-device-type` header.

The value will be one of the following strings:

 * `desktop`: The device requesting the podlet is probably a desktop computer
   or something with a large screen. This is the **default** if we're not able
   to determine anything more detailed.
 * `tablet`: The device is probably a tablet of some sort, or a device with a
   smaller screen than a desktop.
 * `mobile`: The device is probably a phone of some sort, or a device with a
   smaller screen than a tablet.

This module will internally cache its result and the matching UA string in
an LRU cache for faster lookup.

#### arguments (optional)

This parser takes an optional config object with the following properties:

 * cacheSize - `Number` - How many UA Strings to keep in LRU cache. Default: 10000

This config object is passed on to the `deviceType` property on the config
object on the constructor.

### Mount Origin

URL Origin of the inbound request to the layout server. The parser will try
to parse this from the inbound request to the layout server. Though, it is
possible to override by providing a config.

Output value from this parser is stored on the `podium-mount-origin` header.
The value is a [WHATWG URL](https://url.spec.whatwg.org/) compatible origin
[(illustrated overview)](https://nodejs.org/api/url.html#url_url_strings_and_url_objects).

#### arguments (optional)

This parser takes an optional [WHATWG URL](https://nodejs.org/api/url.html#url_class_url) origin String
for overriding the mount origin.

Example:

```js
const Context = require('@podium/context');
const context = new Context('myName', {
    mountOrigin: 'https://example.org/'
});
```

This is passed on to the `mountOrigin` property on the config object on the
constructor.

### Mount Pathname

URL pathname of the inbound request to the layout server. The parser will try
to parse this from the inbound request to the layout server. Though, it is
possible to override by providing a config.

Output value from this parser is stored on the `podium-mount-pathname` header.
The value is a [WHATWG URL](https://url.spec.whatwg.org/) compatible pathname
[(illustrated overview)](https://nodejs.org/api/url.html#url_url_strings_and_url_objects).

#### arguments (optional)

This parser takes an optional [WHATWG URL](https://nodejs.org/api/url.html#url_class_url)
pathname String for overriding the pathname.

Example:

```js
const Context = require('@podium/context');
const context = new Context('myName', {
    mountPathname: '/my/path/name'
});
```

This is passed on to the `mountPathname` property on the config object on the
constructor.

### Public Pathname

URL pathname of where a layout server has mounted a proxy to proxy public
traffic to a podlet. The public pathname is built up by a given rule. Though,
it is possible to override by providing a config.

Output value from this parser is stored on the `podium-public-pathname` header.
The value is a [WHATWG URL](https://url.spec.whatwg.org/) compatible pathname
[(illustrated overview)](https://nodejs.org/api/url.html#url_url_strings_and_url_objects).

#### arguments (optional)

This parser takes an optional [WHATWG URL object](https://nodejs.org/api/url.html#url_class_url)
pathname String for overriding the pathname.

Example:

```js
const Context = require('@podium/context');
const context = new Context('myName', {
    publicPathname: '/my/custom/proxy'
});
```

This is passed on to the `publicPathname` property on the config object on the
constructor.


## A word on URL construction

By adhering to [WHATWG URL](https://url.spec.whatwg.org/) when constructing
URLs we can easely compose full URLs by using, ex the [URL module in node.js](https://nodejs.org/api/url.html#url_class_url).

Example:

In a podlet, the origin of a layout server will be found on `res.locals.podium.context.mountOrigin`
and the pathname to the layout will be found on `res.locals.podium.context.mountPathname`.

To get the full URL of a layout in a podlet, we can combine these two by
using the [URL module in node.js](https://nodejs.org/api/url.html#url_class_url)
like this:

```js
const { URL } = require('url');
const origin = res.locals.podium.context.mountOrigin;
const pathname = res.locals.podium.context.mountPathname;
const url = new URL(pathname, origin);

console.log(url.href)  // prints full URL
```

The same can be done to construct public URL to the proxy URL:

```js
const { URL } = require('url');
const origin = res.locals.podium.context.mountOrigin;
const pathname = res.locals.podium.context.publicPathname;
const url = new URL(pathname, origin);

console.log(url.href)  // prints full to proxy endpoint
```
