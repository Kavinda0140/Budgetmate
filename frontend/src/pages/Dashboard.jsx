import React from 'react';
import Sidebar from '../components/Sidebar';
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFF]">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-10">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
            <p className="text-slate-500 font-medium">Welcome back, Dishan!</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 flex items-center gap-2 hover:bg-blue-700 transition-all cursor-pointer">
            <Plus size={18} /> Add Transaction
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Balance" amount="$12,450.00" trend="+12%" up />
          <StatCard title="Monthly Income" amount="$4,200.00" trend="+8%" up />
          <StatCard title="Total Expenses" amount="$1,850.00" trend="-5%" />
        </div>

        {/* Charts Section Placeholder */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-80 flex items-center justify-center">
            <p className="text-slate-300 font-bold uppercase tracking-widest text-xs italic">[ Revenue Chart Placeholder ]</p>
          </div>
          <div className="col-span-1 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-80 flex items-center justify-center">
            <p className="text-slate-300 font-bold uppercase tracking-widest text-xs italic">[ Savings Goal ]</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, amount, trend, up }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">{title}</p>
    <h3 className="text-3xl font-black text-slate-900 mb-4">{amount}</h3>
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
      {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {trend}
    </div>
  </div>
);

export default Dashboard;