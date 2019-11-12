const withCSS = require('@zeit/next-css')
require("dotenv").config();

module.exports = withCSS({
    env: {
        OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || 'eats.rafiki.shop',
        OAUTH_CALLBACK_URL: process.env.OAUTH_CALLBACK_URL || 'https://eats.rafiki.shop/callback'
    }
});
