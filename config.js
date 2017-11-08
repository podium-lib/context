'use strict';

const dataServicesConfig = require('@finn-no/data-services/config');
const tokenConfig = require('@finn-no/express-user-token-middleware/config');

const { str, url } = require('envalid');

module.exports = Object.assign(
    {},
    {
        RESOURCE_MOUNT_PATH: str({
            default: '/podium-resource',
        }),
        BASE_URL: str({
            desc: 'The base URL used by podlets',
            default: 'https://www.finn.no',
            devDefault: '',
        }),
        CDN_HOST: url({
            desc: 'The base URL used by podlets',
            default: 'https://static.finncdn.no',
        }),
    },
    tokenConfig,
    dataServicesConfig,
);
