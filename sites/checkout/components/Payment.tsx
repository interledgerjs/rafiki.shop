import * as React from 'react'
import { Coffee } from '.'

const CartItem: React.FC = () => {

  return (
    <div className="flex py-2 mx-8 bg-secondary border items-center border-dark">
      <div className="w-1/4">
        <Coffee size={75}/>
      </div>
      <div className="w-2/4 px-2">
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
