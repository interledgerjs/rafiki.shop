import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { NextPage } from "next"
import { Base64 } from 'js-base64'
import nanoid from 'nanoid'

const plans = [
	{
		name: 'Basic',
		description: "Watch on 1 screen at a time in Standard Definition",
		// price: 899
		price: 299
	},
	{
		name: 'Standard',
		description: "Watch on 2 screens at a time. HD available.",
		// price: 1299
		price: 399
	},
	{
		name: 'Premium',
		description: "Watch on 4 screens at a time. HD and Ultra HD available.",
		// price: 1599
		price: 499
	}
]

export type OAuthServerMetaData = {
	// Ilp extension to meta data
	payment_intents_endpoint: string
	payment_mandates_endpoint: string
	payment_assets_supported: string[]
	// Subset of current meta data specified in RFC8414
	issuer: string
	authorization_endpoint: string
	token_endpoint: string
	response_types_supported: string[]
	jwks_uri?: string
	registration_endpoint?: string
	scopes_supported?: string[]
	response_modes_supported?: string[]
	grant_types_supported?: string[]
	token_endpoint_auth_methods_supported?: string[]
	service_documentation?: string
	token_endpoint_auth_signing_alg_values_supported?: string[]
	ui_locales_supported?: string
	op_policy_uri?: string
	op_tos_uri?: string
}

