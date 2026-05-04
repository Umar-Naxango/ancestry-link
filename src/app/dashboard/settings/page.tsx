'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from 'next-themes';
import { useFamilyData } from '@/hooks/useFamilyData';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { currentUser, updateProfile, loading } = useFamilyData();
    const [settings, setSettings] = useState({
        publicTree: false,
        allowContributions: true,
        emailNotifications: true,
        pushNotifications: false,
    });

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (currentUser) {
            setForm({
                name: currentUser.name || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
            });
        }
    }, [currentUser]);

    const handleSave = async () => {
        if (!currentUser) return;
        
        try {
            const success = await updateProfile({
                name: form.name,
                birthDate: currentUser.birthDate,
                phone: form.phone,
                email: form.email,
                location: currentUser.location,
                photo: currentUser.picture
            });

            if (success) {
                toast.success('Settings updated successfully!');
            } else {
                toast.error('Failed to update settings.');
            }
        } catch (err) {
            toast.error('An error occurred while saving.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Settings</h1>

            <div className="space-y-10 pb-12">
                {/* Appearance */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 border dark:border-gray-800">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Appearance</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-gray-200">Theme</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred color scheme</p>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Account Information */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 border dark:border-gray-800">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Account Information</h2>
                    <div className="grid gap-6">
                        <div>
                            <label className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input 
                                type="text" 
                                value={form.name} 
                                onChange={(e) => setForm({...form, name: e.target.value})}
                                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 transition-all" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input 
                                type="email" 
                                value={form.email} 
                                onChange={(e) => setForm({...form, email: e.target.value})}
                                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 transition-all" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300">Phone</label>
                            <input 
                                type="tel" 
                                value={form.phone} 
                                onChange={(e) => setForm({...form, phone: e.target.value})}
                                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 transition-all" 
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                    </div>
                </div>

                {/* Privacy & Sharing */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 border dark:border-gray-800">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Privacy & Sharing</h2>
                    <div className="space-y-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-200">Make tree public</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Allow other users to discover your tree</p>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={settings.publicTree}
                                onChange={(e) => setSettings({...settings, publicTree: e.target.checked})}
                                className="w-6 h-6 accent-emerald-600 rounded-lg cursor-pointer" 
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-200">Allow family contributions</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Let invited members edit the tree</p>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={settings.allowContributions}
                                onChange={(e) => setSettings({...settings, allowContributions: e.target.checked})}
                                className="w-6 h-6 accent-emerald-600 rounded-lg cursor-pointer" 
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 border dark:border-gray-800">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Notifications</h2>
                    <div className="space-y-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-200">Email notifications</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={settings.emailNotifications}
                                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                                className="w-6 h-6 accent-emerald-600 rounded-lg cursor-pointer" 
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-200">Push notifications</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Receive browser push notifications</p>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={settings.pushNotifications}
                                onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                                className="w-6 h-6 accent-emerald-600 rounded-lg cursor-pointer" 
                            />
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-2xl text-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}
