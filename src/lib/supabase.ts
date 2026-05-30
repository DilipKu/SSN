import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://example.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyODc2NzYwMCwiZXhwIjoxOTQ0MzQzNjAwfQ.example";

console.log("Supabase Client: Initializing with URL", supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseKey);
