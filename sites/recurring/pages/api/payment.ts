import { NextApiRequest, NextApiResponse } from 'next'
import { payment, queryPaymentPointer } from '../../lib/stream'
const { Issuer } = require('openid-client');

const PAYMENT_POINTER = 'https://rafiki.money/p/ilpeats'
const ILP_URL = (agreementId: string) => `https://rafiki.money/ilp/agreements/${agreementId}/ilp`
const OAUTH_CLIENT_ID = 'rafiki.shop'
const OAUTH_CALLBACK_URL = process.env.OAUTH_CALLBACK_URL

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req

  try {

    const issuer = await Issuer.discover('https://auth.rafiki.money') // => Promise
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
