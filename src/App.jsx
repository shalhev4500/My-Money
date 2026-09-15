import React,5 { useState } from 'react';

// אייקונים מובנים נקיים ב-SVG שלא דורשים שום התקנה חיצונית
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
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
};

export default function BudgetApp() {
  const [activeTab, setActiveTab] = useState('overview');
  const [balance, setBalance] = useState(12450);
  const [totalIncome, setTotalIncome] = useState(18200);
  const [totalExpense, setTotalExpense] = useState(5750);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // טופס להוספת תנועה חדשה
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState('expense');

  const [transactions, setTransactions] = useState([
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

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    const amt = parseFloat(newAmount);
    const amountVal = newType === 'expense' ? -Math.abs(amt) : Math.abs(amt);
    
    const newTx = {
      id: Date.now(),
      title: newTitle,
      category: newType === 'expense' ? 'הוצאה כללית' : 'הכנסה כללית',
      amount: amountVal,
      date: 'הרגע',
      type: newType,
      icon: newType === 'expense' ? 'Shopping' : 'ArrowUp',
      color: newType === 'expense' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
    };

    setTransactions([newTx, ...transactions]);
    if (newType === 'income') {
      setTotalIncome(totalIncome + amt);
      setBalance(balance + amt);
    } else {
      setTotalExpense(totalExpense + amt);
      setBalance(balance - amt);
    }

    setNewTitle('');
    setNewAmount('');
    setIsModalOpen(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-4 font-sans">
      {/* מסגרת המובייל המדויקת */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border border-slate-800">
        
        {/* Header ראשי */}
        <header className="bg-white px-6 pt-8 pb-5 border-b border-slate-100 sticky top-0 z-20">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-slate-400 font-medium">יתרה כוללת בחשבון</p>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">₪{balance.toLocaleString()}</h1>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 shadow-sm">
              ש
            </div>
          </div>

          {/* כרטיסי סיכום מהיר */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100/80 flex items-center gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Icons.ArrowDown />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">הכנסות</p>
                <p className="text-sm font-bold text-emerald-700">₪{totalIncome.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-100/80 flex items-center gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                <Icons.ArrowUp />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">הוצאות</p>
                <p className="text-sm font-bold text-rose-700">₪{totalExpense.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </header>

        {/* תוכן מרכזי לפי הטאב הנבחר */}
        <main className="flex-1 p-5 space-y-5 overflow-y-auto pb-28">
          
          {activeTab === 'overview' && (
            <>
              {/* מעקב תקציב חודשי */}
              <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-100/80 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">מעקב תקציב לפי קטגוריות</h3>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">ספטמבר 2026</span>
                </div>

                <div className="space-y-3.5">
                  {categories.map((cat, idx) => {
                    const percentage = Math.min(Math.round((cat.spent / cat.budget) * 100), 100);
                    const IconComp = Icons[cat.icon];
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="flex items-center gap-2 text-slate-700 font-semibold">
                            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600"><IconComp /></span>
                            {cat.name}
                          </span>
                          <span className="text-slate-600 font-bold">₪{cat.spent} <span className="text-slate-400 font-normal">/ ₪{cat.budget}</span></span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${percentage > 90 ? 'bg-rose-500' : 'bg-indigo-600'}`} 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* תנועות אחרונות */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-bold text-slate-800 text-sm">תנועות אחרונות</h3>
                  <span className="text-xs text-indigo-600 font-semibold cursor-pointer">הצג הכל</span>
                </div>

                <div className="bg-white rounded-3xl shadow-xs border border-slate-100/80 divide-y divide-slate-50 overflow-hidden">
                  {transactions.map((tx) => {
                    const IconComp = Icons[tx.icon] || Icons.Shopping;
                    return (
                      <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${tx.color} shadow-xs`}>
                            <IconComp />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900">{tx.title}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{tx.date} • {tx.category}</p>
                          </div>
                        </div>
                        <span className={`font-black text-sm tracking-tight ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {tx.type === 'income' ? '+' : ''}₪{Math.abs(tx.amount).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 text-center py-16 space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Icons.PieChart />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">ניתוח פיננסי מתקדם</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">כאן מוצגים פילוחים חכמים, תחזיות הוצאות חודשיות וגרפים להשוואה קלה בין תקופות.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-900 text-base">הגדרות אפליקציה</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="p-3.5 bg-slate-50 rounded-2xl flex justify-between items-center font-medium">
                  <span>מטבע ראשי</span>
                  <span className="font-bold text-slate-900">שקל חדש (₪ ILS)</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl flex justify-between items-center font-medium">
                  <span>ניהול קטגוריות ותקציבים</span>
                  <span className="text-indigo-600 font-bold cursor-pointer">ערוך</span>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* כפתור הוספה מהיר צף במרכז */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-600/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <Icons.Plus />
          </button>
        </div>

        {/* תפריט ניווט תחתון (Bottom Nav) מעוצב */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 px-8 py-3.5 flex justify-around items-center z-20">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'overview' ? 'text-indigo-600 font-bold' : 'text-slate-400 font-medium'}`}
          >
            <Icons.Wallet />
            <span className="text-[11px]">סקירה</span>
          </button>
          <button 
            onClick={() => setActiveTab('analytics')} 
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'analytics' ? 'text-indigo-600 font-bold' : 'text-slate-400 font-medium'}`}
          >
            <Icons.PieChart />
            <span className="text-[11px]">נתונים</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'settings' ? 'text-indigo-600 font-bold' : 'text-slate-400 font-medium'}`}
          >
            <Icons.Settings />
            <span className="text-[11px]">הגדרות</span>
          </button>
        </nav>

        {/* מודל הוספת תנועה חדשה */}
        {isModalOpen && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 space-y-5 shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-lg">הוספת תנועה חדשה</h3>
                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Icons.Close />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setNewType('expense')}
                    className={`py-2 text-xs font-bold rounded-xl transition-all ${newType === 'expense' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    הוצאה
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('income')}
                    className={`py-2 text-xs font-bold rounded-xl transition-all ${newType === 'income' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500'}`}
                  >
                    הכנסה
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">שם התנועה</label>
                  <input 
                    type="text" 
                    placeholder="לדוגמה: סופרמרקט, דלק..." 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">סכום ב-₪</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-600 font-bold"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md shadow-indigo-600/30 transition-all text-sm"
                >
                  הוסף תנועה
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
