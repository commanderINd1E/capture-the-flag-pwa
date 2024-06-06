import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import { fetchMarkers } from './utils/supabaseUtils';
import { supabase } from './supabase';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import { useUser } from './UserContext';
import { icons } from './icons'; // Import the icons
import RefreshButton from './RefreshButton'; // Import the RefreshButton component


const MapView = () => {
  const [playerPositions, setPlayerPositions] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const {user} = useUser();
  const refreshInterval = 6000;
  const [markers, setMarkers] = useState([]);


  const userIcon = L.icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const fetchAllMarkers = async () => {
    const data = await fetchMarkers();
    setMarkers(data);
  };

  // Predefined area coordinates
  const Gebiet_Blau = [
    [50.601129, 8.117341],
    [50.599604, 8.115453],
    [50.59643, 8.124593],
    [50.596097, 8.124787],
    [50.593801, 8.129368],
    [50.59389, 8.129861],
    [50.594115, 8.130559],
    [50.594639, 8.13102],
    [50.595511, 8.131739],
    [50.59594, 8.131599],
    [50.596675, 8.130891],
    [50.597595, 8.130634],
    [50.598031, 8.13028],
    [50.598766, 8.129497],
    [50.599236, 8.128424],
    [50.60023, 8.129625],
    [50.600407, 8.130172],
    [50.600414, 8.13013],
    [50.60023, 8.12793],
    [50.601252, 8.125387],
    [50.602076, 8.123124],
    [50.602423, 8.120892],
    [50.601803, 8.12072],
    [50.601531, 8.121632],
    [50.601095, 8.121643],
    [50.60055, 8.119583],
    [50.600101, 8.119015],
    [50.600489, 8.11851],
    [50.601129, 8.117341]
  ];
  
  const Gebiet_Rot = [
    [50.60245, 8.120871],
    [50.602975, 8.12145],
    [50.604806, 8.118585],
    [50.604779, 8.117598],
    [50.605147, 8.11821],
    [50.605875, 8.116536],
    [50.606229, 8.114465],
    [50.610104, 8.116912],
    [50.605685, 8.124003],
    [50.604432, 8.125634],
    [50.604064, 8.12646],
    [50.603703, 8.128885],
    [50.602178, 8.128885],
    [50.600435, 8.130312],
    [50.600264, 8.127984],
    [50.602062, 8.123113],
    [50.602369, 8.121192],
    [50.60245, 8.120871]
  ];
  

  // Fetch player positions from Supabase
  const fetchPlayerPositions = async () => {
    try {
      const { data, error } = await supabase.from('Players').select('user_id, name, position');
      if (error) {
        throw error;
      }
      console.log('Player positions:', data); // Log the data
      setPlayerPositions(data);
    } catch (error) {
      console.error('Error fetching player positions:', error.message);
    }
  };



  // Function to update the user's position in Supabase
  const updateUserPositionInDatabase = async (position) => {
  try {
    const user_id = user.id;
    const name = user.name
    const { latitude, longitude } = position.coords;
    const { data, error } = await supabase
      .from('Players')
      .upsert({position: [latitude, longitude], name: name, updated_at: new Date() })
      .eq(user_id); // Use your unique user ID
    if (error) {
      throw error;
    }
    console.log('User position updated:', data);
  } catch (error) {
    console.error('Error updating user position:', error.message);
  }
  };

  const getUserPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
          updateUserPositionInDatabase(position);
        },
        error => {
          console.error('Error getting user position:', error.message);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const refreshData = () => {
    getUserPosition();
    fetchPlayerPositions();
    fetchAllMarkers();
  };


  useEffect(() => {
    getUserPosition();
    fetchPlayerPositions();
    fetchMarkers().then(setMarkers);
    const interval = setInterval(() => {
      getUserPosition();
      fetchPlayerPositions();
      fetchMarkers().then(setMarkers);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [] );

  return (
    <div> 
    <RefreshButton onClick={refreshData} />
    <MapContainer center={userPosition || [50.6042, 8.1131]} zoom={15} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
          url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          attribution = '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      />
      {userPosition && (
        <Marker position={userPosition} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}
      {playerPositions.map(player =>
        player.position && player.position.length === 2 ? (
          <Marker key={player.id} position={player.position} icon={userIcon}>
            <Popup>{player.name}</Popup>
          </Marker>
        ) : (
          console.warn(`Invalid position data for player ${player.id}:`, player.position)
        )
      )}
        {markers.map((marker) => (
        <Marker key={marker.id} position={marker.position} icon={icons[marker.type][marker.category]}>
          <Popup>
            {marker.name} ({marker.type}, {marker.category})
          </Popup>
        </Marker>
      ))}
          <Polygon positions={Gebiet_Blau} color="blue" />
          <Polygon positions={Gebiet_Rot} color="red" />
    </MapContainer>
    </div>  
  );
};

export default MapView;
