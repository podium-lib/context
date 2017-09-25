'use strict';

const Joi = require('joi');
const logger = require('@finn-no/fiaas-logger');

/*
    What can a browser/"layout" server set from a request
*/
const base = {
    sessionId: Joi.string().optional(),
    visitorId: Joi.string().optional(),
    locale: Joi.string()
        .optional()
        .default('nb-NO'),
    cdnHost: Joi.string()
        .optional()
        .allow('')
        .default(''),
    domain: Joi.string().default('finn.no'),
    baseUrl: Joi.string()
        .allow('')
        .default(''),
    resourceMountPath: Joi.string().default('/podium-resource'),
    deviceType: Joi.string()
        .allow('mobile', 'tablet', 'desktop')
        .default('mobile'),
    query: Joi.object().default({}),
    userAgent: Joi.string().optional(),
    userToken: Joi.string().optional(),
    traceId: Joi.string().optional(),
    debug: Joi.boolean()
        .optional()
        .default(false),
    requestedBy: Joi.string().optional(),
    payload: Joi.any(), // fixme decide what to expect here
};

const requestContextSchema = Joi.object()
    .keys(base)
    .unknown(false);

const contextSchema = Joi.object()
    .keys(
        Object.assign({}, base, {
            token: Joi.string().optional(),
            extras: Joi.object()
                .keys({
                    cdnHost: Joi.string().optional(),
                })
                .unknown(true),

            serverId: Joi.string().optional(),
            knownVersions: Joi.string().optional(),
        })
    )
    .unknown(false);

const validateProm = (schema, context) =>
    new Promise((resolve, reject) => {
        logger.trace('Validating context', { extras: context });

        const { value, error } = schema.validate(context, {
            abortEarly: false,
        });

        if (error) {
            logger.debug('PodiumContext error', error, { extras: context });
            reject(error);
        } else {
            logger.trace('PodiumContext valid', { extras: value });
            resolve(value);
        }
    });

const validateExternalRequest = validateProm.bind(null, requestContextSchema);
const validateInternalRequest = validateProm.bind(null, contextSchema);

module.exports = {
    requestContextSchema,
    contextSchema,
    validateExternalRequest,
    validateInternalRequest,
};
