-- Insert sample venues
INSERT INTO public.venues (name, location, city, state, country, capacity, venue_type, latitude, longitude, contact_email, website_url) VALUES
('Madison Square Garden', '4 Pennsylvania Plaza', 'New York', 'NY', 'USA', 20789, 'arena', 40.7505, -73.9934, 'booking@msg.com', 'https://www.msg.com'),
('The Fillmore', '1805 Geary Blvd', 'San Francisco', 'CA', 'USA', 1315, 'theater', 37.7849, -122.4324, 'booking@fillmore.com', 'https://www.fillmore.com'),
('Red Rocks Amphitheatre', '18300 W Alameda Pkwy', 'Morrison', 'CO', 'USA', 9525, 'amphitheater', 39.6654, -105.2057, 'booking@redrocks.com', 'https://www.redrocksonline.com'),
('The Troubadour', '9081 Santa Monica Blvd', 'West Hollywood', 'CA', 'USA', 400, 'club', 34.0901, -118.3896, 'booking@troubadour.com', 'https://www.troubadour.com'),
('Coachella Valley Music Festival', '81800 51st Ave', 'Indio', 'CA', 'USA', 125000, 'festival', 33.6803, -116.2378, 'booking@coachella.com', 'https://www.coachella.com');

-- Insert sample artists (these would normally come from Spotify API)
INSERT INTO public.artists (spotify_id, name, followers, genres, popularity, image_url) VALUES
('4q3ewBCX7sLwd24euuV69X', 'Bad Bunny', 65000000, '{"reggaeton", "latin trap"}', 100, 'https://i.scdn.co/image/ab6761610000e5eb4a21b4760d2ecb7b0dcdc8da'),
('06HL4z0CvFAxyc27GXpf02', 'Taylor Swift', 92000000, '{"pop", "country"}', 100, 'https://i.scdn.co/image/ab6761610000e5eb859e4c14fa59296c8649e0e4'),
('3TVXtAsR1Inumwj472S9r4', 'Drake', 85000000, '{"hip hop", "rap"}', 100, 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9'),
('1uNFoZAHBGtllmzznpCI3s', 'Justin Bieber', 70000000, '{"pop", "r&b"}', 95, 'https://i.scdn.co/image/ab6761610000e5eb8ae7f2aaa9817a704a87ea36'),
('7dGJo4pcD2V6oG8kP0tJRR', 'Eminem', 58000000, '{"hip hop", "rap"}', 94, 'https://i.scdn.co/image/ab6761610000e5eba00b11c129b27a88fc72f36b');

-- Insert sample fan demographics
INSERT INTO public.fan_demographics (artist_id, age_group, gender, location, percentage) VALUES
((SELECT id FROM public.artists WHERE name = 'Bad Bunny'), '18-24', 'male', 'Los Angeles, CA', 25.5),
((SELECT id FROM public.artists WHERE name = 'Bad Bunny'), '18-24', 'female', 'Los Angeles, CA', 30.2),
((SELECT id FROM public.artists WHERE name = 'Bad Bunny'), '25-34', 'male', 'Miami, FL', 20.1),
((SELECT id FROM public.artists WHERE name = 'Bad Bunny'), '25-34', 'female', 'Miami, FL', 24.2),
((SELECT id FROM public.artists WHERE name = 'Taylor Swift'), '18-24', 'female', 'Nashville, TN', 35.8),
((SELECT id FROM public.artists WHERE name = 'Taylor Swift'), '25-34', 'female', 'New York, NY', 28.4),
((SELECT id FROM public.artists WHERE name = 'Taylor Swift'), '18-24', 'male', 'Nashville, TN', 15.2),
((SELECT id FROM public.artists WHERE name = 'Taylor Swift'), '25-34', 'male', 'New York, NY', 20.6);

-- Insert sample streaming data for the last 30 days
INSERT INTO public.streaming_data (artist_id, platform, streams, date)
SELECT 
  a.id,
  platform,
  (RANDOM() * 1000000 + 500000)::INTEGER as streams,
  CURRENT_DATE - (generate_series(1, 30) || ' days')::INTERVAL as date
FROM public.artists a
CROSS JOIN (VALUES ('spotify'), ('apple_music'), ('youtube')) as platforms(platform)
WHERE a.name IN ('Bad Bunny', 'Taylor Swift', 'Drake');
