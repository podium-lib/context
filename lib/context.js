'use strict';

const PublicPathname = require('./get-public-pathname');
const MountPathname = require('./get-mount-pathname');
const MountOrigin = require('./get-mount-origin');
const RequestedBy = require('./get-requested-by');
const decamelize = require('decamelize');
const DeviceType = require('./get-device-type');
const VisitorId = require('./get-visitor-id');
const camelcase = require('camelcase');
const Metrics = require('@podium/metrics');
const Locale = require('./get-locale');
const assert = require('assert');
const Debug = require('./get-debug');
const boom = require('boom');

const PREFIX = 'podium';

const PodiumContext = class PodiumContext {
    constructor(
        name,
        {
            locale,
            debug,
            deviceType,
            mountOrigin,
            mountPathname,
            publicPathname,
        } = {}
    ) {
        assert(name, 'You must provide a value to "name".');

        Object.defineProperty(this, 'parsers', {
            value: new Map(),
        });

        Object.defineProperty(this, 'metrics', {
            value: new Metrics(),
        });

        this.register('publicPathname', new PublicPathname(publicPathname));
        this.register('mountPathname', new MountPathname(mountPathname));
        this.register('mountOrigin', new MountOrigin(mountOrigin));
        this.register('requestedBy', new RequestedBy({ name }));
        this.register('deviceType', new DeviceType(deviceType));
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
        assert(
            parser.parse,
            `Parser with the name "${name}" is missing a ".parse()" method.`
        );
        assert.equal(
            this.parsers.has(name),
            false,
            `Parser with the name "${name}" has already been registered.`
        );
        const type = {}.toString.call(parser.parse);
        assert(
            type === '[object Function]' || type === '[object AsyncFunction]',
            `Parse method for parser "${name}" must be a function or async function.`
        );
        this.parsers.set(name, parser);
    }

    middleware() {
        const self = this;
        return (req, res, next) => {
            const successTimer = this.metrics.timer({
                name: 'context_run_parsers_success',
                description:
                    'Time taken to successfully run all context parsers',
            });

            const failureTimer = this.metrics.timer({
                name: 'context_run_parsers_failure',
                description:
                    'Time taken for failure to occur when running all context parsers',
            });

            const parsers = Array.from(self.parsers);
            Promise.all(parsers.map(parser => parser[1].parse(req, res)))
                .then(result => {
                    const context = {};

                    result.forEach((item, index) => {
                        const key = `${PREFIX}-${parsers[index][0]}`;
                        context[decamelize(key, '-')] = item;
                    });

                    if (!res.locals) {
                        res.locals = {};
                    }

                    if (!res.locals.podium) {
                        res.locals.podium = {};
                    }

                    res.locals.podium.context = context;
                    successTimer();
                    next();
                })
                .catch(error => {
                    const message = `Error during context parsing or serializing`;
                    failureTimer({
                        meta: {
                            message,
                            error: error.message,
                            stack: error.stack,
                        },
                    });
                    next(boom.badGateway(message, error));
                });
        };
    }

    static serialize(headers = {}, context = {}, name = '') {
        Object.keys(context).forEach(key => {
            if (typeof context[key] === 'string') {
                headers[key] = context[key];
            }

            if ({}.toString.call(context[key]) === '[object Function]') {
                headers[key] = context[key](name);
            }
        });
        return headers;
    }

    static deserialize() {
        return (req, res, next) => {
            const context = {};
            Object.keys(req.headers).forEach(key => {
                if (key.startsWith(PREFIX)) {
                    const k = camelcase(key.replace(`${PREFIX}-`, ''));
                    context[k] = req.headers[key];
                }
            });

            if (!res.locals) {
                res.locals = {};
            }

            if (!res.locals.podium) {
                res.locals.podium = {};
            }

            res.locals.podium.context = context;
            next();
        };
    }
};

module.exports = PodiumContext;
