import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import './css/style.css';
import './charts/ChartjsConfig';

// Pages
import Dashboard from './pages/Dashboard';
import Labs from './pages/Labs';
import Researchers from './pages/Researchers';
import Analytics from './pages/Analytics';
import Collaboration from './pages/Collaboration';
import Profile from './pages/Profile';

function App() {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0 });
    document.documentElement.style.scrollBehavior = '';
  }, [location.pathname]);

  return (
    <Routes>
      {/* Redirect root to Dashboard */}
      <Route path="/" element={<Navigate to="/Dashboard" replace />} />

      {/* NEXACORE */}
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Labs" element={<Labs />} />
      <Route path="/Researchers" element={<Researchers />} />

      {/* ANALYTICS */}
      <Route path="/Analytics" element={<Analytics />} />
      <Route path="/Collaboration" element={<Collaboration />} />

      {/* SETTINGS */}
      <Route path="/Profile" element={<Profile />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/Dashboard" replace />} />
    </Routes>
  );
}

export default App;
