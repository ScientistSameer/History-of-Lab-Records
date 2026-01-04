import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";

function Sidebar({ sidebarExpanded, setSidebarExpanded }) {
  const { pathname } = useLocation();

  const linkClass = (active) =>
    `block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
      active ? "" : "hover:text-gray-900 dark:hover:text-white"
    }`;

  const iconClass = (active) =>
    `shrink-0 fill-current ${
      active ? "text-violet-500" : "text-gray-400 dark:text-gray-500"
    }`;

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 h-full">
      <div className="flex flex-col flex-1 overflow-y-auto pt-5 pb-4">

        {/* Branding */}
        <div className="px-4 mb-4">
          <NavLink to="/" className="text-lg font-bold text-gray-800 dark:text-white">
            IDEAL LABS-Collaboration Portal
          </NavLink>
        </div>

        <div className="flex-1 px-2">

          <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3 mt-3">
            MAIN
          </h3>
          <ul className="mt-3 space-y-1">

            <NavLink to="/Dashboard" className={linkClass(pathname === "/Dashboard")}>
              <div className="flex items-center px-3 py-2">
                <svg className={iconClass(pathname === "/Dashboard")} width="16" height="16" viewBox="0 0 16 16">
                  <path d="M2 2h4v4H2V2zm0 8h4v4H2v-4zm8-8h4v4h-4V2zm0 8h4v4h-4v-4z" />
                </svg>
                <span className="ml-4 text-sm font-medium">Dashboard</span>
              </div>
            </NavLink>

            <NavLink to="/Labs" className={linkClass(pathname === "/Labs")}>
              <div className="flex items-center px-3 py-2">
                <svg className={iconClass(pathname === "/Labs")} width="16" height="16" viewBox="0 0 16 16">
                  <path d="M2 2h12v12H2V2z" />
                </svg>
                <span className="ml-4 text-sm font-medium">Labs</span>
              </div>
            </NavLink>

            <NavLink to="/Researchers" className={linkClass(pathname === "/Researchers")}>
              <div className="flex items-center px-3 py-2">
                <svg className={iconClass(pathname === "/Researchers")} width="16" height="16" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm0 1c-2 0-6 1-6 3v1h12v-1c0-2-4-3-6-3z" />
                </svg>
                <span className="ml-4 text-sm font-medium">Researchers</span>
              </div>
            </NavLink>
          </ul>

          {/* ANALYTICS */}
          <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3 mt-6">
            INSIGHTS
          </h3>
          <ul className="mt-3 space-y-1">

            <NavLink to="/Analytics" className={linkClass(pathname === "/Analytics")}>
              <div className="flex items-center px-3 py-2">
                <svg className={iconClass(pathname === "/Analytics")} width="16" height="16" viewBox="0 0 16 16">
                  <path d="M2 10h12v2H2v-2zm0-4h8v2H2V6zm0-4h4v2H2V2z" />
                </svg>
                <span className="ml-4 text-sm font-medium">Analytics</span>
              </div>
            </NavLink>

            <NavLink to="/Collaboration" className={linkClass(pathname === "/Collaboration")}>
              <div className="flex items-center px-3 py-2">
                <svg className={iconClass(pathname === "/Collaboration")} width="16" height="16" viewBox="0 0 16 16">
                  <path d="M2 2h12v12H2V2z" />
                </svg>
                <span className="ml-4 text-sm font-medium">Collaboration</span>
              </div>
            </NavLink>
          </ul>

          {/* SETTINGS */}
          <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3 mt-6">
            SETTINGS
          </h3>
          <ul className="mt-3 space-y-1">
            <NavLink to="/Profile" className={linkClass(pathname === "/Profile")}>
              <div className="flex items-center px-3 py-2">
                <svg className={iconClass(pathname === "/Profile")} width="16" height="16" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
                <span className="ml-4 text-sm font-medium">IDEAL Labs Profile</span>
              </div>
            </NavLink>
          </ul>

        </div>
      </div>
    </div>
  );
}

export default Sidebar;
