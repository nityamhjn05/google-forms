// src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:1111/auth/login', {
        employeeId,
        password,
      });

      let role = '';
      const rawRole = data.role;
      if (Array.isArray(rawRole)) role = rawRole[0]?.authority || '';
      else if (typeof rawRole === 'object') role = rawRole.authority || '';
      else role = rawRole;

      role = role.replace(/^ROLE_/, '').toUpperCase();

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', role);

      if (role === 'ADMIN') {
        window.location.href = '/admin';
      } else if (role === 'USER') {
        window.location.href = '/user';
      } else {
        alert('Unknown role');
        window.location.href = '/auth/login';
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Check credentials.');
    }
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/building-bg.jpg')" }}
    >
      {/* Header */}
      <header className="absolute top-0 left-0 w-full h-20 bg-blue-900 bg-opacity-90 flex items-center justify-between px-6 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <img
            src="/assets/coforge-logo.png"
            alt="Coforge"
            className="h-12 object-contain"
          />
          <h1 className="text-white text-xl font-bold tracking-wider">
            FEEDBACK SYSTEM
          </h1>
        </div>
      </header>

      {/* Login Form */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/30"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
            Welcome Back!
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Employee ID
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              placeholder="Enter your ID"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-900 to-blue-600 hover:from-blue-800 hover:to-blue-500 text-white font-semibold rounded-md transition duration-200 ease-in-out"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
