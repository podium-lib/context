'use strict';

// TODO: Zipkin has API to extract its own keys. Why not use that?

const HEADER_NAMES = [
    'x-b3-traceid',
    'x-b3-spanid',
    'x-request-id',
    'trace-id',
];

module.exports = ({ headers }) => {
    if (!headers) {
        return;
    }

    for (const key in headers) {
        if (HEADER_NAMES.includes(key.toLowerCase())) {
            return headers[key];
        }
    }
};
