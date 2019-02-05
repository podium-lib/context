'use strict';

const { HttpIncoming } = require('@podium/utils');
const DeviceType = require('../lib/get-device-type');

/**
 * From https://github.com/lancedikson/bowser/blob/master/src/useragents.js
 */
const UA_TABLET =
    'Mozilla/5.0 (iPad; U; CPU OS 5_1_1 like Mac OS X; en-us) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3';
const UA_MOBILE =
    'Mozilla/5.0 (Linux; Android 4.3; Galaxy Nexus Build/JWR66Y) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.99 Mobile Safari/537.36';
const UA_DESKTOP =
    'Mozilla/5.0 (Windows NT 6.3; Win64; x64; Trident/7.0; MAARJS; rv:11.0) like Gecko';

const REQ = {
    originalUrl: 'http://www.finn.no',
    headers: {
        host: 'www.finn.no',
    },
    protocol: 'http:',
};

test('PodiumContextDeviceTypeParser() - instantiate new object - should create an object', () => {
    const parser = new DeviceType();
    expect(parser).toBeInstanceOf(DeviceType);
});

test('PodiumContextDeviceTypeParser() - object tag - should be PodiumContextDeviceTypeParser', () => {
    const parser = new DeviceType();
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object PodiumContextDeviceTypeParser]',
    );
});

test('PodiumContextDeviceTypeParser.parse() - instantiated object - should have parse method', () => {
    const parser = new DeviceType();
    expect(parser.parse).toBeInstanceOf(Function);
});

test('PodiumContextDeviceTypeParser.parse() - no "user-agent" on header - should return desktop', () => {
    const parser = new DeviceType();
    const incoming = new HttpIncoming(REQ);
    const result = parser.parse(incoming);
    expect(result).toBe('desktop');
});

test('PodiumContextDeviceTypeParser.parse() - "user-agent" is defined but null - should return desktop', () => {
    const parser = new DeviceType();
    const incoming = new HttpIncoming(Object.assign(REQ, {
        headers: {
            'user-agent': null,
        },
    }));
    const result = parser.parse(incoming);
    expect(result).toBe('desktop');
});

test('PodiumContextDeviceTypeParser.parse() - "user-agent" is empty string - should return desktop', () => {
    const parser = new DeviceType();
    const incoming = new HttpIncoming(Object.assign(REQ, {
        headers: {
            'user-agent': '',
        },
    }));
    const result = parser.parse(incoming);
    expect(result).toBe('desktop');
});

test('PodiumContextDeviceTypeParser.parse() - "user-agent" is known desktop UA - should return desktop', () => {
    const parser = new DeviceType();
    const incoming = new HttpIncoming(Object.assign(REQ, {
        headers: {
            'user-agent': UA_DESKTOP,
        },
    }));
    const result = parser.parse(incoming);
    expect(result).toBe('desktop');
});

test('PodiumContextDeviceTypeParser.parse() - "user-agent" is known tablet UA - should return tablet', () => {
    const parser = new DeviceType();
    const incoming = new HttpIncoming(Object.assign(REQ, {
        headers: {
            'user-agent': UA_TABLET,
        },
    }));
    const result = parser.parse(incoming);
    expect(result).toBe('tablet');
});

test('PodiumContextDeviceTypeParser.parse() - "user-agent" is known mobile UA - should return mobile', () => {
    const parser = new DeviceType();
    const incoming = new HttpIncoming(Object.assign(REQ, {
        headers: {
            'user-agent': UA_MOBILE,
        },
    }));
    const result = parser.parse(incoming);
    expect(result).toBe('mobile');
});

test('PodiumContextDeviceTypeParser.parse() - parse a new UA - should not exist in cache pre parsing and should exist in cache post parsing', () => {
    const parser = new DeviceType();
    const beforeParse = parser.cache.get(UA_MOBILE.toLowerCase());
    expect(beforeParse).toBeUndefined();

    const incoming = new HttpIncoming(Object.assign(REQ, {
        headers: {
            'user-agent': UA_MOBILE,
        },
    }));
    parser.parse(incoming);

    const afterParse = parser.cache.get(UA_MOBILE.toLowerCase());
    expect(afterParse).toBe('mobile');
});

test('PodiumContextDeviceTypeParser.statistics() - 3 items inserted in cache - should reflect the items in cache', () => {
    const parser = new DeviceType();

    parser.parse(new HttpIncoming(Object.assign(REQ, {
        headers: {
            'user-agent': UA_DESKTOP,
        },
    })));

    parser.parse(new HttpIncoming(Object.assign(REQ, {
        headers: {
            'user-agent': UA_TABLET,
        },
    })));

    parser.parse(new HttpIncoming(Object.assign(REQ, {
        headers: {
            'user-agent': UA_MOBILE,
        },
    })));

    const result = parser.statistics();

    expect(result.cacheItems).toBe(3);
});

test('PodiumContextDeviceTypeParser() - amount of different UAs parsed is larger then set cacheSize - should not grow over cacheSize', () => {
    const parser = new DeviceType({ cacheSize: 2 });

    parser.parse(new HttpIncoming(Object.assign(REQ, {
        headers: {
            'user-agent': UA_DESKTOP,
        },
    })));

    parser.parse(new HttpIncoming(Object.assign(REQ, {
        headers: {
            'user-agent': UA_TABLET,
        },
    })));

    parser.parse(new HttpIncoming(Object.assign(REQ, {
        headers: {
            'user-agent': UA_MOBILE,
        },
    })));

    const result = parser.statistics();
    expect(result.cacheItems).toBe(2);
});
