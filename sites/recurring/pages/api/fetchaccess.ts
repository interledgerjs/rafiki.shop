import { NextApiRequest, NextApiResponse } from "next"
import getConfig from 'next/config'
const { Issuer } = require("openid-client")

const { publicRuntimeConfig } = getConfig()

const OAUTH_CLIENT_ID = publicRuntimeConfig.OAUTH_CLIENT_ID
const OAUTH_CALLBACK_URL = publicRuntimeConfig.OAUTH_CALLBACK_URL

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req

  try {
    const issuer = await Issuer.discover("https://auth.rafiki.money")

    const client = new issuer.Client({
      client_id: OAUTH_CLIENT_ID,
      token_endpoint_auth_method: "none"
    })

    const grant = await client.grant({
      grant_type: "authorization_code",
      code: body.code,
      redirect_uri: OAUTH_CALLBACK_URL
    })

    res.setHeader("Content-Type", "application/json")
    res.statusCode = 200
    res.end(JSON.stringify({ access_token: grant.access_token }))
    return
  } catch (error) {
    console.log(error)
    res.status(400).end()
  }
}
