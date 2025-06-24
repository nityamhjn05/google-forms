// src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log('Sending login request with:', employeeId, password);
      const { data } = await axios.post('http://localhost:1111/auth/login', {
        employeeId,
        password,
      });

      console.log('Login response:', data);

      // Extract and normalize role
      const rawRole = data.role;
      let role = '';

      if (Array.isArray(rawRole)) {
        role = rawRole[0]?.authority || '';
      } else if (typeof rawRole === 'object') {
        role = rawRole.authority || '';
      } else {
        role = rawRole;
      }

      // Strip "ROLE_" prefix and convert to uppercase
      role = role.replace(/^ROLE_/, '').toUpperCase();

      console.log('Parsed role:', role);

      // Store credentials
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', role);

      // Redirect based on role
      if (role === 'ADMIN') {
        window.location.href = '/admin';
      } else if (role === 'USER') {
        window.location.href = '/user';
      } else {
        alert('Unknown role. Redirecting to login.');
        window.location.href = '/auth/login';
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. See console.');
    }
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/building-bg.jpg')" }}
    >
      <header className="absolute top-0 left-0 w-full h-16 bg-blue-900 bg-opacity-90 flex items-center px-6 z-10">
        <img
          src="/assets/coforge-logo.png"
          alt="Coforge"
          className="h-16 object-contain"
        />
      </header>

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur p-8 rounded-lg shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">LOG IN !!</h2>

          <label className="block mb-2 text-sm font-medium">Employee ID</label>
          <input
            type="text"
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
            placeholder="Employee ID"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
          />

          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-2 mb-6 border border-gray-300 rounded"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-black to-blue-800 text-white font-semibold rounded"
          >
            NEXT
          </button>
        </form>
      </div>
    </div>
  );
}
