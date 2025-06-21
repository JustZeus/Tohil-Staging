import "./navbar.css"
import { useContext } from "react"
import { NavbarContext } from "./navbarContext"
import logo from "/src/assets/logo.png"
import { LoginContext } from "../../pages/login/loginContext"
import {ActionCloseContext} from "../../pages/dashboard/watchdetails/context/contextActionClose"

export default function Navbar(){
    const {menu, setMenu} = useContext(NavbarContext)
    const {login, setLogin} = useContext(LoginContext)
    const { actionClose,setActionClose } = useContext(ActionCloseContext);
    

    const go = () => {
        if(menu.page == 0){
            setMenu({page:1})
        }else{
            setMenu({page:0})
        }
        setActionClose({    
            closeAction:false,
            activeAction:0,
            data:actionClose.data,
            severity: actionClose.severity
        })
    }

    const goHome = () => {
        setMenu({page:0})
        setActionClose({    
            closeAction:false,
            activeAction:0,
            data:actionClose.data,
            severity: actionClose.severity
        })
    }

    const logout = () =>{
        if(login.loginConfirm){
            setLogin( {
                user: "",
                password: "",
                loginConfirm: false
            })
            setMenu({page:0})
        }else{
            setMenu({page:2})
        }
        setActionClose({    
            closeAction:false,
            activeAction:0,
            data:actionClose.data,
            severity: actionClose.severity
        })
 
    }

    return(
        <nav>
            <button className="logo" onClick={goHome}>
                <img src={logo} alt="" />
            </button>
            <div className="menu">
                <button onClick={go}>{menu.page == 1 ? "Home" :"Dash"}</button>
                <button onClick={logout}>{login.loginConfirm == true ? "Log Out" : "Log In"}</button>
            </div>
        </nav>
    )
}