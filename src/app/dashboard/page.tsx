'use client';

import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaChild, FaHeart, FaCalendarAlt, FaVenusMars, FaEnvelope, FaMapMarkerAlt, FaPhone, FaSyncAlt, FaTrash } from 'react-icons/fa';
import AddMemberModal from '@/components/AddMemberModal';
import UpdateProfileModal from '@/components/UpdateProfileModal';
import AddSpouseModal from '@/components/AddSpouseModal';
import UpdateMemberModal from '@/components/UpdateMemberModal';
import OnboardingModal from '@/components/OnboardingModal';
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
    updateProfile,
    updateMember,
    deleteMember
  } = useFamilyData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSpouseModalOpen, setIsSpouseModalOpen] = useState(false);
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const spouses = familyMembers.filter(m => m.relation === 'Spouse');
  const children = familyMembers.filter(m => m.relation === 'Child');
  const hasAnyMember = familyMembers.length > 0;
  
  const isProfileIncomplete = !currentUser?.birthDate || !currentUser?.location;

  useEffect(() => {
    if (!loading && currentUser && isProfileIncomplete) {
      setIsOnboardingOpen(true);
    }
  }, [loading, currentUser, isProfileIncomplete]);

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

  const profileImage = currentUser?.picture?.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=10b981&color=ffffff`;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal & family information</p>
        </div>
        <button 
          onClick={refreshData}
          className="flex items-center gap-2 px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition font-medium"
        >
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
          <p className="font-medium">Notice</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-xl shadow-emerald-500/5 overflow-hidden border dark:border-gray-800">
          <div className="h-48 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
            <div className="absolute -bottom-16 left-8">
              <img src={profileImage} alt={currentUser.name} className="w-32 h-32 rounded-[2rem] border-4 border-white dark:border-gray-800 object-cover shadow-2xl" />
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{currentUser.name}</h2>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-sm font-semibold capitalize">{currentUser.gender}</span>
                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-4 py-1.5 rounded-full text-sm font-medium">ID: MEM-{currentUser.id.slice(0, 8)}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsUpdateModalOpen(true)}
                disabled={!canEdit}
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 w-full md:w-auto font-bold"
              >
                <FaEdit /> Edit Profile
              </button>
            </div>

            {/* Contact & Location */}
            <div className="grid md:grid-cols-2 gap-6 mt-8 p-6 bg-gray-50 dark:bg-[#252525] rounded-3xl">
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                  <FaEnvelope className="text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium">Email Address</span>
                  <span className="text-sm font-semibold truncate">{currentUser.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                  <FaPhone className="text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium">Phone Number</span>
                  <span className="text-sm font-semibold">{currentUser.phone || 'Not provided'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                  <FaMapMarkerAlt className="text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium">Home Location</span>
                  <span className="text-sm font-semibold">{currentUser.location || 'Not provided'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                  <FaCalendarAlt className="text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium">Birth Date</span>
                  <span className="text-sm font-semibold">{currentUser.birthDate || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spouse Section */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] p-8 shadow-xl shadow-emerald-500/5 border dark:border-gray-800 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-3 dark:text-gray-200">
              <div className="p-2 bg-red-100 dark:bg-red-950/30 rounded-xl">
                <FaHeart className="text-red-500" />
              </div>
              Spouse
            </h3>
            {canEdit && spouses.length === 0 && (
              <button 
                onClick={() => setIsSpouseModalOpen(true)} 
                className="text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:underline"
              >
                + Add
              </button>
            )}
          </div>
          
          {spouses.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
              <p className="text-gray-400 text-sm italic">No spouse added</p>
            </div>
          ) : (
            spouses.map(sp => (
              <div key={sp.id} className="group relative border dark:border-gray-800 rounded-3xl p-4 hover:border-emerald-500 transition-all">
                <div className="flex items-center gap-4">
                  <img src={sp.picture?.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(sp.name || 'Spouse')}&background=f472b6&color=ffffff`} alt={sp.name} className="w-14 h-14 rounded-2xl object-cover shadow-md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold dark:text-gray-200 truncate">{sp.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{sp.birthDate ? `Born ${sp.birthDate}` : 'No date'}</p>
                  </div>
                  {canEdit && (
                    <button 
                      onClick={() => { setSelectedMember(sp); setIsEditMemberModalOpen(true); }}
                      className="p-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-emerald-600 transition-all"
                    >
                      <FaEdit />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Children Section */}
      <div className="mt-12 bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] p-10 shadow-xl shadow-emerald-500/5 border dark:border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <h3 className="text-2xl font-bold flex items-center gap-4 dark:text-gray-200">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/30 rounded-2xl">
              <FaChild className="text-emerald-600" />
            </div>
            Children ({children.length})
          </h3>
          {canEdit && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 font-bold"
            >
              <FaPlus /> Add Child
            </button>
          )}
        </div>

        {children.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem]">
            <p className="text-gray-400 mb-6 italic">Build your family tree by adding your children</p>
            {canEdit && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-2xl hover:bg-emerald-200 dark:hover:bg-emerald-900/50 font-bold transition-all"
              >
                Add Your First Child
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {children.map(child => (
              <div key={child.id} className="group relative border dark:border-gray-800 rounded-[2rem] p-6 hover:shadow-xl hover:border-emerald-500 transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <img src={child.picture?.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(child.name || 'Child')}&background=0ea5e9&color=ffffff`} alt={child.name} className="w-24 h-24 rounded-[1.5rem] object-cover shadow-lg group-hover:scale-105 transition-transform" />
                    {canEdit && (
                      <button 
                        onClick={() => { setSelectedMember(child); setIsEditMemberModalOpen(true); }}
                        className="absolute -top-2 -right-2 p-2 bg-white dark:bg-gray-800 text-gray-400 hover:text-emerald-600 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <FaEdit />
                      </button>
                    )}
                  </div>
                  <h4 className="font-bold text-xl dark:text-gray-200 mb-1">{child.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <FaCalendarAlt size={12} /> {child.birthDate || 'No date'}
                  </p>
                  <span className="mt-3 px-4 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    {child.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
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
      <UpdateMemberModal
        isOpen={isEditMemberModalOpen}
        onClose={() => { setIsEditMemberModalOpen(false); setSelectedMember(null); }}
        onUpdate={updateMember}
        onDelete={deleteMember}
        member={selectedMember}
      />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={updateProfile}
        initialData={{ name: currentUser.name, email: currentUser.email, photo: currentUser.picture }}
      />
    </div>
  );
}

