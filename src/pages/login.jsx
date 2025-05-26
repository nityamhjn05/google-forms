// src/pages/Login.jsx
import { useState } from 'react'
import axios from 'axios'
// import logo from '../assets/coforge-logo.png'

export default function Login() {
  const [employeeId, setEmployeeId] = useState('')
  const [password,   setPassword  ] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    const { data } = await axios.post(
      'http://localhost:1111/api/auth/login',
      { employeeId, password }
    )
    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.role)
    // redirect based on role:
    window.location.href = data.role === 'ADMIN' ? '/admin' : '/user'
  }

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/building-bg.jpg')" }}
    >
      {/* 1. Top header bar */}
      <header className="absolute top-0 left-0 w-full h-16 bg-blue-900 bg-opacity-90 flex items-center px-6 z-10">
        <img
          src="/assets/coforge-logo.png"
          alt="Coforge"
          className="h-16 object-contain"
        />
      </header>

      {/* 2. Centered two-column layout */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        {/* Left side text */}
        <div className="hidden md:flex flex-1 flex-col text-white max-w-lg space-y-4 pr-8">
          <h1 className="text-5xl font-extrabold">FeedBack System</h1>
          <p className="text-2xl italic">“Transform at the Intersect”</p>
        </div>

        {/* Right side login card */}
        <form
          onSubmit={handleSubmit}
          className="
            w-full
            max-w-md
            bg-white bg-opacity-80
            backdrop-blur
            p-8
            rounded-lg
            shadow-xl
          "
        >
          <h2 className="text-2xl font-bold mb-6 text-center">LOG IN !!</h2>

          <label className="block mb-2 text-sm font-medium">Employee ID</label>
          <input
            type="text"
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
            placeholder="Employee ID"
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-black to-blue-800 text-white font-semibold rounded hover:from-gray-800 hover:to-blue-900 transition"
          >
            NEXT
          </button>

          <div className="mt-4 text-center text-sm text-gray-700">
            OR already have an account?{' '}
            <a href="#" className="underline">LOG IN</a>
          </div>
        </form>
      </div>
    </div>
  )
}
