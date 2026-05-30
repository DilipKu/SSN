-- Kirdaar Celebrations: Unified Schema Fix
-- This script ensures the profiles and addresses tables match the requirements
-- and fixes the signup trigger failure.

-- 1. Ensure Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Based on your snippet)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  display_name text NULL,
  avatar_url text NULL,
  phone_number text NULL,
  role text NULL DEFAULT 'customer'::text,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  status text NULL DEFAULT 'active'::text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_email_key UNIQUE (email),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT profiles_role_check CHECK (role = ANY (ARRAY['customer'::text, 'admin'::text])),
  CONSTRAINT profiles_status_check CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text]))
) TABLESPACE pg_default;

-- 3. Addresses Table (Based on your snippet)
CREATE TABLE IF NOT EXISTS public.addresses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NULL,
  type text NULL DEFAULT 'Home'::text,
  street text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  country text NULL DEFAULT 'India'::text,
  is_default boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT addresses_pkey PRIMARY KEY (id),
  CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON DELETE CASCADE,
  CONSTRAINT addresses_type_check CHECK (type = ANY (ARRAY['Home'::text, 'Work'::text, 'Other'::text]))
) TABLESPACE pg_default;

-- 4. Robust Signup Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, role, status)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'display_name', 
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'customer'),
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
    updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Re-create Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
