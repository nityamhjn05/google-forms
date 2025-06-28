import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api.js';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [formsMap, setFormsMap] = useState({});
  const [groupedResponses, setGroupedResponses] = useState({});
  const [showResponses, setShowResponses] = useState(false);

  useEffect(() => {
    if (showResponses) {
      // Fetch all forms to map formId to title and questions
      API.get('/api/admin/forms')
        .then(res => {
          if (Array.isArray(res.data)) {
            const formMap = {};
            res.data.forEach(f => {
              formMap[f.id] = { title: f.title, questions: {} };
              if (Array.isArray(f.question)) {
                f.question.forEach(q => {
                  formMap[f.id].questions[q.questionId] = q.text;
                });
              }
            });
            setFormsMap(formMap);

            // Now fetch responses for each form by ID
            Promise.all(
              res.data.map(f => API.get(`/api/admin/forms/${f.id}/responses`).then(r => r.data))
            ).then(results => {
              const allResponses = results.flat();
              setResponses(allResponses);

              const grouped = {};
              allResponses.forEach(r => {
                if (!grouped[r.userId]) grouped[r.userId] = [];
                grouped[r.userId].push(r);
              });
              setGroupedResponses(grouped);
            });
          }
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
        <section className="max-w-5xl mx-auto px-8 pb-10">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">Responses Grouped by User</h2>
          {Object.entries(groupedResponses).map(([userId, userResponses]) => (
            <div key={userId} className="mb-8 border p-6 rounded-lg bg-white shadow">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">User ID: {userId}</h3>
              {userResponses.map((r, index) => {
                const form = formsMap[r.formId] || {};
                const questions = form.questions || {};
                return (
                  <div key={index} className="mb-4">
                    <h4 className="text-md font-bold text-gray-700 mb-1">
                      Form: {form.title || 'Unknown Form'}
                    </h4>
                    <ul className="space-y-1 ml-4">
                      {Array.isArray(r.answers) && r.answers.map((ans, idx) => (
                        <li key={idx} className="text-sm">
                          <span className="font-medium">
                            {questions[ans.questionId] || `QID: ${ans.questionId}`}:
                          </span>{" "}
                          {Array.isArray(ans.response)
                            ? ans.response.join(', ')
                            : ans.response}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
