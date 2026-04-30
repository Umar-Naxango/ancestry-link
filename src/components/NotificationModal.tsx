'use client';

import { FaBell, FaTimes, FaUserPlus, FaBirthdayCake, FaStar, FaCheck, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
    if (!isOpen) return null;

    const notifications = [
        { id: 1, title: 'New Family Member', desc: 'Aisha added a new child, Zainab.', time: '2 hours ago', type: 'member', read: false },
        { id: 2, title: 'Upcoming Birthday', desc: 'Ahmed Umar\'s birthday is in 3 days.', time: '1 day ago', type: 'birthday', read: false },
        { id: 3, title: 'Feature Update', desc: 'You can now export your family tree to PDF.', time: '2 days ago', type: 'feature', read: true },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'member': return <FaUserPlus className="w-4 h-4" />;
            case 'birthday': return <FaBirthdayCake className="w-4 h-4" />;
            case 'feature': return <FaStar className="w-4 h-4" />;
            default: return <FaBell className="w-4 h-4" />;
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'member': return 'bg-blue-500';
            case 'birthday': return 'bg-purple-500';
            case 'feature': return 'bg-amber-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1a1a1a] dark:to-[#252525] rounded-3xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-2xl shadow-emerald-500/20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/30">
                            <FaBell />
                        </span>
                        Notifications
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
                        <FaTimes />
                    </button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {notifications.map(note => (
                        <div key={note.id} className={`p-4 rounded-2xl bg-white dark:bg-gray-800/50 border ${note.read ? 'border-gray-100 dark:border-gray-700' : 'border-l-4 border-l-emerald-500'} hover:border-emerald-300 dark:hover:border-emerald-600/50 hover:shadow-md hover:shadow-emerald-500/10 transition-all duration-200 relative group`}>
                            <div className="flex items-start gap-3">
                                <span className={`p-2 ${getIconColor(note.type)} rounded-lg text-white shadow-md`}>
                                    {getIcon(note.type)}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{note.title}</h4>
                                        {!note.read && <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{note.desc}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{note.time}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="flex-1 py-2 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition flex items-center justify-center gap-1">
                                    <FaCheck className="w-3 h-3" /> Mark Read
                                </button>
                                <button className="px-3 py-2 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition">
                                    <FaTrash className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    <Link href="/dashboard/notifications" onClick={onClose} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium text-center shadow-lg shadow-emerald-500/30">
                        View All Notifications
                    </Link>
                    <button onClick={onClose} className="w-full py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all font-medium">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
