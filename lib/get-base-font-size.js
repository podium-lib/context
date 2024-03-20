export default class PodiumContextBaseFontSizeParser {
    constructor({ baseFontSize = '1rem' } = {}) {
        Object.defineProperty(this, 'baseFontSize', {
            value: baseFontSize,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextBaseFontSizeParser';
    }

    /**
     * @param {import('@podium/utils').HttpIncoming} incoming
     * @returns {string}
     */
    parse(incoming) {
        if (
            Object.prototype.toString.call(incoming) !==
            '[object PodiumHttpIncoming]'
        ) {
            throw TypeError('Argument must be of type PodiumHttpIncoming');
        }

        if (incoming?.request?.headers?.['x-podium-base-font-size']) {
            const baseFontSize =
                incoming.request.headers['x-podium-base-font-size'];
            if (typeof baseFontSize === 'string') {
                return baseFontSize;
            }
            return baseFontSize[0];
        }

        return this.baseFontSize;
    }
}
