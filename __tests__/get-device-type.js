'use strict';

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

test('PodiumContextDeviceTypeParser() - instantiate new object - should create an object', () => {
    const parser = new DeviceType();
    expect(parser).toBeInstanceOf(DeviceType);
});

test('PodiumContextDeviceTypeParser() - object tag - should be PodiumContextDeviceTypeParser', () => {
    const parser = new DeviceType();
    expect(Object.prototype.toString.call(parser)).toEqual(
        '[object PodiumContextDeviceTypeParser]'
    );
});

test('PodiumContextDeviceTypeParser.parse() - instantiated object - should have parse method', () => {
    const parser = new DeviceType();
    expect(parser.parse).toBeInstanceOf(Function);
});

test('PodiumContextDeviceTypeParser.parse() - no "user-agent" on header - should return desktop', () => {
    const req = {};
    const parser = new DeviceType();
    const result = parser.parse(req);
    expect(result).toBe('desktop');
});

test('PodiumContextDeviceTypeParser.parse() - "user-agent" is defined but null - should return desktop', () => {
    const req = {
        headers: {
            'user-agent': null,
        },
    };
    const parser = new DeviceType();
    const result = parser.parse(req);
    expect(result).toBe('desktop');
});

test('PodiumContextDeviceTypeParser.parse() - "user-agent" is empty string - should return desktop', () => {
    const req = {
        headers: {
            'user-agent': '',
        },
    };
    const parser = new DeviceType();
    const result = parser.parse(req);
    expect(result).toBe('desktop');
});

test('PodiumContextDeviceTypeParser.parse() - "user-agent" is known desktop UA - should return desktop', () => {
    const req = {
        headers: {
            'user-agent': UA_DESKTOP,
        },
    };
    const parser = new DeviceType();
    const result = parser.parse(req);
    expect(result).toBe('desktop');
});

test('PodiumContextDeviceTypeParser.parse() - "user-agent" is known tablet UA - should return tablet', () => {
    const req = {
        headers: {
            'user-agent': UA_TABLET,
        },
    };
    const parser = new DeviceType();
    const result = parser.parse(req);
    expect(result).toBe('tablet');
});

test('PodiumContextDeviceTypeParser.parse() - "user-agent" is known mobile UA - should return mobile', () => {
    const req = {
        headers: {
            'user-agent': UA_MOBILE,
        },
    };
    const parser = new DeviceType();
    const result = parser.parse(req);
    expect(result).toBe('mobile');
});

test('PodiumContextDeviceTypeParser.parse() - parse a new UA - should not exist in cache pre parsing and should exist in cache post parsing', () => {
    const req = {
        headers: {
            'user-agent': UA_MOBILE,
        },
    };
    const parser = new DeviceType();
    const beforeParse = parser.cache.get(UA_MOBILE.toLowerCase());
    expect(beforeParse).toBeUndefined();

    parser.parse(req);

    const afterParse = parser.cache.get(UA_MOBILE.toLowerCase());
    expect(afterParse).toBe('mobile');
});

test('PodiumContextDeviceTypeParser.statistics() - 3 items inserted in cache - should reflect the items in cache', () => {
    const parser = new DeviceType();
    parser.parse({
        headers: {
            'user-agent': UA_DESKTOP,
        },
    });
    parser.parse({
        headers: {
            'user-agent': UA_TABLET,
        },
    });
    parser.parse({
        headers: {
            'user-agent': UA_MOBILE,
        },
    });

    const result = parser.statistics();

    expect(result.cacheItems).toBe(3);
});

test('PodiumContextDeviceTypeParser() - amount of different UAs parsed is larger then set cacheSize - should not grow over cacheSize', () => {
    const parser = new DeviceType({ cacheSize: 2 });
    parser.parse({
        headers: {
            'user-agent': UA_DESKTOP,
        },
    });
    parser.parse({
        headers: {
            'user-agent': UA_TABLET,
        },
    });
    parser.parse({
        headers: {
            'user-agent': UA_MOBILE,
        },
    });

    const result = parser.statistics();
    expect(result.cacheItems).toBe(2);
});
