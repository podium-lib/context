import decamelize from 'decamelize';
import Metrics from '@metrics/client';
import abslog from 'abslog';
import assert from 'assert';
import * as schemas from '@podium/schemas';
import * as utils from '@podium/utils';
import PublicPathname from './get-public-pathname.js';
import MountPathname from './get-mount-pathname.js';
import MountOrigin from './get-mount-origin.js';
import RequestedBy from './get-requested-by.js';
import DeviceType from './get-device-type.js';
import Locale from './get-locale.js';
import Debug from './get-debug.js';

const PREFIX = 'podium';

/**
 * Options passed on to the built-in context parsers.
 *
 * @typedef {object} PodiumContextOptions
 * @property {string} name
 * @property {object} [logger]
 * @property {import('./get-public-pathname.js').PodiumContextPublicPathnameParserOptions} [publicPathname={}]
 * @property {import('./get-mount-pathname.js').PodiumContextMountPathnameParserOptions} [mountPathname={}]
 * @property {import('./get-mount-origin.js').PodiumContextMountOriginParserOptions} [mountOrigin={}]
 * @property {import('./get-device-type.js').PodiumContextDeviceTypeParserOptions} [deviceType={}]
 * @property {import('./get-locale.js').PodiumContextLocaleParserOptions} [locale={}]
 * @property {import('./get-debug.js').PodiumContextDebugParserOptions} [debug={}]
 */

/**
 * @typedef {object} PodiumContextParser
 * @property {(incoming?: import('@podium/utils').PodiumHttpIncoming) => string | ((name: string) => string) | Promise<string> | ((name: string) => Promise<string>)} parse
 */

export default class PodiumContext {
    /**
     * @readonly
     * @type {import('abslog').ValidLogger}
     */
    log;

    /**
     * @readonly
     * @type {import('@metrics/client')}
     */
    metrics;

    /**
     * @readonly
     * @type {import('@metrics/client').MetricsHistogram}
     */
    histogram;

    /**
     * @readonly
     * @type {Map<string, PodiumContextParser>}
     */
    parsers;

    /**
     * @constructor
     * @param {PodiumContextOptions} options
     */
    constructor(
        options = {
            name: undefined,
            logger: undefined,
            publicPathname: {},
            mountPathname: {},
            mountOrigin: {},
            deviceType: {},
            locale: {},
            debug: {},
        },
    ) {
        if (schemas.name(options.name).error)
            throw new Error(
                `The value, "${options.name}", for the required argument "name" on the Context constructor is not defined or not valid.`,
            );

        Object.defineProperty(this, 'log', {
            value: abslog(options.logger),
        });

        Object.defineProperty(this, 'parsers', {
            value: new Map(),
        });

        Object.defineProperty(this, 'metrics', {
            value: new Metrics(),
        });

        this.metrics.on('error', (error) => {
            this.log.error(
                'Error emitted by metric stream in @podium/context module',
                error,
            );
        });

        this.histogram = this.metrics.histogram({
            name: 'podium_context_process',
            description:
                'Time taken to run all context parsers in the process method',
            labels: { name: '' },
            buckets: [0.001, 0.01, 0.1, 0.5, 1],
        });

        this.register(
            'publicPathname',
            new PublicPathname(options.publicPathname),
        );
        this.register(
            'mountPathname',
            new MountPathname(options.mountPathname),
        );
        this.register('mountOrigin', new MountOrigin(options.mountOrigin));
        this.register('requestedBy', new RequestedBy({ name: options.name }));
        this.register('deviceType', new DeviceType(options.deviceType));
        this.register('locale', new Locale(options.locale));
        this.register('debug', new Debug(options.debug));
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContext';
    }

    /**
     * Register a context parser that will run on each incoming request.
     *
     * @param {string} name
     * @param {PodiumContextParser} parser
     */
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

    /**
     * Process an incoming request. This will run all registered context parsers.
     *
     * @param {import('@podium/utils').HttpIncoming} incoming
     * @returns {Promise<import('@podium/utils').HttpIncoming>} enriched with the result of each context parser
     */
    process(incoming) {
        if (
            Object.prototype.toString.call(incoming) !==
            '[object PodiumHttpIncoming]'
        ) {
            throw TypeError('Argument must be of type "PodiumHttpIncoming"');
        }

        const timer = this.histogram.timer({ labels: { name: incoming.name } });

        const parsers = Array.from(this.parsers);
        return Promise.all(
            parsers.map((parser) => parser[1].parse(incoming)),
        ).then((result) => {
            result.forEach((item, index) => {
                const key = `${PREFIX}-${parsers[index][0]}`;

                incoming.context[decamelize(key, { separator: '-' })] = item;
            });

            timer();

            return incoming;
        });
    }

    /**
     * @param {object} [headers]
     * @param {object} [context]
     * @param {unknown} [name]
     * @returns {object}
     */
    static serialize(headers, context, name) {
        return utils.serializeContext(headers, context, name);
    }

    /**
     * @returns {(req: { headers: Record<string, string | string[]>}, res: object, next: () => void) => void}
     */
    static deserialize() {
        return (req, res, next) => {
            const context = utils.deserializeContext(req.headers, PREFIX);
            utils.setAtLocalsPodium(res, 'context', context);
            next();
        };
    }
}
