'use strict';

const ipRegex = require('ip-regex');

function isLocalhost(domain) {
    return !!domain && domain.startsWith('localhost');
}

module.exports = req =>
    new Promise((resolve, reject) => {
        const domain = req.hostname;
        if (!domain) {
            resolve(domain);
            return;
        }

        if (isLocalhost(domain) || ipRegex().test(domain)) {
            resolve(domain);
            return;
        }

        const split = domain.split('.');
        if (!split || split.length <= 2) {
            resolve(domain);
            return;
        }

        resolve(`${split[split.length - 2]}.${split[split.length - 1]}`);
    });

/*
module.exports = function getToplevelDomain(req) {
    const domain = req.hostname;
    if (!domain) {
        return domain;
    }

    if (isLocalhost(domain) || ipRegex().test(domain)) {
        return domain;
    }

    const split = domain.split('.');
    if (!split || split.length <= 2) {
        return domain;
    }
    return `${split[split.length - 2]}.${split[split.length - 1]}`;
};
*/
