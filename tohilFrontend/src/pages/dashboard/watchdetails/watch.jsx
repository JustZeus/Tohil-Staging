import "./watch.css"
import { useContext } from 'react'
import { ActionCloseContext } from "./context/contextActionClose";
import {color} from "../const"
// import { AlertDetailsContext} from "../alertMap/context/contextAlertInfo"



export function Watch(){
    const { actionClose, setActionClose } = useContext(ActionCloseContext);
    // const {} = useContext( AlertDetailsContext)
    // console.log(actionClose.data.split("\n"))
    let data = actionClose.data.split("\n");

    function handeleNullAction(){
        setActionClose({closeAction: true, activeAction:1, data:actionClose.data, severity: actionClose.severity })
    }

    return(
        <div className="watch">
            <div className="headerWatch">
                <h3 style={{color:color(actionClose.severity)}}>Details</h3>
                <div>
                    <button onClick={() => handeleNullAction()} alt="Cerrar">   <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 1.875C7.6875 1.875 1.875 7.6875 1.875 15C1.875 22.3125 7.6875 28.125 15 28.125C22.3125 28.125 28.125 22.3125 28.125 15C28.125 7.6875 22.3125 1.875 15 1.875ZM15 26.25C8.8125 26.25 3.75 21.1875 3.75 15C3.75 8.8125 8.8125 3.75 15 3.75C21.1875 3.75 26.25 8.8125 26.25 15C26.25 21.1875 21.1875 26.25 15 26.25Z" fill="#696969"/>
                    <path d="M20.0625 21.5625L15 16.5L9.9375 21.5625L8.4375 20.0625L13.5 15L8.4375 9.9375L9.9375 8.4375L15 13.5L20.0625 8.4375L21.5625 9.9375L16.5 15L21.5625 20.0625L20.0625 21.5625Z" fill="#696969" />
                    </svg></button>
                </div>
            </div>     
            {/* <div className="details">
                {actionClose.data}
            </div> */}
        
            {/* <div className="details">
                {data.map((detail, index) => (
                    <p key={index} style={{color:index == 0 && "#0a2a43", fontWeight: index == 0&& "bold"}}> {detail}</p>
                ))}
            </div>        */}

            <div className="details">
                {data.map((item, index) => {
                    let className = "line";

                    if (item.trim() === "") {
                    className = "line empty";
                    } else if (item.startsWith("Location:")) {
                    className = "line location";
                    } else if (item.startsWith("-")) {
                    className = "line detail";
                    } else if (item.startsWith("Insights:")) {
                    className = "line section";
                    } else if (item.startsWith("Recommendations:")) {
                    className = "line section";
                    } else if (/^\d\./.test(item)) {
                    className = "line bullet";
                    }

                    return (
                    <div key={index} className={className}>
                        {item.trim() === "" ? <>&nbsp;</> : item}
                    </div>
                    );
                })}
                </div>
        </div>
    )
}