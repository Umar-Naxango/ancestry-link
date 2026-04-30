'use client';

import { useState } from 'react';

interface AddSpouseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (spouse: any) => void;
}

export default function AddSpouseModal({ isOpen, onClose, onAdd }: AddSpouseModalProps) {
    const [form, setForm] = useState({ name: '', marriageDate: '', status: 'Current', photo: '', location: '', marriagePlace: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ ...form, id: Date.now() });
        onClose();
        setForm({ name: '', marriageDate: '', status: 'Current', photo: '', location: '', marriagePlace: '' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1a1a1a] dark:to-[#252525] rounded-3xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-2xl shadow-emerald-500/20">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </span>
                    Add Spouse
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
                        <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Photo URL</label>
                        <input
                            type="url"
                            value={form.photo}
                            onChange={(e) => setForm({ ...form, photo: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                            placeholder="https://example.com/photo.jpg"
                        />
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Marriage Date *</label>
                            <input
                                type="date"
                                value={form.marriageDate}
                                onChange={(e) => setForm({ ...form, marriageDate: e.target.value })}
                                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                            >
                                <option value="Current">Current</option>
                                <option value="Former">Former</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Marriage Place</label>
                        <input
                            type="text"
                            value={form.marriagePlace}
                            onChange={(e) => setForm({ ...form, marriagePlace: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                            placeholder="City, Country"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Location</label>
                        <input
                            type="text"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                            placeholder="Current City, Country"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all font-medium">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium shadow-lg shadow-emerald-500/30">
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
