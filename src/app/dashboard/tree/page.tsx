'use client';

import { FaPlus, FaSyncAlt } from 'react-icons/fa';
import AddMemberModal from '@/components/AddMemberModal';
import { useFamilyData, FamilyMember } from '@/hooks/useFamilyData';
import { useState, useMemo } from 'react';

export default function FamilyTreePage() {
    const { loading, error, currentUser, familyMembers, canEdit, refreshData, addChild } = useFamilyData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Data-driven relationship finding
    const parents = useMemo(() => {
        if (!currentUser) return [];
        return familyMembers.filter(m => 
            m.id === currentUser.fatherId || 
            m.id === currentUser.motherId ||
            (currentUser.relation === 'Child' && (m.relation === 'Father' || m.relation === 'Mother'))
        );
    }, [currentUser, familyMembers]);

    const spouses = useMemo(() => {
        if (!currentUser) return [];
        return familyMembers.filter(m => 
            m.partnerId === currentUser.id || 
            currentUser.partnerId === m.id ||
            m.relation === 'Spouse'
        );
    }, [currentUser, familyMembers]);

    const children = useMemo(() => {
        if (!currentUser) return [];
        return familyMembers.filter(m => 
            m.fatherId === currentUser.id || 
            m.motherId === currentUser.id ||
            m.relation === 'Child'
        );
    }, [currentUser, familyMembers]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading family tree...</p>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Family Tree</h1>
                    <p className="text-gray-600 dark:text-gray-400">{familyMembers.length} Members</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                        onClick={refreshData}
                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        <FaSyncAlt /> Refresh
                    </button>
                    {canEdit ? (
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl hover:bg-emerald-700 flex-1 sm:flex-none"
                        >
                            <FaPlus /> Add Member
                        </button>
                    ) : (
                        <span className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">View-only access</span>
                    )}
                </div>
            </div>

            {/* Visual Tree */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-10 shadow-sm overflow-auto border dark:border-gray-800">
                <div className="min-w-[900px] mx-auto">
                    {/* Parents/Grandparents */}
                    {parents.length > 0 && (
                        <>
                            <div className="flex justify-center gap-12 mb-12">
                                {parents.map((member) => (
                                    <div key={member.id} className="text-center">
                                        <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-3xl mx-auto flex items-center justify-center mb-3 overflow-hidden border-2 border-amber-300 dark:border-amber-700">
                                            <img src={member.picture?.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'Member')}&background=f59e0b&color=ffffff`} alt={member.name} className="w-full h-full object-cover" />
                                        </div>
                                        <p className="font-semibold dark:text-gray-200">{member.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{member.relation}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Connector */}
                            <div className="flex justify-center mb-8">
                                <div className="h-8 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                            </div>
                        </>
                    )}

                    {/* Generation: User & Spouses */}
                    <div className="flex justify-center gap-20 mb-12">
                        {currentUser && (
                            <div className="text-center">
                                <div className="w-28 h-28 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl mx-auto flex items-center justify-center mb-3 border-4 border-emerald-500 overflow-hidden">
                                    <img src={currentUser.picture?.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=10b981&color=ffffff`} alt={currentUser.name} className="w-full h-full object-cover" />
                                </div>
                                <p className="font-bold text-lg dark:text-gray-200">{currentUser.name}</p>
                                <p className="text-sm text-emerald-600 dark:text-emerald-400">You</p>
                            </div>
                        )}
                        {spouses.map(spouse => (
                            <div key={spouse.id} className="text-center">
                                <div className="w-28 h-28 bg-pink-100 dark:bg-pink-900/30 rounded-3xl mx-auto flex items-center justify-center mb-3 border-4 border-pink-300 dark:border-pink-700 overflow-hidden">
                                    <img src={spouse.picture?.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(spouse.name || 'Spouse')}&background=f472b6&color=ffffff`} alt={spouse.name} className="w-full h-full object-cover" />
                                </div>
                                <p className="font-bold text-lg dark:text-gray-200">{spouse.name}</p>
                                <p className="text-sm text-pink-600 dark:text-pink-400">Spouse</p>
                            </div>
                        ))}
                    </div>

                    {/* Children */}
                    {children.length > 0 && (
                        <>
                            <div className="flex justify-center mb-4">
                                <div className="h-8 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                            </div>
                            <div className="flex justify-center gap-8">
                                {children.map((child) => (
                                    <div key={child.id} className="text-center">
                                        <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-3 overflow-hidden border-2 ${child.gender === 'male' ? 'bg-sky-100 dark:bg-sky-900/30 border-sky-300 dark:border-sky-700' : 'bg-rose-100 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700'}`}>
                                            <img src={child.picture?.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(child.name || 'Child')}&background=0ea5e9&color=ffffff`} alt={child.name} className="w-full h-full object-cover" />
                                        </div>
                                        <p className="font-semibold dark:text-gray-200">{child.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {child.gender === 'male' ? 'Son' : 'Daughter'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {children.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">No children added yet</p>
                            {canEdit ? (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-2xl hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                                >
                                    Add Member
                                </button>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                This is your family tree. Use the "Add Member" button to expand your lineage.
            </p>

            <AddMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addChild}
            />
        </div>
    );
}
