import React, { useState, FC, useRef, useEffect } from 'react'
import axios from 'axios'
import { NextPage } from "next"
import nanoid from 'nanoid'
import useForm from 'react-hook-form'
import getConfig from 'next/config'
import { OpenPaymentsButton } from '../components/open-payments-button'
import QRCode from 'qrcode.react'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Decor, CartItem, TextInput, Coffee } from '../components'

const methodName = process.env.METHOD_NAME || 'https://openpayments.dev/pay'

const { publicRuntimeConfig } = getConfig()

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

const Checkout: NextPage<Props> = ({ id }) => {
  const ACQUIRER_SUBJECT = process.env.AQUIRER_SUBJECT || '$rafiki.money/p/eats@rafiki.shop'
  const ACQUIRER_WALLET_INVOICES = process.env.AQUIRER_WALLET || 'https://rafiki.money/api/invoices'

  const {register, handleSubmit, errors, setError, clearError} = useForm()
  const formRef = useRef<HTMLFormElement>(null)

  const [invoice, setInvoice] = useState<any>()
  const [email, setEmail] = useState<String>()
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [canMakePayment, setCanMakePayment] = useState(true)

  const reset = () => {
    setInvoice(undefined)
    setCanMakePayment(true)
    setPaymentComplete(false)
  }


  const PayForm: FC = () => {
    return (
      <div className="flex flex-col p-8 md:px-0 w-full justify-center">
          {canMakePayment ? 
            <form ref={formRef} className="w-full justify-center items-center content-center" onSubmit={handleSubmit(checkout)}>
              <div>
                <TextInput
                  errorState={null}
                  validationFunction={validateEmail}
                  inputRef={(register({required: true}))}
                  name='email'
                  label='Email'
                  hint={'Email is required to receive your coffee.'}
                />
              </div>
              <OpenPaymentsButton/>
            </form>
          : 
            <div className='h-full flex flex-col py-6 md:py-0'>
              <div className="text-dark text-2xl">
                Payments Details
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <QRCode
                  className="mx-auto my-4 md:my-8"
                  value={invoice.name}
                  size={128}
                  bgColor={"#ffffff00"}
                  fgColor={"#442C2E"}
                  level={"L"}
                  includeMargin={false}
                  renderAs={"svg"}
                />
              </div>
              <CopyToClipboard text={invoice.name}>
                <div className="bg-secondary focus:outline-none border border-dark py-2 px-4 block w-full cursor-pointer appearance-none leading-normal">
                  Click here to copy Invoice details to your clipboard
                </div>
              </CopyToClipboard>
            </div>
          }
          <p className="text-xs text-center mt-2">
            Powered by <a className="opacity-75" target="_blank" href="https://openpayments.dev">Open Payments</a> and <a className="opacity-75" target="_blank" href="https://rafiki.money">Rafiki Money</a>.
          </p>
        </div>
    )
  }


  useInterval(() => {
    if(invoice && !paymentComplete) {
      const invoiceUrl = "https:" + invoice.name
      axios.get(invoiceUrl).then((response) => {
        const inv = response.data
        if(inv.amount === inv.received) {
          setPaymentComplete(true)
          sendCoffee()
        }
      })
    }
  }, 500)

  
  const checkCanMakePayment = async (request) => {
    if (!request.canMakePayment) {
      return
    }

    try {
      const result = await request.canMakePayment()
      setCanMakePayment(result)
      console.info(result ? "Can make payment" : "Cannot make payment")
    } catch (e) {
      setCanMakePayment(false)
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

  const sendCoffee = async () => {
    if (email) {
      await axios.post('https://rafiki.money/api/coffee', {
        email: email
      }).then(() => {
        console.log('Coffee sent successfully!')
      })
    }
  }
  
  const initiatePaymentRequest = async (request) => {
    if (!request) {
      return
    }
  
    try {
      const instrumentResponse = await request.show()
      console.log(instrumentResponse)
      if (instrumentResponse.details.success) {
        await instrumentResponse.complete('success')
        setPaymentComplete(true)
        sendCoffee()
      }
      console.info('This is a demo website. No payment will be processed.', instrumentResponse)
    } catch (e) {
      console.error(e.toString())
    }
  }

  const checkout = async data => {
    console.log('data', data.email, validateEmail({ target: { value: data.email } }))
    if (validateEmail({ target: { value: data.email } })) {
      setEmail(data.email)
    } 
    const invoice = await axios.post(ACQUIRER_WALLET_INVOICES, {
      subject: ACQUIRER_SUBJECT,
      assetCode: "USD",
      assetScale: 6,
      amount: 5000000,
      description: "Digital Coffee"
    }).then(response => {
      setInvoice(response.data)
      return response.data
    })

    // If Payment Handler Show it
    let paymentHandlerPayment: boolean = false
    if (window.PaymentRequest) {
        const paymentMethodData: PaymentMethodData[] = [
          {
            supportedMethods: methodName,
            data: {
              invoice
            }
          }
        ]

        const paymentDetailsInit: PaymentDetailsInit = {
          total: {
            label: 'ILP Checkout',
            amount: {
              value: (5000000 / 1000000).toFixed(2).toString(),
              currency: 'USD'
            }
          }
        }

        let request

        try {
          request = new PaymentRequest(paymentMethodData, paymentDetailsInit)
          // await checkHasEnrolledInstrument(request) 
          await checkCanMakePayment(request)
          await initiatePaymentRequest(request)
        } catch (e) {
          console.error(e.toString())
        }
    } else {
      setCanMakePayment(false)
    }

    // Else display invoice details
    if(!paymentHandlerPayment) {

    } else {
      setInvoice(invoice)
    }
  }

  const validateEmail = e => {
    const emailRegex = RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)
    if (!emailRegex.test(e.target.value)) {
      return (false)
    }
    return (true)
  }

  return (
    <div className="relative overflow-hidden w-full">
      <Decor/>
      {/* CART */}
      <div className={`${paymentComplete ? 'hidden' : 'flex'} container justify-between md:justify-center mx-auto w-screen h-screen flex-col md:flex-row md:items-center leading-tight text-dark`}>
        <div className="hidden md:flex">
          <Coffee size={400}/>
        </div>
        <div>
          <div className="flex px-8 md:px-0 py-16 md:py-4 max-w-sm mx-auto">
              <p className="text-4xl">
                Cart
              </p>
          </div>
          <div className="px-8 md:px-0">
            <CartItem/>
          </div>
          <div className="hidden md:flex">
            <PayForm/>
          </div>
        </div>
        <div className="flex md:hidden justify-center">
          <PayForm/>
        </div>
      </div>
      <div className={`${paymentComplete && canMakePayment ? 'flex' : 'hidden'} container justify-center mx-auto w-screen h-screen flex-col leading-tight text-dark`}>
        <div className="flex flex-col pt-2 pb-8 px-8 bg-secondary border text-center items-center border-dark mx-auto">
          <div>
            <Coffee size={200}/>
          </div>
          <div>
            <div className="text-xl">

              Payment Successful!
            </div>
            <div className="text-sm">
              Check your email.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Checkout.getInitialProps = async ({req}) => {
  const id = nanoid()
  return {
    id
  }
}

export default Checkout
