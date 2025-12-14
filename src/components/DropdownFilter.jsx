import React, { useState, useRef, useEffect } from "react";
import Transition from "../utils/Transition";

const DropdownFilter = ({ align }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);

  const filtersRef = {
    ByLab: useRef(null),
    ByDomain: useRef(null),
    ByResearcher: useRef(null),
    ByYear: useRef(null),
    BySuccessRate: useRef(null),
    ByWorkloadLevel: useRef(null),
    ByProductivityTrend: useRef(null),
  };

  const clearFilters = () => {
    Object.values(filtersRef).forEach((ref) => {
      if (ref.current) ref.current.checked = false;
    });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownOpen) return;
      if (!dropdown.current.contains(e.target) && !trigger.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [dropdownOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="btn px-2.5 bg-white dark:bg-gray-800 border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 text-gray-400 dark:text-gray-500"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="sr-only">Filter</span>
        <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16">
          <path d="M0 3a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1ZM3 8a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM7 12a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Z" />
        </svg>
      </button>

      <Transition
        show={dropdownOpen}
        tag="div"
        className={`origin-top-right z-10 absolute top-full left-0 min-w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 pt-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${align === "right" ? "md:left-auto md:right-0" : "md:left-0 md:right-auto"}`}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div ref={dropdown}>
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-3">
            Filters
          </div>
          <ul className="mb-4">
            {Object.entries(filtersRef).map(([key, ref]) => (
              <li key={key} className="py-1 px-3">
                <label className="flex items-center">
                  <input ref={ref} type="checkbox" className="form-checkbox" />
                  <span className="text-sm font-medium ml-2">{key.replace(/By/, "By ")}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="py-2 px-3 border-t border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-700/20">
            <ul className="flex items-center justify-between">
              <li>
                <button onClick={clearFilters} className="btn-xs bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-red-500">
                  Clear
                </button>
              </li>
              <li>
                <button onClick={() => setDropdownOpen(false)} className="btn-xs bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                  Apply
                </button>
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default DropdownFilter;
