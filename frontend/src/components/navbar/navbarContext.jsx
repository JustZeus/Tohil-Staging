import { createContext, useState } from 'react'

export const NavbarContext = createContext()

// page 0 = home
// page 1 = dash
export function NavbarProvider ({ children }) {
  const [menu, setMenu] = useState({
    page:0,
  })

  // console.log(menu)
  return (
    <NavbarContext.Provider value={{
        menu, 
        setMenu
    }}
    >
      {children}
    </NavbarContext.Provider>
  )
}