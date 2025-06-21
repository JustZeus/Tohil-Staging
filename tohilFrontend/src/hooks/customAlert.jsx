import { useState, useEffect } from 'react'
// import {testAlert} from "./alertTest"

// Address to which the GET request will be made
let API_ALERT_INFO = 'https://tohil-staging.azurewebsites.net/v1/alerts/last'


export function useAlertInfo() {
  const [alertInfo, setAlertInfo] = useState({
    status: "success",
    alerts: [{
      alertId: "ALRT-20250614-032",
      title: "Confirmed Wildfire Near Urban Area",
      severity: 4,
      sector: {
        id: "C2",
        name: "Sector C2 - North Hills",
        polygon: {
          type: "Polygon",
          coordinates: [
            [
              [-99.1334, 19.4326],
              [-99.1320, 19.4335],
              [-99.1315, 19.4318],
              [-99.1334, 19.4326]
            ]
          ]
        }
      },
      telemetry: {
        temperature: 42,
        humidity: 10,
        windSpeed: 33,
        windDirection: "NW",
        fuelLoad: 88,
        iotDeviceId: "iot-00214"
      },
      acknowledged: {
        status: true,
        by: "Fire Dept Zone 3",
        at: "2025-06-14T21:30:00Z"
      },
      recommendations: [
        "Evacuate if near forest edge",
        "Avoid outdoor activity"
      ],
      createdAt: "2025-06-14T21:00:00Z",
      updatedAt: "2025-06-14T21:30:00Z"
    }]
  });

  const fetchAlertInfo = () => {
    fetch(API_ALERT_INFO, { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        console.log('Alerta actualizada:', data);
        setAlertInfo(data);
      })
      .catch(err => console.error('Error al obtener alertas:', err));
  };

  useEffect(() => {
    fetchAlertInfo(); // fisrt call

    const interval = setInterval(() => {
      fetchAlertInfo();
    }, 10 * 60 * 1000); // 10 min

    return () => clearInterval(interval); // clean component
  }, []);

  return { alertInfo };
}

