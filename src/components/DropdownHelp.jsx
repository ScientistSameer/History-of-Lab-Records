// src/components/DropdownHelp.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition';

function DropdownHelp({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

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
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full ${dropdownOpen && 'bg-gray-200 dark:bg-gray-800'}`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Need help?</span>
        <svg
          className="fill-current text-gray-500/80 dark:text-gray-400/80"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 7.5a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0v-4ZM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
          <path
            fillRule="evenodd"
            d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm6-8A6 6 0 1 1 2 8a6 6 0 0 1 12 0Z"
          />
        </svg>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
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
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-3">Need help?</div>
          <ul>
            <li>
              <Link
                className="font-medium text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                to="/labs"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <svg className="w-3 h-3 fill-current text-violet-500 shrink-0 mr-2" viewBox="0 0 12 12">
                  <path d="M11 0H1C.4 0 0 .4 0 1v10c0 .6.4 1 1 1h10c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1zM2 10H1V9h1v1zm0-2H1V7h1v1zm0-2H1V5h1v1zm0-2H1V3h1v1zm0-2H1V1h1v1zm9 8H3V1h8v9z"/>
                </svg>
                <span>Getting Started Guide</span>
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                to="/collaboration"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <svg className="w-3 h-3 fill-current text-violet-500 shrink-0 mr-2" viewBox="0 0 12 12">
                  <path d="M11.854.146a.5.5 0 00-.525-.116l-11 4a.5.5 0 00-.015.934l4.8 1.921 1.921 4.8A.5.5 0 007.5 12h.008a.5.5 0 00.462-.329l4-11a.5.5 0 00-.116-.525z" />
                </svg>
                <span>AI Collaboration Help</span>
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                to="/analytics"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <svg className="w-3 h-3 fill-current text-violet-500 shrink-0 mr-2" viewBox="0 0 12 12">
                  <path d="M0 11h12v1H0v-1zm1-1h2V4H1v6zm3 0h2V0H4v10zm3 0h2V5H7v5z"/>
                </svg>
                <span>Analytics Tutorial</span>
              </Link>
            </li>
            <li className="border-t border-gray-200 dark:border-gray-700/60 my-1"></li>
            <li>
              <a
                className="font-medium text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                href="mailto:support@ideallabs.com"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <svg className="w-3 h-3 fill-current text-violet-500 shrink-0 mr-2" viewBox="0 0 12 12">
                  <path d="M11.854.146a.5.5 0 00-.525-.116l-11 4a.5.5 0 00-.015.934l4.8 1.921 1.921 4.8A.5.5 0 007.5 12h.008a.5.5 0 00.462-.329l4-11a.5.5 0 00-.116-.525z" />
                </svg>
                <span>Contact Support</span>
              </a>
            </li>
            <li>
              <a
                className="font-medium text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                href="https://github.com/yourusername/lab-records"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <svg className="w-3 h-3 fill-current text-violet-500 shrink-0 mr-2" viewBox="0 0 12 12">
                  <path d="M10.5 0h-9A1.5 1.5 0 000 1.5v9A1.5 1.5 0 001.5 12h9a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 0zM10 7L8.207 5.207l-3 3-1.414-1.414 3-3L5 2h5v5z" />
                </svg>
                <span>Documentation</span>
              </a>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownHelp;