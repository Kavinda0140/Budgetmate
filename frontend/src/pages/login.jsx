import React, { useState } from "react";
import { Mail, Lock, X } from "lucide-react"; 
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import logoImg from "../assets/logo.png";

const Login = ({ isOpen, onClose, openRegister, openForgot }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  
  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading('Logging in...');

    try {
      const response = await API.post('/auth/login', {
        email: email,
        password: password
      });

      if (response.status === 200) {
        // 1. save the token in localStorage for future authenticated requests
        localStorage.setItem('token', response.data.access_token);
        toast.success('Login Successful!', { id: loadToast });
        
        // 2. close the login modal
        onClose(); 
        
        setTimeout(() => {
          navigate('/');
          window.location.reload(); 
        }, 1200);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Invalid email or password';
      toast.error(errorMsg, { id: loadToast });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
        onClick={onClose}
      ></div>

      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in duration-300 border border-white/20">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <img src={logoImg} alt="BudgetMate Logo" className="h-14 w-auto object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-500">
            Sign in to continue managing your finances.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="flex items-center border-2 border-slate-100 rounded-2xl px-4 py-3 mt-1.5 focus-within:border-blue-600 transition-all">
              <Mail size={18} className="text-slate-400 mr-3" />
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full outline-none text-sm font-medium bg-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center ml-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Password
              </label>
              <button 
                type="button"
                onClick={openForgot} 
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="flex items-center border-2 border-slate-100 rounded-2xl px-4 py-3 mt-1.5 focus-within:border-blue-600 transition-all">
              <Lock size={18} className="text-slate-400 mr-3" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full outline-none text-sm font-medium bg-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-100 active:scale-95 cursor-pointer"
          >
            Sign In to BudgetMate
          </button>
        </form>

        {/* Footer Links */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-center">New Here?</span>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>

          <div className="text-center">
            <button 
              type="button"
              onClick={openRegister}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all cursor-pointer"
            >
              Create a free account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;