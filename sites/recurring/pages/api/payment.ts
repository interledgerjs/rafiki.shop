import { NextApiRequest, NextApiResponse } from "next"
import { payment, queryPaymentPointer } from "../../lib/stream"

const PAYMENT_POINTER = "https://rafiki.money/p/ilpeats"
const ILP_URL = (agreementId: string) =>
  `https://rafiki.money/ilp/agreements/${agreementId}/ilp`

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req

  try {
    const { destinationAccount, sharedSecret } = await queryPaymentPointer(
      PAYMENT_POINTER
    )

    await payment(
      ILP_URL(body.agreementId),
      body.access_token,
      body.amount,
      destinationAccount,
      sharedSecret
    )

    // res.status(200).end()

    res.setHeader("Content-Type", "application/json")
    res.statusCode = 200
    res.end(JSON.stringify({ ok: true }))
    return
  } catch (error) {
    console.log(error)
    res.status(400).end()
  }
}
