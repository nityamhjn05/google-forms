// Enhanced FillAssignedForm.jsx with UI polish: header, shadow, branding
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api.js';

export default function FillAssignedForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    API.get(`/admin/forms/${id}`)
      .then(res => {
        setForm(res.data);
        if (res.data.expiryDate) {
          const now = new Date();
          const expiry = new Date(res.data.expiryDate);
          if (now > expiry) setIsExpired(true);
        }
      })
      .catch(console.error);

    API.get(`/user/forms/${id}/response`)
      .then(res => {
        if (res.data?.answers) setAnswers(res.data.answers);
      })
      .catch(() => {});
  }, [id]);

  const handleChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleMultiChange = (qid, value) => {
    setAnswers(prev => {
      const current = new Set(prev[qid] || []);
      if (current.has(value)) current.delete(value);
      else current.add(value);
      return { ...prev, [qid]: Array.from(current) };
    });
  };

  const handleSubmit = async () => {
    try {
      await API.post(`/user/forms/${id}/response`, { answers });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (!form) return <div className="p-8">Loading form...</div>;

  if (submitted) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Response Submitted!</h2>
        <button onClick={() => navigate('/user')} className="text-blue-700 underline">
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-xl font-semibold">This form has expired and can no longer be submitted.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white px-6 py-4 shadow-md">
        <h1 className="text-xl font-bold">Coforge Feedback Form</h1>
      </header>

      <div className="p-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-blue-900">{form.title}</h2>
        <p className="mb-6 text-gray-700 italic">{form.description}</p>

        {form.questions.map(q => (
          <div key={q.id} className="mb-6 bg-white p-4 rounded shadow">
            <label className="font-semibold block mb-2 text-gray-800">{q.text}</label>

            {q.type === 'SHORT_ANSWER' && (
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400"
                value={answers[q.id] || ''}
                onChange={e => handleChange(q.id, e.target.value)}
              />
            )}

            {q.type === 'LONG_ANSWER' && (
              <textarea
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400"
                rows="4"
                value={answers[q.id] || ''}
                onChange={e => handleChange(q.id, e.target.value)}
              />
            )}

            {q.type === 'MULTIPLE_CHOICE' && (
              <div className="space-y-2">
                {q.options.map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-gray-700">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={e => handleChange(q.id, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === 'MULTI_SELECT' && (
              <div className="space-y-2">
                {q.options.map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-gray-700">
                    <input
                      type="checkbox"
                      value={opt}
                      checked={(answers[q.id] || []).includes(opt)}
                      onChange={() => handleMultiChange(q.id, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
        >
          {Object.keys(answers).length > 0 ? 'Update Response' : 'Submit Response'}
        </button>
      </div>
    </div>
  );
}
