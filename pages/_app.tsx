import { ReactElement } from "react"
import { AppProps } from "next/app"
import Head from "next/head"

import AppContextProvider from "../view/context/provider.context"

import Navbar from "../view/components/layout/navbar"

import "../view/styles/classes.css"
import "../view/styles/colors.css"
import "../view/styles/globals.css"

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  return (
    <>
      <Head>
        <title>Todos App</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Todos App with next js and backend all in one" />
        <meta name="keywords" content="Todos, Next, NextJS, API Routes" />
      </Head>
      <AppContextProvider>
        <Navbar />
        <Component {...pageProps} className="app-component" />
      </AppContextProvider>
    </>
  )
}

export default App
