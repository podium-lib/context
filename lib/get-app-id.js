export default class PodiumContextAppIdParser {
    get [Symbol.toStringTag]() {
        return 'PodiumContextAppIdParser';
    }

    /**
     * @param {import('@podium/utils').HttpIncoming} incoming
     * @returns {string | undefined}
     */
    parse(incoming) {
        if (
            Object.prototype.toString.call(incoming) !==
            '[object PodiumHttpIncoming]'
        ) {
            throw TypeError('Argument must be of type "PodiumHttpIncoming"');
        }

        if (!incoming.request.headers['x-podium-app-id']) {
            return undefined;
        }

        const appId = incoming.request.headers['x-podium-app-id'];
        if (typeof appId === 'string') {
            return appId;
        }

        return appId[0];
    }
}
