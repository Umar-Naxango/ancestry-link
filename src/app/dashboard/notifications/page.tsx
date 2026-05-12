'use client';

import { useEffect, useState } from 'react';
import { FaBell, FaUserPlus, FaCalendarAlt, FaCog, FaCheck, FaTimes, FaInbox } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('family_invites')
        .select(`
          *,
          owner:owner_user_id (full_name)
        `)
        .eq('recipient_email', user.email)
        .eq('status', 'pending');

      if (error) throw error;
      setInvites(data || []);
    } catch (err) {
      console.error('Error fetching invites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (inviteId: string, status: 'accepted' | 'revoked') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 1. Get the invite details first
      const { data: invite, error: fetchError } = await supabase
        .from('family_invites')
        .select('*')
        .eq('id', inviteId)
        .single();

      if (fetchError) throw fetchError;

      // 2. Update the status
      const { error: updateError } = await supabase
        .from('family_invites')
        .update({ status })
        .eq('id', inviteId);

      if (updateError) throw updateError;

      // 3. If accepted, add to collaborators
      if (status === 'accepted') {
        const { error: collaboError } = await supabase
          .from('family_collaborators')
          .insert({
            owner_user_id: invite.owner_user_id,
            collaborator_auth_user_id: user.id,
            permission: invite.role
          });

        if (collaboError && collaboError.code !== '23505') {
          throw collaboError;
        }
      }
      
      toast.success(`Invitation ${status === 'accepted' ? 'accepted' : 'declined'}`);
      setInvites(prev => prev.filter(i => i.id !== inviteId));
    } catch (err) {
      console.error('Error handling invite:', err);
      toast.error('Failed to update invitation.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/30 rounded-2xl">
              <FaBell className="text-emerald-600" />
            </div>
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Stay updated with your family events and system alerts</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : invites.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] border dark:border-gray-800 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FaInbox className="text-3xl text-gray-300" />
          </div>
          <h3 className="text-xl font-bold dark:text-white">All caught up!</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">No new notifications or invitations at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invites.map((invite) => (
            <div 
              key={invite.id} 
              className="p-6 bg-white dark:bg-[#1a1a1a] border dark:border-gray-800 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
                <FaUserPlus className="text-emerald-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Family Collaboration Invite
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  <span className="font-bold text-emerald-600">{invite.owner?.full_name || 'Someone'}</span> invited you to collaborate on their family tree as an <span className="capitalize font-bold text-gray-900 dark:text-white">{invite.role}</span>.
                </p>
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  Received {new Date(invite.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => handleInvite(invite.id, 'accepted')}
                  className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <FaCheck /> Accept
                </button>
                <button 
                  onClick={() => handleInvite(invite.id, 'revoked')}
                  className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  <FaTimes /> Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

