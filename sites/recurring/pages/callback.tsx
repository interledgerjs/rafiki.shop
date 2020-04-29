import { NextPage } from 'next'
import { Base64 } from 'js-base64'
import { useEffect, useState } from 'react'
import axios from 'axios'
import nanoid from 'nanoid'

type Props = {
	state: {
		mandate: any,
		amount: string,
		orderId: string
	},
	code: string
}

type PaymentInfo = {
	paymentNumber: number,
	date: string,
	time: string,
	amount: number,
	status: 'processing' | 'error' | 'complete'
}

type PaymentStatus = 'processing' | 'error' | 'complete'

const dateString = () => {
	let today = new Date();
	let dd = String(today.getDate()).padStart(2, '0');
	let mm = String(today.getMonth() + 1).padStart(2, '0');
	let yyyy = today.getFullYear();
	return (mm + '/' + dd + '/' + yyyy)
}

const timeString = () => {
	let today = new Date();
	let min = String(today.getMinutes()).padStart(2, '0')
	let hrs = String(today.getHours()).padStart(2, '0')
	let sec = String(today.getSeconds()).padStart(2, '0')
	return (hrs + ':' + min + ':' + sec)
}

const renderStatusTable = (paymentArr) => {
	const newarr = paymentArr.map((el: PaymentInfo, index: number) => (
		<tr key={index}>
			<td>{el.paymentNumber}</td>
			<td>{el.date}</td>
			<td>{el.time}</td>
			<td>{el.amount}</td>
			<td>{el.status}</td>
		</tr>
	))
	return (
		<table className="w-full table-fixed">
			<thead>
				<tr className="text-left">
					<th className="w-1/12">No</th>
					<th>Date</th>
					<th>Time</th>
					<th>Amount</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>{newarr}</tbody>
		</table>
	)
}

const Page: NextPage<Props> = ({ state, code }) => {

	const [paymentState, setPaymentStatus] = useState<PaymentStatus>('processing')
	const [attemptId, setAttemptId] = useState<string>('');
	const [payment, setPayment] = useState<PaymentInfo[]>([])
	const [transactionTable, setTransactionTable] = useState()
	const [access_token, setAccess_token] = useState('')
	const [fetch_token, setFetch_token] = useState(true)
	const [interval, setMyInterval] = useState()

	const executePayment = (accesstoken: string) => {
		setPaymentStatus('processing')
		setPayment(payment)
		axios.post('/api/payment', {
			mandate: state.mandate.name,
			amount: state.amount,
			access_token: accesstoken
		}).then(() => {
			console.log("payment complete")
			setPaymentStatus('complete')
			payment[payment.length - 1].status = 'complete'
			setPayment(payment)
		}).catch(error => {
			console.log('error processing payment', error)
			setPaymentStatus('error')
			payment[payment.length - 1].status = 'error'
			setPayment(payment)
		})
	}

	useEffect(() => {
		payment.push({
			paymentNumber: payment.length,
			date: dateString(),
			time: timeString(),
			amount: (parseInt(state.amount)) / 100,
			status: 'processing'
		})
		if (payment.length >= 6) {
			clearInterval(interval)
		}
		if (fetch_token) {
			axios.post('/api/fetchaccess', {
				code
			}).then(response => {
				console.log('successfully retrieved token')
				setAccess_token(response.data.access_token)
				setFetch_token(false)
				executePayment(response.data.access_token)
			}).catch(error => {
				console.log('unable to retrieve token', error)
				setPaymentStatus('error')
				payment[payment.length - 1].status = 'error'
				setPayment(payment)
			})
		} else {
			executePayment(access_token)
		}
	}, [attemptId])

	useEffect(() => {
		setTransactionTable(renderStatusTable(payment))
	}, [paymentState])

	useEffect(() => {
		setTimeout(() => {
			setMyInterval(setInterval(() => setAttemptId(nanoid()), 60000))
		}, 1000)
	}, [])

	return (
		<div className="mx-auto bg-white shadow rounded max-w-lg mt-8 px-4 py-6">
			<div>
				<div className="text-2xl text-gray-800 font-400">
					Subscription
        </div>
				<div className="flex my-6">
					<div className="flex-1 leading-tight">
						<div className="text-gray-500 text-sm">
							Subscription reference
            </div>
						<div>
							{state.orderId}
						</div>
					</div>
				</div>
			</div>
			{
				transactionTable
			}
		</div>
	)
}

Page.getInitialProps = async ({ query }) => {
	const { code, state } = query

	const decodedState = JSON.parse(Base64.decode(state))

	console.log('query', query)
	console.log('decoded state:', decodedState)

	return {
		state: decodedState,
		code: code.toString()
	}
}

export default Page
