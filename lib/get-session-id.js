'use strict';

module.exports = req =>
    new Promise((resolve, reject) => {
        const id =
            req.sessionId ||
            req.sessionID ||
            (req.cookies && req.cookies.finnSessionId);
        resolve(id);
    });

/*
module.exports = function getSessionId({ sessionId, sessionID, cookies }) {
    return sessionId || sessionID || (cookies && cookies.finnSessionId);
};

*/
