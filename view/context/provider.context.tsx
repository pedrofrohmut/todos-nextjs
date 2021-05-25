import { ReactElement, ReactNode, useReducer } from "react"

import reducer from "./reducer.context"
import initialState from "./initial-state.context"
import AppContext from "./index"

export default function AppContextProvider ({ children }: { children: ReactNode }): ReactElement {
  const [ state, dispatch ] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
  )
}
