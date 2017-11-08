'use strict';

const getToplevelDomain = require('./get-request-domain');
const getSessionId = require('./get-session-id');
const getTraceId = require('./get-trace-id');
const getVisitorId = require('./get-visitor-id');

const {
    validateExternalRequest,
    validateInternalRequest,
} = require('./schema');

module.exports = class ContextResolver {
    constructor(
        config,
        { requestedBy = 'podium-context-client', locale, debug = false } = {},
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
