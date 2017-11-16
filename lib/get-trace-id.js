'use strict';

// TODO: Zipkin has API to extract its own keys. Why not use that?

const HEADER_NAMES = [
    'x-b3-traceid',
    'x-b3-spanid',
    'x-request-id',
    'trace-id',
];

module.exports = req =>
    new Promise((resolve, reject) => {
        if (!req.headers) {
            resolve();
            return;
        }

        for (const key in req.headers) {
            if (HEADER_NAMES.includes(key.toLowerCase())) {
                resolve(req.headers[key]);
                return;
            }
        }

        resolve();
    });

/*
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
*/
