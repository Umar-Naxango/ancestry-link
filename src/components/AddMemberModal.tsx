'use client';

import { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadCompressedImage } from '@/lib/mediaUpload';
import { useFamilyData } from '@/hooks/useFamilyData';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (member: any) => Promise<boolean>;
}

export default function AddMemberModal({ isOpen, onClose, onAdd }: AddMemberModalProps) {
    const { familyMembers, currentUser } = useFamilyData();
    const [form, setForm] = useState({ 
        name: '', 
        gender: 'male', 
        birthDate: '', 
        photo: '', 
        location: '', 
        bio: '', 
        phone: '', 
        email: '',
        relation: 'Child',
        fatherId: '',
        motherId: '',
        partnerId: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const fathers = useMemo(() => familyMembers.filter(m => m.gender === 'male'), [familyMembers]);
    const mothers = useMemo(() => familyMembers.filter(m => m.gender === 'female'), [familyMembers]);

    const onSelectPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputEl = e.currentTarget;
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadError(null);
        setUploading(true);
        try {
            const { data } = await supabase.auth.getUser();
            if (!data.user) {
                throw new Error('Sign in again before uploading photos.');
            }
            const url = await uploadCompressedImage(file, data.user.id, 'members');
            setForm((prev) => ({ ...prev, photo: url }));
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Failed to upload photo.');
        } finally {
            setUploading(false);
            if (inputEl) inputEl.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Map relationship field for useFamilyData hooks
        const payload = {
            ...form,
            id: Date.now(), // Fallback ID for optimistic UI if needed
        };
        const success = await onAdd(payload);
        setSubmitting(false);
        if (!success) return;
        onClose();
        setForm({ 
            name: '', 
            gender: 'male', 
            birthDate: '', 
            photo: '', 
            location: '', 
            bio: '', 
            phone: '', 
            email: '',
            relation: 'Child',
            fatherId: '',
            motherId: '',
            partnerId: ''
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1a1a1a] dark:to-[#252525] rounded-3xl p-8 w-full max-w-lg border border-gray-200 dark:border-gray-700 shadow-2xl shadow-emerald-500/20 max-h-[90vh] overflow-hidden flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3 shrink-0">
                    <span className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </span>
                    Add Family Member
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-emerald-500 shadow-lg">
                                {form.photo ? (
                                    <img src={form.photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-emerald-500 text-white rounded-full shadow-lg cursor-pointer hover:bg-emerald-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <input type="file" accept="image/*" onChange={onSelectPhoto} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Relationship *</label>
                            <select
                                value={form.relation}
                                onChange={(e) => setForm({ ...form, relation: e.target.value })}
                                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                            >
                                <option value="Child">Child</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Sibling">Sibling</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Gender</label>
                            <select
                                value={form.gender}
                                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
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
                    </div>

                    {form.relation === 'Child' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Father</label>
                                <select
                                    value={form.fatherId}
                                    onChange={(e) => setForm({ ...form, fatherId: e.target.value })}
                                    className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                                >
                                    <option value="">None</option>
                                    {currentUser?.gender === 'male' && <option value={currentUser.id}>You</option>}
                                    {fathers.map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Mother</label>
                                <select
                                    value={form.motherId}
                                    onChange={(e) => setForm({ ...form, motherId: e.target.value })}
                                    className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                                >
                                    <option value="">None</option>
                                    {currentUser?.gender === 'female' && <option value={currentUser.id}>You</option>}
                                    {mothers.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {(form.relation === 'Spouse' || form.relation === 'Partner') && (
                        <div>
                            <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Partner of</label>
                            <select
                                value={form.partnerId}
                                onChange={(e) => setForm({ ...form, partnerId: e.target.value })}
                                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                            >
                                <option value="">None</option>
                                <option value={currentUser?.id}>You</option>
                                {familyMembers.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

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
                            placeholder="Tell us about this family member..."
                        />
                    </div>

                    {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
                    {uploading && <p className="text-xs text-emerald-600">Uploading photo...</p>}

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 shrink-0">
                        <button type="button" onClick={onClose} disabled={submitting} className="flex-1 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all font-medium disabled:opacity-60">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting || uploading} className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium shadow-lg shadow-emerald-500/30 disabled:opacity-60">
                            {submitting ? 'Saving...' : 'Add Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
