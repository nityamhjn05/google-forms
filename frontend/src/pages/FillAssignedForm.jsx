// === AssignedForms.jsx ===
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function AssignedForms() {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/api/user/forms/assigned')
      .then(res => setForms(res.data))
      .catch(err => {
        console.error("Failed to fetch assigned forms", err);
        setError('Failed to load assigned forms. Please try again later.');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white px-6 py-4 shadow-md flex items-center gap-4">
        <img src="/assets/coforge-logo.png" alt="Coforge" className="h-10" />
        <h1 className="text-xl font-bold">Assigned Feedback Forms</h1>
      </header>

      <main className="p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Your Assigned Forms</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {forms.length === 0 && !error ? (
          <p className="text-gray-700">No forms assigned to you at the moment.</p>
        ) : (
          <ul className="space-y-2">
            {forms.map(f => (
              <li key={f.id} className="flex items-center justify-between bg-white p-4 rounded shadow">
                <span className="text-blue-900 font-medium">{f.title}</span>
                <button
                  onClick={() => navigate(`/user/fill/${f.id}`)}
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  Fill Now
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
