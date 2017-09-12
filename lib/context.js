'use strict';

const getToplevelDomain = require('./get-request-domain');
const getSessionId = require('./get-session-id');
const getTraceId = require('./get-trace-id');
const getVisitorId = require('./get-visitor-id');
const logger = require('@finn-no/fiaas-logger');

const { toPodiumRequest } = require('./serialize');
const {
    validateExternalRequest,
    validateInternalRequest,
} = require('./schema');

module.exports = class ContextResolver {
    constructor(
        config,
        { requestedBy = 'podium-context-client', locale, debug = false } = {}
    ) {
        this.resolvers = [];

        this.config = config;
        this.requestedBy = requestedBy;
        this.locale = locale;
        this.debug = debug;
    }

    registerResolver({ key, keys, fn }) {
        this.resolvers.push({ key, fn, keys });
    }

    _getContext(req) {
        const {
            userToken, // = 'anonymous',
            deviceType,
            query,
            headers,
            body,
        } = req;

        const userAgent = headers ? headers['user-agent'] : '';

        const context = {
            userToken,
            userAgent,
            deviceType,
            domain: getToplevelDomain(req),
            sessionId: getSessionId(req),
            query,
            baseUrl: this.config.baseUrl,
            resourceMountPath: this.config.resourceMountPath,
            cdnHost: this.config.cdnHost,
            locale: this.locale,
            debug: this.debug,
            requestedBy: this.requestedBy,
        };

        const traceId = getTraceId(req);
        if (traceId) {
            context.traceId = traceId;
        }

        const visitorId = getVisitorId(req);
        if (visitorId) {
            context.visitorId = visitorId;
        }

        if (body) {
            context.payload = body;
        }
        return context;
    }

    async processRequest(req) {
        const context = this._getContext(req);

        const newContext = await validateExternalRequest(context);

        if (this.resolvers.length === 0) {
            return newContext;
        }

        await Promise.all(
            this.resolvers
                .filter(({ key }) => newContext[key])
                .map(({ key, fn, keys }) =>
                    fn(newContext[key])
                        .then(_data => {
                            keys.forEach(resolvedKey => {
                                if (_data[resolvedKey]) {
                                    newContext[resolvedKey] =
                                        _data[resolvedKey];
                                }
                            });
                        })
                        .catch(e => {
                            logger.debug(`${key} failed`, e);
                            return null;
                        })
                )
        );

        return validateInternalRequest(newContext);
    }

    async toPodiumClientRequest(req) {
        return toPodiumRequest(await this.processRequest(req));
    }
};
