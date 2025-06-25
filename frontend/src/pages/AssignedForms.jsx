import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api.js';

export default function AssignedForms() {
  const [forms, setForms] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    API.get('/api/user/forms/assigned')
      .then(res => setForms(res.data))
      .catch(err => console.error('Error fetching assigned forms:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white px-6 py-4 shadow-md flex items-center gap-4">
        <img src="/assets/coforge-logo.png" alt="Coforge" className="h-10" />
        <h1 className="text-xl font-bold">Assigned Feedback Forms</h1>
      </header>

      <main className="p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Your Assigned Forms</h2>
        <ul className="space-y-2">
          {forms.map(f => (
            <li key={f.id}>
              <button
                onClick={() => nav(`/user/fill/${f.id}`)}
                className="text-blue-700 underline hover:text-blue-900"
              >
                {f.title}
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