const PaymentMethodCard: React.FC<{ hide: boolean, setPaymentPointer: React.Dispatch<React.SetStateAction<string>>, paymentPointerError: string, paymentPointer: string }> = ({ paymentPointerError, setPaymentPointer, paymentPointer, hide }) => {

	if (hide) {
		return null
	}

	return (
		<div>
			<div className="text-2xl text-gray-700 my-4">
				Payment method
      </div>
			<div className="mt-4">
				<div className="rounded-lg shadow-md bg-white flex flex-col mx-auto" style={{ width: '20rem', height: '12rem' }}>
					<div className="flex-1 flex justify-end">
						<div className="mt-2 mr-4 text-gray-700">
							ILP Payment Details
            </div>
					</div>
					<div className="flex-1 flex flex-col">
						<input className="mx-4 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="payment-pointer" type="text" placeholder="$example.com/alice" value={paymentPointer} onChange={event => setPaymentPointer(event.currentTarget.value)} />
						{
							paymentPointerError !== '' ?
								<div className="mt-2 text-center text-xs text-red-600">
									{paymentPointerError}
								</div> : null
						}
					</div>
					<div className="flex-1 flex justify-end align-bottom">
						<div className="flex flex-col justify-end">
							<div className="mr-4 mb-2">
								<img src="/ilp_icon.png" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

type Props = {
	id: string
}

const Page: NextPage<Props> = ({ id }) => {

	const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID
	const OAUTH_CALLBACK_URL = process.env.OAUTH_CALLBACK_URL

	const [paymentPointer, setPaymentPointer] = useState('')
	const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0)
	const [hasPaymentRequest, setHasPaymentRequest] = useState(true)
	const [paymentPointerError, setPaymentPointerError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		const check = async () => {
			if ('PaymentRequest' in window) {
				const dummydetails = {
					total: {
						label: "Total",
						amount: {
							currency: "USD",
							value: "0.00",
						},
					},
				};

				const supportsInterledgerPayment = await new PaymentRequest(
					[{ supportedMethods: "interledger" }],
					dummydetails
				).canMakePayment();
				setHasPaymentRequest(supportsInterledgerPayment)
			} else {
				setHasPaymentRequest(false)
			}
		}
		check()
	}, [])

	function subscribe() {
		if (hasPaymentRequest) {
			invokePaymentHandler()
		} else {
			subscribeWithPaymentPointer()
		}
	}

	async function invokePaymentHandler() {
		const selectedPlan = plans[selectedPlanIndex]
		const yearInFuture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).getTime()
		const paymentMethodData: PaymentMethodData[] = [{
			supportedMethods: ['interledger'],
			data: {
				mandate: {
					asset: {
						code: 'USD',
						scale: 2
					},
					amount: selectedPlan.price.toString(),
					description: `ILPFlix ${selectedPlan.name} plan.`,
					interval: 'P0Y0M0DT0H0M60S',
					expiry: yearInFuture
				},
				merchantInfo: {
					clientId: OAUTH_CLIENT_ID
				}
			}
		}];

		const paymentDetailsInit: PaymentDetailsInit = {
			displayItems: [],
			id: "",
			shippingOptions: [],
			total: {
				label: 'Subscription',
				amount: {
					value: (selectedPlan.price / 100).toFixed(2).toString(),
					currency: 'USD'
				}
			}
		}
		const request = new PaymentRequest(paymentMethodData, paymentDetailsInit)
		try {
			const canMakePayment = await request.canMakePayment()
			if (canMakePayment) {
				try {
					const result = await request.show()
					await result.complete('success')
					if (result.methodName === 'interledger') {
						window.location.href = `https://${OAUTH_CLIENT_ID}/callback?code=${result.details.code}&callbackUrl=${OAUTH_CALLBACK_URL}&clientId=${OAUTH_CLIENT_ID}`
					}
				} catch (error) {
					// Error calling show
					console.log(error)
				}
			}
		} catch (error) {
			// Error calling canMakePayment
			// Ignore as we'll fall back to iframe
		}
	}

	async function subscribeWithPaymentPointer() {
		if (!isSubmitting && paymentPointer !== '') {
			try {
				setIsSubmitting(true)
				setPaymentPointerError('')
				const sanitizedPP = paymentPointer.startsWith('$') ? 'https://' + paymentPointer.slice(1) : paymentPointer
				// Fetch server meta data from payment pointer
				const serverMetaData = await axios.get<OAuthServerMetaData>(sanitizedPP).then(resp => resp.data).catch(error => {
					console.log('error getting payment pointer')
					setPaymentPointerError('Invalid Payment Pointer')
					setIsSubmitting(false)
					throw error
				})

				console.log('Server meta data received from payment pointer: ', serverMetaData)
				console.log('Creating mandate at: ', serverMetaData.payment_mandates_endpoint)


				const selectedPlan = plans[selectedPlanIndex]
				const yearInFuture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).getTime()
				// create mandate
				const { data } = await axios.post(serverMetaData.payment_mandates_endpoint, {
					asset: { code: 'USD', scale: 2 },
					amount: selectedPlan.price.toString(),
					interval: 'P0Y0M0DT0H0M60S',
					scope: paymentPointer,
					expiry: yearInFuture,
					description: `ILPFlix ${selectedPlan.name} plan.`
				})
				const mandateId = data.id

				const state = Base64.encode(JSON.stringify({
					mandate: data,
					amount: selectedPlan.price.toString(),
					orderId: id
				}), true)

				// request authorization for mandate
				const authQuery = `?client_id=${OAUTH_CLIENT_ID}&response_type=code&scope=openid%20offline%20mandates.${mandateId}&state=${state}&redirect_uri=${OAUTH_CALLBACK_URL}`
				console.log('Mandate created. ', data)
				console.log('Redirecting to authorization endpoint to make an authorization request of:', authQuery.substring(1))

				window.location.href = serverMetaData.authorization_endpoint + authQuery
			} catch (error) {
				console.error('error', error)
			}
		}
	}

	return (
		<div className="max-w-xl h-full flex flex-col mx-auto mt-8">
			<div className="mx-auto">
				<div className="max-w-5xl mx-auto mt-8 text-4xl text-gray-800">
					Start watching on ILPFlix Now!
          </div>
				<div className="w-full mt-8">
					<div className="text-2xl text-gray-700 my-4">
						Select a plan
            </div>
					<div className="flex flex-col">
						{
							plans.map((plan, index) => {
								return (
									<div key={index} onClick={(event) => setSelectedPlanIndex(index)} className={"bg-white shadow-md h-24 rounded-lg flex px-4 py-4 mb-6 cursor-pointer border-2 hover:border-teal-500 " + (selectedPlanIndex === index ? "border-teal-500" : "")}>
										<div className="w-24 my-auto text-gray-900 font-bold">
											{plan.name}
										</div>
										<div className="flex-1 my-auto font-light">
											{plan.description}
										</div>
										<div className="w-32 flex mx-auto my-auto text-lg">
											${(plan.price / 100).toFixed(2)}/month
                      </div>
									</div>
								)
							})
						}
					</div>
				</div>
				<div className="">
					<PaymentMethodCard paymentPointer={paymentPointer} setPaymentPointer={setPaymentPointer} hide={hasPaymentRequest} paymentPointerError={paymentPointerError} />
					<div className="flex justify-center mx-auto max-w-xs mt-8">
						<button
							className="text-lg w-full font-semibold rounded-lg px-4 py-1 leading-normal bg-white border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white" onClick={subscribe}>
							{isSubmitting ? '...' : 'Subscribe'}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

Page.getInitialProps = async ({ req }) => {
	const id = nanoid()
	return {
		id
	}
}

export default Page
