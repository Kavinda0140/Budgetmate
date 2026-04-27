import React, { useState } from 'react';
import { Mail, Lock, User, X } from "lucide-react";
import API from '../services/api';
import toast from 'react-hot-toast';
import logoImg from "../assets/logo.png";

const Register = ({ isOpen, onClose, openLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    const loadToast = toast.loading('Creating account...');
    try {
      const response = await API.post('/auth/register', {
        full_name: name,
        email: email,
        password: password
      });

      if (response.status === 201 || response.status === 200) {
        toast.success('Registration successful!', { id: loadToast });
        setTimeout(() => {
          openLogin();
        }, 1500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to register';
      toast.error(errorMsg, { id: loadToast });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <div className="text-center">
          <img src={logoImg} alt="BudgetMate Logo" className="h-14 mx-auto object-contain" />
          <h2 className="text-xl font-bold text-gray-800 mt-4">Create Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
            <div className="flex items-center border-2 border-gray-50 rounded-xl px-3 py-2 mt-1 focus-within:border-blue-900">
              <User size={18} className="text-gray-400 mr-2" />
              <input type="text" placeholder="John Doe" className="w-full outline-none text-sm" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Email</label>
            <div className="flex items-center border-2 border-gray-50 rounded-xl px-3 py-2 mt-1 focus-within:border-blue-900">
              <Mail size={18} className="text-gray-400 mr-2" />
              <input type="email" placeholder="name@company.com" className="w-full outline-none text-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Password</label>
              <div className="flex items-center border-2 border-gray-50 rounded-xl px-3 py-2 mt-1 focus-within:border-blue-900">
                <input type="password" placeholder="••••" className="w-full outline-none text-sm" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Confirm</label>
              <div className="flex items-center border-2 border-gray-50 rounded-xl px-3 py-2 mt-1 focus-within:border-blue-900">
                <input type="password" placeholder="••••" className="w-full outline-none text-sm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition">
            Create Account →
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button onClick={openLogin} className="text-blue-600 font-bold hover:underline">Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default Register;