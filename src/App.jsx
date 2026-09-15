import React, { useState } from 'react';

// אייקונים מובנים לממשק נקי וללא תלויות חיצוניות
const Icons = {
  Wallet: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>,
  PieChart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>,
  Plus: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>,
  ArrowUp: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>,
  ArrowDown: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>,
  Shopping: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>,
  Car: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>,
  Home: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  Film: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/></svg>,
  Heart: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
};

export default function BudgetApp() {
  const [activeTab, setActiveTab] = useState('overview');
  const [balance] = useState(12450);
  const [totalIncome] = useState(18200);
  const [totalExpense] = useState(5750);

  const [transactions] = useState([
    { id: 1, title: 'סופרמרקט', category: 'אוכל', amount: -450, date: 'היום, 14:20', type: 'expense', icon: 'Shopping', color: 'bg-emerald-100 text-emerald-600' },
    { id: 2, title: 'משכורת חודשית', category: 'הכנסה', amount: 18200, date: 'אתמול', type: 'income', icon: 'ArrowUp', color: 'bg-blue-100 text-blue-600' },
    { id: 3, title: 'דלק', category: 'רכב', amount: -280, date: '12 ספט', type: 'expense', icon: 'Car', color: 'bg-amber-100 text-amber-600' },
    { id: 4, title: 'מסעדה', category: 'בילויים', amount: -190, date: '10 ספט', type: 'expense', icon: 'Film', color: 'bg-rose-100 text-rose-600' },
  ]);

  const categories = [
    { name: 'אוכל', icon: 'Shopping', budget: 2000, spent: 1450, color: 'bg-emerald-500' },
    { name: 'דיור', icon: 'Home', budget: 4500, spent: 4500, color: 'bg-blue-500' },
    { name: 'רכב', icon: 'Car', budget: 1000, spent: 780, color: 'bg-amber-500' },
    { name: 'בילויים', icon: 'Film', budget: 800, spent: 650, color: 'bg-purple-500' },
    { name: 'בריאות', icon: 'Heart', budget: 500, spent: 200, color: 'bg-rose-500' },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
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

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <Icons.ArrowDown />
            </div>
            <div>
              <p className="text-xs text-slate-500">הכנסות</p>
              <p className="text-sm font-bold text-emerald-700">₪{totalIncome.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-100/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center">
              <Icons.ArrowUp />
            </div>
            <div>
              <p className="text-xs text-slate-500">הוצאות</p>
              <p className="text-sm font-bold text-rose-700">₪{totalExpense.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto space-y-6">
        {activeTab === 'overview' && (
          <>
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">מעקב תקציב חודשי</h3>
                <span className="text-xs text-slate-400">ספטמבר 2026</span>
              </div>

              <div className="space-y-3">
                {categories.map((cat, idx) => {
                  const percentage = Math.min(Math.round((cat.spent / cat.budget) * 100), 100);
                  const IconComp = Icons[cat.icon];
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="flex items-center gap-2 text-slate-700">
                          <IconComp />
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

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">תנועות אחרונות</h3>
                <button className="text-xs text-blue-600 font-semibold">הצג הכל</button>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 divide-y divide-slate-50 overflow-hidden">
                {transactions.map((tx) => {
                  const IconComp = Icons[tx.icon];
                  return (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tx.color}`}>
                          <IconComp />
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

        {activeTab === 'analytics' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center py-12 space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Icons.PieChart />
            </div>
            <h3 className="font-bold text-slate-800">ניתוח פיננסי חכם</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">כאן יוצגו גרפים מתקדמים של הוצאות לאורך זמן ותחזיות חודשיות.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-800">הגדרות מערכת</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span>מטבע ראשי</span>
                <span className="font-bold text-slate-800">₪ (ILS)</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20">
        <button className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg shadow-slate-900/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
          <Icons.Plus />
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-md border-t border-slate-100 px-6 py-3 flex justify-around items-center z-10">
        <button onClick={() => setActiveTab('overview')} className={`flex flex-col items-center gap-1 ${activeTab === 'overview' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Icons.Wallet />
          <span className="text-[10px] font-medium">סקירה</span>
        </button>
        <button onClick={() => setActiveTab('analytics')} className={`flex flex-col items-center gap-1 ${activeTab === 'analytics' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Icons.PieChart />
          <span className="text-[10px] font-medium">נתונים</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Icons.Calendar />
          <span className="text-[10px] font-medium">תקציב</span>
        </button>
      </nav>
    </div>
  );
}
