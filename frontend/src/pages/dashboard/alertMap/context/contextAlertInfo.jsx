import { createContext, useState } from 'react'

// Este es el que tenemos que consumir
export const AlertDetailsContext = createContext()

// Este es el que nos provee de acceso al contexto
export function AlertDetailsProvider ({ children }) {
  const [alertDetails, setAlertDetails] = useState({
    coordinates: [],
    name: "",
    severity: 0,
  })

  return (
    <AlertDetailsContext.Provider value={{
      alertDetails,
      setAlertDetails
    }}
    >
      {children}
    </AlertDetailsContext.Provider>
  )
}