import React, { useState, useMemo, FC, useRef, useEffect } from 'react'
import axios from 'axios'
import { NextPage } from "next"
import nanoid from 'nanoid'
import { Base64 } from 'js-base64'
import useForm from 'react-hook-form'
import getConfig from 'next/config'
import { OpenPaymentsButton } from '../components/open-payments-button'
import QRCode from 'qrcode.react'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { CheckmarkOutline } from '../components/icons/checkmark-outline'
import { Decor, CartItem, TextInput } from '../components'

const methodName = process.env.METHOD_NAME || 'https://rafiki.money'

const { publicRuntimeConfig } = getConfig()

const toVisibileValue = (amount: number) => {
  return (amount / 100).toFixed(2)
}

type Props = {
  id: string
}

const Checkout: NextPage<Props> = ({ id }) => {
  const {register, handleSubmit, errors, setError, clearError} = useForm()
  const formRef = useRef<HTMLFormElement>(null)

  const onSubmit = async data => {
    if (validateEmail({ target: { value: data.username } })) {
      // const login = await usersService.login(data.username, data.password, login_challenge).then(resp => {
      //   if(resp.redirectTo) {
      //     window.location.href = resp.redirectTo
      //   }
      // }).catch(async (error) => {
      //   console.log(error)
      //   const body = await error.response.json()
      //   body.errors.forEach((el) => {
      //     if (el.field === 'username')
      //       setError('username', 'usernameError', el.message)
      //     else if (el.field === 'password')
      //       setError('password', 'passwordError', el.message)
      //   })
      // })
    }
  }
  const validateEmail = e => {
    const emailRegex = RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)
    if (!emailRegex.test(e.target.value)) {
      // setError("username", "invalidEmail", "Please submit a valid email address")
      return (false)
    }
    return (true)
  }

  return (
    <div className="relative overflow-hidden w-full">
      <Decor/>
      {/* CART */}
      <div className="container justify-between mx-auto flex w-screen h-screen flex-col leading-tight text-dark">
        <div>
          <div className="flex px-8 py-16 flex-shrink">
            <div className="flex flex-col justify-center p-4">
              <p className="text-4xl">
                Cart
              </p>
            </div>
          </div>
          <CartItem/>
        </div>
        <div className="flex flex-col p-8">
            <form ref={formRef} className='w-full max-w-xs' onSubmit={handleSubmit(onSubmit)}>
            <div className=''>
              {/* <TextInput
                errorState={errors.username != undefined}
                validationFunction={validateEmail}
                inputRef={(register({required: true}))}
                name='username'
                label='Email'
                bgColour='surface'
                hint={errors.username ? errors.username.type==='required' ? 'Email required' : (errors.username.message) as string : undefined}
              /> */}
              <TextInput
                errorState={false}
                validationFunction={validateEmail}
                inputRef={(register({required: true}))}
                name='username'
                label='Email'
                bgColour='secondary'
                hint={'Email is required to receive your coffee'}
                />
            </div>
                <OpenPaymentsButton/>
          </form>
          <p className="text-xs text-center mt-2">
            Powered by <a></a>Open Payments and rafiki.money
          </p>
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
