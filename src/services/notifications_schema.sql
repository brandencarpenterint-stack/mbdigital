-- RUN THIS IN SUPABASE SQL EDITOR TO ENABLE NOTIFICATIONS

CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sender_id TEXT, -- References user ID
    receiver_id TEXT, -- References user ID
    type TEXT, -- 'challenge', 'system', 'friend_req'
    message TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    read BOOLEAN DEFAULT FALSE
);

-- OPTIONAL: Add RLS policies if you want security
-- ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users see their own notifications" ON notifications FOR SELECT USING (auth.uid()::text = receiver_id);
-- CREATE POLICY "Users can insert notifications" ON notifications FOR INSERT WITH CHECK (true);
