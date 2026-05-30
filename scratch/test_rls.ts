import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Checking RLS policies for profiles...");
  // We can't directly check policies via public API, but we can check if we can read ANY profile
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.log("Error reading profiles:", error.message);
  } else {
    console.log("Successfully read profile(s):", data.length);
  }
}

test();
