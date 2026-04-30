'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [callbackError, setCallbackError] = useState<string | null>(null);

  useEffect(() => {
    const finishOAuth = async () => {
      const code = searchParams.get('code');
      const next = searchParams.get('next') || '/dashboard';
      const providerError = searchParams.get('error');
      const providerErrorDescription = searchParams.get('error_description');

      if (providerError) {
        setCallbackError(providerErrorDescription || providerError);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setCallbackError(error.message || 'Unable to complete sign in.');
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // Handle token hash callbacks when no code is present.
        const { data: refreshed } = await supabase.auth.refreshSession();
        if (refreshed.session) {
          router.replace(next);
          router.refresh();
          return;
        }
        setCallbackError('No active session found after authentication. Please try signing in again.');
        return;
      }

      router.replace(next);
      router.refresh();
    };

    finishOAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        {callbackError ? (
          <>
            <h1 className="text-xl font-semibold text-red-300">Authentication failed</h1>
            <p className="mt-3 text-sm text-slate-300">{callbackError}</p>
            <div className="mt-5 space-y-3 text-sm">
              <p className="text-slate-400">
                Check your Google/Apple provider settings in Supabase and try again.
              </p>
              <Link href="/sign-in" className="inline-block rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
                Back to Sign In
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold">Completing sign in</h1>
            <p className="mt-2 text-sm text-slate-300">Please wait while we securely finish authentication.</p>
          </>
        )}
      </div>
    </div>
  );
}
