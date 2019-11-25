import { NextApiRequest, NextApiResponse } from "next"
const { Issuer } = require("openid-client")

const OAUTH_CLIENT_ID = "rafiki.shop"
const OAUTH_CALLBACK_URL = process.env.OAUTH_CALLBACK_URL

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req

  try {
    const issuer = await Issuer.discover("https://auth.rafiki.money").then(
      rafikiIssuer => {
        return rafikiIssuer
      }
    )

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
