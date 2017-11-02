# Podium Context

The context module is an internal module used to read or generate a `PodiumContext`.


## Userfacing server
```js

const { browserMiddleware } = require('@podium/context');

app.use(browserMiddleware(config))

app.get('/', (req, res) => {
    // use req.podiumContext
})

```

## Service

```js

const { internalMiddleware } = require('@podium/context');

app.use(internalMiddleware(config))

app.get('/', (req, res) => {
    // use req.podiumContext
})

```
