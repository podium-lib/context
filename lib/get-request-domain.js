'use strict';

const ipRegex = require('ip-regex');

function isLocalhost(domain) {
    return !!domain && domain.startsWith('localhost');
}

module.exports = class ContextTopLevelDomainParser {
    constructor(name = 'podium-context-client') {
        Object.defineProperty(this, 'name', {
            value: name,
        });
    }

    get [Symbol.toStringTag]() {
        return 'ContextTopLevelDomainParser';
    }

    parse(req) {
        return new Promise(resolve => {
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
    }
};
