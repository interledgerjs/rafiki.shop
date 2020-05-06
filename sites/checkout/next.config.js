const withCSS = require('@zeit/next-css')
require("dotenv").config();

module.exports = withCSS({
  serverRuntimeConfig: {
  },
  publicRuntimeConfig: {
        OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || 'eats.rafiki.shop',
        OAUTH_CALLBACK_URL: process.env.OAUTH_CALLBACK_URL || 'https://eats.rafiki.shop/callback',
        OAUTH_DISCOVERY_URL: process.env.OAUTH_DISCOVERY_URL || 'https://auth.rafiki.money',
        ACQUIRER_SUBJECT: process.env.AQUIRER_SUBJECT || '$localhost:3001/p/eats@rafiki.shop',
        ACQUIRER_WALLET_INVOICES: process.env.AQUIRER_WALLET || 'http://localhost:3001/invoices'
    }
});
