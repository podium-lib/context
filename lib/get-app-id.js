export default class PodiumContextAppIdParser {
    get [Symbol.toStringTag]() {
        return 'PodiumContextAppIdParser';
    }

    /**
     * @param {import('@podium/utils').HttpIncoming} incoming
     * @returns {string | null}
     */
    parse(incoming) {
        let value = incoming.request.headers
            ? incoming.request.headers['x-podium-app-id']
            : null;
        if (!value || value === '') {
            return null;
        }
        return value;
    }
}
