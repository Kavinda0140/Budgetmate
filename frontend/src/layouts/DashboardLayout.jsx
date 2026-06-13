import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Bell, Search, CircleHelp } from 'lucide-react';
import API from '../services/api';

const DashboardLayout = ({ children, title, notifications = [] }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem('profilePhoto') || '');

  useEffect(() => {
    const loadProfilePhoto = async () => {
      if (!localStorage.getItem('token')) {
        setProfilePhoto('');
        return;
      }

      try {
        const { data } = await API.get('/settings/profile');
        const nextPhoto = data?.profile_photo || '';
        setProfilePhoto(nextPhoto);
        localStorage.setItem('profilePhoto', nextPhoto);
      } catch {
        setProfilePhoto(localStorage.getItem('profilePhoto') || '');
      }
    };

    void loadProfilePhoto();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFF] font-sans">
      {/*  Left Sidebar */}
      <Sidebar />

      {/*  Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Navbar */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions, bills, or reports..." 
              className="w-full bg-slate-100/50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex items-center gap-6 text-slate-500">
            <div className="relative">
            <button
              onClick={() => { if (notifications.length) setShowNotifications((prev) => !prev); }}
              className="hover:text-blue-600 transition-colors"
            >
                 <Bell size={20} />
                 {notifications.length > 0 && (
                   <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                 )}
            </button>
            {showNotifications && notifications.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-4 z-50">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <Bell size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Notifications</p>
                    <p className="text-xs text-slate-400">You have {notifications.length} active alert{notifications.length > 1 ? 's' : ''}.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {notifications.map((note) => (
                    <div key={note.id} className="rounded-3xl border border-red-100 bg-red-50 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-red-600 mb-2">{note.title}</p>
                      <p className="text-sm font-semibold text-slate-900 mb-1">{note.category}</p>
                      <p className="text-xs text-slate-500">{note.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="hover:text-blue-600 transition-colors"><CircleHelp size={20} /></button>
            <div className="h-10 w-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
              {profilePhoto ? (
                <img src={profilePhoto} alt="User" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-black text-slate-500">BM</span>
              )}
            </div>
          </div>
        </header>

        {/*  Page Content */}
        <main className="p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;