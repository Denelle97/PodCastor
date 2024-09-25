import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wchztwmvmefugrnqfezh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjaHp0d212bWVmdWdybnFmZXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3NzE2NjQsImV4cCI6MjA0MjM0NzY2NH0.9Xe1d5LY-7f5NwCoxDjWS16G-nCVnpLjGgu1-fZaono';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Sync favorites with Supabase
const syncFavoritesWithSupabase = async (favorites) => {
    const { data, error } = await supabase
      .from('favorites')
      .upsert({ user_id: 1, favorites }); 
    if (error) console.error("Error syncing with Supabase:", error);
  };
  
  // Retrieve favorites from Supabase
  const getFavoritesFromSupabase = async () => {
    const { data, error } = await supabase
      .from('favorites')
      .select('favorites')
      .eq('user_id', 1); 
    if (error) console.error("Error fetching from Supabase:", error);
    return data ? data[0].favorites : {};
  };