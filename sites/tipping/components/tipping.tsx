import React, {FC, useState} from 'react'
import { ToggleLayer, anchor } from "react-laag"

const amounts = [
  10,
  20,
  50
]

const sendPayment = async (close: any) => {
  try {
    const request = new PaymentRequest(
      [{supportedMethods: "https://rafiki.money"}],
      {total: {label: "Payment", amount: {currency: "USD", value: "0.10"}}});
    const response = await request.show();
    await response.complete("success");
  } catch (e) {
    console.log(e)
  }
  console.log("SEND THE MONEY!!!"); close()
}

const Tipping: FC = () => {

  const [amount, setAmount] = useState(10)

  return (
    <ToggleLayer
      closeOnOutsideClick={true}
      placement={{anchor: anchor.TOP_CENTER}}
      renderLayer={({layerProps, isOpen, close}) =>
        // only render on `isOpen`
        isOpen && (
          <div
            // for calculation stuff
            ref={layerProps.ref}
            style={{
              // inject calculated positional styles
              ...layerProps.style,
            }}
            className="bg-gray-400 shadow-lg rounded-lg text-sm"
          >
            <div className="flex justify-between mx-4 my-4">
              {
                amounts.map(amt => {
                  return (
                    <div key={amt} className="flex-1 text-center my-auto mx-2 w-16">
                      <div
                        onClick={() => setAmount(amt)}
                        className={`${amount === amt ? 'bg-green-300' : 'bg-white'} px-2 py-2 rounded-lg shadow-md hover:bg-green-100 cursor-pointer`}>
                        $ {(amt/100).toFixed(2)}
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className="justify-center flex my-2">
              <button
                onClick={() => sendPayment(close)}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-full shadow">
                Send
              </button>
            </div>
          </div>
        )
      }
    >
      {({toggle, triggerRef}) => (
        <div
          className="cursor-pointer"
          ref={triggerRef}
          onClick={toggle}
        >
          <img src="/icon_ilp.png"/>
        </div>
      )}
    </ToggleLayer>
  )
}

export default Tipping
