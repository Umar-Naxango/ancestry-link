'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { FaGoogle, FaApple, FaEnvelope, FaLock, FaArrowRight, FaTree } from 'react-icons/fa';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        window.location.href = '/dashboard';
      }
    };
    checkSession();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        toast.error(signInError.message);
        return;
      }
      toast.success('Successfully signed in!');
      window.location.href = '/dashboard';
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'apple') => {
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
            <h1 className="text-5xl font-bold leading-tight mb-6">Preserve your family's legacy.</h1>
            <p className="text-emerald-100 text-lg max-w-md">Connect generations, share stories, and build your digital heritage in a secure collaborative space.</p>
          </div>
          <div className="flex items-center gap-4 text-emerald-200">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-emerald-600 bg-emerald-500 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium">Joined by 10k+ families worldwide</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-16 bg-white dark:bg-[#111111]">
          <div className="max-w-sm mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome back to your family circle.</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => signInWithProvider('google')} 
                disabled={oauthLoading !== null}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.98]"
              >
                <FaGoogle className="text-red-500" />
                {oauthLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
              </button>
              <button 
                onClick={() => signInWithProvider('apple')} 
                disabled={oauthLoading !== null}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.98]"
              >
                <FaApple className="text-xl" />
                {oauthLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}
              </button>
            </div>

            <div className="flex items-center gap-4 my-8">
              <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Or Email</span>
              <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
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
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all dark:text-white"
                  required 
                />
              </div>

              <div className="flex justify-end pt-2">
                <Link href="/forgot-password" size={14} className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Forgot Password?</Link>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Signing in...' : <>Sign In <FaArrowRight size={14} /></>}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-500 dark:text-gray-400 font-medium">
              New here? <Link href="/sign-up" className="text-emerald-600 font-bold hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

