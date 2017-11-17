'use strict';

module.exports = class ContextRequestByParser {
    constructor(name = 'podium-context-client') {
        Object.defineProperty(this, 'name', {
            value: name,
        });
    }

    get [Symbol.toStringTag]() {
        return 'ContextRequestByParser';
    }

    parse() {
        return new Promise(resolve => {
            resolve(this.name);
        });
    }
};
