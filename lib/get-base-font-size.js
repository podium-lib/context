export default class PodiumContextBaseFontSizeParser {
    constructor({ baseFontSize = '1rem' } = {}) {
        Object.defineProperty(this, 'baseFontSize', {
            value: baseFontSize,
        });
    }

    get [Symbol.toStringTag]() {
        return 'PodiumContextBaseFontSizeParser';
    }

    parse(incoming = {}) {
        if (
            Object.prototype.toString.call(incoming) !==
            '[object PodiumHttpIncoming]'
        ) {
            throw TypeError('Argument must be of type PodiumHttpIncoming');
        }

        if (incoming?.request?.headers?.['x-podium-base-font-size']) {
            return incoming.request.headers['x-podium-base-font-size'];
        }

        return this.baseFontSize;
    }
}
