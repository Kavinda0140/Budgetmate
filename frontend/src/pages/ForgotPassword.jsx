import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldCheck, Lock, RefreshCcw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setStatus('');

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message || 'If an account exists, a reset link will be sent.');
      setStatus(response.ok ? 'success' : 'error');
    } catch (error) {
      setMessage('Could not connect to backend');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-md overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_35px_60px_-15px_rgba(15,23,42,0.18)]">
        <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-br from-slate-900 to-slate-800"></div>
        <div className="relative bg-white px-8 pb-10 pt-20 text-center text-slate-900">
          <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-md">
            <RefreshCcw className="absolute h-10 w-10 text-blue-950/70" />
            <Lock className="relative h-6 w-6 text-blue-950" />
          </div>
          <h1 className="text-3xl font-semibold text-slate-950">Forgot Password?</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Enter your email address and we'll send you a secure password reset link.
          </p>
        </div>

        <div className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative mt-3 rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-slate-900">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-none bg-transparent pl-12 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
  type="submit"
  className="flex w-full items-center justify-center gap-2 rounded-[28px] bg-blue-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-blue-800"
>
  Send Reset Link
  <span aria-hidden="true">→</span>
</button>
          </form>

          {message && (
            <div
              className={`mt-6 rounded-3xl border px-4 py-3 text-sm ${
                status === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}
            >
              {message}
            </div>
          )}

          <div className="mt-8 flex flex-col items-center gap-3 text-sm text-slate-500">
            <Link to="/login" className="inline-flex items-center gap-2 font-semibold text-slate-900 transition hover:text-blue-600">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            <ShieldCheck className="mt-1 h-5 w-5 text-slate-700" />
            <p>BudgetMate uses bank-grade 256-bit encryption to protect your data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
