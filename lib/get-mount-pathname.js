import { pathnameBuilder } from '@podium/utils';

export default class PodiumContextMountPathnameParser {
    constructor({ pathname = '/' } = {}) {
        Object.defineProperty(this, 'pathname', {
            value: pathname,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextMountPathnameParser';
    }

    parse() {
        return pathnameBuilder(this.pathname);
    }
};
