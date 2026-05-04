'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadCompressedImage } from '@/lib/mediaUpload';
import { FaUser, FaCamera, FaTimes, FaSave, FaTrash } from 'react-icons/fa';

interface UpdateMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (memberId: string, data: any) => Promise<boolean>;
    onDelete: (memberId: string) => Promise<boolean>;
    member: any;
}

export default function UpdateMemberModal({ isOpen, onClose, onUpdate, onDelete, member }: UpdateMemberModalProps) {
    const [form, setForm] = useState({ 
        name: '', 
        gender: 'male', 
        birthDate: '', 
        photo: '', 
        location: '', 
        bio: '', 
        phone: '', 
        email: '',
        status: 'Living'
    });
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (member) {
            setForm({
                name: member.name || '',
                gender: member.gender || 'male',
                birthDate: member.birthDate || '',
                photo: member.picture || '',
                location: member.location || '',
                bio: member.bio || '',
                phone: member.phone || '',
                email: member.email || '',
                status: member.status || 'Living'
            });
        }
    }, [member]);

    const onSelectPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const inputEl = e.target;
        setUploading(true);
        try {
            const { data } = await supabase.auth.getUser();
            if (!data.user) throw new Error('Sign in again.');
            const url = await uploadCompressedImage(file, data.user.id, 'members');
            setForm(prev => ({ ...prev, photo: url }));
        } catch (err) {
            console.error('Upload error:', err);
            alert(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
            if (inputEl) inputEl.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const success = await onUpdate(member.id, form);
        setSubmitting(false);
        if (success) onClose();
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to remove this family member?')) return;
        setDeleting(true);
        const success = await onDelete(member.id);
        setDeleting(false);
        if (success) onClose();
    };

    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] p-8 w-full max-w-lg border dark:border-gray-800 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold dark:text-white">Edit Family Member</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <FaTimes className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-emerald-500">
                                {form.photo ? (
                                    <img src={form.photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <FaUser size={30} className="text-gray-400" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full cursor-pointer hover:scale-110 transition-transform">
                                <FaCamera size={14} />
                                <input type="file" accept="image/*" className="hidden" onChange={onSelectPhoto} disabled={uploading} />
                            </label>
                            {uploading && <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center rounded-full">
                                <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            </div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Gender</label>
                                <select
                                    value={form.gender}
                                    onChange={e => setForm({ ...form, gender: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Status</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="Living">Living</option>
                                    <option value="Deceased">Deceased</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Birth Date</label>
                            <input
                                type="date"
                                value={form.birthDate}
                                onChange={e => setForm({ ...form, birthDate: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Location</label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={e => setForm({ ...form, location: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting || submitting}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-2xl hover:bg-red-100 transition-all font-semibold"
                        >
                            <FaTrash />
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || deleting}
                            className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                        >
                            {submitting ? 'Saving...' : <><FaSave /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
