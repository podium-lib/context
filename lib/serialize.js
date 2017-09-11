'use strict';

const camelcase = require('camelcase');
const decamelize = require('decamelize');

const PREFIX = 'podium';
exports.PREFIX = PREFIX;

const startWithPrefix = key => key.startsWith(PREFIX);

const toCamelCaseKeys = (headers, acc, key) => {
    const setKey = camelcase(key.replace(`${PREFIX}-`, ''));
    acc[setKey] = headers[key];
    return acc;
};

exports.fromPodiumRequest = function fromPodium({ query = {}, body, headers }) {
    // serialize
    const result = { query };

    if (body) {
        result.body = body;
    }

    return Object.keys(headers)
        .filter(startWithPrefix)
        .reduce(toCamelCaseKeys.bind(null, headers), result);
};

const filterOutKeys = key => key !== 'query' && key !== 'payload';

const toUpperCase = (obj, acc, key) => {
    const setKey = `${PREFIX}-${decamelize(key, '-')}`;
    acc[setKey] = obj[key];
    return acc;
};

exports.toPodiumRequest = function toPodiumRequest(obj) {
    // deserialize
    const result = {};

    result.query = obj.query || {};

    if (obj.payload) {
        result.body = obj.payload;
    }

    const headers = Object.keys(obj)
        .filter(filterOutKeys)
        .filter(key => obj[key] != null && obj[key] !== '')
        .reduce(toUpperCase.bind(null, obj), {});

    result.headers = headers;

    return result;
};
