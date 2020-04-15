// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html className="w-full h-full">
        <Head>
          <title>ILP Eats</title>
          <link rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Rubik"/>
        </Head>
      <body className="w-full h-full bg-gray-200">
        <Main />
      <NextScript />
      </body>
      </Html>
    )
  }
}

export default MyDocument
