import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const nav = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    nav('/login');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/user-bg.jpg')" }}
    >
      <header className="px-6 py-4 shadow-md flex items-center justify-between bg-transparent text-black">
        <div className="flex items-center gap-4">
          <img src="/assets/coforge-logo.png" alt="Coforge" className="h-10" />
          <h1 className="text-xl font-semibold">User Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded text-sm hover:bg-red-700 text-white"
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
