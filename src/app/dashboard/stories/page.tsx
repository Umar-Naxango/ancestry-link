'use client';

import { useState } from 'react';
import { FaPlus, FaHeart, FaComment, FaSyncAlt } from 'react-icons/fa';
import AddStoryModal from '@/components/AddStoryModal';
import { useFamilyData } from '@/hooks/useFamilyData';

export default function StoriesPage() {
    const { loading, error, stories, canEdit, refreshData, addStory } = useFamilyData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'memory': return 'bg-blue-500';
            case 'achievement': return 'bg-amber-500';
            case 'tradition': return 'bg-emerald-500';
            case 'milestone': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'memory': return 'Memory';
            case 'achievement': return 'Achievement';
            case 'tradition': return 'Tradition';
            case 'milestone': return 'Milestone';
            default: return category;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading stories...</p>
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
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Stories & Memories</h1>
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
                            <FaPlus /> Add New Story
                        </button>
                    ) : (
                        <span className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">View-only access</span>
                    )}
                </div>
            </div>

            {stories.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No stories yet</p>
                    {canEdit ? (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-2xl hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                        >
                            Create Your First Story
                        </button>
                    ) : null}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stories.map(story => (
                        <div key={story.id} className="bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition border dark:border-gray-800">
                            <div className="relative">
                                <img src={story.image} alt={story.title} className="w-full h-56 object-cover" />
                                <span className={`absolute top-4 left-4 px-3 py-1 ${getCategoryColor(story.category)} text-white text-xs font-medium rounded-full`}>
                                    {getCategoryLabel(story.category)}
                                </span>
                            </div>
                            <div className="p-6">
                                <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-gray-200">{story.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{story.description}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    <span>{story.date}</span>
                                    {story.location && (
                                        <>
                                            <span>&middot;</span>
                                            <span>{story.location}</span>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 pt-4 border-t dark:border-gray-800">
                                    <div className="flex items-center gap-5">
                                        <span className="flex items-center gap-1"><FaHeart /> {story.likes}</span>
                                        <span className="flex items-center gap-1"><FaComment /> {story.comments}</span>
                                    </div>
                                    <button className="text-emerald-600 dark:text-emerald-400 font-medium hover:text-emerald-700 dark:hover:text-emerald-300">
                                        Read Story
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddStoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addStory}
            />
        </div>
    );
}
