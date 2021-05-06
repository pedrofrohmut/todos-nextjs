import { ReactElement } from "react"
import { AppProps } from "next/app"

import "../shared/styles/globals.css"

const App = ({ Component, pageProps }: AppProps): ReactElement => <Component {...pageProps} />

export default App
