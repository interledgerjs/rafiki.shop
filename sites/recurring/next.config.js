const withCSS = require('@zeit/next-css')
require("dotenv").config();

module.exports = withCSS({
  serverRuntimeConfig: {
  },
  publicRuntimeConfig: {
		OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || 'rafiki.shop',
		OAUTH_CALLBACK_URL: process.env.OAUTH_CALLBACK_URL || 'http://localhost:3000/callback'
  },
})

