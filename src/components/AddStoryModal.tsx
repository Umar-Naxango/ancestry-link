'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadCompressedImage } from '@/lib/mediaUpload';

interface AddStoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (story: any) => Promise<boolean>;
}

export default function AddStoryModal({ isOpen, onClose, onAdd }: AddStoryModalProps) {
    const [form, setForm] = useState({ title: '', category: 'memory', date: '', description: '', location: '', image: '' });
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const onSelectPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const inputEl = e.target;
        setUploadError(null);
        setUploading(true);
        try {
            const { data } = await supabase.auth.getUser();
            if (!data.user) throw new Error('Sign in again before uploading photos.');
            const url = await uploadCompressedImage(file, data.user.id, 'stories');
            setForm((prev) => ({ ...prev, image: url }));
        } catch (err) {
            console.error('Upload error:', err);
            setUploadError(err instanceof Error ? err.message : 'Failed to upload photo.');
        } finally {
            setUploading(false);
            if (inputEl) inputEl.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const ok = await onAdd({ ...form, id: Date.now(), createdAt: new Date().toISOString() });
        setSubmitting(false);
        if (!ok) return;
        onClose();
        setForm({ title: '', category: 'memory', date: '', description: '', location: '', image: '' });
    };

    if (!isOpen) return null;

    const categories = [
        { value: 'memory', label: 'Memory', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-blue-500' },
        { value: 'achievement', label: 'Achievement', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', color: 'bg-amber-500' },
        { value: 'tradition', label: 'Tradition', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: 'bg-emerald-500' },
        { value: 'milestone', label: 'Milestone', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', color: 'bg-purple-500' },
    ];

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1a1a1a] dark:to-[#252525] rounded-3xl p-8 w-full max-w-lg border border-gray-200 dark:border-gray-700 shadow-2xl shadow-emerald-500/20 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </span>
                    Add New Story
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Title *</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                            placeholder="Give your story a title..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Category</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setForm({ ...form, category: cat.value })}
                                    className={`p-4 rounded-2xl border-2 transition-all ${form.category === cat.value ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`p-2 ${cat.color} rounded-lg text-white`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.icon} /></svg>
                                        </span>
                                        <span className={`font-medium ${form.category === cat.value ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>{cat.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Date</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Location</label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                                placeholder="Where did it happen?"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Story *</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all resize-none"
                            rows={5}
                            placeholder="Share your story..."
                            required
                        />
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
                        {uploading && <p className="text-xs text-emerald-600 mt-2">Compressing and uploading...</p>}
                        {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Photo URL (optional)</label>
                        <input
                            type="text"
                            value={form.image}
                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                            placeholder="https://example.com/photo.jpg"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button type="button" onClick={onClose} disabled={submitting} className="flex-1 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all font-medium disabled:opacity-60">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium shadow-lg shadow-emerald-500/30 disabled:opacity-60">
                            {submitting ? 'Saving...' : 'Add Story'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
