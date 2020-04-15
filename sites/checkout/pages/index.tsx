import React, { useState, useMemo, FC, useRef, useEffect } from 'react'
import axios from 'axios'
import { NextPage } from "next"
import nanoid from 'nanoid'
import { Base64 } from 'js-base64'
import getConfig from 'next/config'
import { OpenPaymentsButton } from '../components/open-payments-button'
import QRCode from 'qrcode.react'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { CheckmarkOutline } from '../components/icons/checkmark-outline'

const methodName = process.env.METHOD_NAME || 'http://localhost:3000/'

const { publicRuntimeConfig } = getConfig()

const toVisibileValue = (amount: number) => {
  return (amount / 100).toFixed(2)
}

type Props = {
  id: string
}

export function useInterval(callback, delay) {
  const savedCallback = useRef<any>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const DisplayCheckout: FC<{checkout: () => void}> = ({checkout}) => {
  return (
    <div className='bg-gray-100 h-full shadow rounded-lg flex flex-col px-6 py-12'>
      <div className="text-gray-800 font-bold text-2xl">
        Checkout
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-gray-700 my-4">
          ILP Eats is powered by Open Payments. Go to <a href="https://rafiki.money" target='_blank'>https://rafiki.money</a> to get an Open Payments enabled account Today!
        </div>
      </div>
      <div className="w-full">
        <OpenPaymentsButton
          onClick={checkout}
        />
      </div>
    </div>
  )
}

const DisplayInvoiceDetails: FC<any> = ({invoice, setPaymentComplete}) => {

  const invoiceUrl = "https:" + invoice.name

  useInterval(() => {
    axios.get(invoiceUrl).then((response) => {
     const inv = response.data
      if(inv.amount === inv.received) {
        setPaymentComplete(true)
      }
    })
  }, 500)

  return (
    <div className='bg-gray-100 h-full shadow rounded-lg flex flex-col px-6 py-12'>
      <div className="text-gray-800 font-bold text-2xl text-center">
        Payments Details
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <QRCode
          className="mx-auto my-8"
          value={invoice.name}
          size={128}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
          includeMargin={false}
          renderAs={"svg"}
        />
      </div>
      <CopyToClipboard text={invoice.name}>
        <div className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal">
            {invoice.name}
        </div>
      </CopyToClipboard>
    </div>
  )
}

const DisplayPaymentComplete: FC<any> = ({reset}) => {
  return (
    <div className='bg-gray-100 h-full shadow rounded-lg flex flex-col px-6 py-12'>
      <div className="text-gray-800 font-bold text-2xl">
        Payment Complete
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <CheckmarkOutline className="h-32"/>
      </div>
      <div onClick={reset} className="flex justify-center mt-4">
        <div className="ml-4 rounded-lg px-4 md:px-5 xl:px-4 py-3 md:py-4 xl:py-3 bg-white hover:bg-gray-200 md:text-lg xl:text-base text-gray-800 font-semibold leading-tight shadow-md">
          Restart
        </div>
      </div>
    </div>
  )
}

const Page: NextPage<Props> = ({ id }) => {
  const ACQUIRER_SUBJECT = process.env.AQUIRER_SUBJECT || '$rafiki.money/p/eats@rafiki.shop'
  const ACQUIRER_WALLET_INVOICES = process.env.AQUIRER_WALLET || 'https://rafiki.money/api/invoices'

  const [totalBurgers, setTotalBurgers] = useState(1)
  const [totalFries, setTotalFries] = useState(1)
  const [totalMilkshakes, setTotalMilkshakes] = useState(1)


  const [isSubmitting, setIsSubmitting] = useState(false)
  const [invoice, setInvoice] = useState<any>()
  const [paymentComplete, setPaymentComplete] = useState(false)

  const reset = () => {
    setInvoice(undefined)
    setPaymentComplete(false)
  }

  const total = useMemo(
    () => {
      return totalBurgers * 499 + totalFries * 299 + totalMilkshakes * 499
    },
    [totalBurgers, totalFries, totalMilkshakes]
  )


  const checkCanMakePayment = async (request) => {
    if (!request.canMakePayment) {
      return
    }

    try {
      const result = await request.canMakePayment()
      console.info(result ? "Can make payment" : "Cannot make payment")
    } catch (e) {
      console.error(e.toString())
    }
  }

  const checkHasEnrolledInstrument = async (request) => {
    if (!request.hasEnrolledInstrument) {
      return
    }

    try {
      const result = await request.hasEnrolledInstrument()
      console.info(result ? "Has enrolled instrument" : "No enrolled instrument")
    } catch (e) {
      console.error(e.toString())
    }
  }
  
  const initiatePaymentRequest = async (request) => {
    if (!request) {
      return
    }
  
    try {
      const instrumentResponse = await request.show()
      await instrumentResponse.complete('success')
      setPaymentComplete(true)
      console.info('This is a demo website. No payment will be processed.', instrumentResponse)
    } catch (e) {
      console.error(e.toString())
    }
  }

  const checkout = async () => {
    // Generate Invoice
    const invoice = await axios.post(ACQUIRER_WALLET_INVOICES, {
      subject: ACQUIRER_SUBJECT,
      assetCode: "USD",
      assetScale: 6,
      amount: total*10000,
      description: "ILP Eats Order"
    }).then(response => response.data)

    // If Payment Handler Show it
    {/*if (window.PaymentRequest) {*/}
    //     const paymentMethodData: PaymentMethodData[] = [
    //       {
    //         supportedMethods: methodName,
    {/*        data: {*/}
    {/*          invoice*/}
    {/*        }*/}
    {/*      }*/}
    {/*    ]*/}

    //     const paymentDetailsInit: PaymentDetailsInit = {
    //       total: {
    //         label: 'ILP Eats',
    {/*        amount: {*/}
    //           value: (total/100).toFixed(2).toString(),
    //           currency: 'USD'
    //         }
    //       }
    //     }
    //     let request
    //
    //     try {
    //       request = new PaymentRequest(paymentMethodData, paymentDetailsInit)
    //     } catch (e) {
    //       console.error(e.toString())
    //       setPaymentPointerRequired(true)
    //       return null
    //     }
    //
    //     await checkCanMakePayment(request)
    //     await checkHasEnrolledInstrument(request)
    //
    //     await initiatePaymentRequest(request)
    // }

    // Else display invoice details
    setInvoice(invoice)

  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="max-w-5xl mx-auto mt-8 text-4xl text-gray-800">
        ILP EATS
      </div>
      <div className="max-w-sm sm:max-w-5xl w-full flex flex-col sm:flex-row shadow-lg rounded-lg bg-white mx-auto px-16 py-16 mt-16">
        <div className="w-full sm:w-2/3 flex flex-col">
          <div className="my-4 text-gray-600 text-2xl">
            Cart
          </div>
          <div className="flex-1">
            <div className="flex my-4">
              <div className="mr-2">
                <img className="rounded-full h-10" src="https://source.unsplash.com/88YAXjnpvrM/100x100"/>
              </div>
              <div className="flex flex-1 my-auto mx-2 text-gray-600 justify-center">
                Hamburger
              </div>
              <div className="flex flex-1 my-auto mx-2">
                <input className="w-8 h-6 border-gray-400 border-2 mx-auto rounded" type="number" min="0"
                       disabled={!!invoice}
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
                <img className="rounded-full h-10" src="https://source.unsplash.com/vi0kZuoe0-8/100x100"/>
              </div>
              <div className="flex flex-1 my-auto mx-2 text-gray-600 justify-center">
                Fries
              </div>
              <div className="flex flex-1 my-auto mx-2">
                <input className="w-8 h-6 border-gray-400 border-2 mx-auto rounded" type="number" min="0"
                       disabled={!!invoice}
                       value={totalFries}
                       onChange={(event) => setTotalFries(event.target.value ? parseInt(event.target.value) : 0)}/>
              </div>
              <div className="flex flex-1 my-auto mx-2 text-gray-600 text-lg self-end">
                $2.99
              </div>
            </div>
            <div className="border-b border-gray-500"/>
            <div className="flex my-4">
              <div className="mr-2">
                <img className="rounded-full h-10" src="https://source.unsplash.com/gjFfm8ADhQw/100x100"/>
              </div>
              <div className="flex flex-1 my-auto mx-2 text-gray-600 justify-center">
                Milkshake
              </div>
              <div className="flex flex-1 my-auto mx-2">
                <input className="w-8 h-6 border-gray-400 border-2 mx-auto rounded" type="number" min="0"
                       disabled={!!invoice}
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
        <div className="w-full sm:w-1/3 sm:ml-4">

          { !paymentComplete ?
            invoice ?
              <DisplayInvoiceDetails invoice={invoice} setPaymentComplete={setPaymentComplete}/> :
              <DisplayCheckout checkout={checkout}/> :
              <DisplayPaymentComplete reset={reset}/>
          }
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
