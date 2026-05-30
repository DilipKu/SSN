import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const email = 'avneesh.kumar@kirdaarcelebrations.com';
  console.log("Checking profile for:", email);
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('email', email)
    .single();
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Profile data:", data);
  }
}

test();
