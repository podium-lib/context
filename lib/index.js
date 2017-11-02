'use strict';

const {
    generateJwtMiddleware,
} = require('@finn-no/express-user-token-middleware');

const middleware = require('./middleware');
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

const internalMiddleware = () => [
    async (req, res, next) => {
        try {
            const newContext = await fromPodiumClientRequest(req);
            req.podiumContext = {
                ...req.podiumContext,
                ...newContext,
            };
            next();
        } catch (err) {
            next(err);
        }
    },
];

const browserMiddleware = config => {
    const tokenMiddleware = generateJwtMiddleware(config);
    const context = createLayoutServerContext(config);

    return [
        tokenMiddleware,
        middleware,
        async (req, res, next) => {
            try {
                const newContext = await context.processRequest(req);
                req.podiumContext = {
                    ...req.podiumContext,
                    ...newContext,
                };
                next();
            } catch (err) {
                next(err);
            }
        },
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
