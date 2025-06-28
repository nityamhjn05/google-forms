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

      // Fetch all forms (admin should have access to all forms anyway)
      API.get('/api/user/forms/assigned')
        .then(res => {
          const formMap = {};
          res.data.forEach(form => {
            formMap[form.id] = {
              title: form.title,
              questions: {}
            };
            form.question.forEach(q => {
              formMap[form.id].questions[q.questionId] = q.text;
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

      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => navigate('/admin/create')}
          className="bg-blue-900 text-white rounded-lg shadow-lg p-6 hover:bg-blue-800 transition"
        >
          ➕ Create Feedback Form
        </button>
        <button
          onClick={() => setShowResponses(!showResponses)}
          className="bg-blue-900 text-white rounded-lg shadow-lg p-6 hover:bg-blue-800 transition"
        >
          {showResponses ? '🙈 Hide Responses' : '📄 View Responses'}
        </button>
      </main>

      {showResponses && (
        <section className="max-w-6xl mx-auto px-8 pb-12">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">📊 All Responses</h2>

          {responses.length === 0 ? (
            <p className="text-gray-600 italic">No responses available yet.</p>
          ) : (
            <div className="space-y-6">
              {responses.map((r, i) => {
                const form = formsMap[r.formId] || {};
                const questions = form.questions || {};

                return (
                  <div
                    key={r.id || i}
                    className="bg-white border rounded-xl shadow-md p-6 space-y-3"
                  >
                    <h3 className="text-lg font-semibold text-blue-800">
                      📝 {form.title || 'Untitled Form'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>User ID:</strong> {r.userId}
                    </p>

                    <ul className="space-y-3">
                      {r.answers.map((ans, idx) => (
                        <li
                          key={idx}
                          className="bg-gray-50 border rounded p-3"
                        >
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            {questions[ans.questionId] || `Question: ${ans.questionId}`}
                          </p>
                          <p className="text-gray-800">
                            {Array.isArray(ans.response)
                              ? ans.response.join(', ')
                              : ans.response}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
