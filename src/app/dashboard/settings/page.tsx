'use client';

import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [settings, setSettings] = useState({
        publicTree: false,
        allowContributions: true,
        emailNotifications: true,
        pushNotifications: false,
    });

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Settings</h1>

            <div className="space-y-10">
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
                            <input type="text" defaultValue="Umar Bello" className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="email" defaultValue="umar.bello@email.com" className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300">Phone</label>
                            <input type="tel" defaultValue="+1 234 567 8900" className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500" />
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
                                className="w-6 h-6 accent-emerald-600" 
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
                                className="w-6 h-6 accent-emerald-600" 
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
                                className="w-6 h-6 accent-emerald-600" 
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
                                className="w-6 h-6 accent-emerald-600" 
                            />
                        </div>
                    </div>
                </div>

                <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-2xl text-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30">
                    Save Changes
                </button>
            </div>
        </div>
    );
}
