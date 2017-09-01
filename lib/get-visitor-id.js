'use strict';

module.exports = ({ cookies }) => {
    if (!cookies) {
        return;
    }

    return cookies.USERID;
};
