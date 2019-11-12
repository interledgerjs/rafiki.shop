const withCSS = require('@zeit/next-css')

module.exports = withCSS({
    env: {
        OAUTH_CLIENT_ID: 'eats.rafiki.shop',
        OAUTH_CALLBACK_URL: 'http://localhost:3000/callback'
    }
});
