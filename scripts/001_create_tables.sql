-- Create artists table
CREATE TABLE IF NOT EXISTS public.artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  spotify_id TEXT UNIQUE,
  name TEXT NOT NULL,
  followers INTEGER DEFAULT 0,
  genres TEXT[] DEFAULT '{}',
  popularity INTEGER DEFAULT 0,
  image_url TEXT,
  external_urls JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create venues table
CREATE TABLE IF NOT EXISTS public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  venue_type TEXT NOT NULL, -- 'arena', 'theater', 'club', 'festival', etc.
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  contact_email TEXT,
  contact_phone TEXT,
  website_url TEXT,
  booking_fee_percentage DECIMAL(5, 2) DEFAULT 10.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table (for venue managers and artists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('artist', 'venue_manager', 'admin')),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  company TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_time TIME,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  ticket_price DECIMAL(10, 2),
  expected_attendance INTEGER,
  revenue_projection DECIMAL(12, 2),
  booking_fee DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fan demographics table (simulated data based on artist followers)
CREATE TABLE IF NOT EXISTS public.fan_demographics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  age_group TEXT NOT NULL, -- '18-24', '25-34', '35-44', '45-54', '55+'
  gender TEXT, -- 'male', 'female', 'other'
  location TEXT NOT NULL, -- city, state/country
  percentage DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create streaming data table (for real-time analytics)
CREATE TABLE IF NOT EXISTS public.streaming_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'spotify', 'apple_music', 'youtube', etc.
  streams INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaming_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for artists (public read, authenticated write)
CREATE POLICY "artists_select_all" ON public.artists FOR SELECT TO authenticated USING (true);
CREATE POLICY "artists_insert_authenticated" ON public.artists FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "artists_update_authenticated" ON public.artists FOR UPDATE TO authenticated USING (true);

-- RLS Policies for venues (public read, authenticated write)
CREATE POLICY "venues_select_all" ON public.venues FOR SELECT TO authenticated USING (true);
CREATE POLICY "venues_insert_authenticated" ON public.venues FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "venues_update_authenticated" ON public.venues FOR UPDATE TO authenticated USING (true);

-- RLS Policies for bookings (users can only see their own bookings)
CREATE POLICY "bookings_select_own" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookings_insert_own" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookings_update_own" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "bookings_delete_own" ON public.bookings FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for fan demographics (public read for authenticated users)
CREATE POLICY "fan_demographics_select_all" ON public.fan_demographics FOR SELECT TO authenticated USING (true);
CREATE POLICY "fan_demographics_insert_authenticated" ON public.fan_demographics FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for streaming data (public read for authenticated users)
CREATE POLICY "streaming_data_select_all" ON public.streaming_data FOR SELECT TO authenticated USING (true);
CREATE POLICY "streaming_data_insert_authenticated" ON public.streaming_data FOR INSERT TO authenticated WITH CHECK (true);
