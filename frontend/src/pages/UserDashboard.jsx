import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const nav = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Clear token
    nav('/login'); // Redirect to login
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white px-6 py-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/assets/coforge-logo.png" alt="Coforge" className="h-10" />
          <h1 className="text-xl font-semibold">User Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded text-sm hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      <main className="max-w-md mx-auto p-8">
        <button
          onClick={() => nav('/user/assigned')}
          className="w-full bg-blue-900 text-white rounded-lg shadow-lg p-6 hover:bg-blue-800 transition"
        >
          Assigned Feedback
        </button>
      </main>
    </div>
  );
}
