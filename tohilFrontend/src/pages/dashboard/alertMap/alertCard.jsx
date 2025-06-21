import { useContext } from "react";
import { ActionCloseContext } from "../watchdetails/context/contextActionClose";
import {time, color} from "../const"
import { AlertDetailsContext } from "../alertMap/context/contextAlertInfo";
import { LoginContext } from "../../login/loginContext";
import {dashAlert } from "../images/img"


export function AlertList({alert_list}){
    return(
        alert_list.map(alert => (
            <CardAlert 
                key={alert.alertId}
                id={alert.alertId}
                severity={alert.severity}
                acknowledged={alert.acknowledged}
                title={alert.title}
                telemetry={alert.telemetry}
                sector={alert.sector}
                recommendations={alert.recommendations}
                createdAt={alert.createdAt}
            />
        ))
    )
}

function CardAlert({id, severity, acknowledged, title, telemetry, sector,recommendations, createdAt}){
    const { setActionClose } = useContext(ActionCloseContext);
    const {alertDetails, setAlertDetails} = useContext(AlertDetailsContext);
    const {login, setLogin} = useContext(LoginContext)

    function acknowledgedData(){
    }

    function viewDetails(recommend, severity){
        setActionClose({
            closeAction:false,
            activeAction:1,
            data: recommend[0],
            severity: severity
        });

    }

    function viewMap(){
        setAlertDetails({coordinates:sector.polygon.coordinates[0], name: sector.name, severity:severity })
    }
    return(
        <>
                <div className="alertElement" style={{border:"8px solid " + color(severity)}}>
                    <div className="idAlert">                    
                        <p >{id}</p>
                        <div style={{display: severity != 4 && "none"}}><img src={dashAlert.alertImg2} alt="" /></div>
                    </div>
                    <h3 style={{color: color(severity)}}>Hazard level {severity}</h3>
                    <h4>{title}</h4>
                    <h5>Description</h5>
                    <div className="descriptList">
                        <div>
                            <span>Temperature</span>
                            <span>{telemetry.temperature}° C</span>
                        </div>
                        <div>
                            <span>Humidity</span>
                            <span>{telemetry.humidity} (g/m³)</span>
                        </div>
                        <div>
                            <span>Wind Speed</span>
                            <span>{telemetry.windSpeed} (m/s)</span>
                        </div>
                        <div>
                            <span>Wind Direction</span>
                            <span>{telemetry.windDirection}</span>
                        </div>
                    </div>
                    <p>Hazardous environmental conditions in {sector.name}.</p>
                    <p style={{display: severity <= 2 && "none"}}>The vision system has detected a smoldering fire.</p>
                    <p>Alert detected: {time(createdAt)} </p>
                
                    <div className="buttonsAlert">
                        <button onClick={viewMap}>View Map</button>
                        <button onClick={() => viewDetails(recommendations, severity)}>More Info</button>
                    </div>

                    {
                        acknowledged.status == true ?
                            <p id="acknowledged">{"Acknowledged by " + acknowledged.by + " at " + time(acknowledged.at) }</p>
                        :
                        login.loginConfirm == false?
                        <p id="acknowledged" style={{color: color(severity)}} >Not acknowledged</p>
                        : <div className="notAcknowledged"><button style={{color: color(severity)}} onClick={acknowledgedData} >Not acknowledged</button></div>
                    }
                </div>
        </>
    )
}

