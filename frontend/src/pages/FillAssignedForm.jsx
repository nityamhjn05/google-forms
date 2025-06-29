import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function FillAssignedForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    API.get('/api/user/forms/assigned')
      .then(res => {
        const foundForm = res.data.find(f => f.id === id);
        if (foundForm && Array.isArray(foundForm.question)) {
          setForm(foundForm);
        } else {
          console.error("Form not found or has no questions");
        }
      })
      .catch(err => console.error("Error fetching assigned forms", err));

    API.get(`/api/user/forms/${id}/submitted`)
      .then(res => setSubmitted(res.data))
      .catch(() => {});
  }, [id]);

  const handleChange = (qid, value) => {
    if (!qid) {
      console.error("❌ Question ID is undefined during handleChange");
      return;
    }

    setAnswers(prev => {
      const updated = [...prev];
      const index = updated.findIndex(a => a.questionId === qid);
      if (index !== -1) {
        updated[index].response = [value];
      } else {
        updated.push({ questionId: qid, response: [value] });
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      await API.post(`/api/user/forms/${id}/submit`, { answers });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting form", err);
      alert("Submission failed. You may not have access.");
    }
  };

  if (!form) return <div className="p-6">Loading...</div>;

  if (submitted) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl text-green-600 font-bold mb-4">Form Already Submitted ✅</h2>
        <button onClick={() => navigate('/user')} className="text-blue-700 underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white px-6 py-4 shadow">
        <h1 className="text-xl font-semibold">Coforge Feedback Form</h1>
      </header>

      <main className="max-w-3xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-4 text-blue-900">{form.title}</h2>
        <p className="mb-6 text-gray-600 italic">{form.description}</p>

        {Array.isArray(form.question) ? (
          form.question.map(q => (
            <div key={q.questionId} className="mb-6 bg-white p-4 rounded shadow">
              <label className="block font-semibold mb-2">{q.text}</label>

              {q.type === 'SHORT_ANSWER' && (
                <input
                  type="text"
                  onChange={e => handleChange(q.questionId, e.target.value)}
                  className="w-full border p-2 rounded"
                />
              )}

              {q.type === 'LONG_ANSWER' && (
                <textarea
                  rows="4"
                  onChange={e => handleChange(q.questionId, e.target.value)}
                  className="w-full border p-2 rounded"
                />
              )}

              {q.type === 'MULTIPLE_CHOICE' && (
                <div className="space-y-2">
                  {q.options?.map(opt => (
                    <label key={opt} className="flex gap-2">
                      <input
                        type="radio"
                        name={`q-${q.questionId}`}
                        value={opt}
                        onChange={() => handleChange(q.questionId, opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-red-600">⚠️ No questions available in this form.</div>
        )}

        <button
          onClick={handleSubmit}
          className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
        >
          Submit Response
        </button>
      </main>
    </div>
  );
}
