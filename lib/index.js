'use strict';

const logger = require('@finn-no/fiaas-logger');

const ContextMiddleware = require('./middleware');
const Context = require('./context');
const { contextSchema, validateInternalRequest } = require('./schema');
const { fromPodiumRequest, toPodiumRequest } = require('./serialize');

const createLayoutServerContext = config => new Context(config);

const fromPodiumClientRequest = ({ podiumContext = {}, query, headers }) => {
    const contextHeaders = Object.assign({}, podiumContext.headers, headers);
    const result = {
        query: podiumContext.query || query,
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

const internalMiddleware = (
    config,
    { rejectValidationErrors = false } = {}
) => {
    const contextMiddleware = new ContextMiddleware(config);
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
        contextMiddleware.middleware(),
        (req, res, next) =>
            // Internal request
            fromPodiumClientRequest(req)
                .then(complete.bind(null, req, next))
                .catch(error.bind(null, next)),
    ];
};

const browserMiddleware = (config, { rejectValidationErrors = false } = {}) => {
    const contextMiddleware = new ContextMiddleware(config);
    const context = createLayoutServerContext(config);
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
        contextMiddleware.middleware(),
        (req, res, next) =>
            context
                .processRequest(req)
                .then(complete.bind(null, req, next))
                .catch(error.bind(null, next)),
    ];
};

module.exports = {
    browserMiddleware,
    internalMiddleware,
    contextSchema,
    createLayoutServerContext,
    toPodiumRequest,
    validateInternalRequest,
};
