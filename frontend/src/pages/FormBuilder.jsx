// UI-polished FormBuilder.jsx with branding and styling
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/api'

export default function FormBuilder() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDesc] = useState('')
  const [questions, setQuestions] = useState([])
  const [assignedEmployees, setAssignedEmployees] = useState([''])

  const addQuestion = () => {
    setQuestions(qs => [
      ...qs,
      { id: Date.now(), text: '', type: 'SHORT_ANSWER', options: [''] }
    ])
  }

  const updateQuestion = (id, key, value) => {
    setQuestions(qs =>
      qs.map(q =>
        q.id === id ? { ...q, [key]: value, ...(key === 'type' && value !== 'MULTIPLE_CHOICE' && value !== 'MULTI_SELECT' ? { options: [''] } : {}) } : q
      )
    )
  }

  const updateOption = (qid, index, value) => {
    setQuestions(qs =>
      qs.map(q => {
        if (q.id === qid) {
          const newOpts = [...q.options]
          newOpts[index] = value
          return { ...q, options: newOpts }
        }
        return q
      })
    )
  }

  const addOption = (qid) => {
    setQuestions(qs =>
      qs.map(q => (q.id === qid ? { ...q, options: [...q.options, ''] } : q))
    )
  }

  const removeOption = (qid, index) => {
    setQuestions(qs =>
      qs.map(q => {
        if (q.id === qid) {
          const newOpts = q.options.filter((_, i) => i !== index)
          return { ...q, options: newOpts }
        }
        return q
      })
    )
  }

  const updateAssignedEmployee = (index, value) => {
    const updated = [...assignedEmployees]
    updated[index] = value
    setAssignedEmployees(updated)
  }

  const addAssignedEmployee = () => {
    setAssignedEmployees([...assignedEmployees, ''])
  }

  const submitForm = async () => {
    await API.post('/admin/forms', {
      title,
      description,
      questions,
      assignedEmployees,
    })
    navigate('/admin')
  }

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

        {questions.map((q, i) => (
          <div key={q.id} className="mb-6 bg-white p-4 rounded shadow">
            <input
              value={q.text}
              onChange={e => updateQuestion(q.id, 'text', e.target.value)}
              placeholder={`Question ${i + 1}`}
              className="w-full mb-2 border p-2 rounded"
            />
            <select
              value={q.type}
              onChange={e => updateQuestion(q.id, 'type', e.target.value)}
              className="w-full mb-2 border p-2 rounded"
            >
              <option value="SHORT_ANSWER">Short Answer</option>
              <option value="LONG_ANSWER">Long Answer</option>
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="MULTI_SELECT">Multi Select</option>
            </select>

            {(q.type === 'MULTIPLE_CHOICE' || q.type === 'MULTI_SELECT') && (
              <div className="pl-4">
                {q.options.map((opt, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={e => updateOption(q.id, idx, e.target.value)}
                      className="border p-2 flex-grow rounded"
                      placeholder={`Option ${idx + 1}`}
                    />
                    <button onClick={() => removeOption(q.id, idx)} className="text-red-600">✕</button>
                  </div>
                ))}
                <button onClick={() => addOption(q.id)} className="text-blue-600">+ Add Option</button>
              </div>
            )}
          </div>
        ))}

        <button onClick={addQuestion} className="bg-gray-200 px-4 py-2 rounded mb-6">
          + Add Question
        </button>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Assign to Employees (Employee IDs)</h3>
          {assignedEmployees.map((empId, i) => (
            <input
              key={i}
              type="text"
              value={empId}
              onChange={e => updateAssignedEmployee(i, e.target.value)}
              className="w-full mb-2 border p-2 rounded"
              placeholder="E.g. 123456"
            />
          ))}
          <button onClick={addAssignedEmployee} className="text-blue-600">+ Add Employee</button>
        </div>

        <button onClick={submitForm} className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition">
          Save Form
        </button>
      </div>
    </div>
  )
}
