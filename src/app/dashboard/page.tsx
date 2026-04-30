'use client';

import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaChild, FaHeart, FaCalendarAlt, FaVenusMars, FaEnvelope, FaMapMarkerAlt, FaPhone, FaSyncAlt } from 'react-icons/fa';
import AddMemberModal from '@/components/AddMemberModal';
import UpdateProfileModal from '@/components/UpdateProfileModal';
import AddSpouseModal from '@/components/AddSpouseModal';
import { useFamilyData } from '@/hooks/useFamilyData';

export default function ProfilePage() {
  const { 
    loading, 
    error, 
    currentUser, 
    familyMembers, 
    canEdit,
    refreshData, 
    addChild, 
    addSpouse, 
    updateProfile 
  } = useFamilyData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSpouseModalOpen, setIsSpouseModalOpen] = useState(false);
  const [hasAutoOpenedOnboarding, setHasAutoOpenedOnboarding] = useState(false);

  const spouses = familyMembers.filter(m => m.relation === 'Spouse');
  const children = familyMembers.filter(m => m.relation === 'Child');
  const hasAnyMember = familyMembers.length > 0;
  const profileImage = currentUser?.picture?.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=10b981&color=ffffff`;

  const isMale = currentUser?.gender === 'male';

  useEffect(() => {
    if (!loading && currentUser && canEdit && !hasAnyMember && !hasAutoOpenedOnboarding) {
      setIsModalOpen(true);
      setHasAutoOpenedOnboarding(true);
    }
  }, [loading, currentUser, hasAnyMember, hasAutoOpenedOnboarding, canEdit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading family data...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal & family information</p>
        </div>
        <button 
          onClick={refreshData}
          className="flex items-center gap-2 px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition"
        >
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
          <p className="font-medium">Setup note</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {!hasAnyMember && canEdit && (
        <div className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/40 dark:bg-emerald-900/20">
          <h2 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200">Welcome! Let's add your first family member.</h2>
          <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">Start with a child or a close family member. This helps us build your tree and personalize your dashboard.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
          >
            <FaPlus /> Add First Member
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-sm overflow-hidden border dark:border-gray-800">
          <div className="h-48 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
            <div className="absolute -bottom-16 left-8">
              <img src={profileImage} alt={currentUser.name} className="w-32 h-32 rounded-3xl border-4 border-white object-cover shadow-lg" />
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{currentUser.name}</h2>
                <div className="flex gap-3 mt-2">
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-1 rounded-full text-sm font-medium capitalize">{currentUser.gender}</span>
                  <span className="text-gray-500 dark:text-gray-400">ID: MEM-{currentUser.id}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsUpdateModalOpen(true)}
                disabled={!canEdit}
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl hover:bg-emerald-700 w-full md:w-auto"
              >
                <FaEdit /> Update Profile
              </button>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <FaEnvelope className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm truncate">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <FaPhone className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm">{currentUser.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <FaMapMarkerAlt className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm">{currentUser.location}</span>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-50 dark:bg-[#252525] rounded-2xl p-6 border dark:border-gray-800">
                <FaCalendarAlt className="text-emerald-600 dark:text-emerald-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Birth Date</p>
                <p className="text-2xl font-semibold mt-1 dark:text-gray-200">{currentUser.birthDate}</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#252525] rounded-2xl p-6 border dark:border-gray-800">
                <FaVenusMars className="text-purple-600 dark:text-purple-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                <p className="text-2xl font-semibold mt-1 dark:text-gray-200 capitalize">{currentUser.gender}</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#252525] rounded-2xl p-6 border dark:border-gray-800">
                <FaChild className="text-blue-600 dark:text-blue-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                <p className="text-2xl font-semibold mt-1 dark:text-gray-200">{currentUser.age} years</p>
              </div>
            </div>
          </div>
        </div>

        {/* Spouse Section */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 shadow-sm border dark:border-gray-800">
          <div className="flex justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-3 dark:text-gray-200"><FaHeart className="text-red-500" /> Spouse(s)</h3>
            {canEdit && isMale && spouses.length < 4 && <button onClick={() => setIsSpouseModalOpen(true)} className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">+ Add Spouse</button>}
          </div>
          {spouses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No spouse added yet</p>
          ) : (
            spouses.map(sp => (
              <div key={sp.id} className="border dark:border-gray-800 rounded-2xl p-5 mb-3 last:mb-0">
                <div className="flex items-center gap-3">
                  <img src={sp.picture?.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(sp.name || 'Spouse')}&background=f472b6&color=ffffff`} alt={sp.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold dark:text-gray-200">{sp.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Married {sp.birthDate}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Children Section */}
      <div className="mt-10 bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 shadow-sm border dark:border-gray-800">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-semibold flex items-center gap-3 dark:text-gray-200"><FaChild className="text-emerald-600 dark:text-emerald-400" /> Children ({children.length})</h3>
          {canEdit ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl hover:bg-emerald-700"
            >
              <FaPlus /> Add Child
            </button>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">View-only access</span>
          )}
        </div>

        {children.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No children added yet</p>
            {canEdit ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-2xl hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
              >
                Add Your First Child
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map(child => (
              <div key={child.id} className="border dark:border-gray-800 rounded-3xl p-6 hover:shadow-md transition">
                <img src={child.picture?.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(child.name || 'Child')}&background=0ea5e9&color=ffffff`} alt={child.name} className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover" />
                <h4 className="font-semibold text-lg text-center dark:text-gray-200">{child.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Born: {child.birthDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addChild}
      />
      <UpdateProfileModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        currentName={currentUser.name}
        currentBirthDate={currentUser.birthDate}
        currentPhoto={currentUser.picture}
        currentPhone={currentUser.phone}
        currentEmail={currentUser.email}
        currentLocation={currentUser.location}
        onUpdate={updateProfile}
      />
      <AddSpouseModal
        isOpen={isSpouseModalOpen}
        onClose={() => setIsSpouseModalOpen(false)}
        onAdd={addSpouse}
      />
    </div>
  );
}
