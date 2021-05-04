import { pathnameBuilder } from '@podium/utils';

export default class PodiumContextPublicPathnameParser {
    constructor({ pathname = '/', prefix = 'podium-resource' } = {}) {
        Object.defineProperty(this, 'pathname', {
            value: pathname,
        });

        Object.defineProperty(this, 'prefix', {
            value: prefix,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextPublicPathnameParser';
    }

    parse() {
        return (name = '/') =>
            pathnameBuilder(this.pathname, this.prefix, name);
    }
};
