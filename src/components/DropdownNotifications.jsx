// src/components/DropdownNotifications.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition';

function DropdownNotifications({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // Sample notifications (replace with real data from backend)
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'collaboration',
        icon: '🤝',
        title: 'New collaboration match found',
        message: 'AI Lab has 92% match score with Computer Vision Lab',
        date: 'Today, 2:30 PM',
        read: false,
        link: '/collaboration',
      },
      {
        id: 2,
        type: 'lab',
        icon: '🔬',
        title: 'New lab added',
        message: 'Quantum Computing Lab has been successfully added to the system',
        date: 'Today, 11:15 AM',
        read: false,
        link: '/labs',
      },
      {
        id: 3,
        type: 'workload',
        icon: '⚠️',
        title: 'High workload alert',
        message: 'Cybersecurity Lab is at 85% capacity - consider resource allocation',
        date: 'Yesterday, 4:20 PM',
        read: false,
        link: '/analytics',
      },
      {
        id: 4,
        type: 'researcher',
        icon: '👤',
        title: 'Researcher profile updated',
        message: 'Dr. Ahmed Khan updated their research profile',
        date: '2 days ago',
        read: true,
        link: '/researchers',
      },
      {
        id: 5,
        type: 'email',
        icon: '📧',
        title: 'Collaboration email sent',
        message: 'Email successfully sent to Bioinformatics Lab',
        date: '3 days ago',
        read: true,
        link: '/collaboration',
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [dropdownOpen]); // Added dependency for safety

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full ${dropdownOpen && 'bg-gray-200 dark:bg-gray-800'}`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Notifications</span>
        <svg
          className="fill-current text-gray-500/80 dark:text-gray-400/80"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V12l2.699-1.542A7.454 7.454 0 006.5 11c3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0z" />
          <path d="M16 9.5c0-.987-.429-1.897-1.147-2.639C14.124 10.348 10.66 13 6.5 13c-.103 0-.206-.003-.309-.008C7.856 14.195 10.041 15 12.5 15l2.699 1.542V13.42c.629-.847 1-1.846 1-2.92z" />
        </svg>
        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-gray-100 dark:border-gray-900 rounded-full"></div>
        )}
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full -mr-48 sm:mr-0 min-w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-4 flex items-center justify-between">
            <span>Notifications ({unreadCount})</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-violet-500 hover:text-violet-600 normal-case text-xs"
              >
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <li key={notification.id} className="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
                <Link
                  className={`block py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/20 ${!notification.read ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''}`}
                  to={notification.link}
                  onClick={() => {
                    markAsRead(notification.id);
                    setDropdownOpen(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{notification.icon}</span>
                    <div className="flex-1">
                      <span className="block text-sm mb-1">
                        <span className="font-medium text-gray-800 dark:text-gray-100">{notification.title}</span>
                      </span>
                      <span className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {notification.message}
                      </span>
                      <span className="block text-xs font-medium text-gray-400 dark:text-gray-500">
                        {notification.date}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {notifications.length === 0 && (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>
      </Transition>
    </div>
  );
}

export default DropdownNotifications;