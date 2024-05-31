import React, { useState } from 'react';
import { supabase } from './supabase';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      // Fetch user details from the database
      const { data: userData, error: fetchError } = await supabase
        .from('Players')
        .select('*')
        .eq('user_id', loginData.user.id)
        .single();

      if (fetchError) throw fetchError;

      setUser(userData);
      navigate('/map');
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
