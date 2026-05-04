'use client';

import { useState, useEffect, useCallback } from 'react';
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

function getErrorMessage(err: unknown, fallback: string): string {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'object') {
    const maybe = err as { message?: string; details?: string; hint?: string; code?: string };
    if (maybe.message) return maybe.message;
    const parts = [maybe.code, maybe.details, maybe.hint].filter(Boolean);
    if (parts.length) return parts.join(' - ');
  }
  return fallback;
}

export function useFamilyData() {
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authName, setAuthName] = useState<string>('User');
  const [authAvatar, setAuthAvatar] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<FamilyMember | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [stories, setStories] = useState<FamilyStory[]>([]);
  const [collaboratorRole, setCollaboratorRole] = useState<'viewer' | 'editor'>('editor');
  const canEdit = collaboratorRole === 'editor';

  const ensureDbUserId = useCallback(async (): Promise<string> => {
    if (!authUserId) {
      throw new Error('You are not authenticated.');
    }

    const { data: dbUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', authUserId)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (dbUser?.id) {
      return dbUser.id;
    }

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        auth_user_id: authUserId,
        email: authEmail,
        full_name: authName,
        avatar_url: authAvatar,
      })
      .select('id')
      .single();

    if (createError || !newUser?.id) {
      throw createError || new Error('Could not create user profile row.');
    }

    return newUser.id;
  }, [authUserId, authEmail, authName, authAvatar]);

  const buildFallbackCurrentUser = useCallback((): FamilyMember => ({
    id: authUserId || 'pending',
    name: authName || 'User',
    firstName: (authName || 'User').split(' ')[0],
    lastName: (authName || 'User').split(' ').slice(1).join(' ') || '',
    gender: 'male',
    email: authEmail || '',
    phone: '',
    location: '',
    picture: authAvatar || '',
    birthDate: '',
    age: 0,
    relation: 'Self',
    status: 'Living',
  }), [authAvatar, authEmail, authName, authUserId]);

  const fetchFamilyData = useCallback(async () => {
    if (!authUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get or create user in Supabase
      const { data: dbUser, error: dbUserFetchError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .maybeSingle();

      let activeUser = dbUser;

      if (dbUserFetchError) {
        setCurrentUser(buildFallbackCurrentUser());
        setFamilyMembers([]);
        setStories([]);
        setError(getErrorMessage(dbUserFetchError, 'Could not read your profile from database.'));
        return;
      }

      if (!activeUser) {
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            auth_user_id: authUserId,
            email: authEmail,
            full_name: authName,
            avatar_url: authAvatar,
          })
          .select()
          .single();

        if (createError) {
          setCurrentUser(buildFallbackCurrentUser());
          setFamilyMembers([]);
          setStories([]);
          setError(getErrorMessage(createError, 'Profile setup failed. Please run the latest Supabase SQL schema.'));
          return;
        }
        activeUser = newUser;
      }

      // Set current user from auth + DB data
      setCurrentUser({
        id: activeUser.id,
        name: activeUser.full_name || authName,
        firstName: (activeUser.full_name || authName).split(' ')[0],
        lastName: (activeUser.full_name || authName).split(' ').slice(1).join(' ') || '',
        gender: (activeUser.gender as 'male' | 'female') || 'male',
        email: activeUser.email || authEmail,
        phone: activeUser.phone || '',
        location: activeUser.location || '',
        picture: activeUser.avatar_url || authAvatar,
        birthDate: activeUser.birth_date || '',
        age: 0,
        relation: 'Self',
        status: 'Living',
        onboarded: activeUser.onboarded || false,
        bio: activeUser.bio || '',
      } as any);

      // Fetch family members
      const { data: members, error: membersError } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', activeUser.id)
        .order('created_at', { ascending: true });

      if (membersError) {
        setError(getErrorMessage(membersError, 'Could not load family members.'));
      }

      // Fetch stories
      const { data: userStories, error: storiesError } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', activeUser.id)
        .order('created_at', { ascending: false });

      if (storiesError) {
        setError(getErrorMessage(storiesError, 'Could not load stories.'));
      }

      setFamilyMembers(
        ((membersError ? [] : members) || []).map((member: any) => ({
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
        ((storiesError ? [] : userStories) || []).map((story: any) => ({
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
      if (!membersError && !storiesError) {
        setError(null);
      } else {
        setError('Some profile data could not be loaded yet. You can still add members now.');
      }
    } catch (err) {
      setCurrentUser(buildFallbackCurrentUser());
      setFamilyMembers([]);
      setStories([]);
      setError(getErrorMessage(err, 'Unable to load existing family data right now.'));
    } finally {
      setLoading(false);
    }
  }, [authUserId, authEmail, authName, authAvatar, buildFallbackCurrentUser]);

  useEffect(() => {
    const role =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('ancestrylink_access_role')
        : null;
    if (role === 'viewer' || role === 'editor') {
      setCollaboratorRole(role);
    } else {
      setCollaboratorRole('editor');
    }

    const loadSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setAuthUserId(user.id);
          setAuthEmail(user.email || '');
          setAuthName(user.user_metadata?.full_name || user.email || 'User');
          setAuthAvatar(user.user_metadata?.avatar_url || '');
        } else {
          setAuthUserId(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading session:', err);
        setLoading(false);
      }
    };

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthUserId(session.user.id);
        setAuthEmail(session.user.email || '');
        setAuthName(session.user.user_metadata?.full_name || session.user.email || 'User');
        setAuthAvatar(session.user.user_metadata?.avatar_url || '');
      } else {
        setAuthUserId(null);
        setLoading(false);
      }
    });

    loadSession();
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (authUserId) {
      fetchFamilyData();
    }
  }, [authUserId, fetchFamilyData]);

  const refreshData = useCallback(() => {
    fetchFamilyData();
  }, [fetchFamilyData]);

  const addChild = useCallback(async (child: AddMemberInput) => {
    if (!authUserId) return false;
    if (!canEdit) {
      setError('You have view-only permission. Ask for editor access to add members.');
      return false;
    }

    try {
      const dbUserId = await ensureDbUserId();

      const normalizedGender = normalizeGender(child.gender);
      const newMember = {
        user_id: dbUserId,
        name: child.name || '',
        first_name: child.firstName || child.name?.split(' ')[0] || '',
        last_name: child.lastName || child.name?.split(' ').slice(1).join(' ') || '',
        gender: normalizedGender,
        email: child.email || '',
        phone: child.phone || '',
        location: child.location || '',
        picture: child.picture || child.photo || '',
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
      setError(null);
      return true;
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to save family member.'));
      return false;
    }
  }, [authUserId, ensureDbUserId, canEdit]);

  const addSpouse = useCallback(async (spouse: AddMemberInput) => {
    if (!authUserId) return false;
    if (!canEdit) {
      setError('You have view-only permission. Ask for editor access to add members.');
      return false;
    }

    try {
      const dbUserId = await ensureDbUserId();

      const newMember = {
        user_id: dbUserId,
        name: spouse.name || '',
        first_name: spouse.name?.split(' ')[0] || '',
        last_name: spouse.name?.split(' ').slice(1).join(' ') || '',
        gender: 'female',
        email: '',
        phone: '',
        location: spouse.location || '',
        picture: spouse.picture || spouse.photo || '',
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
      setError(null);
      return true;
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to save spouse.'));
      return false;
    }
  }, [authUserId, ensureDbUserId, canEdit]);

  const addStory = useCallback(async (story: AddStoryInput) => {
    if (!authUserId) return false;
    if (!canEdit) {
      setError('You have view-only permission. Ask for editor access to add stories.');
      return false;
    }

    try {
      const dbUserId = await ensureDbUserId();

      const newStory = {
        user_id: dbUserId,
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
      setError(null);
      return true;
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to save story.'));
      return false;
    }
  }, [authUserId, ensureDbUserId, canEdit]);

  const updateProfile = useCallback(async (data: { name: string; birthDate: string; photo?: string; phone?: string; email?: string; location?: string; bio?: string; onboarded?: boolean }) => {
    if (!authUserId || !currentUser) return false;
    if (!canEdit) {
      setError('You have view-only permission. Ask for editor access to update profile.');
      return false;
    }

    try {
      const [firstName, ...lastNameParts] = data.name.split(' ');

      // Update in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          full_name: data.name,
          avatar_url: data.photo,
          phone: data.phone,
          location: data.location,
          birth_date: data.birthDate,
          bio: data.bio,
          onboarded: data.onboarded !== undefined ? data.onboarded : true, // Mark as onboarded by default when updating
        })
        .eq('auth_user_id', authUserId);

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
        bio: data.bio || (prev as any).bio,
        onboarded: data.onboarded !== undefined ? data.onboarded : true,
      } : null);
      setError(null);
      return true;
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to update profile.'));
      return false;
    }
  }, [authUserId, currentUser, canEdit]);

  const deleteMember = useCallback(async (memberId: string) => {
    if (!authUserId) return false;
    if (!canEdit) {
      setError('You have view-only permission.');
      return false;
    }

    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setFamilyMembers(prev => prev.filter(m => m.id !== memberId));
      return true;
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete family member.'));
      return false;
    }
  }, [authUserId, canEdit]);

  const updateMember = useCallback(async (memberId: string, updates: Partial<FamilyMember>) => {
    if (!authUserId) return false;
    if (!canEdit) {
      setError('You have view-only permission.');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('family_members')
        .update({
          name: updates.name,
          first_name: updates.firstName,
          last_name: updates.lastName,
          gender: updates.gender,
          email: updates.email,
          phone: updates.phone,
          location: updates.location,
          picture: updates.picture,
          birth_date: updates.birthDate,
          age: updates.age,
          status: updates.status,
        })
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;

      setFamilyMembers(prev => prev.map(m => m.id === memberId ? {
        ...m,
        ...updates,
      } : m));
      return true;
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to update family member.'));
      return false;
    }
  }, [authUserId, canEdit]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  }, []);

  return {
    loading,
    error,
    currentUser,
    familyMembers,
    stories,
    collaboratorRole,
    canEdit,
    refreshData,
    addChild,
    addSpouse,
    addStory,
    updateProfile,
    updateMember,
    deleteMember,
    logout,
  };
}
