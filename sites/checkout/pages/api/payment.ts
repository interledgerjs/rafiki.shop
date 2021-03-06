import { NextApiRequest, NextApiResponse } from 'next'
import { payment, queryPaymentPointer } from '../../lib/stream'
const { Issuer } = require('openid-client')
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const PAYMENT_POINTER = 'https://rafiki.money/p/ilpeats'
const ILP_URL = (agreementId: string) => `https://rafiki.money/ilp/agreements/${agreementId}/ilp`
const OAUTH_CLIENT_ID = publicRuntimeConfig.OAUTH_CLIENT_ID
const OAUTH_CALLBACK_URL = publicRuntimeConfig.OAUTH_CALLBACK_URL
const OAUTH_DISCOVERY_URL = publicRuntimeConfig.OAUTH_DISCOVERY_URL

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req

  try {

    const issuer = await Issuer.discover(OAUTH_DISCOVERY_URL) // => Promise
      .then((rafikiIssuer) => {
        return rafikiIssuer
      });

    const client = new issuer.Client({
      client_id: OAUTH_CLIENT_ID,
      token_endpoint_auth_method: 'none'
    })

    const grant = await client.grant({
      grant_type: 'authorization_code',
      code: body.code,
      redirect_uri: OAUTH_CALLBACK_URL
    })

    const { destinationAccount, sharedSecret } = await queryPaymentPointer(PAYMENT_POINTER)

    await payment(ILP_URL(body.agreementId), grant.access_token, body.amount, destinationAccount, sharedSecret)

    res.status(200).end()
    return
  } catch(error) {
    console.log(error)
    res.status(400).end()
  }
}
