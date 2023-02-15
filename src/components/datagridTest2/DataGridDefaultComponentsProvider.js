import { createContext, useContext } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataGridDefaultComponentsContext = createContext(undefined)

export const DataGridDefaultComponentsProvider =
  DataGridDefaultComponentsContext.Provider

export function useDefaultComponents() {
  return useContext(DataGridDefaultComponentsContext)
}
