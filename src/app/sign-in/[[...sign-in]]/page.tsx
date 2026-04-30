'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);

  useEffect(() => {
    const ensureRedirectForActiveSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace('/dashboard');
        router.refresh();
      }
    };

    ensureRedirectForActiveSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/dashboard');
        router.refresh();
      }
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      const isNetworkError = err instanceof TypeError;
      setError(
        isNetworkError
          ? 'Unable to reach Supabase. Check your internet, NEXT_PUBLIC_SUPABASE_URL, and that your Supabase project is active.'
          : 'Unexpected error while signing in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'apple') => {
    setError(null);
    setOauthLoading(provider);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 px-6 py-8 md:grid-cols-2 md:gap-8 md:px-10">
        <section className="hidden md:flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-cyan-400/10 to-slate-900 p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">AncestryLink</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">Welcome back</h1>
            <p className="mt-4 max-w-sm text-slate-300">Continue building your family history with secure sign in and shared access.</p>
          </div>
          <p className="text-sm text-slate-400">Trusted family collaboration platform</p>
        </section>

        <section className="flex items-center">
          <form onSubmit={onSubmit} className="w-full rounded-3xl border border-white/10 bg-white/95 p-8 text-slate-900 shadow-2xl backdrop-blur md:p-10">
            <h2 className="text-3xl font-semibold">Sign in</h2>
            <p className="mt-2 text-sm text-slate-600">Access your dashboard securely.</p>

            <div className="mt-8 space-y-3">
              <button type="button" onClick={() => signInWithProvider('google')} disabled={oauthLoading !== null} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-medium transition hover:bg-slate-50 disabled:opacity-60">
                <span>{oauthLoading === 'google' ? 'Connecting...' : 'Continue with Google'}</span>
              </button>
              <button type="button" onClick={() => signInWithProvider('apple')} disabled={oauthLoading !== null} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-medium transition hover:bg-slate-50 disabled:opacity-60">
                <span>{oauthLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}</span>
              </button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs uppercase tracking-wide text-slate-500">Or use email</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <input className="mb-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-emerald-500 focus:ring-2" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-emerald-500 focus:ring-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
            <button disabled={loading} className="w-full rounded-xl bg-slate-900 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="mt-5 text-sm text-slate-600">
              No account? <Link href="/sign-up" className="font-medium text-emerald-700 hover:text-emerald-800">Create one</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
