
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// These credentials were provided in the prompt.
// In a production app, they should be stored in environment variables.
const supabaseUrl = "https://xphvvtcyypvfoheuhjwk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaHZ2dGN5eXB2Zm9oZXVoandrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDQ5NjksImV4cCI6MjA2NzM4MDk2OX0._toVjWc_O7RshqWcBYVQ_DXAUKc80_De0QMeflVD4HU";

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
