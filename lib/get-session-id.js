'use strict';

module.exports = function getSessionId({ sessionId, sessionID, cookies }) {
    return sessionId || sessionID || (cookies && cookies.finnSessionId);
};
