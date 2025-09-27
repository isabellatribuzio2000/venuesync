-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'booking_request', 'booking_confirmed', 'booking_cancelled', 'booking_completed',
    'new_venue', 'new_artist', 'venue_approved', 'artist_verified'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

-- Create function to send notifications
CREATE OR REPLACE FUNCTION send_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to send notifications on booking status changes
CREATE OR REPLACE FUNCTION notify_booking_status_change()
RETURNS TRIGGER AS $$
DECLARE
  artist_user_id UUID;
  venue_user_id UUID;
BEGIN
  -- Get artist user ID
  IF NEW.artist_id IS NOT NULL THEN
    SELECT user_id INTO artist_user_id FROM public.artists WHERE id = NEW.artist_id;
  END IF;
  
  -- Get venue user ID
  IF NEW.venue_id IS NOT NULL THEN
    SELECT user_id INTO venue_user_id FROM public.venues WHERE id = NEW.venue_id;
  END IF;
  
  -- Send notification to artist
  IF artist_user_id IS NOT NULL AND OLD.status != NEW.status THEN
    CASE NEW.status
      WHEN 'confirmed' THEN
        PERFORM send_notification(
          artist_user_id,
          'booking_confirmed',
          'Booking Confirmed',
          'Your booking request has been confirmed!',
          jsonb_build_object('booking_id', NEW.id, 'venue_id', NEW.venue_id)
        );
      WHEN 'cancelled' THEN
        PERFORM send_notification(
          artist_user_id,
          'booking_cancelled',
          'Booking Cancelled',
          'Your booking request has been cancelled.',
          jsonb_build_object('booking_id', NEW.id, 'venue_id', NEW.venue_id)
        );
      WHEN 'completed' THEN
        PERFORM send_notification(
          artist_user_id,
          'booking_completed',
          'Booking Completed',
          'Your booking has been marked as completed.',
          jsonb_build_object('booking_id', NEW.id, 'venue_id', NEW.venue_id)
        );
    END CASE;
  END IF;
  
  -- Send notification to venue
  IF venue_user_id IS NOT NULL AND OLD.status != NEW.status THEN
    CASE NEW.status
      WHEN 'confirmed' THEN
        PERFORM send_notification(
          venue_user_id,
          'booking_confirmed',
          'Booking Confirmed',
          'You have confirmed a booking request.',
          jsonb_build_object('booking_id', NEW.id, 'artist_id', NEW.artist_id)
        );
      WHEN 'cancelled' THEN
        PERFORM send_notification(
          venue_user_id,
          'booking_cancelled',
          'Booking Cancelled',
          'A booking has been cancelled.',
          jsonb_build_object('booking_id', NEW.id, 'artist_id', NEW.artist_id)
        );
      WHEN 'completed' THEN
        PERFORM send_notification(
          venue_user_id,
          'booking_completed',
          'Booking Completed',
          'A booking has been completed.',
          jsonb_build_object('booking_id', NEW.id, 'artist_id', NEW.artist_id)
        );
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for booking status changes
DROP TRIGGER IF EXISTS booking_status_change_trigger ON public.bookings;
CREATE TRIGGER booking_status_change_trigger
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_status_change();

-- Create trigger to send notification when new booking is created
CREATE OR REPLACE FUNCTION notify_new_booking()
RETURNS TRIGGER AS $$
DECLARE
  venue_user_id UUID;
BEGIN
  -- Get venue user ID
  IF NEW.venue_id IS NOT NULL THEN
    SELECT user_id INTO venue_user_id FROM public.venues WHERE id = NEW.venue_id;
    
    -- Send notification to venue
    IF venue_user_id IS NOT NULL THEN
      PERFORM send_notification(
        venue_user_id,
        'booking_request',
        'New Booking Request',
        'You have received a new booking request.',
        jsonb_build_object('booking_id', NEW.id, 'artist_id', NEW.artist_id)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new bookings
DROP TRIGGER IF EXISTS new_booking_trigger ON public.bookings;
CREATE TRIGGER new_booking_trigger
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_booking();
