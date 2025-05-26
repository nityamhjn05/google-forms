// Final version: Response viewing removed from ResponseViewer.jsx and logic moved to AdminDashboard
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api.js';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [showResponses, setShowResponses] = useState(false);

  useEffect(() => {
    if (showResponses) {
      API.get('/admin/forms/responses')
        .then(res => setResponses(res.data))
        .catch(console.error);
    }
  }, [showResponses]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white px-6 py-4 shadow-md flex items-center gap-4">
      <img src="/assets/coforge-logo.png" alt="Coforge" className="h-10" />
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </header>
      <main className="max-w-4xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <button
          onClick={() => navigate('/admin/create')}
          className="bg-blue-900 text-white rounded-lg shadow-lg p-6 hover:bg-blue-800 transition"
        >
          Create Feedback Form
        </button>
        <button
          onClick={() => setShowResponses(!showResponses)}
          className="bg-blue-900 text-white rounded-lg shadow-lg p-6 hover:bg-blue-800 transition"
        >
          {showResponses ? 'Hide' : 'View'} Responses
        </button>
      </main>

      {showResponses && (
        <section className="max-w-4xl mx-auto px-8 pb-10">
          <h2 className="text-xl font-semibold mb-4">All Responses</h2>
          <ul className="space-y-4">
            {responses.map(r => (
              <li key={r.id} className="border p-4 rounded bg-white">
                <p><strong>Form ID:</strong> {r.formId}</p>
                <p><strong>User ID:</strong> {r.userId}</p>
                <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
                  {JSON.stringify(r.answers, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
