import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { ArrowUpRight, ArrowDownRight, Plus, Landmark, Target, Wallet } from 'lucide-react';
import { getTransactions, createTransaction, getUserAccounts } from '../services/transactionService.js';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    account_id: '',
    title: '',
    category: '',
    amount: '',
    transaction_type: 'EXPENSE',
  });

  const fetchDashboardData = async () => {
    try {
      const [txData, accountData] = await Promise.all([
        getTransactions(),
        getUserAccounts(),
      ]);

      setTransactions(txData);
      setAccounts(accountData);

      if (accountData.length > 0) {
        setFormData((prev) => ({ ...prev, account_id: accountData[0].id }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      await fetchDashboardData();
    };

    void initializeDashboard();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatCompactCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.transaction_date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  const monthlySpend = currentMonthTransactions
    .filter((tx) => tx.transaction_type === 'EXPENSE')
    .reduce((total, tx) => total + tx.amount, 0);

  const monthlyIncome = currentMonthTransactions
    .filter((tx) => tx.transaction_type === 'INCOME')
    .reduce((total, tx) => total + tx.amount, 0);

  const cashBalance = accounts
    .filter((account) => account.account_type !== 'INVESTMENT')
    .reduce((total, account) => total + (account.balance || 0), 0);

  const investmentBalance = accounts
    .filter((account) => account.account_type === 'INVESTMENT')
    .reduce((total, account) => total + (account.balance || 0), 0);

  const totalNetWorth = cashBalance + investmentBalance;
  const savingsAmount = Math.max(monthlyIncome - monthlySpend, 0);
  const savingsRate = monthlyIncome > 0
    ? Math.round((savingsAmount / monthlyIncome) * 1000) / 10
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTransaction({
        ...formData,
        account_id: parseInt(formData.account_id),
        amount: parseFloat(formData.amount),
      });
      setIsModalOpen(false);
      setFormData({
        account_id: accounts.length > 0 ? accounts[0].id : '',
        title: '',
        category: '',
        amount: '',
        transaction_type: 'EXPENSE',
      });
      await fetchDashboardData();
    } catch (error) {
      alert('Failed to add transaction: ' + (error.response?.data?.detail || 'Error'));
    }
  };

  return (
    <DashboardLayout title="Overview">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-[#0A1128] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-6">
            <p className="text-blue-300 font-bold text-xs uppercase tracking-widest">Total Net Worth</p>
            <h2 className="text-5xl font-black tracking-tight">{formatCurrency(totalNetWorth)}</h2>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 px-3 py-1.5 rounded-full text-xs font-bold text-blue-200 border border-blue-500/30">
              <ArrowUpRight size={14} /> {formatCurrency(monthlyIncome)} income this month
            </div>
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-white/10">
              <div>
                <p className="text-blue-300 text-[10px] uppercase font-bold">Cash</p>
                <p className="text-xl font-bold">{formatCompactCurrency(cashBalance)}</p>
              </div>
              <div>
                <p className="text-blue-300 text-[10px] uppercase font-bold">Investments</p>
                <p className="text-xl font-bold">{formatCompactCurrency(investmentBalance)}</p>
              </div>
              <div>
                <p className="text-blue-300 text-[10px] uppercase font-bold">Income</p>
                <p className="text-xl font-bold">{formatCompactCurrency(monthlyIncome)}</p>
              </div>
            </div>
          </div>
          <Landmark size={200} className="absolute right-[-40px] top-[-20px] text-white opacity-5 rotate-12" />
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Wallet size={20} /></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Spend</p>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{formatCurrency(monthlySpend)}</h3>
            <p className="text-xs font-bold text-slate-400 mt-2">Current month expenses</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 rounded-2xl text-green-600"><Target size={20} /></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Savings Rate</p>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{savingsRate}%</h3>
            <p className="text-xs font-bold text-slate-400 mt-2 italic">Saved {formatCurrency(savingsAmount)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xl font-black text-slate-900">Recent Transactions</h4>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                <Plus size={14} /> Add Transaction
              </button>
              <button className="text-blue-600 font-bold text-sm hover:underline">View All</button>
            </div>
          </div>

          <div className="space-y-6">
            {transactions.length === 0 ? (
              <p className="text-slate-400 text-sm py-4 text-center font-medium">No recent transactions found.</p>
            ) : (
              transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      tx.transaction_type === 'INCOME'
                        ? 'bg-green-50 text-green-600 group-hover:bg-green-100'
                        : 'bg-slate-50 text-slate-400 group-hover:bg-red-50 group-hover:text-red-500'
                    }`}
                    >
                      {tx.transaction_type === 'INCOME' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{tx.title}</p>
                      <p className="text-xs text-slate-400 font-medium">
                        {new Date(tx.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {tx.category}
                      </p>
                    </div>
                  </div>
                  <p className={`font-black ${tx.transaction_type === 'INCOME' ? 'text-green-600' : 'text-slate-900'}`}>
                    {tx.transaction_type === 'INCOME' ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-blue-100">
          <h4 className="text-xl font-bold mb-6">Investment Opportunity</h4>
          <p className="text-blue-100 text-sm leading-relaxed mb-8 font-medium">
            Based on your savings goals, we've identified an ETF that matches your risk profile.
          </p>
          <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-colors">
            Learn more
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white w-full max-w-md p-8 rounded-[2rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-6">New Transaction</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Account</label>
                <select
                  value={formData.account_id}
                  onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_name || acc.name} ({formatCurrency(acc.balance || 0)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Internet Bill / Monthly Salary"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Type</label>
                  <select
                    value={formData.transaction_type}
                    onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-bold transition-all"
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Food, Transport, Salary"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium transition-all"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-sm transition-colors shadow-lg shadow-blue-500/20"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
