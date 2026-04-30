'use client';

import { FaBell, FaUserPlus, FaCalendarAlt, FaCog } from 'react-icons/fa';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: 'member',
      icon: <FaUserPlus className="text-emerald-600 dark:text-emerald-400" />,
      title: 'New Family Member',
      desc: 'Aisha added a new child, Zainab, to the family tree.',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      type: 'event',
      icon: <FaCalendarAlt className="text-blue-600 dark:text-blue-400" />,
      title: 'Upcoming Birthday',
      desc: "Ahmed Umar's birthday is coming up in 3 days. Send a wish!",
      time: '1 day ago',
      unread: true,
    },
    {
      id: 3,
      type: 'system',
      icon: <FaCog className="text-purple-600 dark:text-purple-400" />,
      title: 'Feature Update',
      desc: 'You can now export your complete family tree to high-resolution PDF.',
      time: '2 days ago',
      unread: false,
    },
    {
      id: 4,
      type: 'member',
      icon: <FaUserPlus className="text-emerald-600 dark:text-emerald-400" />,
      title: 'New Collaboration Request',
      desc: 'Chinedu Okoro wants to collaborate on your family tree branch.',
      time: '4 days ago',
      unread: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FaBell className="text-emerald-600 dark:text-emerald-400" /> Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Stay updated with your family events and system alerts</p>
        </div>
        <button className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
          Mark all as read
        </button>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] border dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {notifications.map((note) => (
            <div 
              key={note.id} 
              className={`p-6 flex items-start gap-5 transition hover:bg-gray-50 dark:hover:bg-[#252525] ${
                note.unread ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#252525] flex items-center justify-center shrink-0 border dark:border-gray-800">
                {note.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-lg font-semibold ${note.unread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                    {note.title}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                    {note.time}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{note.desc}</p>
                
                {note.type === 'member' && note.title.includes('Collaboration') && (
                  <div className="mt-4 flex gap-3">
                    <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition">
                      Accept
                    </button>
                    <button className="px-4 py-2 border dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-[#333] transition">
                      Decline
                    </button>
                  </div>
                )}
              </div>
              {note.unread && (
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-sm" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
