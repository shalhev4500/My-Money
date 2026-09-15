import React, { useState } from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, PieChart, Plus, 
  ShoppingBag, Car, Utensils, Home, Heart, Film, 
  MoreHorizontal, Calendar, ArrowUpRight, ArrowDownLeft 
} from 'lucide-react';

export default function BudgetApp() {
  const [activeTab, setActiveTab] = useState('overview');
  const [balance] = useState(12450);
  const [totalIncome] = useState(18200);
  const [totalExpense] = useState(5750);

  const [transactions, setTransactions] = useState([
    { id: 1, title: 'סופרמרקט', category: 'אוכל', amount: -450, date: 'היום, 14:20', type: 'expense', icon: ShoppingBag, color: 'bg-emerald-100 text-emerald-600' },
    { id: 2, title: 'משכורת חודשית', category: 'הכנסה', amount: 18200, date: 'אתמול', type: 'income', icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
    { id: 3, title: 'דלק', category: 'רכב', amount: -280, date: '12 ספט', type: 'expense', icon: Car, color: 'bg-amber-100 text-amber-600' },
    { id: 4, title: 'מסעדה', category: 'בילויים', amount: -190, date: '10 ספט', type: 'expense', icon: Utensils, color: 'bg-rose-100 text-rose-600' },
  ]);

  const categories = [
    { name: 'אוכל', icon: ShoppingBag, budget: 2000, spent: 1450, color: 'bg-emerald-500' },
    { name: 'דיור', icon: Home, budget: 4500, spent: 4500, color: 'bg-blue-500' },
    { name: 'רכב', icon: Car, budget: 1000, spent: 780, color: 'bg-amber-500' },
    { name: 'בילויים', icon: Film, budget: 800, spent: 650, color: 'bg-purple-500' },
    { name: 'בריאות', icon: Heart, budget: 500, spent: 200, color: 'bg-rose-500' },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      {/* Top Header */}
      <header className="bg-white px-6 pt-6 pb-4 border-b border-slate-100 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-slate-400 font-medium">סך הכל בחשבון</p>
            <h1 className="text-2xl font-bold text-slate-900">₪{balance.toLocaleString()}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
            ש
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <ArrowDownLeft size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">הכנסות</p>
              <p className="text-sm font-bold text-emerald-700">₪{totalIncome.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-100/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center">
              <ArrowUpRight size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">הוצאות</p>
              <p className="text-sm font-bold text-rose-700">₪{totalExpense.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="p-6 max-w-md mx-auto space-y-6">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Budget Progress Section */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">מעקב תקציב חודשי</h3>
                <span className="text-xs text-slate-400">ספטמבר 2026</span>
              </div>

              <div className="space-y-3">
                {categories.map((cat, idx) => {
                  const percentage = Math.min(Math.round((cat.spent / cat.budget) * 100), 100);
                  const IconComponent = cat.icon;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="flex items-center gap-2 text-slate-700">
                          <IconComponent size={14} className="text-slate-400" />
                          {cat.name}
                        </span>
                        <span className="text-slate-500">₪{cat.spent} / <span className="text-slate-400">₪{cat.budget}</span></span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${percentage > 90 ? 'bg-rose-500' : 'bg-slate-800'}`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">תנועות אחרונות</h3>
                <button className="text-xs text-blue-600 font-semibold">הצג הכל</button>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 divide-y divide-slate-50 overflow-hidden">
                {transactions.map((tx) => {
                  const Icon = tx.icon;
                  return (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tx.color}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-800">{tx.title}</p>
                          <p className="text-xs text-slate-400">{tx.date}</p>
                        </div>
                      </div>
                      <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {tx.type === 'income' ? '+' : ''}₪{Math.abs(tx.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Analytics Tab Placeholder */}
        {activeTab === 'analytics' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center py-12 space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <PieChart size={24} />
            </div>
            <h3 className="font-bold text-slate-800">ניתוח פיננסי חכם</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">כאן יוצגו גרפים מתקדמים של הוצאות לאורך זמן, תחזיות חודשיות והמלצות חסכון.</p>
          </div>
        )}

        {/* Settings / Profile Tab Placeholder */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-800">הגדרות מערכת</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span>מטבע ראשי</span>
                <span className="font-bold text-slate-800">₪ (ILS)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span>ניהול קטגוריות</span>
                <span className="text-blue-600 font-semibold cursor-pointer">ערוך</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Action Add Button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20">
        <button className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg shadow-slate-900/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
          <Plus size={26} />
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-3 flex justify-around items-center z-10">
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'overview' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Wallet size={20} />
          <span className="text-[10px] font-medium">סקירה</span>
        </button>
        <button 
          onClick={() => setActiveTab('analytics')} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'analytics' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <PieChart size={20} />
          <span className="text-[10px] font-medium">נתונים</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'settings' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Calendar size={20} />
          <span className="text-[10px] font-medium">תקציב</span>
        </button>
      </nav>
    </div>
  );
}
