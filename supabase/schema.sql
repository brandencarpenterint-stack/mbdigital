
-- Run this in your Supabase SQL Editor to create the necessary tables.

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name TEXT NOT NULL DEFAULT 'OPERATOR',
    friend_code TEXT UNIQUE,
    avatar_url TEXT DEFAULT '/assets/merchboy_face.png',
    coins BIGINT DEFAULT 0,
    xp BIGINT DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    high_scores JSONB DEFAULT '{}',
    stats JSONB DEFAULT '{}',
    achievements JSONB DEFAULT '[]',
    inventory JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) but allow public access for now (Arcade Mode)
-- In a real app with Auth, you'd restrict this to authenticated users.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON profiles FOR UPDATE USING (true);

-- LEADERBOARD VIEW (Optional, for easy querying)
CREATE OR REPLACE VIEW global_leaderboard AS
SELECT 
    id, 
    display_name, 
    avatar_url, 
    xp, 
    games_played, 
    (high_scores->>'merch_jump')::INTEGER as merch_jump_score,
    (high_scores->>'snake')::INTEGER as snake_score,
    (high_scores->>'flappy')::INTEGER as flappy_score
FROM profiles
ORDER BY xp DESC;
