// Logout.js
import React from 'react';
import { supabase } from './supabase';

const Logout = () => {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      // Redirect or perform other actions upon successful logout
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
