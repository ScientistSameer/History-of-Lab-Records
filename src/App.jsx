import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import './css/style.css';
import './charts/ChartjsConfig';

import ProtectedRoute from "./utils/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
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
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* NEXACORE */}
      <Route path="/Dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }/>
      <Route path="/Labs" element={
        <ProtectedRoute>
        <Labs />
      </ProtectedRoute>
    }/>
      <Route path="/Researchers" element={
        <ProtectedRoute>
        <Researchers />
      </ProtectedRoute>
    }/>

      {/* ANALYTICS */}
      <Route path="/Analytics" element={
        <ProtectedRoute>
        <Analytics />
      </ProtectedRoute>
    }/>

      <Route path="/Collaboration" element={
        <ProtectedRoute>
        <Collaboration />
      </ProtectedRoute>
    }/>

      {/* SETTINGS */}
      <Route path="/Profile" element={
        <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }/>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/Dashboard" replace />} />
    </Routes>
  );
}

export default App;
