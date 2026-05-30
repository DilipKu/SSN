import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const userId = 'd80f4d99-8f01-4afb-966d-10a94355fa33';
  console.log("Checking email for UID:", userId);
  // We can't check auth.users directly, but we can check profiles
  const { data, error } = await supabase
    .from('profiles')
    .select('email, role')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Profile data:", data);
  }
}

test();
