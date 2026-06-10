import { useState } from 'react';
import { ArrowRight, Sparkles, MoveRight, User, LogOut } from 'lucide-react';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import VerifyOTP from './VerifyOTP';

const Home = () => {
  // --- States ---
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('token')));
  const [userName] = useState(() => localStorage.getItem('userName') || "User");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    window.location.reload(); 
  };

  // --- Modal Switchers ---
  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsForgotOpen(false);
    setIsVerifyOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsForgotOpen(false);
    setIsVerifyOpen(false);
    setIsLoginOpen(true);
  };

  const switchToForgot = () => {
    setIsLoginOpen(false);
    setIsForgotOpen(true);
  };

  const switchToVerify = (email) => {
    setResetEmail(email);
    setIsForgotOpen(false);
    setIsVerifyOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-900 font-sans overflow-x-hidden selection:bg-blue-100">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl -z-10"></div>

      {/* --- NAVBAR --- */}
      <header className="fixed top-6 left-0 w-full z-50 px-6">
        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-lg border border-white/40 px-8 py-3 rounded-full flex justify-between items-center shadow-lg">
          <div className="flex items-center">
            <span className="text-xl font-black tracking-tighter text-slate-900">
              Budget<span className="text-blue-600">Mate</span>
            </span>
          </div>
          
          <nav className="hidden md:flex gap-8 font-semibold text-slate-500 text-[13px]">
            <a href="#features" className="hover:text-blue-600 transition-all">Features</a>
            {isLoggedIn && (
              <a href="/dashboard" className="text-blue-600 font-bold flex items-center gap-1 transition-all">
                Dashboard <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
              </a>
            )}
            <a href="#" className="hover:text-blue-600 transition-all">Knowledge Hub</a>
          </nav>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4 border-l pl-4 border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1 text-nowrap">Welcome back</p>
                  <p className="text-xs font-bold text-slate-900 capitalize">{userName}</p>
                </div>

                <button 
                  title="Dashboard"
                  onClick={() => window.location.href='/dashboard'}
                  className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-md active:scale-90 cursor-pointer"
                >
                  <User size={18} />
                </button>

                <button 
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setIsLoginOpen(true)} 
                  className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Log in
                </button>
                <button 
                  onClick={() => setIsRegisterOpen(true)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-md cursor-pointer"
                >
                  Try Now <MoveRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="pt-52 pb-20 px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">
            <Sparkles size={14} className="text-blue-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Intelligence Finance Manager</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-none mb-6">
            Track. Save. Grow. <br />
            All in One <span className="text-blue-600">AI Platform.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed">
            Unlock the full potential of your wealth with a single platform designed to power your 
            savings, investments, and expenses.
          </p>

          <div className="flex justify-center pt-4">
             <button 
               onClick={isLoggedIn ? () => window.location.href='/dashboard' : () => setIsRegisterOpen(true)}
               className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-3 group cursor-pointer"
             >
               {isLoggedIn ? `Go to Dashboard` : "Try BudgetMate"} 
               <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </section>

      {/* --- MODAL RENDERING --- */}
      <Login 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        openRegister={switchToRegister} 
        openForgot={switchToForgot} 
      />
      <Register 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        openLogin={switchToLogin} 
      />
      <ForgotPassword 
        isOpen={isForgotOpen} 
        onClose={() => setIsForgotOpen(false)} 
        openLogin={switchToLogin} 
        openVerify={switchToVerify} 
      />
      <VerifyOTP 
        isOpen={isVerifyOpen} 
        onClose={() => setIsVerifyOpen(false)} 
        email={resetEmail} 
        openLogin={switchToLogin} 
      />

    </div>
  );
};

export default Home;