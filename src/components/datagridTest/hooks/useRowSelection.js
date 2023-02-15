import React from 'react';
import { createContext, useContext } from "react"

const RowSelectionContext = createContext(undefined)

export const RowSelectionProvider = RowSelectionContext.Provider

const RowSelectionChangeContext = createContext(undefined) // eslint-disable-next-line @typescript-eslint/no-explicit-any

export const RowSelectionChangeProvider = RowSelectionChangeContext.Provider

export function useRowSelection() {
  const rowSelectionContext = useContext(RowSelectionContext)
  const rowSelectionChangeContext = useContext(RowSelectionChangeContext)

  if (
    rowSelectionContext === undefined ||
    rowSelectionChangeContext === undefined
  ) {
    throw new Error("useRowSelection must be used within DataGrid cells")
  }

  return [rowSelectionContext, rowSelectionChangeContext]
}
