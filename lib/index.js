'use strict';

const logger = require('@finn-no/fiaas-logger');
const { validateToken } = require('@finn-no/data-services');

const ContextMiddleware = require('./middleware');
const Context = require('./context');
const { contextSchema, validateInternalRequest } = require('./schema');
const { fromPodiumRequest, toPodiumRequest } = require('./serialize');

const createLayoutServerContext = (
    { resourceMountPath, loginHost, resolveToken } = {}
) => {
    if (!resolveToken) {
        resolveToken = validateToken({ loginHost });
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

// TODO: These defaults should not live here, they should live in a single location
const middleware = (external, config = {}) => {
    const {
        fiaasEnvironment,
        loginHost,
        resourceMountPath,
        resolveToken,
        rejectValidationErrors = false,
    } = config;
    const contextMiddleware = new ContextMiddleware({ fiaasEnvironment });
    const context = createLayoutServerContext({
        fiaasEnvironment,
        loginHost,
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

// TODO do not use object assign as we loose the envalid proxy
const browserMiddleware = config => middleware(true, Object.assign({}, config));
const internalMiddleware = config =>
    middleware(false, Object.assign({}, config));

module.exports = {
    browserMiddleware,
    internalMiddleware,
    contextSchema,
    createLayoutServerContext,
    toPodiumRequest,
    validateInternalRequest,
};
