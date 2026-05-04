'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaTree, FaBars, FaTimes } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session);
        };
        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    return (
        <nav className="bg-white dark:bg-[#1a1a1a] shadow-md sticky top-0 z-50 dark:border-b dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                        <FaTree size={24} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">AncestryLink</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-gray-700 dark:text-gray-300">
                    <Link href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Features</Link>
                    <Link href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">How it Works</Link>
                    <Link href="#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">About</Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <ThemeToggle />
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" className="px-6 py-2 text-emerald-600 font-medium hover:underline transition">
                                Dashboard
                            </Link>
                            <button 
                                onClick={handleSignOut}
                                className="px-6 py-2 bg-red-500/10 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition font-medium"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in" className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition">
                                Log in
                            </Link>
                            <Link href="/sign-up" className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium">
                                Start Free
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-2xl text-gray-700 dark:text-gray-300">
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-[#1a1a1a] border-t dark:border-gray-800 py-4 px-6 space-y-4">
                    <div className="flex justify-end pt-2">
                        <ThemeToggle />
                    </div>
                    {isLoggedIn ? (
                        <div className="pt-4 border-t dark:border-gray-800 flex flex-col gap-3">
                            <Link href="/dashboard" className="py-3 text-center text-emerald-600 font-medium">Dashboard</Link>
                            <button onClick={handleSignOut} className="py-3 bg-red-500/10 text-red-600 rounded-xl text-center font-medium">Log out</button>
                        </div>
                    ) : (
                        <div className="pt-4 border-t dark:border-gray-800 flex flex-col gap-3">
                            <Link href="/sign-in" className="py-3 text-center text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">Log in</Link>
                            <Link href="/sign-up" className="py-3 bg-emerald-600 text-white rounded-xl text-center font-medium">Start Free</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}