// Final version: Response viewing enhanced for clarity and better UI
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api.js';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [formsMap, setFormsMap] = useState({});
  const [showResponses, setShowResponses] = useState(false);

  useEffect(() => {
    if (showResponses) {
      // Fetch responses
      API.get('/admin/forms/responses')
        .then(res => setResponses(res.data))
        .catch(console.error);

      // Fetch all forms to map formId to form title and questions
      API.get('/api/user/forms/assigned') // Or another admin endpoint if exists
        .then(res => {
          const formMap = {};
          res.data.forEach(f => {
            formMap[f.id] = { title: f.title, questions: {} };
            f.question.forEach(q => {
              formMap[f.id].questions[q.questionId] = q.text;
            });
          });
          setFormsMap(formMap);
        })
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
          <h2 className="text-2xl font-bold mb-6 text-blue-900">All Responses</h2>
          <div className="space-y-6">
            {responses.map(r => {
              const formData = formsMap[r.formId] || {};
              const questionsMap = formData.questions || {};

              return (
                <div key={r.id} className="border p-6 rounded-lg bg-white shadow">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    {formData.title || 'Form Title Not Found'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>User ID:</strong> {r.userId}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {r.answers.map((ans, idx) => (
                      <li key={idx} className="bg-gray-50 p-3 rounded border">
                        <p className="text-sm font-medium text-gray-700">
                          {questionsMap[ans.questionId] || `Question ID: ${ans.questionId}`}
                        </p>
                        <p className="text-gray-800 mt-1">
                          {Array.isArray(ans.response) ? ans.response.join(', ') : ans.response}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
