import {loginImg} from "./img/img"
import { useState, useContext } from "react"
import {LoginContext} from "./loginContext"
import "./login.css"
import { NavbarContext } from "../../components/navbar/navbarContext"


export function Login(){
    const { login, setLogin} = useContext(LoginContext)
    const [ viewPassword, setViewPassword] = useState({type:"password", image:loginImg.lockIcon});
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const {setMenu} = useContext(NavbarContext);


    function lockFunc(p){
        const pwd = document.getElementById(p);
        if (pwd.type == 'password'){
            setViewPassword({type: "text" ,image:loginImg.unlockIcon})
        }else if(pwd.type == 'text'){
            setViewPassword({type: "password", image: loginImg.lockIcon})
        }
    }

    const logInUser = () => {
        setLogin({ user: user, password: password, loginConfirm: true})
        setMenu({page:1})
        
    };

    return(
        <div className="loginSection">
            <div className="wrapper">
                <div className="brand">
                    <div><img src={loginImg.flame} alt="" /></div>
                    <p>TOHIL</p>
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault(); 
                    logInUser();        
                }}>
                    <h3>Welcome</h3>
                    <h1>Monitoring and Alert Platform</h1>
                    <div className="input-box">
                        <input placeholder="User" id="user" value={user} onChange={(e) => setUser(e.target.value)} />
                        <img className="iconLogin" src={loginImg.user} alt="" />
                    </div>
                    <div className="input-box">
                        <input type={viewPassword.type} placeholder="Password" id="pwd" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <img onClick={() => lockFunc("pwd")} className="iconLogin pwd" src={viewPassword.image} alt="" />
                    </div>
                    <button  type="submit" className="btn">Log in</button>
                </form>
            </div>                
            <div className="burbujas">
                <div className="burbuja"></div>
                <div className="burbuja"></div>
                <div className="burbuja"></div>
                <div className="burbuja"></div>
                <div className="burbuja"></div>
                <div className="burbuja"></div>
                <div className="burbuja"></div>
                <div className="burbuja"></div>
            </div>
        </div>
    )
}