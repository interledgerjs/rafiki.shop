import React from 'react'
import { NextPage } from "next"

const openUrl = (url:string) => {
  // @ts-ignore
  const win = window.open(url, '_blank')
  win.focus()
}

const Page: NextPage = () => {

  return (
    <div className="flex flex-1 flex-col mb-16">
      <div className="max-w-5xl mx-auto mt-8 text-4xl text-gray-800">
        Rafiki Shop
      </div>
      <div className="max-w-md flex flex-col shadow-lg rounded-lg bg-white mx-auto px-4 py-4 mt-16 w-full cursor-pointer"
           onClick={() => openUrl('https://eats.rafiki.shop')}
      >
        <div className="font-semibold text-lg text-gray-800">
          Checkout - https://eats.rafiki.shop
        </div>
        <div className="text-gray-700 mx-4 mt-2">
          <ul className="list-disc">
            <li>
              Merchant initiated payment
            </li>
            <li>
              Traditional online checkout flow
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-md flex flex-col shadow-lg rounded-lg bg-white mx-auto px-4 py-4 mt-12 w-full cursor-pointer"
           onClick={() => openUrl('https://flix.rafiki.shop')}
      >
        <div className="font-semibold text-lg text-gray-800">
          Recurring Payments - <a>https://flix.rafiki.shop</a>
        </div>
        <div className="text-gray-700 mx-4 mt-2">
          <ul className="list-disc">
            <li>
              Merchant initiated subscription
            </li>
            <li>
              User authorizes a mandate to the Merchant within the scope of the subscription
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-md flex flex-col shadow-lg rounded-lg bg-white mx-auto px-4 py-4 mt-12 w-full">
        <div className="font-semibold text-lg text-gray-800">
          Tipping Example - Coming soon...
        </div>
        <div className="text-gray-700 mx-4 mt-2">
          <ul className="list-disc">
          <li>
              Example of authorization and application to perform transactions on users behalf
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Page
