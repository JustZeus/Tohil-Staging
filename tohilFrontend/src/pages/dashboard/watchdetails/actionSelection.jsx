import {Watch} from "./watch"
import { ActionCloseContext} from "./context/contextActionClose"
import { useContext } from 'react'


export function ActionSelectionApp() {
    const {actionClose} = useContext(ActionCloseContext);
    
        return (
            <div>
                <div className={actionClose.closeAction == false ? "backtable" : "confirmActionClose"} style={{display:actionClose.activeAction == 0 && "none"}}></div>
                <div className={actionClose.closeAction == false ? "confirmAction" : "confirmActionClose"} style={{display:actionClose.activeAction == 0 && "none"}}>
                    <Watch/>
                </div>
            </div>
        )
    

}