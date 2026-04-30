-- Run this SQL in your Supabase SQL Editor to create the tables

-- 1. Users table (links to Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- 4. Invitation + collaboration permissions
CREATE TABLE IF NOT EXISTS family_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('viewer', 'editor')),
  token TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  message TEXT,
  invited_user_auth_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS family_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  collaborator_auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL CHECK (permission IN ('viewer', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(owner_user_id, collaborator_auth_user_id)
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_collaborators ENABLE ROW LEVEL SECURITY;

-- 6. Create policies for users to only see their own data
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- For family_members
CREATE POLICY "Users can view their family members" ON family_members
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert family members" ON family_members
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their family members" ON family_members
  FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their family members" ON family_members
  FOR DELETE USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- For stories
CREATE POLICY "Users can view their stories" ON stories
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert stories" ON stories
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their stories" ON stories
  FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their stories" ON stories
  FOR DELETE USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Invites
CREATE POLICY "Owners can view their invites" ON family_invites
  FOR SELECT USING (owner_user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Recipients can view own invites" ON family_invites
  FOR SELECT USING (lower(recipient_email) = lower((SELECT email FROM auth.users WHERE id = auth.uid())));

CREATE POLICY "Owners can create invites" ON family_invites
  FOR INSERT WITH CHECK (owner_user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Owners and recipients can update invites" ON family_invites
  FOR UPDATE USING (
    owner_user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
    OR lower(recipient_email) = lower((SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- Collaborators
CREATE POLICY "Owners can view collaborators" ON family_collaborators
  FOR SELECT USING (owner_user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Collaborators can view their rows" ON family_collaborators
  FOR SELECT USING (collaborator_auth_user_id = auth.uid());

CREATE POLICY "Recipients can accept invites into collaborators" ON family_collaborators
  FOR INSERT WITH CHECK (collaborator_auth_user_id = auth.uid());

CREATE POLICY "Owners can manage collaborators" ON family_collaborators
  FOR UPDATE USING (owner_user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Owners can remove collaborators" ON family_collaborators
  FOR DELETE USING (owner_user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- 7. Storage setup (run in SQL editor once)
-- Create a public bucket named family-media in Storage UI (or via SQL if preferred).
-- Then apply policies for authenticated uploads:
-- create policy "Authenticated users can upload media"
-- on storage.objects for insert to authenticated
-- with check (bucket_id = 'family-media');
--
-- create policy "Public can read media"
-- on storage.objects for select to public
-- using (bucket_id = 'family-media');
