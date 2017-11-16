'use strict';

const getToplevelDomain = require('./get-request-domain');
const getSessionId = require('./get-session-id');
const getTraceId = require('./get-trace-id');
const getVisitorId = require('./get-visitor-id');

/*
const {
    validateExternalRequest,
    validateInternalRequest,
} = require('./schema');
*/

module.exports = class ContextResolver {
    constructor(
        config,
        { requestedBy = 'podium-context-client', locale, debug = false } = {}
    ) {
        Object.defineProperty(this, 'config', {
            value: config,
        });

        Object.defineProperty(this, 'parsers', {
            value: new Map(),
        });
    }

    get [Symbol.toStringTag]() {
        return 'ContextResolver';
    }

    parser(name, parser) {
        if (this.parsers.has(name)) {
            throw new Error(
                `Parser with the name "${name}" has already been registered.`
            );
        }
        this.parsers.set(name, parser);
    }

    serialize(req, res, next) {
        const self = this;
        return (req, res, next) => {
            const parsers = Array.from(self.parsers);
            Promise.all(parsers.map(parser => parser[1](req)))
                .then(result => {
                    const context = {};
                    result.forEach((item, index) => {
                        context[parsers[index][0]] = item;
                    });

                    res.locals.podium = {
                        context,
                    };

                    next();
                })
                .catch(error => {
                    next(error);
                });
        };
    }

    /*
    _getContext(req) {
        const {
            deviceType,
            query,
            headers,
            body,
            token,
            locale = this.locale,
        } = req;

        const userAgent = headers ? headers['user-agent'] : '';

        const context = {
            domain: getToplevelDomain(req),
            query,
            baseUrl: this.config.baseUrl,
            cdnHost: this.config.cdnHost,
            resourceMountPath: this.config.resourceMountPath,
            locale,
            debug: this.debug,
            requestedBy: this.requestedBy,
        };

        if (userAgent) {
            context.userAgent = userAgent;
        }

        if (token) {
            context.token = token;
        }

        if (deviceType) {
            context.deviceType = deviceType;
        }

        const sessionId = getSessionId(req);
        if (sessionId) {
            context.sessionId = sessionId;
        }

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
        const newContext = await validateExternalRequest(this._getContext(req));
        return validateInternalRequest(newContext);
    }
    */
};

/*
module.exports = class ContextResolver {
    constructor(
        config,
        { requestedBy = 'podium-context-client', locale, debug = false } = {}
    ) {
        this.config = config;
        this.requestedBy = requestedBy;
        this.locale = locale;
        this.debug = debug;
    }

    _getContext(req) {
        const {
            deviceType,
            query,
            headers,
            body,
            token,
            locale = this.locale,
        } = req;

        const userAgent = headers ? headers['user-agent'] : '';

        const context = {
            domain: getToplevelDomain(req),
            query,
            baseUrl: this.config.baseUrl,
            cdnHost: this.config.cdnHost,
            resourceMountPath: this.config.resourceMountPath,
            locale,
            debug: this.debug,
            requestedBy: this.requestedBy,
        };

        if (userAgent) {
            context.userAgent = userAgent;
        }

        if (token) {
            context.token = token;
        }

        if (deviceType) {
            context.deviceType = deviceType;
        }

        const sessionId = getSessionId(req);
        if (sessionId) {
            context.sessionId = sessionId;
        }

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
        const newContext = await validateExternalRequest(this._getContext(req));
        return validateInternalRequest(newContext);
    }
};
*/
