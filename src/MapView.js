import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import { supabase } from './supabase';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import { useUser } from './UserContext';



const MapView = () => {
  const [playerPositions, setPlayerPositions] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const {user} = useUser();


  const userIcon = L.icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  

  // Predefined area coordinates
  const Gebiet_Blau = [
    [50.6029, 8.1214], 
    [50.602, 8.1227], 
    [50.6011, 8.1228], 
    [50.5997, 8.1201],
    [50.6011, 8.1173],
    [50.5997, 8.1154], 
    [50.5938, 8.1294],
    [50.5956, 8.1316],
    [50.5993, 8.1294],
    [50.6004, 8.13]
  ];


  // Fetch player positions from Supabase
  useEffect(() => {
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
    fetchPlayerPositions();
  }, []);

  // Get user's current position and update it in Supabase
  useEffect(() => {
    if (!user) return;

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
    getUserPosition();
  }, []);

  return (
    <MapContainer center={userPosition || [50.6042, 8.1131]} zoom={15} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
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
          <Polygon positions={Gebiet_Blau} color="blue" />
    </MapContainer>
  );
};

export default MapView;
