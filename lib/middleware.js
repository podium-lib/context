'use strict';

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

module.exports = (req, res, next) => {
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
    next();
    return req; // return for tests
};
