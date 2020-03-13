import React, { useState, useMemo, MouseEvent, useEffect } from 'react'
import axios from 'axios'
import { NextPage } from "next"
import nanoid from 'nanoid'
import { Base64 } from 'js-base64'
import getConfig from 'next/config'

const METHOD_NAME = process.env.METHOD_NAME || 'http://localhost:3000/'

const { publicRuntimeConfig } = getConfig()

const toVisibileValue = (amount: number) => {
  return (amount / 100).toFixed(2)
}

type Props = {
  id: string
}

const Page: NextPage<Props> = ({ id }) => {
  const OAUTH_CLIENT_ID = publicRuntimeConfig.OAUTH_CLIENT_ID
  const OAUTH_CALLBACK_URL = publicRuntimeConfig.OAUTH_CALLBACK_URL
  const AQUIRER_SUBJECT = process.env.AQUIRER_SUBJECT || '$localhost:3001/checkout@merchant.com'
  const AQUIRER_WALLET = process.env.AQUIRER_WALLET || 'http://localhost:3001'

  const [totalBurgers, setTotalBurgers] = useState(1)
  const [totalFries, setTotalFries] = useState(1)
  const [totalMilkshakes, setTotalMilkshakes] = useState(1)
  const [paymentPointer, setPaymentPointer] = useState('')
  const [paymentPointerError, setPaymentPointerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentPointerRequired, setPaymentPointerRequired] = useState(false)

  const total = useMemo(
    () => {
      return totalBurgers * 499 + totalFries * 299 + totalMilkshakes * 499
    },
    [totalBurgers, totalFries, totalMilkshakes]
  )

  const ppCheckout = async () => {
    if (paymentPointer !== ''){
      const sanitizedPP = paymentPointer.startsWith('$') ? 'https://' + paymentPointer.slice(1) : paymentPointer
      setIsSubmitting(true)
      setPaymentPointerError('')
      const response = await axios.get(sanitizedPP).then(response => {
        return response.data
      }).catch(error => {
        setPaymentPointerError('Invalid Payment Pointer')
        setIsSubmitting(false)
        throw error
      })
      
      debugger
      // create mandate
      const { data } = await axios.post(response.payment_mandates_endpoint, {
        asset: {code: 'USD', scale: 2},
        amount: total.toString(),
        scope: paymentPointer,
        description: `ILP Eats Order ${id}`
      })

      const mandateId = data.id

      const state = Base64.encode(JSON.stringify({
        mandate: data,
        amount: total.toString(),
        orderId: id
      }), true)

      // request authorization for mandate
      const authQuery = `?client_id=${OAUTH_CLIENT_ID}&response_type=code&scope=openid%20mandates.${mandateId}&state=${state}&redirect_uri=${OAUTH_CALLBACK_URL}`
      debugger
      window.location.href = response.authorization_endpoint + authQuery
      setIsSubmitting(false)
      
    } else if (paymentPointer === '') {
      setPaymentPointerError('Please enter a payment pointer')
    }
  }

  const checkout = async (event: MouseEvent<HTMLButtonElement>) => {
    if (!paymentComplete && !isSubmitting) {
      if(window.PaymentRequest) {
        axios.post(AQUIRER_WALLET + '/invoices', {
          subject: AQUIRER_SUBJECT,
          assetCode: "USD",
          assetScale: 2,
          amount: total,
          description: "ILP Eats"
        }).then((response) => {

          const paymentMethodData: PaymentMethodData[] = [
            {
              supportedMethods: METHOD_NAME,
              data: {
                invoice: response.data
              }
            }
          ]
    
          const paymentDetailsInit: PaymentDetailsInit = {
            total: {
              label: 'ILP Eats',
              amount: {
                value: (total/100).toFixed(2).toString(),
                currency: 'USD'
              }
            }
          }
    
          const request = new PaymentRequest(paymentMethodData, paymentDetailsInit)
          request.canMakePayment().then((x) => {
            request.show()
            .then((paymentResponse) => {
              paymentResponse.complete('success')
              console.log('PR successful', paymentResponse)
              setPaymentComplete(true)
            })
            .catch((error) => {
              if (error.message != 'User closed the Payment Request UI.')
              setPaymentPointerRequired(true)
            })
          }).catch((err) => {
            console.log('unable to process payment', err)
          })

        }).catch(err => {
          console.log('Failed to generate invoice', err)
        })
      } else {
        setPaymentPointerRequired(true)
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="max-w-5xl mx-auto mt-8 text-4xl text-gray-800">
        ILP EATS
      </div>
      <div className="max-w-5xl flex shadow-lg rounded-lg bg-white mx-auto px-16 py-16 mt-16">
        <div className="w-2/3 flex flex-col ">
          <div className="my-4 text-gray-600 text-2xl">
            Cart
          </div>
          <div className="flex-1">
            <div className="flex my-4">
              <div className="mr-2">
                <img className="rounded-full" src="https://source.unsplash.com/88YAXjnpvrM/100x100"/>
              </div>
              <div className="flex flex-1 my-auto mx-2 text-gray-600 justify-center">
                Hamburger
              </div>
              <div className="flex flex-1 my-auto mx-2">
                <input className="w-8 h-6 border-gray-400 border-2 mx-auto rounded" type="number" min="0"
                       value={totalBurgers}
                       onChange={(event) => setTotalBurgers(event.target.value ? parseInt(event.target.value) : 0)}/>
              </div>
              <div className="flex flex-1 my-auto mx-2 text-gray-600 text-lg">
                $4.99
              </div>
            </div>
            <div className="border-b border-gray-500"/>
            <div className="flex my-4">
              <div className="mr-2">
                <img className="rounded-full" src="https://source.unsplash.com/vi0kZuoe0-8/100x100"/>
              </div>
              <div className="flex flex-1 my-auto mx-2 text-gray-600 justify-center">
                Fries
              </div>
              <div className="flex flex-1 my-auto mx-2">
                <input className="w-8 h-6 border-gray-400 border-2 mx-auto rounded" type="number" min="0"
                       value={totalFries}
                       onChange={(event) => setTotalFries(event.target.value ? parseInt(event.target.value) : 0)}/>
              </div>
              <div className="flex flex-1 my-auto mx-2 text-gray-600 text-lg">
                $2.99
              </div>
            </div>
            <div className="border-b border-gray-500"/>
            <div className="flex my-4">
              <div className="mr-2">
                <img className="rounded-full" src="https://source.unsplash.com/gjFfm8ADhQw/100x100"/>
              </div>
              <div className="flex flex-1 my-auto mx-2 text-gray-600 justify-center">
                Milkshake
              </div>
              <div className="flex flex-1 my-auto mx-2">
                <input className="w-8 h-6 border-gray-400 border-2 mx-auto rounded" type="number" min="0"
                       value={totalMilkshakes}
                       onChange={(event) => setTotalMilkshakes(event.target.value ? parseInt(event.target.value) : 0)}/>
              </div>
              <div className="flex flex-1 my-auto mx-2 text-gray-600 text-lg">
                $4.99
              </div>
            </div>
            <div className="border-b border-gray-500"/>
          </div>
          <div className="my-4 justify-end flex mr-16">
            <div>
              <div className="text-gray-600 text-3xl">
                $ {toVisibileValue(total)}
              </div>
              <div className="text-gray-500 text-center">
                Subtotal
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/3 ml-4">

          <div className={'bg-gray-100 h-full shadow rounded-lg flex flex-col px-6 py-12' + (paymentPointerRequired? ' hidden': '')}>
            <div className="text-gray-800 font-bold text-2xl">
              Checkout
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-gray-700 my-4">
                ILP Eats is powered by ILP.
                Go to https://rafiki.money to get an ILP enabled account Today!
              </div>
            </div>
            <div className="w-full">
              <button
                onClick={checkout}
                className="w-full h-10 shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="button">
                {paymentComplete ? 'Paid' : 'Checkout'}
              </button>
            </div>
          </div>

          <div className={'bg-gray-100 h-full shadow rounded-lg flex flex-col px-6 py-12' + (!paymentPointerRequired? ' hidden': '')}>
            <div className="text-gray-800 font-bold text-2xl">
              Payments Details
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-gray-700 my-4">
                Payment Handler is not available
                Submit your payment pointer to checkout
              </div>
              <div className="flex items-center border-b border-b-2 border-teal-600 py-2 mt-4">
                <input
                  value={paymentPointer}
                  onChange={(event) => {
                    setPaymentPointer(event.target.value);
                    setPaymentPointerError('')
                  }}
                  className="appearance-none bg-transparent border-none w-full text-gray-600 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="text" placeholder="$paymentpointer.org/alice"/>
              </div>
              <div className="mt-2 text-xs text-red-700 h-12">
                {paymentPointerError ? paymentPointerError : null}
              </div>
            </div>
            <div className="w-full">
              <button
                onClick={ppCheckout}
                className="w-full h-10 shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="button">
                {isSubmitting ? '...' : 'Pay'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

Page.getInitialProps = async ({req}) => {
  const id = nanoid()
  return {
    id
  }
}

export default Page
