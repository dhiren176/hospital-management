import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import HospitalAdminDashboard from './components/dashboards/HospitalAdminDashboard';
import DoctorDashboard from './components/dashboards/DoctorDashboard';
import PatientDashboard from './components/dashboards/PatientDashboard';
import AppointmentBooking from './components/appointments/AppointmentBooking';
import SystemOverview from './components/overview/SystemOverview';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<SystemOverview />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin-dashboard" 
          element={user?.role === 'admin' ? <HospitalAdminDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/doctor-dashboard" 
          element={user?.role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/patient-dashboard" 
          element={user?.role === 'patient' ? <PatientDashboard /> : <Navigate to="/login" />} 
        />
        <Route path="/book-appointment" element={<AppointmentBooking />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;