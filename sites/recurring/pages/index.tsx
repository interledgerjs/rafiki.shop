import React, {  MouseEvent } from 'react'
import axios from 'axios'
import { NextPage } from "next"


const Page: NextPage = () => {
  const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID
  const OAUTH_CALLBACK_URL = process.env.OAUTH_CALLBACK_URL

  return (
    <div className="flex flex-1 flex-col">

    </div>
  )
}

Page.getInitialProps = async ({req}) => {
  return {}
}

export default Page
