import { NextPage } from 'next'
import { Base64 } from 'js-base64'
import { useEffect, useState } from 'react'
import PulseLoader from 'react-spinners/PulseLoader';
import { CheckmarkOutline } from '../components/icons/checkmark-outline'
import { CloseOutline } from '../components/icons/close-outline'
import { Issuer } from 'openid-client'
import axios from 'axios'

type Props = {
  state: {
    mandate: any,
    amount: string,
    orderId: string
  },
  code: string
}

type PaymentStatus = 'processing' | 'error' | 'complete'

const renderProcessingPayment = () => (
  <div className="flex flex-col">
    <div className="justify-center flex my-4 text-gray-800 text-2xl">
      Processing Payment
    </div>
    <div className="flex justify-center my-6">
      <PulseLoader
        color={'grey'}
        size={12}
      />
    </div>
  </div>
)

const renderCompletePayment = () => (
  <div className="flex flex-col mx-4">
    <div className="justify-center flex my-4 text-gray-800 text-2xl">
      Payment Complete
    </div>
    <div className="flex justify-center mb-4">
      <CheckmarkOutline className="fill-current text-teal-500 w-16"/>
    </div>
    <div className="text-gray-600 mx-auto mb-4">
      Your order is on its way!
    </div>
  </div>
)

const renderErrorPayment = () => (
  <div className="flex flex-col mx-4">
    <div className="justify-center flex my-4 text-gray-800 text-2xl">
      Payment Error
    </div>
    <div className="flex justify-center mb-4">
      <CloseOutline className="fill-current text-red-400 w-16"/>
    </div>
    <button onClick={() => window.location.href = '/' } className="bg-gray-200 rounded shadow w-40 px-2 py-2 mx-auto mt-6 font-semibold">
      Purchase Again
    </button>
  </div>
)

const Page: NextPage<Props> = ({ state, code }) => {
  const [paymentState, setPaymentStatus] = useState<PaymentStatus>('processing')

  useEffect(() => {
    const response = axios.post('/api/payment', {
      code,
      agreementId: state.mandate.id,
      amount: state.amount
    }).then(response => {
      console.log(response.data)
      setPaymentStatus('complete')
    }).catch(error => {
      console.log('error processing payment', error)
      setPaymentStatus('error')
    })
  }, [])
  return (
    <div className="mx-auto bg-white shadow rounded max-w-lg mt-8 px-4 py-6">
      <div>
        <div className="text-2xl text-gray-800 font-light">
          Order
        </div>
        <div className="flex my-6">
          <div className="flex-1 leading-tight">
            <div className="text-gray-500 text-sm">
              Reference
            </div>
            <div>
              {state.orderId}
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-t border-gray-300">
        <div className="flex leading-tight my-4 mx-8 justify-between">
          <div className="text-gray-600 text-2xl my-auto font-light">
            Total
          </div>
          <div className="text-gray-800 text-2xl my-auto">
            $ {(parseInt(state.amount))/100}
          </div>
        </div>
      </div>
      {paymentState === 'processing' ? renderProcessingPayment() : null}
      {paymentState === 'complete' ? renderCompletePayment() : null}
      {paymentState === 'error' ? renderErrorPayment() : null}
    </div>
  )
}

Page.getInitialProps = async ({query}) => {
  const {code, state} = query

  // console.log(issuer)
  //Do some upfront work to cover+ the code into
  const decodedState = JSON.parse('')

  console.log(decodedState)
  return {
    state: decodedState,
    code: code.toString()
  }
}

export default Page
