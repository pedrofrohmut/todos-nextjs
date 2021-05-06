import { ReactElement } from "react"
import { AppProps } from "next/app"

import "../shared/styles/globals.css"
import "../shared/styles/classes.css"
import "../shared/styles/colors.css"

const App = ({ Component, pageProps }: AppProps): ReactElement => (
  <Component {...pageProps} className="app-component" />
)

export default App
