'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);
  const [resending, setResending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (!data.session) {
        setSuccessMessage('Account created. Check your email and click the verification link before signing in.');
        return;
      }

      setSuccessMessage('Account created successfully. Redirecting to dashboard...');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      const isNetworkError = err instanceof TypeError;
      setError(
        isNetworkError
          ? 'Unable to reach Supabase. Check your internet, NEXT_PUBLIC_SUPABASE_URL, and that your Supabase project is active.'
          : 'Unexpected error while creating account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setError('Enter your email address first, then click resend.');
      return;
    }
    setResending(true);
    setError(null);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (resendError) {
        setError(resendError.message);
        return;
      }
      setSuccessMessage('Verification email sent. Check inbox/spam and open the latest link.');
    } catch {
      setError('Unable to resend verification email right now. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const signUpWithProvider = async (provider: 'google' | 'apple') => {
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
        <section className="hidden md:flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/20 via-emerald-400/10 to-slate-900 p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">AncestryLink</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">Create your family hub</h1>
            <p className="mt-4 max-w-sm text-slate-300">Build your lineage together with secure accounts and shared stories.</p>
          </div>
          <p className="text-sm text-slate-400">Fast setup with social sign in options</p>
        </section>

        <section className="flex items-center">
          <form onSubmit={onSubmit} className="w-full rounded-3xl border border-white/10 bg-white/95 p-8 text-slate-900 shadow-2xl backdrop-blur md:p-10">
            <h2 className="text-3xl font-semibold">Create account</h2>
            <p className="mt-2 text-sm text-slate-600">Start in less than a minute.</p>

            <div className="mt-8 space-y-3">
              <button type="button" onClick={() => signUpWithProvider('google')} disabled={oauthLoading !== null} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-medium transition hover:bg-slate-50 disabled:opacity-60">
                <span>{oauthLoading === 'google' ? 'Connecting...' : 'Continue with Google'}</span>
              </button>
              <button type="button" onClick={() => signUpWithProvider('apple')} disabled={oauthLoading !== null} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-medium transition hover:bg-slate-50 disabled:opacity-60">
                <span>{oauthLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}</span>
              </button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs uppercase tracking-wide text-slate-500">Or use email</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <input className="mb-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-emerald-500 focus:ring-2" type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <input className="mb-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-emerald-500 focus:ring-2" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-emerald-500 focus:ring-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
            {successMessage ? <p className="mb-4 text-sm text-emerald-700">{successMessage}</p> : null}
            <button disabled={loading} className="w-full rounded-xl bg-slate-900 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60">
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            <button
              type="button"
              onClick={resendVerification}
              disabled={resending}
              className="mt-3 w-full rounded-xl border border-slate-300 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              {resending ? 'Sending...' : 'Resend verification email'}
            </button>
            <p className="mt-5 text-sm text-slate-600">
              Already have an account? <Link href="/sign-in" className="font-medium text-emerald-700 hover:text-emerald-800">Sign in</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
