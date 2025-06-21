import { GoogleMap, useJsApiLoader, Polygon } from '@react-google-maps/api';
import { useState, useRef, useEffect } from 'react';

const API_KEY_MAPS = "AIzaSyCK081LMXzZgyMVShckGsxskG9XKs9imD0"; // Coloca tu clave aquí
const LIBRARIES = ['places']; // ✅ definido fuera del componente

const containerStyle = {
  width: '100%',
  height: 'calc(100% - 105px)'
};

const defaultCenter = { lat: 19.4326, lng: -99.1334 };

const polygonOptions = {
  fillColor: '#FF0000',
  fillOpacity: 0.4,
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  clickable: true,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
};

const MapWithPolygon = ({ dataMap }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY_MAPS,
    libraries: LIBRARIES, // ✅ usa constante
  });

  const [polygonPath, setPolygonPath] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    if (dataMap?.coordinates?.length > 0) {
      const path = dataMap.coordinates.map(([lng, lat]) => ({ lat, lng }));
      setPolygonPath(path);
    }
  }, [dataMap]);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    if (polygonPath.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      polygonPath.forEach(point => bounds.extend(point));
      map.fitBounds(bounds);
    }
  };

  useEffect(() => {
    if (mapRef.current && polygonPath.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      polygonPath.forEach(point => bounds.extend(point));
      mapRef.current.fitBounds(bounds);
    }
  }, [polygonPath]);

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={17}
      onLoad={handleMapLoad}
    >
      <Polygon path={polygonPath} options={polygonOptions} />
    </GoogleMap>
  );
};

export default MapWithPolygon;
