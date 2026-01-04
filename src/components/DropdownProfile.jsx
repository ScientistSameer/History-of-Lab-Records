import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import Transition from '../utils/Transition';
import { getProfile } from '../api/users'; // Import your API helper

function DropdownProfile({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null); // State for API data
  const [loading, setLoading] = useState(true);
  
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const navigate = useNavigate();

  // 1. Fetch User Data on Mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Optional: redirect to login if unauthorized
        // navigate('/signin');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Close on outside click (Existing logic)
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Close on ESC (Existing logic)
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  // Handle Sign Out
  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setDropdownOpen(false);
    navigate('/signin');
  };

  if (loading) return <div className="ml-2 w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  const avatarUrl = userData?.avatar || "https://i.pravatar.cc/150?img=12";
  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img className="w-8 h-8 rounded-full" src={avatarUrl} width="32" height="32" alt={userData?.name || "User"}/>
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
            {userData?.name || "Guest User"}
          </span>
          <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" viewBox="0 0 12 12">
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div ref={dropdown} onFocus={() => setDropdownOpen(true)} onBlur={() => setDropdownOpen(false)}>
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
            <div className="font-medium text-gray-800 dark:text-gray-100">{userData?.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{userData?.email}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Lab Manager</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">IDEAL Labs</div>

            {/* Note: Role and Lab aren't in your current User Schema/Model yet */}
          </div>
          <ul>
            <li>
              <Link className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3" to="/settings" onClick={() => setDropdownOpen(false)}>
                Settings
              </Link>
            </li>
            <li>
              <button
                className="w-full text-left font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownProfile;