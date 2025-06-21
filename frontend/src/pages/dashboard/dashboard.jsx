import { useContext } from "react"
import "./dashboard.css"
import Navbar from "../../components/navbar/navbar"
import {CustomSelect} from "../../components/selectComponent/customSelect"
import {useAlertInfo} from "../../hooks/customAlert"
import {AlertList} from "./alertMap/alertCard"
import { ActionSelectionApp } from "./watchdetails/actionSelection"
import MapWithPolygon from "./alertMap/map"
import { AlertDetailsContext } from "./alertMap/context/contextAlertInfo"
import {  useFilters } from "../../components/selectComponent/useFiltersSeach";
import { dashAlert } from "./images/img"


export function DashboardApp(){

    return(
        <>
        <div className="dashboardApp">
            <ActionSelectionApp />
            <DashboardSection />
        </div>
        </>
    )
}

function DashboardSection(){
    const {alertInfo} = useAlertInfo()
    const {alertDetails} = useContext(AlertDetailsContext)
    const { filterAlert} = useFilters()
    const filtered = filterAlert(alertInfo.alerts)

    return(
        <>

            <Navbar/>
            <div className="dashboardSection">
                <div className="alertsSection">
                    <div className="selectionZone">
                        <CustomSelect options={alertInfo.alerts}/>
                    </div>
                    <div className="alertsList">
                        <AlertList alert_list={filtered}/>
                    </div>
                </div>
                  
                <div className="mapsShow">
                    <div className="head">
                        <h2>Alert located on the map: <span>{alertDetails.name}</span></h2>
                        <div>
                            <img src={dashAlert.alertImg} alt="" />
                            <p>WARNING THIS DEMONSTRATION USES A COMBINATION OF REAL AND SIMULATED DATA AND TELEMETRY</p>
                        </div>
                    </div>
                    <MapWithPolygon dataMap={alertDetails}/>
                </div>
                
            </div>
        </>
    )
}