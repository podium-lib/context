'use strict';

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

module.exports = class ContextDeviceTypeParser {
    constructor() {
        Object.defineProperty(this, 'default', {
            value: 'desktop',
        });
    }

    get [Symbol.toStringTag]() {
        return 'ContextDeviceTypeParser';
    }

    parse(req) {
        return new Promise(resolve => {
            const userAgent = req.headers ? req.headers['user-agent'] : '';
            let type = this.default;

            if (!req.deviceType && userAgent) {
                type = getDeviceType(userAgent.toLowerCase());
            }

            resolve(type);
        });
    }
};
