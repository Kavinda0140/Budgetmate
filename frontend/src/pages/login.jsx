import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import logoImg from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">

        {/* Logo */}
        <div className="text-center">
          <div className="flex flex-col justify-center items-center gap-3">

            {/* ✅ FIXED: use imported image */}
            <img
              src={logoImg}
              alt="BudgetMate Logo"
              className="h-16 w-auto object-contain"
            />
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Enter your credentials to access your professional asset management suite.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-500">
              EMAIL ADDRESS
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
              <Mail size={18} className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-500">
              <label>PASSWORD</label>
              <span className="text-blue-600 cursor-pointer">
                Forgot password?
              </span>
            </div>

            <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Remember */}
          <div className="flex items-center text-sm text-gray-500">
            <input type="checkbox" className="mr-2" />
            Remember this device
          </div>

          {/* Button */}
          <button className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition">
            Log In →
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-gray-200"></div>
          OR CONTINUE WITH
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Social */}
        <div className="flex gap-3">
          <button className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50">
            Google
          </button>
          <button className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50">
            Apple
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <span className="text-blue-600 cursor-pointer">Sign Up</span>
        </div>

        <div className="text-center text-xs text-gray-400">
          Privacy Policy · Terms of Service · Security
          <br />
          © 2024 FinSecure International. All rights reserved.
        </div>

      </div>
    </div>
  );
};

export default Login;