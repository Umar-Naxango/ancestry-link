'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { FaGoogle, FaApple, FaUser, FaEnvelope, FaLock, FaArrowRight, FaTree } from 'react-icons/fa';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);
  const [resending, setResending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
        toast.error(signUpError.message);
        return;
      }

      if (!data.session) {
        toast.success('Account created! Please check your email for the verification link.');
        return;
      }

      toast.success('Account created successfully!');
      window.location.href = '/dashboard';
    } catch (err) {
      toast.error('Unexpected error while creating account.');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      toast.error('Enter your email address first.');
      return;
    }
    setResending(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (resendError) {
        toast.error(resendError.message);
        return;
      }
      toast.success('Verification email resent. Please check your inbox.');
    } catch {
      toast.error('Unable to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  const signUpWithProvider = async (provider: 'google' | 'apple') => {
    setOauthLoading(provider);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (oauthError) {
      toast.error(oauthError.message);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[2.5rem] overflow-hidden shadow-2xl border dark:border-gray-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl relative z-10">
        {/* Left Side - Hero */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-12 group">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaTree size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight">AncestryLink</span>
            </Link>
            <h1 className="text-5xl font-bold leading-tight mb-6">Build your family hub today.</h1>
            <p className="text-emerald-100 text-lg max-w-md">Start tracing your roots and collaborating with family members in a secure, beautiful environment.</p>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <p className="text-sm font-medium italic">"The easiest way to keep our family history alive for the next generation."</p>
              <p className="mt-2 text-xs font-bold text-emerald-200">— The Thompson Family</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-16 bg-white dark:bg-[#111111]">
          <div className="max-w-sm mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Join thousands of families preservation legacy.</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => signUpWithProvider('google')} 
                disabled={oauthLoading !== null}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.98]"
              >
                <FaGoogle className="text-red-500" />
                {oauthLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
              </button>
            </div>

            <div className="flex items-center gap-4 my-8">
              <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Or Register</span>
              <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all dark:text-white"
                  required 
                />
              </div>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all dark:text-white"
                  required 
                />
              </div>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="password" 
                  placeholder="Create Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all dark:text-white"
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Creating...' : <>Create Account <FaArrowRight size={14} /></>}
              </button>
            </form>

            <button 
              onClick={resendVerification}
              className="w-full mt-4 text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors"
            >
              Didn't get the email? Resend
            </button>

            <p className="mt-8 text-center text-gray-500 dark:text-gray-400 font-medium">
              Already have an account? <Link href="/sign-in" className="text-emerald-600 font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

