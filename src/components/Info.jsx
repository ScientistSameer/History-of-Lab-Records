// src/components/Info.jsx

import React, { useState } from 'react';
import Transition from './Transition';

function Info({
  children,
  className,
  containerClassName,
  position = 'top' // ✅ NEW: Add position prop (default 'top')
}) {

  const [infoOpen, setInfoOpen] = useState(false);

  // ✅ NEW: Position classes based on prop
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setInfoOpen(true)}
      onMouseLeave={() => setInfoOpen(false)}
      onFocus={() => setInfoOpen(true)}
      onBlur={() => setInfoOpen(false)}
    >
      <button
        className="block"
        aria-haspopup="true"
        aria-expanded={infoOpen}
        onClick={(e) => e.preventDefault()}
      >
        <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 16 16">
          <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
        </svg>
      </button>
      
      {/* ✅ UPDATED: Use position-based classes */}
      <div className={`z-10 absolute ${positionClasses[position]}`}>
        <Transition
          show={infoOpen}
          tag="div"
          className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-lg overflow-hidden ${containerClassName}`}
          enter="transition ease-out duration-200 transform"
          enterStart="opacity-0 -translate-y-2"
          enterEnd="opacity-100 translate-y-0"
          leave="transition ease-out duration-200"
          leaveStart="opacity-100"
          leaveEnd="opacity-0"
        >
          {children}
        </Transition>
      </div>
    </div>
  );
}

export default Info;