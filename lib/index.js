'use strict';

const logger = require('@finn-no/fiaas-logger');
const loginClient = require('@finn-no/login-client');

const ContextMiddleware = require('./middleware');
const Context = require('./context');
const { contextSchema, validateInternalRequest } = require('./schema');
const { fromPodiumRequest, toPodiumRequest } = require('./serialize');

const createLayoutServerContext = (
    { resourceMountPath, resolveToken, loginHosts } = {}
) => {
    if (!resolveToken) {
        resolveToken = loginClient(loginHosts).validateToken;
    }
    const context = new Context({ resourceMountPath });

    context.registerResolver({
        key: 'userToken',
        fn: resolveToken,
        keys: ['userId', 'spidId', 'token'],
    });

    return context;
};

const fromPodiumClientRequest = ({ podiumContext = {}, headers }) => {
    const contextHeaders = Object.assign({}, podiumContext.headers, headers);
    const result = {
        query: podiumContext.query,
        headers: contextHeaders,
    };
    if (podiumContext.payload) {
        result.payload = podiumContext.payload;
    }

    const mergedPodiumContext = Object.assign(
        {},
        podiumContext,
        fromPodiumRequest(result)
    );

    return validateInternalRequest(mergedPodiumContext);
};

const middleware = (
    {
        finnEnv = 'dev',
        loginHosts,
        resourceMountPath,
        resolveToken,
        external = true,
        rejectValidationErrors = false,
    } = {}
) => {
    const contextMiddleware = new ContextMiddleware({ finnEnv });
    const context = createLayoutServerContext({
        loginHosts,
        resourceMountPath,
        resolveToken,
    });
    function complete(req, next, ctx) {
        req.podiumContext = Object.assign({}, req.podiumContext, ctx);
        next();
        return ctx;
    }
    function error(next, err) {
        if (rejectValidationErrors) {
            next(err);
        } else {
            logger.error(err);
            next();
        }
    }
    return [
        contextMiddleware.router(),
        (req, res, next) => {
            if (external) {
                return context
                    .processRequest(req)
                    .then(complete.bind(null, req, next))
                    .catch(error.bind(null, next));
            }

            // Internal request
            return fromPodiumClientRequest(req)
                .then(complete.bind(null, req, next))
                .catch(error.bind(null, next));
        },
    ];
};

const browserMiddleware = (options = {}) => {
    options.external = true;
    return middleware(options);
};

const internalMiddleware = (options = {}) => {
    options.external = false;
    return middleware(options);
};

module.exports = {
    browserMiddleware,
    internalMiddleware,
    contextSchema,
    createLayoutServerContext,
    toPodiumRequest,
    validateInternalRequest,
};
