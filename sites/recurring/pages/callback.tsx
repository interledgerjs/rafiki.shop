import { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    null
  )
}

Page.getInitialProps = async ({query}) => {
  const {code, state} = query
  console.log(code, state)
  return {}
}

export default Page
