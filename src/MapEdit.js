// AddMarker.js

import React, { useEffect, useState } from 'react';import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { supabase } from './supabase';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import { fetchMarkers } from './utils/supabaseUtils';
import { icons } from './icons'; // Import the icons
import RefreshButton from './RefreshButton'; // Import the RefreshButton component

const AddMarker = () => {
  const [position, setPosition] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [type, setType] = useState('friendly');
  const [category, setCategory] = useState('Big_Flag');
  const [name, setName] = useState('');

  const HandleMapClick = () => {
    useMapEvents({
      click: (e) => {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (position) {
      try {
        const { data, error } = await supabase
          .from('Markers')
          .insert([{ position, type, category, name }]);
        
        if (error) {
          throw error;
        }
        console.log('Marker added:', data);
      } catch (error) {
        console.error('Error adding marker:', error.message);
      }
    } else {
      console.error('No position selected');
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data, error } = await supabase
        .from('Markers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      console.log('Marker deleted:', data);
      // Fetch the updated markers list after deleting a marker
      fetchMarkers().then(setMarkers);
    } catch (error) {
      console.error('Error deleting marker:', error.message);
    }
  };

  const markerIcon = L.icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  useEffect(() => {
    fetchMarkers().then(setMarkers);
  }, []);

  const refreshMarkers = () => {
    fetchMarkers().then(setMarkers);
  };

  useEffect(() => {
    refreshMarkers();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <MapContainer center={[50.6042, 8.1131]} zoom={15} style={{ height: '100vh', width: '70%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        {position && (
          <Marker position={position} icon={markerIcon}>
            <Popup>Selected Position</Popup>
          </Marker>
        )}
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position} icon={icons[marker.type][marker.category]}>
            <Popup>
              {marker.name} ({marker.type}, {marker.category})
              <br />
              <button onClick={() => handleDelete(marker.id)}>Delete</button>
            </Popup>
          </Marker>
        ))}
        <HandleMapClick />
      </MapContainer>
      <form onSubmit={handleSubmit} style={{ width: '30%', padding: '20px' }}>
        <h2>Add Marker</h2>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="friendly">Friendly</option>
            <option value="enemy">Enemy</option>
          </select>
        </label>
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Big_Flag">Big Flag</option>
            <option value="Small_Flag">Small Flag</option>
            <option value="Jail">Jail</option>
          </select>
        </label>
        <button type="submit">Add Marker</button>
      </form>
      <RefreshButton onClick={refreshMarkers} />
    </div>
  );
};

export default AddMarker;
