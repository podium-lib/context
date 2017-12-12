'use strict';

const ResourceMountPath = require('./get-resource-mount-path');
const TopLevelDomain = require('./get-request-domain');
const RequestedBy = require('./get-requested-by');
const decamelize = require('decamelize');
const DeviceType = require('./get-device-type');
const SessionId = require('./get-session-id');
const VisitorId = require('./get-visitor-id');
const camelcase = require('camelcase');
const TraceId = require('./get-trace-id');
const BaseUrl = require('./get-base-url');
const Locale = require('./get-locale');
const Debug = require('./get-debug');
const boom = require('boom');

const PREFIX = 'podium';

module.exports = class ContextResolver {
    constructor(requestedBy, locale, debug) {
        Object.defineProperty(this, 'parsers', {
            value: new Map(),
        });

        this.parser('resourceMountPath', new ResourceMountPath());
        this.parser('domain', new TopLevelDomain());
        this.parser('requestedBy', new RequestedBy(requestedBy));
        this.parser('deviceType', new DeviceType());
        this.parser('sessionId', new SessionId());
        this.parser('baseUrl', new BaseUrl());
        this.parser('traceId', new TraceId());
        this.parser('visitorId', new VisitorId());
        this.parser('locale', new Locale(locale));
        this.parser('debug', new Debug(debug));
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

        if (!parser.parse) {
            throw new Error(
                `Parser with the name "${name}" is missing a ".parse()" method.`
            );
        }

        if ({}.toString.call(parser.parse) !== '[object Function]') {
            throw new Error(
                `Parse method at parser with the name "${name}" is not a function.`
            );
        }

        this.parsers.set(name, parser);
    }

    serialize() {
        const self = this;
        return (req, res, next) => {
            const parsers = Array.from(self.parsers);
            Promise.all(parsers.map(parser => parser[1].parse(req, res)))
                .then(result => {
                    const context = {};
                    result.forEach((item, index) => {
                        const key = `${PREFIX}-${parsers[index][0]}`;
                        context[decamelize(key, '-')] = item;
                    });

                    res.podium = {
                        context,
                    };

                    next();
                })
                .catch(error => {
                    next(boom.badGateway(
                        `Error during context parsing or serializing`,
                        error
                    ));
                });
        };
    }

    static deserialize() {
        return (req, res, next) => {
            const context = {};
            Object.keys(req.headers).forEach((key) => {
                if (key.startsWith(PREFIX)) {
                    const k = camelcase(key.replace(`${PREFIX}-`, ''));
                    context[k] = req.headers[key];
                }
            })

            res.podium = {
                context,
            };

            next();
        };
    }
};
