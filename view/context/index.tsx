import { createContext } from "react"

import initialState from "./initial-state.context"
import { AppContextType, DispatchType } from "./types.context"

const initialDispatch: DispatchType = () => undefined

const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: initialDispatch
})

export default AppContext
