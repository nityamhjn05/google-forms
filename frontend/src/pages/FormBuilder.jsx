// === FormBuilder.jsx ===
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import API from '../api/api';

export default function FormBuilder() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDesc] = useState('');
  const [question, setQuestion] = useState([]);
  const [assignedEmails, setAssignedEmails] = useState(['']);

  const addQuestion = () => {
    setQuestion(qs => [
      ...qs,
      {
        questionId: uuidv4(),
        text: '',
        type: 'SHORT_ANSWER',
        required: false,
        options: ['']
      }
    ]);
  };

  const updateQuestion = (id, key, value) => {
    setQuestion(qs =>
      qs.map(q =>
        q.questionId === id
          ? {
              ...q,
              [key]: value,
              ...(key === 'type' &&
              value !== 'MULTIPLE_CHOICE'
                ? { options: [''] }
                : {})
            }
          : q
      )
    );
  };

  const updateOption = (qid, index, value) => {
    setQuestion(qs =>
      qs.map(q => {
        if (q.questionId === qid) {
          const newOpts = [...q.options];
          newOpts[index] = value;
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  const addOption = qid => {
    setQuestion(qs =>
      qs.map(q =>
        q.questionId === qid
          ? { ...q, options: [...q.options, ''] }
          : q
      )
    );
  };

  const removeOption = (qid, index) => {
    setQuestion(qs =>
      qs.map(q => {
        if (q.questionId === qid) {
          const newOpts = q.options.filter((_, i) => i !== index);
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  const updateAssignedEmail = (index, value) => {
    const updated = [...assignedEmails];
    updated[index] = value;
    setAssignedEmails(updated);
  };

  const addAssignedEmail = () => {
    setAssignedEmails([...assignedEmails, '']);
  };

  const submitForm = async () => {
    try {
      await API.post('/api/admin/forms/create', {
        title,
        description,
        question,
        targetEmails: assignedEmails
      });
      navigate('/admin');
    } catch (err) {
      console.error('Error saving form:', err);
      alert('Failed to save form.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white px-6 py-4 shadow-md flex items-center gap-4">
        <img src="/assets/coforge-logo.png" alt="Coforge" className="h-10" />
        <h1 className="text-xl font-bold">Coforge Admin - Create Feedback Form</h1>
      </header>

      <div className="p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-blue-900">Create Feedback Form</h2>

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Form Title"
          className="w-full mb-4 border p-2 rounded"
        />

        <textarea
          value={description}
          onChange={e => setDesc(e.target.value)}
          placeholder="Form Description"
          className="w-full mb-6 border p-2 rounded"
        />

        {question.map((q, i) => (
          <div key={q.questionId} className="mb-6 bg-white p-4 rounded shadow">
            <input
              value={q.text}
              onChange={e => updateQuestion(q.questionId, 'text', e.target.value)}
              placeholder={`Question ${i + 1}`}
              className="w-full mb-2 border p-2 rounded"
            />
            <select
              value={q.type}
              onChange={e => updateQuestion(q.questionId, 'type', e.target.value)}
              className="w-full mb-2 border p-2 rounded"
            >
              <option value="SHORT_ANSWER">Short Answer</option>
              <option value="LONG_ANSWER">Long Answer</option>
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            </select>

            {(q.type === 'MULTIPLE_CHOICE') && (
              <div className="pl-4">
                {q.options.map((opt, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={e => updateOption(q.questionId, idx, e.target.value)}
                      className="border p-2 flex-grow rounded"
                      placeholder={`Option ${idx + 1}`}
                    />
                    <button
                      onClick={() => removeOption(q.questionId, idx)}
                      className="text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addOption(q.questionId)}
                  className="text-blue-600"
                >
                  + Add Option
                </button>
              </div>
            )}

            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={e => updateQuestion(q.questionId, 'required', e.target.checked)}
                  className="mr-2"
                />
                Required
              </label>
            </div>
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="bg-gray-200 px-4 py-2 rounded mb-6"
        >
          + Add Question
        </button>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">
            Assign to Users (Email IDs)
          </h3>
          {assignedEmails.map((email, i) => (
            <input
              key={i}
              type="email"
              value={email}
              onChange={e => updateAssignedEmail(i, e.target.value)}
              className="w-full mb-2 border p-2 rounded"
              placeholder="E.g. user@example.com"
            />
          ))}
          <button
            onClick={addAssignedEmail}
            className="text-blue-600"
          >
            + Add Email
          </button>
        </div>

        <button
          onClick={submitForm}
          className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
        >
          Save Form
        </button>
      </div>
    </div>
  );
}
