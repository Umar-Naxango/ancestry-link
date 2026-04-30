'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FaTree,
  FaUsers,
  FaPhotoVideo,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaBell,
  FaSearch,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationModal from '@/components/NotificationModal';
import InviteModal from '@/components/InviteModal';
import { supabase } from '@/lib/supabase';

const navLinks = [
  { href: '/dashboard', label: 'Overview', icon: <FaChartBar /> },
  { href: '/dashboard/tree', label: 'Family Tree', icon: <FaTree /> },
  { href: '/dashboard/members', label: 'Family Members', icon: <FaUsers /> },
  { href: '/dashboard/stories', label: 'Stories & Photos', icon: <FaPhotoVideo /> },
  { href: '/dashboard/notifications', label: 'Notifications', icon: <FaBell /> },
  { href: '/dashboard/settings', label: 'Settings', icon: <FaCog /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [avatarLetter, setAvatarLetter] = useState('U');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const syncUserFromSession = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) {
        window.location.href = '/sign-in';
        return;
      }
      const letter = user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U';
      setAvatarLetter(String(letter).toUpperCase());
      setCheckingAuth(false);
    };

    syncUserFromSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (!user) {
        window.location.href = '/sign-in';
        return;
      }
      const letter = user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U';
      setAvatarLetter(String(letter).toUpperCase());
      setCheckingAuth(false);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.localStorage.removeItem('ancestrylink_access_role');
    window.localStorage.removeItem('ancestrylink_owner_user_id');
    window.location.href = '/sign-in';
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-200">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#121212] overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-gray-800 transition-transform duration-300`}>
        <div className="flex items-center justify-between px-6 py-6 border-b dark:border-gray-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
              <FaTree size={22} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">AncestryLink</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-2xl dark:text-gray-300">
            <FaTimes />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${isActive
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252525]'
                  }`}
              >
                <span className={isActive ? 'text-emerald-600' : ''}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-8 px-6 w-full">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-5 text-sm">
            <p className="font-medium text-emerald-800 dark:text-emerald-400">Invite Family Members</p>
            <p className="text-emerald-600 dark:text-emerald-500 text-xs mt-1">Grow your tree together</p>
            <button onClick={() => setInviteOpen(true)} className="mt-4 w-full bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700">
              Invite Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-2xl text-gray-700 dark:text-gray-300"
            >
              <FaBars />
            </button>

            <div className="relative w-80 hidden md:block">
              <input
                type="text"
                placeholder="Search family members, stories..."
                className="w-full bg-gray-100 dark:bg-[#252525] border border-transparent focus:border-gray-300 dark:focus:border-gray-600 pl-11 py-3 rounded-2xl text-sm focus:outline-none dark:text-white"
              />
              <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <ThemeToggle />

            {/* Notifications */}
            <button onClick={() => setNotificationOpen(true)} className="relative p-3 hover:bg-gray-100 dark:hover:bg-[#252525] rounded-2xl transition">
              <FaBell size={20} className="text-gray-700 dark:text-gray-300" />
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                3
              </span>
            </button>

            {/* User Profile */}
            <button
              onClick={signOut}
              className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
              title="Sign out"
            >
              {avatarLetter}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>

      <NotificationModal isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />
      <InviteModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
