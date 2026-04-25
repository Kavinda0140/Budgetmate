import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line } from 'recharts';
import { Calendar, Filter, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Analytics = () => {
  const barData = [
    { name: 'Mon', income: 4000, expense: 2400 },
    { name: 'Tue', income: 3000, expense: 1398 },
    { name: 'Wed', income: 2000, expense: 9800 },
    { name: 'Thu', income: 2780, expense: 3908 },
    { name: 'Fri', income: 1890, expense: 4800 },
    { name: 'Sat', income: 2390, expense: 3800 },
    { name: 'Sun', income: 3490, expense: 4300 },
  ];

  const pieData = [
    { name: 'Housing', value: 2100, color: '#0A1128' },
    { name: 'Food & Dining', value: 850, color: '#2563eb' },
    { name: 'Utilities', value: 420, color: '#60a5fa' },
    { name: 'Entertainment', value: 300, color: '#bfdbfe' },
  ];

  return (
    <DashboardLayout title="Detailed Analytics">
      {/*  Top Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
           <button className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-100">Last 30 Days</button>
           <button className="px-6 py-2 text-slate-500 text-xs font-bold hover:bg-slate-50 rounded-xl transition-all">90 Days</button>
           <button className="px-6 py-2 text-slate-500 text-xs font-bold hover:bg-slate-50 rounded-xl transition-all">Yearly</button>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600">
             <Filter size={16} /> All Categories
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0A1128] text-white rounded-2xl text-xs font-bold">
             <Download size={16} /> Export Data
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/*  Income vs Expenses Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h4 className="text-xl font-black text-slate-900">Income vs Expenses</h4>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#0A1128] rounded-full"></div><span className="text-[10px] font-bold text-slate-400">Income</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-[10px] font-bold text-slate-400">Expenses</span></div>
              </div>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip cursor={{fill: '#f8faff'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="income" fill="#0A1128" radius={[6, 6, 0, 0]} barSize={20} />
                  <Bar dataKey="expense" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/*  Spending by Category */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
           <h4 className="text-xl font-black text-slate-900 mb-8">Spending by Category</h4>
           <div className="h-64 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-2xl hover:bg-slate-50 transition-all">
                   <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}}></div>
                      <span className="text-xs font-bold text-slate-600">{item.name}</span>
                   </div>
                   <span className="text-xs font-black text-slate-900">${item.value}</span>
                </div>
              ))}
           </div>
        </div>

        {/*  Savings Trajectory */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl font-black text-slate-900">Savings Trajectory</h4>
              <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black">+12.4% vs prev. month</span>
           </div>
           <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={barData}>
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/*  Insight Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col justify-between">
           <div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                 <ArrowUpRight size={24} className="text-blue-300" />
              </div>
              <h4 className="text-xl font-bold mb-4">Smart Savings Opportunity</h4>
              <p className="text-blue-100/70 text-sm leading-relaxed font-medium">Based on your spending in 'Food & Dining', switching to home cooking twice more per week could save you <span className="text-white font-bold">$140/month</span>.</p>
           </div>
           <button className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl text-xs font-black transition-all mt-8">Enable Auto-Invest</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;