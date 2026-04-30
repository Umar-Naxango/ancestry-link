'use client';

import { useState } from 'react';

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InviteModal({ isOpen, onClose }: InviteModalProps) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [role, setRole] = useState('viewer');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => {
            setSent(false);
            setEmail('');
            setMessage('');
            setRole('viewer');
            onClose();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1a1a1a] dark:to-[#252525] rounded-3xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-2xl shadow-emerald-500/20">
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </span>
                    Invite Family
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Send an invitation to collaborate on your family tree.</p>

                {sent ? (
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-2xl text-center font-medium">
                        Invitation sent successfully!
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Email Address *</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                                placeholder="cousin@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Role</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('viewer')}
                                    className={`p-4 rounded-2xl border-2 transition-all ${role === 'viewer' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'}`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        <span className="font-medium">Viewer</span>
                                        <span className="text-xs opacity-70">View only</span>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('editor')}
                                    className={`p-4 rounded-2xl border-2 transition-all ${role === 'editor' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'}`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        <span className="font-medium">Editor</span>
                                        <span className="text-xs opacity-70">Can edit</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Personal Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all resize-none"
                                rows={3}
                                placeholder="Add a personal message to your invitation..."
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all font-medium">
                                Cancel
                            </button>
                            <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium shadow-lg shadow-emerald-500/30">
                                Send Invite
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
