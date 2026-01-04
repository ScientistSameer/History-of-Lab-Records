// src/components/ModalSearch.jsx

import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Transition from '../utils/Transition';

function ModalSearch({ id, searchId, modalOpen, setModalOpen }) {
  const modalContent = useRef(null);
  const searchInput = useRef(null);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  // Sample searchable content (expand this with your actual data)
  const searchableContent = [
    // Pages
    { type: 'page', title: 'Dashboard', path: '/dashboard', description: 'Overview and analytics' },
    { type: 'page', title: 'Labs Management', path: '/labs', description: 'Lab profiles and performance' },
    { type: 'page', title: 'Researchers', path: '/researchers', description: 'Researcher profiles and workload' },
    { type: 'page', title: 'Analytics', path: '/analytics', description: 'Advanced analytics and insights' },
    { type: 'page', title: 'Collaboration', path: '/collaboration', description: 'AI-powered collaboration opportunities' },
    { type: 'page', title: 'Profile', path: '/profile', description: 'IDEAL Labs profile settings' },
    
    // Features
    { type: 'feature', title: 'AI Collaboration Matching', path: '/collaboration', description: 'Find collaboration opportunities using AI' },
    { type: 'feature', title: 'Document Ingestion', path: '/labs', description: 'Upload and extract lab data from documents' },
    { type: 'feature', title: 'Workload Analytics', path: '/analytics', description: 'View lab workload distribution' },
    { type: 'feature', title: 'Researcher Growth Trends', path: '/analytics', description: 'Year-over-year comparison' },
    { type: 'feature', title: 'Domain Distribution', path: '/dashboard', description: 'Labs by research domain' },
    
    // Help topics
    { type: 'help', title: 'How to add a new lab', path: '/labs', description: 'Manual or document upload' },
    { type: 'help', title: 'Understanding collaboration scores', path: '/collaboration', description: 'Score calculation methodology' },
    { type: 'help', title: 'Exporting analytics data', path: '/analytics', description: 'Download reports and charts' },
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modalOpen || modalContent.current.contains(target)) return;
      setModalOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Close on ESC
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  // Auto focus input
  useEffect(() => {
    if (modalOpen) {
      searchInput.current.focus();
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [modalOpen]);

  // Search function
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const results = searchableContent.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
  };

  // Handle result click
  const handleResultClick = (result) => {
    // Save to recent searches
    const newRecent = [
      { title: result.title, path: result.path, type: result.type },
      ...recentSearches.filter(r => r.title !== result.title)
    ].slice(0, 5);
    
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));

    // Navigate
    navigate(result.path);
    setModalOpen(false);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-gray-900/30 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />

      {/* Modal dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className="bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700/60 
          overflow-auto max-w-2xl w-full max-h-full rounded-lg shadow-lg"
        >
          {/* Search form */}
          <form 
            className="border-b border-gray-200 dark:border-gray-700/60"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative">
              <label htmlFor={searchId} className="sr-only">
                Search
              </label>
              <input
                id={searchId}
                ref={searchInput}
                type="search"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 border-0 
                  focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500
                  appearance-none py-3 pl-10 pr-4"
                placeholder="Search labs, researchers, analytics, help..."
              />
              <button className="absolute inset-0 right-auto group" type="submit" aria-label="Search">
                <svg
                  className="shrink-0 fill-current text-gray-400 dark:text-gray-500 
                  group-hover:text-gray-500 dark:group-hover:text-gray-400 ml-4 mr-2"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </div>
          </form>

          <div className="py-4 px-2 max-h-96 overflow-y-auto">
            {/* Search Results */}
            {searchQuery && searchResults.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2 flex items-center justify-between">
                  <span>Search Results ({searchResults.length})</span>
                </div>
                <ul className="text-sm">
                  {searchResults.map((result, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-start p-2 text-gray-800 dark:text-gray-100
                        hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg text-left"
                      >
                        {result.type === 'page' && (
                          <svg className="fill-current text-violet-500 shrink-0 mr-3 mt-0.5" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M14 0H2c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h8l5-5V1c0-.6-.4-1-1-1zM3 2h10v8H9v4H3V2z" />
                          </svg>
                        )}
                        {result.type === 'feature' && (
                          <svg className="fill-current text-sky-500 shrink-0 mr-3 mt-0.5" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M8 0L0 6l8 5 8-5-8-6zm0 10L3 7l5-3 5 3-5 3z"/>
                          </svg>
                        )}
                        {result.type === 'help' && (
                          <svg className="fill-current text-green-500 shrink-0 mr-3 mt-0.5" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"/>
                          </svg>
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{result.title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{result.description}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* No results */}
            {searchQuery && searchResults.length === 0 && (
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">No results found for "{searchQuery}"</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Try a different search term</p>
              </div>
            )}

            {/* Recent Searches */}
            {!searchQuery && recentSearches.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2 flex items-center justify-between">
                  <span>Recent searches</span>
                  <button 
                    onClick={clearRecentSearches}
                    className="text-violet-500 hover:text-violet-600 normal-case text-xs"
                  >
                    Clear
                  </button>
                </div>
                <ul className="text-sm">
                  {recentSearches.map((item, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleResultClick(item)}
                        className="w-full flex items-center p-2 text-gray-800 dark:text-gray-100
                        hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg text-left"
                      >
                        <svg className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                          <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                        </svg>
                        <span>{item.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Links */}
            {!searchQuery && (
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">
                  Quick Access
                </div>
                <ul className="text-sm">
                  <QuickLink 
                    icon="dashboard"
                    title="Dashboard" 
                    desc="Overview & Analytics" 
                    path="/dashboard"
                    onClick={() => setModalOpen(false)}
                  />
                  <QuickLink 
                    icon="labs"
                    title="Labs Management" 
                    desc="View and manage labs" 
                    path="/labs"
                    onClick={() => setModalOpen(false)}
                  />
                  <QuickLink 
                    icon="collaboration"
                    title="AI Collaboration" 
                    desc="Find opportunities" 
                    path="/collaboration"
                    onClick={() => setModalOpen(false)}
                  />
                  <QuickLink 
                    icon="analytics"
                    title="Advanced Analytics" 
                    desc="Deep insights" 
                    path="/analytics"
                    onClick={() => setModalOpen(false)}
                  />
                </ul>
              </div>
            )}
          </div>
        </div>
      </Transition>
    </>
  );
}

export default ModalSearch;

// Quick Link Component
function QuickLink({ icon, title, desc, path, onClick }) {
  const icons = {
    dashboard: (
      <svg className="fill-current text-violet-500 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
        <path d="M0 0h7v7H0V0zm9 0h7v7H9V0zM0 9h7v7H0V9z"/>
      </svg>
    ),
    labs: (
      <svg className="fill-current text-sky-500 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
        <path d="M14 0H2c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h8l5-5V1c0-.6-.4-1-1-1zM3 2h10v8H9v4H3V2z" />
      </svg>
    ),
    collaboration: (
      <svg className="fill-current text-green-500 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
        <path d="M11 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-1 1c-2 0-6 1-6 3v2h12v-2c0-2-4-3-6-3zM5 8c1.7 0 3-1.3 3-3S6.7 2 5 2 2 3.3 2 5s1.3 3 3 3z"/>
      </svg>
    ),
    analytics: (
      <svg className="fill-current text-yellow-500 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
        <path d="M0 15h16v1H0v-1zm3-1h2V6H3v8zm4 0h2V0H7v14zm4 0h2V9h-2v5z"/>
      </svg>
    ),
  };

  return (
    <li>
      <Link
        className="flex items-center p-2 text-gray-800 dark:text-gray-100
        hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
        to={path}
        onClick={onClick}
      >
        {icons[icon]}
        <span>
          <span className="font-medium">{title}</span> –{' '}
          <span className="text-gray-600 dark:text-gray-400">{desc}</span>
        </span>
      </Link>
    </li>
  );
}