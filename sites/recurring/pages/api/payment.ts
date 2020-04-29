import { NextApiRequest, NextApiResponse } from "next"
import { payment } from "../../lib/stream"
import ky from 'ky-universal'

const PAYMENT_POINTER = "$rafiki.money/p/flix@rafiki.shop"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req

  try {
    const invoice = await ky.post('https://rafiki.money/api/invoices', {
      json: {
        subject: PAYMENT_POINTER,
        assetCode: "USD",
        assetScale: 6,
        amount: body.amount,
        description: "ILP Flix Subscription"
      }
    }).json<{name: string}>()

    const chargesUrl = `https:${body.mandate}/charges`
    const charge = await ky.post(chargesUrl, {
      headers: {
        authorization: `Bearer ${body.access_token}`
      },
      json: {
        invoice: invoice.name
      }
    }).json()

    console.log(charge)

    res.setHeader("Content-Type", "application/json")
    res.statusCode = 200
    res.end(JSON.stringify({ ok: true }))
    return
  } catch (error) {
    console.log(error)
    res.status(400).end()
  }
}
