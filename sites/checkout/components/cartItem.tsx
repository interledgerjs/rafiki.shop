import * as React from 'react'
import { Coffee } from '.'

const CartItem: React.FC = () => {

  return (
    <div className="flex py-2 md:py-0 mx-8 md:mx-0 bg-secondary md:bg-transparent border items-center border-dark md:border-none max-w-sm mx-auto">
      <div className="w-1/4 md:hidden">
        <Coffee size={75}/>
      </div>
      <div className="w-2/4 md:w-3/4">
        <div className="text-xl">
          Digital Coffee
        </div>
        <div className="text-sm">
        Coffee delivered<br/>via email.
        </div>
      </div>
      <div className="w-1/4 text-center">
        $ 5.00
      </div>
    </div>
  )
}

export default CartItem
