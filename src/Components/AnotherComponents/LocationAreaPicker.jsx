import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, FeatureGroup, Polygon } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";

const LocationAreaPicker = ({ onAreaSelect, initialArea = [] }) => {
  const [areaPoints, setAreaPoints] = useState(initialArea);
  const featureGroupRef = useRef();

  // Update areaPoints when initialArea changes
  useEffect(() => {
    setAreaPoints(initialArea);
  }, [initialArea]);

  // Clear existing layers and draw initial polygon
  useEffect(() => {
    if (featureGroupRef.current && initialArea.length > 0) {
      featureGroupRef.current.clearLayers(); // Clear existing layers
      const latlngs = initialArea.map((point) => [point.lat, point.lng]);
      L.polygon(latlngs).addTo(featureGroupRef.current); // Add initial polygon
    }
  }, [initialArea]);

  const _onCreated = (e) => {
    const layer = e.layer;
    if (layer.getLatLngs) {
      const latlngs = layer.getLatLngs()[0].map((point) => ({
        lat: point.lat,
        lng: point.lng,
      }));
      setAreaPoints(latlngs);
      onAreaSelect(latlngs); // Send updated points to parent
      featureGroupRef.current.clearLayers(); // Clear previous layers
      L.polygon(latlngs).addTo(featureGroupRef.current); // Redraw the new polygon
    }
  };

  // Calculate map center based on initialArea or default
  const center =
    initialArea.length > 0
      ? [
          initialArea[0].lat,
          initialArea[0].lng,
        ]
      : [31.2001, 29.9187]; // Default center (Alexandria, Egypt)

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "400px", width: "100%", borderRadius: "10px", zIndex: "0" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={_onCreated}
          draw={{
            polygon: true,
            polyline: false,
            rectangle: true,
            circle: false,
            marker: false,
            circlemarker: false,
          }}
        />
        {areaPoints.length > 0 && (
          <Polygon positions={areaPoints.map((point) => [point.lat, point.lng])} />
        )}
      </FeatureGroup>
    </MapContainer>
  );
};

export default LocationAreaPicker;