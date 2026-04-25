import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { TrendingUp, ArrowUpRight, Plus, Briefcase, Globe, PieChart as PieIcon, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const Investments = () => {
  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 7500 },
  ];

  const pieData = [
    { name: 'Stocks', value: 60, color: '#2563eb' },
    { name: 'Crypto', value: 25, color: '#8b5cf6' },
    { name: 'Real Estate', value: 15, color: '#10b981' },
  ];

  const assets = [
    { name: "S&P 500 Index Fund", type: "ETF", amount: "$12,450.00", growth: "+8.4%", up: true },
    { name: "Bitcoin", type: "Crypto", amount: "$4,200.50", growth: "+12.1%", up: true },
    { name: "Tesla, Inc.", type: "Stock", amount: "$2,100.00", growth: "-2.4%", up: false },
  ];

  return (
    <DashboardLayout title="Investments">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/*  Performance Overview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Portfolio Performance</p>
                <h3 className="text-4xl font-black text-slate-900">$982,092.00</h3>
                <p className="text-sm font-bold text-green-500 flex items-center gap-1 mt-2">
                  <ArrowUpRight size={16} /> +12.5% this year
                </p>
              </div>
              <div className="flex gap-2">
                 <button className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">1W</button>
                 <button className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-100">1M</button>
                 <button className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">1Y</button>
              </div>
            </div>

            {/* Area Chart */}
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Assets List */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h4 className="text-xl font-black text-slate-900 tracking-tight">Active Assets</h4>
                <button className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all"><Plus size={20}/></button>
             </div>
             <div className="space-y-4">
                {assets.map((asset, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all border border-transparent hover:border-slate-100 group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{asset.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{asset.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-slate-900">{asset.amount}</p>
                       <p className={`text-xs font-bold ${asset.up ? 'text-green-500' : 'text-red-500'}`}>{asset.growth}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/*  Right Column: Allocation */}
        <div className="space-y-8">
           <div className="bg-[#0A1128] rounded-[2.5rem] p-10 text-white overflow-hidden relative shadow-2xl">
              <h4 className="text-lg font-bold mb-8">Asset Allocation</h4>
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest text-center">Global<br/>Assets</p>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                 {pieData.map((item, i) => (
                   <div key={i} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                         <span className="font-bold text-slate-400">{item.name}</span>
                      </div>
                      <span className="font-black">{item.value}%</span>
                   </div>
                 ))}
              </div>
              <Globe size={150} className="absolute bottom-[-50px] right-[-50px] opacity-10" />
           </div>

           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-xl shadow-blue-100">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">Market Insight</h4>
              <p className="text-blue-100 text-sm leading-relaxed mb-8">Tech stocks are showing high momentum this quarter. Consider rebalancing your portfolio.</p>
              <button className="text-white font-black text-sm flex items-center gap-2 hover:translate-x-2 transition-transform">
                Read Analysis <ChevronRight size={18} />
              </button>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Investments;