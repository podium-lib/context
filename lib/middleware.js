'use strict';

const {
    generateJwtMiddleware,
} = require('@finn-no/express-user-token-middleware');

const qs = require('qs');

const parseurl = require('parseurl');
const { withTransformer } = require('bowser-cache');
const getDeviceType = withTransformer(transformToDeviceType);

function transformToDeviceType(bowser) {
    if (bowser.mobile) {
        return 'mobile';
    }
    if (bowser.tablet) {
        return 'tablet';
    }
    return 'desktop';
}

function process(req) {
    const userAgent = req.headers ? req.headers['user-agent'] : '';

    if (!req.deviceType && userAgent) {
        // todo the express-device-type-middleware mutates res.locals instead of req
        // and does apply a different contract
        req.deviceType = getDeviceType(userAgent.toLowerCase());
    }

    if (!req.query) {
        // TODO: Unnecessary dependency. Just use `new URL`
        const urlObj = parseurl(req);
        if (urlObj) {
            req.query = qs.parse(urlObj.query);
        }
    }
    return req; // return for tests
}

module.exports = class ContextMiddleware {
    constructor(config) {
        this.tokenMiddleware = generateJwtMiddleware(config);
    }

    middleware() {
        return [
            this.tokenMiddleware,
            (req, res, next) => {
                process(req);
                next();
            },
        ];
    }
};
