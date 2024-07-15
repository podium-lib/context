export default class PodiumContextBaseFontSizeParser {
    get [Symbol.toStringTag]() {
        return 'PodiumContextBaseFontSizeParser';
    }

    /**
     * @param {import('@podium/utils').HttpIncoming} incoming
     * @returns {string | null}
     */
    parse(incoming) {
        let value = incoming.request.headers
            ? incoming.request.headers['x-podium-base-font-size']
            : null;
        if (!value || value === '') {
            return null;
        }
        return value;
    }
}
