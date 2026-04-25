import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { ArrowUpRight, ArrowDownRight, Plus, Landmark, Target, Wallet } from 'lucide-react';

const Dashboard = () => {
  return (
    <DashboardLayout title="Overview">
      {/*  Hero Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Total Net Worth Card (Dark Blue) */}
        <div className="lg:col-span-2 bg-[#0A1128] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-6">
             <p className="text-blue-300 font-bold text-xs uppercase tracking-widest">Total Net Worth</p>
             <h2 className="text-5xl font-black tracking-tight">$1,248,392.42</h2>
             <div className="inline-flex items-center gap-2 bg-blue-500/20 px-3 py-1.5 rounded-full text-xs font-bold text-blue-200 border border-blue-500/30">
               <ArrowUpRight size={14} /> +$28,491.00 (2.4%)
             </div>
             <div className="grid grid-cols-3 gap-4 pt-10 border-t border-white/10">
                <div><p className="text-blue-300 text-[10px] uppercase font-bold">Cash</p><p className="text-xl font-bold">$142,300</p></div>
                <div><p className="text-blue-300 text-[10px] uppercase font-bold">Investments</p><p className="text-xl font-bold">$982,092</p></div>
                <div><p className="text-blue-300 text-[10px] uppercase font-bold">Real Estate</p><p className="text-xl font-bold">$124,000</p></div>
             </div>
          </div>
          <Landmark size={200} className="absolute right-[-40px] top-[-20px] text-white opacity-5 rotate-12" />
        </div>

        {/* Side Metrics */}
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Wallet size={20} /></div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Spend</p>
              </div>
              <h3 className="text-2xl font-black text-slate-900">$8,240.50</h3>
              <p className="text-xs font-bold text-red-500 mt-2">↑ 12% vs last month</p>
           </div>
           
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-green-50 rounded-2xl text-green-600"><Target size={20} /></div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Savings Rate</p>
              </div>
              <h3 className="text-2xl font-black text-slate-900">32.4%</h3>
              <p className="text-xs font-bold text-slate-400 mt-2 italic">Target: 35%</p>
           </div>
        </div>
      </div>

      {/*  Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Transaction Table Placeholder */}
         <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h4 className="text-xl font-black text-slate-900">Recent Transactions</h4>
               <button className="text-blue-600 font-bold text-sm hover:underline">View All</button>
            </div>
            <div className="space-y-6">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <Plus size={20} />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">Apple Store</p>
                          <p className="text-xs text-slate-400 font-medium">Nov 24, 2023 • Electronics</p>
                       </div>
                    </div>
                    <p className="font-black text-slate-900">-$241.20</p>
                 </div>
               ))}
            </div>
         </div>

         {/* Quick Actions */}
         <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-blue-100">
            <h4 className="text-xl font-bold mb-6">Investment Opportunity</h4>
            <p className="text-blue-100 text-sm leading-relaxed mb-8 font-medium">Based on your savings goals, we've identified an ETF that matches your risk profile.</p>
            <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-colors">
               Learn more →
            </button>
         </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;