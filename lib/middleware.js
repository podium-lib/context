'use strict';

const {
    middleware: userTokenMiddleware,
} = require('@finn-no/express-user-token-middleware');

const cookieParser = require('cookie-parser');
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

const noop = () => {};

// FIXME: What does this middleware even do? Both cookies and user token middleware should be ran before this
module.exports = class ContextMiddleware {
    constructor({ finnEnv = 'dev' } = {}) {
        this.tokenMiddleware = userTokenMiddleware(finnEnv);
        this.cookieParser = cookieParser();
    }

    process(req) {
        const userAgent = req.headers ? req.headers['user-agent'] : '';

        if (!req.deviceType && userAgent) {
            // todo the express-device-type-middleware mutates res.locals instead of req
            // and does apply a different contract
            req.deviceType = getDeviceType(userAgent.toLowerCase());
        }
        if (!req.cookies) {
            this.cookieParser(req, null, noop);
        }

        if (!req.userToken) {
            this.tokenMiddleware(req, null, noop);
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

    router() {
        return (req, res, next) => {
            this.process(req);
            next();
        };
    }
};
