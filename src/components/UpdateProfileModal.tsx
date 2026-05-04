'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadCompressedImage } from '@/lib/mediaUpload';

interface UpdateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    currentBirthDate: string;
    currentPhoto?: string;
    currentPhone?: string;
    currentEmail?: string;
    currentLocation?: string;
    currentBio?: string;
    onUpdate: (data: { name: string, birthDate: string, photo?: string, phone?: string, email?: string, location?: string, bio?: string }) => Promise<boolean>;
}

export default function UpdateProfileModal({ isOpen, onClose, currentName, currentBirthDate, currentPhoto, currentPhone, currentEmail, currentLocation, currentBio, onUpdate }: UpdateProfileModalProps) {
    const [form, setForm] = useState({ name: currentName, birthDate: currentBirthDate, photo: currentPhoto || '', phone: currentPhone || '', email: currentEmail || '', location: currentLocation || '', bio: currentBio || '' });
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        setForm({
            name: currentName,
            birthDate: currentBirthDate,
            photo: currentPhoto || '',
            phone: currentPhone || '',
            email: currentEmail || '',
            location: currentLocation || '',
            bio: currentBio || '',
        });
    }, [isOpen, currentName, currentBirthDate, currentPhoto, currentPhone, currentEmail, currentLocation, currentBio]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const success = await onUpdate(form);
        setSubmitting(false);
        if (!success) return;
        onClose();
    };

    const onSelectPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputEl = e.currentTarget;
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadError(null);
        setUploading(true);
        try {
            const { data } = await supabase.auth.getUser();
            if (!data.user) throw new Error('Sign in again before uploading photos.');
            const url = await uploadCompressedImage(file, data.user.id, 'profiles');
            setForm((prev) => ({ ...prev, photo: url }));
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Failed to upload photo.');
        } finally {
            setUploading(false);
            if (inputEl) inputEl.value = '';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1a1a1a] dark:to-[#252525] rounded-3xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-2xl shadow-emerald-500/20">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </span>
                    Update Profile
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-emerald-500 shadow-lg">
                                {form.photo ? (
                                    <img src={form.photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                )}
                            </div>
                            <span className="absolute bottom-0 right-0 p-2 bg-emerald-500 text-white rounded-full shadow-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onSelectPhoto}
                            disabled={uploading}
                            className="w-full px-5 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none disabled:opacity-50"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Choose from device. We auto-compress before upload.</p>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Photo URL (optional)</label>
                        <input
                            type="url"
                            value={form.photo}
                            onChange={(e) => setForm({ ...form, photo: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                            placeholder="https://example.com/photo.jpg"
                        />
                        {uploading ? <p className="text-xs text-emerald-600 mt-2">Uploading image...</p> : null}
                        {uploadError ? <p className="text-xs text-red-500 mt-2">{uploadError}</p> : null}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Full Name *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Birth Date *</label>
                        <input
                            type="date"
                            value={form.birthDate}
                            onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Phone</label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                                placeholder="email@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Location</label>
                        <input
                            type="text"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                            placeholder="City, Country"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Bio</label>
                        <textarea
                            value={form.bio}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all resize-none"
                            rows={3}
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button type="button" onClick={onClose} disabled={submitting} className="flex-1 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all font-medium disabled:opacity-60">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium shadow-lg shadow-emerald-500/30 disabled:opacity-60">
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
