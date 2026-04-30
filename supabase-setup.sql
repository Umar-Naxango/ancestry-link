-- Run this SQL in your Supabase SQL Editor to create the tables

-- 1. Users table (links to Clerk)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Family Members table
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  email TEXT,
  phone TEXT,
  location TEXT,
  picture TEXT,
  birth_date TEXT,
  age INTEGER,
  relation TEXT NOT NULL,
  status TEXT DEFAULT 'Living' CHECK (status IN ('Living', 'Deceased')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Stories table
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('memory', 'achievement', 'tradition', 'milestone')),
  date TEXT,
  location TEXT,
  image TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for users to only see their own data
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = clerk_id::uuid);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = clerk_id::uuid);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = clerk_id::uuid);

-- For family_members
CREATE POLICY "Users can view their family members" ON family_members
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

CREATE POLICY "Users can insert family members" ON family_members
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

CREATE POLICY "Users can update their family members" ON family_members
  FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

CREATE POLICY "Users can delete their family members" ON family_members
  FOR DELETE USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

-- For stories
CREATE POLICY "Users can view their stories" ON stories
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

CREATE POLICY "Users can insert stories" ON stories
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

CREATE POLICY "Users can update their stories" ON stories
  FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

CREATE POLICY "Users can delete their stories" ON stories
  FOR DELETE USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

-- Note: For simplicity, we're using clerk_id as text. 
-- For production, you might want to use proper UUID conversion.
-- The policies above use a simpler text-based approach for now.
