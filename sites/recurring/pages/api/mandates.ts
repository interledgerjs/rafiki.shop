import { NextApiRequest, NextApiResponse } from "next"
import getConfig from 'next/config'
const { Issuer } = require("openid-client")
import ky from 'ky-universal'
import nanoid from 'nanoid'
import { Base64 } from 'js-base64'

const { publicRuntimeConfig } = getConfig()

const OAUTH_CLIENT_ID = publicRuntimeConfig.OAUTH_CLIENT_ID
const OAUTH_CALLBACK_URL = publicRuntimeConfig.OAUTH_CALLBACK_URL

type Mandate = {
  name: string
  amount: string
  assetCode: string
  assetScale: number
  interval: string
  scope: string
  description: string
}

type CreateMandate = {
  amount: string
  assetCode: string
  assetScale: number
  interval: string
  scope: string
  description: string
}

const getOpenPaymentsMetadata = async (paymentPointer: string): Promise<any> => {
  let openPaymentsUrl = ''

  if (paymentPointer.startsWith('$')) {
    openPaymentsUrl = 'https://' + paymentPointer.substr(1)
  }

  const url = new URL(openPaymentsUrl)
  url.pathname = '/.well-known/open-payments'

  const metadata = await ky.get(url.toJSON()).json<any>()

  return metadata
}

const buildRedirectUrl = (authorizationUrl: string, mandate: Mandate): string => {
  const authorizationDetails = [
    {
      type: 'open_payments_mandate',
      locations: [
        mandate.name
      ],
      actions: [
        'read', 'charge'
      ]
    }
  ]

  const url = new URL(authorizationUrl)
  const state = Base64.encode(JSON.stringify({
    mandate,
    amount: mandate.amount,
    orderId: nanoid()
  }), true)

  url.searchParams.set('client_id', OAUTH_CLIENT_ID)
  url.searchParams.set('authorization_details', JSON.stringify(authorizationDetails))
  url.searchParams.set('redirect_uri', OAUTH_CALLBACK_URL)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('state', state)

  return url.toJSON()
}

const createMandate = async (mandatesUrl: string, mandate: CreateMandate): Promise<Mandate> => {
  return ky.post(mandatesUrl, {
    json: mandate
  }).json<Mandate>()
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req

  if(req.method === 'POST') {
    try {

      const metadata = await getOpenPaymentsMetadata(body.paymentPointer)

      const mandate = await createMandate(metadata.mandates_endpoint, {
        assetCode: 'USD',
        assetScale: 6,
        amount: body.amount,
        interval: 'P0Y0M0DT0H0M60S',
        scope: body.paymentPointer,
        description: `ILPFlix Subscription`
      })

      const redirectUrl = buildRedirectUrl(metadata.authorization_endpoint, mandate)

      res.setHeader("Content-Type", "application/json")
      res.statusCode = 200
      res.end(JSON.stringify({ redirectUrl }))
      return
    } catch (error) {
      console.log(error)
      res.status(400).end()
    }
  } else {
    res.status(404)
    res.end()
  }

}
