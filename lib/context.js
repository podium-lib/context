'use strict';

const decamelize = require('decamelize');
const schemas = require('@podium/schemas');
const Metrics = require('@metrics/client');
const assert = require('assert');
const utils = require('@podium/utils');
const joi = require('joi');
const PublicPathname = require('./get-public-pathname');
const MountPathname = require('./get-mount-pathname');
const MountOrigin = require('./get-mount-origin');
const RequestedBy = require('./get-requested-by');
const DeviceType = require('./get-device-type');
const Locale = require('./get-locale');
const Debug = require('./get-debug');

const PREFIX = 'podium';

const PodiumContext = class PodiumContext {
    constructor({
        name = undefined,
        publicPathname = {},
        mountPathname = {},
        mountOrigin = {},
        deviceType = {},
        locale = {},
        debug = {},
    } = {}) {
        const validatedName = joi.attempt(
            name,
            schemas.manifest.name,
            new Error(`The value for "name", ${name}, is not valid`),
        );

        Object.defineProperty(this, 'parsers', {
            value: new Map(),
        });

        Object.defineProperty(this, 'metrics', {
            value: new Metrics(),
        });

        this.register('publicPathname', new PublicPathname(publicPathname));
        this.register('mountPathname', new MountPathname(mountPathname));
        this.register('mountOrigin', new MountOrigin(mountOrigin));
        this.register('requestedBy', new RequestedBy({ name: validatedName }));
        this.register('deviceType', new DeviceType(deviceType));
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
            `Parser with the name "${name}" is missing a ".parse()" method.`,
        );
        assert.equal(
            this.parsers.has(name),
            false,
            `Parser with the name "${name}" has already been registered.`,
        );

        assert(
            utils.isFunction(parser.parse),
            `Parse method for parser "${name}" must be a function or async function.`,
        );
        this.parsers.set(name, parser);
    }

    process(incoming) {
        if (Object.prototype.toString.call(incoming) !== '[object PodiumHttpIncoming]') {
            throw TypeError('Argument must be of type "PodiumHttpIncoming"');
        }

        const timer = this.metrics.timer({
            name: 'context_run_parsers',
            description:
                'Time taken to run all context parsers',
        });

        const parsers = Array.from(this.parsers);
        return Promise.all(
            parsers.map(parser =>
                parser[1].parse(incoming),
            ),
        ).then(result => {
            result.forEach((item, index) => {
                const key = `${PREFIX}-${parsers[index][0]}`;
                incoming.context[decamelize(key, '-')] = item;
            });

            timer();

            return incoming;
        });
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
