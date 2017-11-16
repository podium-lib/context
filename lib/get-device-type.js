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

module.exports = req =>
    new Promise((resolve, reject) => {
        const userAgent = req.headers ? req.headers['user-agent'] : '';
        let type = 'desktop';

        if (!req.deviceType && userAgent) {
            type = getDeviceType(userAgent.toLowerCase());
        }

        resolve(type);
    });
