import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render (): JSX.Element {
    return (
      <Html lang="es">
        <Head>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>
        </Head>

        <body>
        <Main/>
        <NextScript/>
        </body>
      </Html>
    )
  }
}

export default MyDocument
