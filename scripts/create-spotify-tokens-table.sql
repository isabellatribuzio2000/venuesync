-- Create spotify_tokens table for storing Spotify OAuth tokens
CREATE TABLE IF NOT EXISTS public.spotify_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.spotify_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "spotify_tokens_select_own" ON public.spotify_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "spotify_tokens_insert_own" ON public.spotify_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "spotify_tokens_update_own" ON public.spotify_tokens FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "spotify_tokens_delete_own" ON public.spotify_tokens FOR DELETE USING (auth.uid() = user_id);
