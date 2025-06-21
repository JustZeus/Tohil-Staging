import { createContext, useState } from 'react'

// Este es el que tenemos que consumir
export const ActionCloseContext = createContext()

// Este es el que nos provee de acceso al contexto
export function ActionsCloseProvider ({ children }) {
  const [actionClose, setActionClose] = useState({
    closeAction:false,
    activeAction:0,
    data: "Location: Burbank\n- Temperature: 19.49°C\n- Humidity: 78%\n- Wind Speed: 3.6 m/s\n- Weather: Clear\n- Air Quality Index: 2 (Good)\n- Traffic Incident: Road closure (critical)\n- Road closed from 2025-06-19 21:58 UTC to 2025-06-21 03:58 UTC\n\nInsights:\n1. Weather conditions are favorable for fire spread.\n2. Low air quality may affect respiratory health.\n3. Road closure hinders emergency response access.\n4. Monitor closely for potential wildfire ignition due to dry conditions." ,
    severity: 0
  })

  // console.log(actionClose)
  return (
    <ActionCloseContext.Provider value={{
      actionClose,
      setActionClose
    }}
    >
      {children}
    </ActionCloseContext.Provider>
  )
}