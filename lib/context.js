'use strict';

const PublicPathname = require('./get-public-pathname');
const MountPathname = require('./get-mount-pathname');
const MountOrigin = require('./get-mount-origin');
const RequestedBy = require('./get-requested-by');
const decamelize = require('decamelize');
const DeviceType = require('./get-device-type');
const VisitorId = require('./get-visitor-id');
const camelcase = require('camelcase');
const Locale = require('./get-locale');
const assert = require('assert');
const Debug = require('./get-debug');
const boom = require('boom');

const PREFIX = 'podium';

const PodiumContext = class PodiumContext {
    constructor(requestedBy, locale, debug) {
        assert(requestedBy, 'You must provide a value to "requestedBy".');

        Object.defineProperty(this, 'parsers', {
            value: new Map(),
        });

        this.register('publicPathname', new PublicPathname());
        this.register('mountPathname', new MountPathname());
        this.register('mountOrigin', new MountOrigin());
        this.register('requestedBy', new RequestedBy(requestedBy));
        this.register('deviceType', new DeviceType());
        this.register('visitorId', new VisitorId());
        this.register('locale', new Locale(locale));
        this.register('debug', new Debug(debug));
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContext';
    }

    register(name, parser) {
        assert(name, 'You must provide a value to "name".');
        assert(parser, 'You must provide a value to "parser".');
        assert(parser.parse, `Parser with the name "${name}" is missing a ".parse()" method.`);
        assert.equal(this.parsers.has(name), false, `Parser with the name "${name}" has already been registered.`);
        assert.equal({}.toString.call(parser.parse), '[object Function]', `Parse method at parser with the name "${name}" is not a function.`);
        this.parsers.set(name, parser);
    }

    middleware() {
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

    static serialize(headers = {}, context = {}, name = '') {
        Object.keys(context).forEach((key) => {
            if (typeof context[key] === 'string') {
                headers[key] = context[key];
            }
            if (typeof context[key] === 'function') {
                headers[key] = context[key](name);
            }
        });
        return headers;
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

module.exports = PodiumContext;
