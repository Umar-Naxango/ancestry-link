'use client';

import { useState } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSyncAlt } from 'react-icons/fa';
import AddMemberModal from '@/components/AddMemberModal';
import { useFamilyData, FamilyMember } from '@/hooks/useFamilyData';

export default function MembersPage() {
    const { loading, error, familyMembers, canEdit, refreshData, addChild } = useFamilyData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredMembers = familyMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.relation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading members...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button 
                        onClick={refreshData}
                        className="px-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Family Members</h1>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-grow">
                        <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-4 py-3 w-full sm:w-80 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white"
                        />
                    </div>
                    <button 
                        onClick={refreshData}
                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        <FaSyncAlt /> Refresh
                    </button>
                    {canEdit ? (
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex justify-center items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 whitespace-nowrap"
                        >
                            <FaPlus /> Add Member
                        </button>
                    ) : (
                        <span className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">View-only access</span>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-sm overflow-hidden overflow-x-auto border dark:border-gray-800">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50 dark:bg-[#252525] border-b dark:border-gray-800">
                        <tr>
                            <th className="px-8 py-5 text-left text-gray-600 dark:text-gray-400">Member</th>
                            <th className="px-8 py-5 text-left text-gray-600 dark:text-gray-400">Relation</th>
                            <th className="px-8 py-5 text-left text-gray-600 dark:text-gray-400">Gender</th>
                            <th className="px-8 py-5 text-left text-gray-600 dark:text-gray-400">Birth Date</th>
                            <th className="px-8 py-5 text-left text-gray-600 dark:text-gray-400">Location</th>
                            <th className="px-8 py-5 text-left text-gray-600 dark:text-gray-400">Status</th>
                            <th className="px-8 py-5 text-right text-gray-600 dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map((member) => (
                            <tr key={member.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#252525] transition">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <img src={member.picture?.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'Member')}&background=10b981&color=ffffff`} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-gray-200">{member.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-gray-600 dark:text-gray-400">{member.relation}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-4 py-1 rounded-full text-xs ${member.gender === 'male' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400'}`}>
                                        {member.gender}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-gray-600 dark:text-gray-400">{member.birthDate}</td>
                                <td className="px-8 py-5 text-gray-600 dark:text-gray-400 text-sm">{member.location}</td>
                                <td className="px-8 py-5">
                                    <span className="px-4 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">
                                        {member.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right space-x-3">
                                    <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                                        <FaEdit size={18} />
                                    </button>
                                    <button className="text-red-500 hover:text-red-600">
                                        <FaTrash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredMembers.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No members found</p>
                </div>
            )}

            <AddMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addChild}
            />
        </div>
    );
}
