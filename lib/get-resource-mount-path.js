'use strict';

module.exports = class ContextResourceMountPathParser {
    constructor(path = '/podium-resource') {
        Object.defineProperty(this, 'default', {
            value: path,
        });
    }

    get [Symbol.toStringTag]() {
        return 'ContextResourceMountPathParser';
    }

    parse() {
        return new Promise(resolve => {
            resolve(this.default);
        });
    }
};
