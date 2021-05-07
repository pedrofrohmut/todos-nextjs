import { ReactElement } from "react"
import { AppProps } from "next/app"
import Head from "next/head"

import "../shared/styles/globals.css"
import "../shared/styles/classes.css"
import "../shared/styles/colors.css"

const App = ({ Component, pageProps }: AppProps): ReactElement => (
  <>
    <Head>
      <title>Todos App</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Todos App with next js and backend all in one" />
      <meta name="keywords" content="Todos, Next, NextJS, API Routes" />
    </Head>
    <Component {...pageProps} className="app-component" />
  </>
)

export default App
