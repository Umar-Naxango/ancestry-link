'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadCompressedImage } from '@/lib/mediaUpload';
import { FaUser, FaMapMarkerAlt, FaCalendarAlt, FaPhone, FaCamera, FaArrowRight } from 'react-icons/fa';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: any) => Promise<boolean>;
    initialData: {
        name: string;
        email: string;
        photo?: string;
    };
}

export default function OnboardingModal({ isOpen, onClose, onComplete, initialData }: OnboardingModalProps) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: initialData.name || '',
        location: '',
        birthDate: '',
        gender: 'male',
        phone: '',
        photo: initialData.photo || '',
        bio: ''
    });
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            name: initialData.name || prev.name,
            photo: initialData.photo || prev.photo
        }));
    }, [initialData]);

    const onSelectPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const { data } = await supabase.auth.getUser();
            if (!data.user) throw new Error('Not authenticated');
            const url = await uploadCompressedImage(file, data.user.id, 'profiles');
            setForm(prev => ({ ...prev, photo: url }));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const success = await onComplete(form);
        setSubmitting(false);
        if (success) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border dark:border-gray-800">
                {/* Header */}
                <div className="bg-emerald-600 p-8 text-white">
                    <h2 className="text-3xl font-bold">Welcome to AncestryLink</h2>
                    <p className="mt-2 text-emerald-100">Let's set up your profile to begin your family legacy.</p>
                </div>

                <div className="p-8">
                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-8">
                        <div className={`h-2 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-800'}`} />
                        <div className={`h-2 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-800'}`} />
                    </div>

                    {step === 1 ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="flex justify-center mb-6">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl">
                                        {form.photo ? (
                                            <img src={form.photo} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <FaUser className="text-4xl text-gray-400" />
                                        )}
                                    </div>
                                    <label className="absolute -bottom-3 -right-3 p-3 bg-emerald-600 text-white rounded-2xl shadow-lg cursor-pointer hover:bg-emerald-700 transition-all">
                                        <FaCamera size={18} />
                                        <input type="file" accept="image/*" className="hidden" onChange={onSelectPhoto} disabled={uploading} />
                                    </label>
                                    {uploading && <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center rounded-3xl">
                                        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                    </div>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#252525] border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Home Address / Location"
                                        value={form.location}
                                        onChange={e => setForm({ ...form, location: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#252525] border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={!form.name || uploading}
                                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                            >
                                Next Step <FaArrowRight />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Birth Date</label>
                                    <div className="relative">
                                        <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            value={form.birthDate}
                                            onChange={e => setForm({ ...form, birthDate: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#252525] border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Gender</label>
                                    <select
                                        value={form.gender}
                                        onChange={e => setForm({ ...form, gender: e.target.value })}
                                        className="w-full px-4 py-4 bg-gray-50 dark:bg-[#252525] border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="relative">
                                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#252525] border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <textarea
                                placeholder="Short Bio (Optional)"
                                value={form.bio}
                                onChange={e => setForm({ ...form, bio: e.target.value })}
                                className="w-full px-4 py-4 bg-gray-50 dark:bg-[#252525] border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                                rows={3}
                            />

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Finish Setup'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
