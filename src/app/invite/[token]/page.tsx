'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type InviteState = {
  id: string;
  owner_user_id: string;
  recipient_email: string;
  role: 'viewer' | 'editor';
  status: 'pending' | 'accepted' | 'revoked';
};

export default function InviteAcceptPage() {
  const params = useParams<{ token: string }>();
  const token = useMemo(() => params?.token || '', [params?.token]);
  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<InviteState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);

      const { data: authData } = await supabase.auth.getUser();
      setUserEmail((authData.user?.email || '').toLowerCase());

      const { data, error: inviteError } = await supabase
        .from('family_invites')
        .select('id, owner_user_id, recipient_email, role, status')
        .eq('token', token)
        .single();

      if (inviteError || !data) {
        setError('Invite not found or expired.');
      } else {
        setInvite(data as InviteState);
      }
      setLoading(false);
    };
    load();
  }, [token]);

  const acceptInvite = async () => {
    try {
      setAccepting(true);
      setError(null);

      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setError('Please sign in first to accept this invite.');
        return;
      }

      if (!invite) {
        setError('Invite not available.');
        return;
      }

      const recipientEmail = authData.user.email?.toLowerCase() || '';
      if (recipientEmail !== invite.recipient_email.toLowerCase()) {
        setError('This invite email does not match your signed-in account.');
        return;
      }

      const { error: collabError } = await supabase.from('family_collaborators').upsert(
        {
          owner_user_id: invite.owner_user_id,
          collaborator_auth_user_id: authData.user.id,
          permission: invite.role,
        },
        { onConflict: 'owner_user_id,collaborator_auth_user_id' }
      );
      if (collabError) throw collabError;

      const { error: updateInviteError } = await supabase
        .from('family_invites')
        .update({ status: 'accepted', invited_user_auth_id: authData.user.id })
        .eq('id', invite.id);
      if (updateInviteError) throw updateInviteError;

      window.localStorage.setItem('ancestrylink_access_role', invite.role);
      window.localStorage.setItem('ancestrylink_owner_user_id', invite.owner_user_id);
      setAccepted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept invite.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading invite...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-2xl font-semibold">Family Invitation</h1>
        {invite ? (
          <p className="mt-3 text-slate-300">
            You were invited with <span className="font-medium text-emerald-300">{invite.role === 'editor' ? 'edit' : 'view-only'}</span> permission.
          </p>
        ) : null}
        {userEmail ? <p className="mt-2 text-sm text-slate-400">Signed in as {userEmail}</p> : null}
        {accepted ? (
          <div className="mt-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 p-4 text-emerald-200">
            Invite accepted successfully.
          </div>
        ) : (
          <button
            onClick={acceptInvite}
            disabled={accepting || !invite || invite.status === 'revoked'}
            className="mt-6 rounded-2xl bg-emerald-600 px-5 py-3 font-medium hover:bg-emerald-700 disabled:opacity-60"
          >
            {accepting ? 'Accepting...' : 'Accept Invitation'}
          </button>
        )}
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        <div className="mt-6">
          <Link href="/dashboard" className="text-emerald-300 hover:text-emerald-200">Go to dashboard</Link>
        </div>
      </div>
    </div>
  );
}
