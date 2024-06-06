import { supabase } from '../supabase';

export const fetchMarkers = async () => {
  try {
    const { data, error } = await supabase.from('Markers').select('*');
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching markers:', error.message);
    return [];
  }
};
