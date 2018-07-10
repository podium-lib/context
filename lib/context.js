'use strict';

const PublicPathname = require('./get-public-pathname');
const MountPathname = require('./get-mount-pathname');
const MountOrigin = require('./get-mount-origin');
const RequestedBy = require('./get-requested-by');
const decamelize = require('decamelize');
const DeviceType = require('./get-device-type');
const schemas = require('@podium/schemas');
const Metrics = require('@podium/metrics');
const Locale = require('./get-locale');
const assert = require('assert');
const Debug = require('./get-debug');
const utils = require('@podium/utils');
const boom = require('boom');
const joi = require('joi');

const PREFIX = 'podium';

const PodiumContext = class PodiumContext {
    constructor(options = {}) {
        const validatedName = joi.attempt(
            options.name,
            schemas.manifest.name,
            new Error(
                `The value for "options.name", ${options.name}, is not valid`
            )
        );

        Object.defineProperty(this, 'parsers', {
            value: new Map(),
        });

        Object.defineProperty(this, 'metrics', {
            value: new Metrics(),
        });

        this.register(
            'publicPathname',
            new PublicPathname(options.publicPathname)
        );
        this.register(
            'mountPathname',
            new MountPathname(options.mountPathname)
        );
        this.register('mountOrigin', new MountOrigin(options.mountOrigin));
        this.register('requestedBy', new RequestedBy({ name: validatedName }));
        this.register('deviceType', new DeviceType(options.deviceType));
        this.register('locale', new Locale(options.locale));
        this.register('debug', new Debug(options.debug));
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

        assert(
            utils.isFunction(parser.parse),
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

                    utils.setAtLocalsPodium(res, 'context', context);

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

    static serialize(headers, context, name) {
        return utils.serializeContext(headers, context, name);
    }

    static deserialize() {
        return (req, res, next) => {
            const context = utils.deserializeContext(req.headers, PREFIX);
            utils.setAtLocalsPodium(res, 'context', context);
            next();
        };
    }
};

module.exports = PodiumContext;
