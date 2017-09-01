'use strict';

const ipRegex = require('ip-regex');

function isLocalhost(domain) {
    return !!domain && domain.startsWith('localhost');
}

module.exports = function getToplevelDomain({ hostname, host }) {
    const domain = hostname || host; // supertest ships with .host only
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
