'use strict';

const TopLevelDomain = require('./get-request-domain');
const RequestedBy = require('./get-requested-by');
const DeviceType = require('./get-device-type');
const SessionId = require('./get-session-id');
const VisitorId = require('./get-visitor-id');
const TraceId = require('./get-trace-id');
const Locale = require('./get-locale');
const Debug = require('./get-debug');
const boom = require('boom');

const PREFIX = 'podium';

module.exports = class ContextResolver {
    constructor(
        config,
        { } = {}
    ) {
        Object.defineProperty(this, 'config', {
            value: config,
        });

        Object.defineProperty(this, 'parsers', {
            value: new Map(),
        });

        this.parser('domain', new TopLevelDomain());
        this.parser('requested-by', new RequestedBy());
        this.parser('device-type', new DeviceType());
        this.parser('session-id', new SessionId());
        this.parser('trace-id', new TraceId());
        this.parser('visitor-id', new VisitorId());
        this.parser('locale', new Locale());
        this.parser('debug', new Debug());
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
                        context[`${PREFIX}-${parsers[index][0]}`] = item;
                    });

                    res.locals.podium = {
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
                    context[key.replace(`${PREFIX}-`, '')] = req.headers[key];
                }
            })

            res.locals.podium = {
                context,
            };

            next();
        };
    }
};
