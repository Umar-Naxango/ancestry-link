'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

export interface FamilyMember {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  email: string;
  phone: string;
  location: string;
  picture: string;
  birthDate: string;
  age: number;
  relation: string;
  status: 'Living' | 'Deceased';
}

export interface FamilyStory {
  id: string;
  title: string;
  description: string;
  category: 'memory' | 'achievement' | 'tradition' | 'milestone';
  date: string;
  location: string;
  image: string;
  likes: number;
  comments: number;
}

type AddMemberInput = Partial<FamilyMember> & {
  photo?: string;
  marriageDate?: string;
};

type AddStoryInput = Partial<FamilyStory> & {
  photos?: string;
};

function normalizeGender(gender?: string): 'male' | 'female' {
  return gender?.toLowerCase() === 'female' ? 'female' : 'male';
}

export function useFamilyData() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<FamilyMember | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [stories, setStories] = useState<FamilyStory[]>([]);

  const fetchFamilyData = useCallback(async () => {
    if (!isClerkLoaded || !clerkUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const clerkId = clerkUser.id;
      const userEmail = clerkUser.primaryEmailAddress?.emailAddress || '';
      const userFullName = clerkUser.fullName || clerkUser.username || 'User';
      const userAvatar = clerkUser.imageUrl || '';

      // Get or create user in Supabase
      let { data: dbUser } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', clerkId)
        .single();

      if (!dbUser) {
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            clerk_id: clerkId,
            email: userEmail,
            full_name: userFullName,
            avatar_url: userAvatar,
          })
          .select()
          .single();

        if (createError) throw createError;
        dbUser = newUser;
      }

      // Set current user from Clerk + DB data
      setCurrentUser({
        id: dbUser.id,
        name: dbUser.full_name || userFullName,
        firstName: (dbUser.full_name || userFullName).split(' ')[0],
        lastName: (dbUser.full_name || userFullName).split(' ').slice(1).join(' ') || '',
        gender: 'male' as const,
        email: dbUser.email || userEmail,
        phone: '',
        location: '',
        picture: dbUser.avatar_url || userAvatar,
        birthDate: '',
        age: 0,
        relation: 'Self',
        status: 'Living',
      });

      // Fetch family members
      const { data: members, error: membersError } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', dbUser.id)
        .order('created_at', { ascending: true });

      if (membersError) throw membersError;

      // Fetch stories
      const { data: userStories, error: storiesError } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', dbUser.id)
        .order('created_at', { ascending: false });

      if (storiesError) throw storiesError;

      setFamilyMembers(
        (members || []).map((member: any) => ({
          id: member.id,
          name: member.name || '',
          firstName: member.first_name || '',
          lastName: member.last_name || '',
          gender: normalizeGender(member.gender),
          email: member.email || '',
          phone: member.phone || '',
          location: member.location || '',
          picture: member.picture || '',
          birthDate: member.birth_date || '',
          age: member.age || 0,
          relation: member.relation || '',
          status: member.status === 'Deceased' ? 'Deceased' : 'Living',
        }))
      );
      setStories(
        (userStories || []).map((story: any) => ({
          id: story.id,
          title: story.title || '',
          description: story.description || '',
          category: ['memory', 'achievement', 'tradition', 'milestone'].includes(story.category)
            ? story.category
            : 'memory',
          date: story.date || '',
          location: story.location || '',
          image: story.image || '',
          likes: story.likes || 0,
          comments: story.comments || 0,
        }))
      );
    } catch (err) {
      console.error('Error fetching family data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [clerkUser, isClerkLoaded]);

  useEffect(() => {
    fetchFamilyData();
  }, [fetchFamilyData]);

  const refreshData = useCallback(() => {
    fetchFamilyData();
  }, [fetchFamilyData]);

  const addChild = useCallback(async (child: AddMemberInput) => {
    if (!clerkUser) return;

    try {
      const { data: dbUser } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUser.id)
        .single();

      if (!dbUser) throw new Error('User not found');

      const normalizedGender = normalizeGender(child.gender);
      const newMember = {
        user_id: dbUser.id,
        name: child.name || '',
        first_name: child.firstName || child.name?.split(' ')[0] || '',
        last_name: child.lastName || child.name?.split(' ').slice(1).join(' ') || '',
        gender: normalizedGender,
        email: child.email || '',
        phone: child.phone || '',
        location: child.location || '',
        picture: child.picture || child.photo || `https://randomuser.me/api/portraits/${normalizedGender === 'female' ? 'women' : 'men'}/${Math.floor(Math.random() * 99)}.jpg`,
        birth_date: child.birthDate || '',
        age: child.age || 0,
        relation: 'Child',
        status: 'Living',
      };

      const { data, error } = await supabase
        .from('family_members')
        .insert(newMember)
        .select()
        .single();

      if (error) throw error;

      setFamilyMembers(prev => [...prev, {
        id: data.id,
        name: data.name,
        firstName: data.first_name,
        lastName: data.last_name,
        gender: normalizeGender(data.gender),
        email: data.email,
        phone: data.phone,
        location: data.location,
        picture: data.picture,
        birthDate: data.birth_date,
        age: data.age,
        relation: data.relation,
        status: data.status,
      }]);
    } catch (err) {
      console.error('Error adding child:', err);
    }
  }, [clerkUser]);

  const addSpouse = useCallback(async (spouse: AddMemberInput) => {
    if (!clerkUser) return;

    try {
      const { data: dbUser } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUser.id)
        .single();

      if (!dbUser) throw new Error('User not found');

      const newMember = {
        user_id: dbUser.id,
        name: spouse.name || '',
        first_name: spouse.name?.split(' ')[0] || '',
        last_name: spouse.name?.split(' ').slice(1).join(' ') || '',
        gender: 'female',
        email: '',
        phone: '',
        location: spouse.location || '',
        picture: spouse.picture || spouse.photo || `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 99)}.jpg`,
        birth_date: spouse.birthDate || spouse.marriageDate || '',
        age: 0,
        relation: 'Spouse',
        status: 'Living',
      };

      const { data, error } = await supabase
        .from('family_members')
        .insert(newMember)
        .select()
        .single();

      if (error) throw error;

      setFamilyMembers(prev => [...prev, {
        id: data.id,
        name: data.name,
        firstName: data.first_name,
        lastName: data.last_name,
        gender: normalizeGender(data.gender),
        email: data.email,
        phone: data.phone,
        location: data.location,
        picture: data.picture,
        birthDate: data.birth_date,
        age: data.age,
        relation: data.relation,
        status: data.status,
      }]);
    } catch (err) {
      console.error('Error adding spouse:', err);
    }
  }, [clerkUser]);

  const addStory = useCallback(async (story: AddStoryInput) => {
    if (!clerkUser) return;

    try {
      const { data: dbUser } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUser.id)
        .single();

      if (!dbUser) throw new Error('User not found');

      const newStory = {
        user_id: dbUser.id,
        title: story.title || '',
        description: story.description || '',
        category: story.category || 'memory',
        date: story.date || new Date().toISOString().split('T')[0],
        location: story.location || '',
        image: story.image || story.photos || `https://picsum.photos/seed/${Date.now()}/600/400`,
        likes: 0,
        comments: 0,
      };

      const { data, error } = await supabase
        .from('stories')
        .insert(newStory)
        .select()
        .single();

      if (error) throw error;

      setStories(prev => [{
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        date: data.date,
        location: data.location,
        image: data.image,
        likes: data.likes,
        comments: data.comments,
      }, ...prev]);
    } catch (err) {
      console.error('Error adding story:', err);
    }
  }, [clerkUser]);

  const updateProfile = useCallback(async (data: { name: string; birthDate: string; photo?: string; phone?: string; email?: string; location?: string; bio?: string }) => {
    if (!clerkUser || !currentUser) return;

    try {
      const [firstName, ...lastNameParts] = data.name.split(' ');

      // Update in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          full_name: data.name,
          avatar_url: data.photo,
        })
        .eq('clerk_id', clerkUser.id);

      if (error) throw error;

      setCurrentUser(prev => prev ? {
        ...prev,
        name: data.name,
        firstName,
        lastName: lastNameParts.join(' '),
        birthDate: data.birthDate,
        picture: data.photo || prev.picture,
        phone: data.phone || prev.phone,
        email: data.email || prev.email,
        location: data.location || prev.location,
      } : null);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  }, [clerkUser, currentUser]);

  return {
    loading: loading || !isClerkLoaded,
    error,
    currentUser,
    familyMembers,
    stories,
    refreshData,
    addChild,
    addSpouse,
    addStory,
    updateProfile,
  };
}
