// Updated App.jsx with route for filling assigned form
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/login';
import AdminDashboard from './pages/AdminDashboard';
import FormBuilder from './pages/FormBuilder';
import UserDashboard from './pages/UserDashboard';
import AssignedForms from './pages/AssignedForms';
import FillAssignedForm from './pages/FillAssignedForm';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Admin routes */}
      <Route element={<ProtectedRoute role="ADMIN" />}> 
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create" element={<FormBuilder />} />
      </Route>

      {/* User routes */}
      <Route element={<ProtectedRoute role="USER" />}> 
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/assigned" element={<AssignedForms />} />
        <Route path="/user/fill/:id" element={<FillAssignedForm />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}