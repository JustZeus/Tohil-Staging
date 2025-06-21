export const testAlert = {
  "status": "success",
  "alerts": [
    {
      "sector": {
        "polygon": {
          "type": "Polygon",
          "coordinates": [
            [
              [-118.791915054976, 34.2598115571257],
              [-118.774120351502, 34.258874185577],
              [-118.769215283298, 34.2715741019052],
              [-118.780572210906, 34.2768036465917],
              [-118.79303557861, 34.2736269278103],
              [-118.791915054976, 34.2598115571257]
            ]
          ]
        },
        "id": "C2",
        "name": "Sector C2 - Simi Valley"
      },
      "telemetry": {
        "temperature": 22.99,
        "humidity": 56,
        "windSpeed": 4.02,
        "windDirection": "E",
        "fuelLoad": 96,
        "iotDeviceId": "sensor-SF01"
      },
      "acknowledged": {
        "status": true,
        "by": "Fire Dept Zone 1",
        "at": "2025-06-21T00:30:05.153Z"
      },
      "_id": "6855fd0d4c41a75531dffe01",
      "alertId": "ALRT-20250621-083",
      "title": "Confirmed Wildfire Near Urban Area",
      "severity": 4,
      "recommendations": [
        "Location: Simi Valley\nRisk Level: Moderate\n\n- Temperature: 22.99°C\n- Humidity: 56%\n- Wind Speed: 4.02 m/s\n- Weather: Clear\n- Air Quality Index: 2 (Good)\n\nInsights:\n- Low risk of wildfire due to clear weather and good air quality.\n- Traffic incident with road closure ongoing, affecting accessibility in the area.\n- Monitor for any changes in weather conditions and road closure updates.\n\nRecommendation:\n- Stay alert for any updates on the road closure affecting the area.\n- Maintain awareness of surroundings despite current low wildfire risk."
      ],
      "createdAt": "2025-06-21T00:30:05.153Z",
      "updatedAt": "2025-06-21T00:30:05.153Z",
      "__v": 0
    },
    {
      "sector": {
        "polygon": {
          "type": "Polygon",
          "coordinates": [
            [
              [-117.652611846515, 34.0757172119796],
              [-117.666296963861, 34.0658915106757],
              [-117.656441292542, 34.0551812293943],
              [-117.643175723489, 34.0563205312125],
              [-117.638385420552, 34.0680280082457],
              [-117.652611846515, 34.0757172119796]
            ]
          ]
        },
        "id": "C9",
        "name": "Sector C9 - Ontario"
      },
      "telemetry": {
        "temperature": 26.2,
        "humidity": 50,
        "windSpeed": 8.94,
        "windDirection": "NE",
        "fuelLoad": 54,
        "iotDeviceId": "sensor-SD01"
      },
      "acknowledged": {
        "status": false,
        "by": "Fire Dept Zone 1",
        "at": "2025-06-21T00:30:05.149Z"
      },
      "_id": "6855fd0d4c41a75531dffe00",
      "alertId": "ALRT-20250621-106",
      "title": "Elevated Risk Detected in Brush Zone",
      "severity": 2,
      "recommendations": [
        "Location: Ontario\n- Temperature: 26.2°C, Humidity: 50%\n- Wind Speed: 8.94 m/s, Clear sky\n- AQI: 2, Good air quality\n\nRisk: Moderate risk of wildfires due to dry conditions and moderate wind speed. Road closures may impact emergency response.\n\nRecommendation: Monitor closely for any signs of smoke or fire. Ensure alternative routes for emergency vehicles due to road closures."
      ],
      "createdAt": "2025-06-21T00:30:05.149Z",
      "updatedAt": "2025-06-21T00:30:05.149Z",
      "__v": 0
    },
    {
      "sector": {
        "polygon": {
          "type": "Polygon",
          "coordinates": [
            [
              [-118.314219306388, 34.1901012307494],
              [-118.320469266073, 34.1795706707239],
              [-118.310222584572, 34.1749987783512],
              [-118.295318560145, 34.1746536489367],
              [-118.297806304335, 34.1894542346874],
              [-118.314219306388, 34.1901012307494]
            ]
          ]
        },
        "id": "C1",
        "name": "Sector C1 - Burbank"
      },
      "telemetry": {
        "temperature": 24.47,
        "humidity": 59,
        "windSpeed": 6.17,
        "windDirection": "NE",
        "fuelLoad": 84,
        "iotDeviceId": "sensor-LA01"
      },
      "acknowledged": {
        "status": false,
        "by": "Fire Dept Zone 2",
        "at": "2025-06-21T00:30:05.144Z"
      },
      "_id": "6855fd0d4c41a75531dffdff",
      "alertId": "ALRT-20250621-182",
      "title": "Confirmed Wildfire Near Urban Area",
      "severity": 3,
      "recommendations": [
        "Location: Burbank\n- Temperature: 24.47°C\n- Humidity: 59%\n- Wind Speed: 6.17 m/s\n- Weather: Clear\n- Air Quality Index: 2 (Good)\n- Traffic Incident 1: Minor congestion at Olive Ave/Verdugo Ave, backed-up traffic, approach with care (Started at 00:09, ends at 00:37)\n- Traffic Incident 2: Minor congestion at Burbank Blvd/Exit 146B, backed-up traffic with average speeds of 10 km/h, approach with care (Started at 00:27, ends at 00:37)"
      ],
      "createdAt": "2025-06-21T00:30:05.144Z",
      "updatedAt": "2025-06-21T00:30:05.144Z",
      "__v": 0
    }
  ]
}