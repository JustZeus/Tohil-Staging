import { useContext } from 'react'
import './App.css'
import {Login} from "./pages/login/login"
import { LoginProvider, LoginContext} from "./pages/login/loginContext"
import { HomeApp } from './pages/home/home'
import {NavbarProvider, NavbarContext} from "./components/navbar/navbarContext"
import { DashboardApp } from './pages/dashboard/dashboard'
import { OptionSelectProvider } from './components/selectComponent/context/selectContext'
import { ActionsCloseProvider} from './pages/dashboard/watchdetails/context/contextActionClose'
import { AlertDetailsProvider } from './pages/dashboard/alertMap/context/contextAlertInfo'
import { FiltersProvider } from './components/selectComponent/context/contextSearch'

function PageSelected(){
  const {menu} = useContext(NavbarContext);

  if(menu.page == 0){
    return(
      <HomeApp />
    )
  }else if(menu.page == 1){
    return(
      <DashboardApp />
    )
  }else{
    return(
      <Login /> 
    )
  }
}

function Page(){
  const { login, setLogin} = useContext(LoginContext)
 
  return(
    <>
      {
        (login.user == "admin" && login.password == "Tanji2025") &&
        <PageSelected/>      }
    </>
  )
}


function App() {

  return (
    <>
      <LoginProvider>
        <NavbarProvider>
          <OptionSelectProvider>
          < ActionsCloseProvider >
          <AlertDetailsProvider>
            <FiltersProvider>

            <PageSelected/>

            </FiltersProvider>
          </AlertDetailsProvider>
          </ ActionsCloseProvider >
          </OptionSelectProvider>
        </NavbarProvider>
      </ LoginProvider>
     
    </>
  )
}

export default App
