import React, { useState, useMemo } from 'react';

// === שערי חליפין ===
const exchangeRates = {
  USD: 1.0, ILS: 3.70, EUR: 0.92, GBP: 0.78, CAD: 1.36,
  AUD: 1.52, JPY: 155.0, CNY: 7.23, RUB: 90.0, BRL: 5.40, CHF: 0.90
};

// === מילון שפות ===
const translations = {
  en: {
    appTitle: "Nest Budget",
    greeting: "Welcome, Shalhev & Opal",
    tabDashboard: "Dashboard", tabTransactions: "Transactions", tabDebits: "Standing Orders", tabSavings: "Savings",
    balance: "Net Balance", income: "Total Income", expenses: "Total Expenses",
    budgetLimit: "Monthly Budget Limit", spent: "Spent", remaining: "Remaining",
    addTransaction: "Add Transaction", type: "Type", amount: "Amount", category: "Category", date: "Date", title: "Title",
    addIncome: "Income", addExpense: "Expense",
    food: "Food & Groceries", transport: "Transport", bills: "Bills", entertainment: "Entertainment", other: "Other",
    addDebit: "Add Standing Order", debitEnd: "End Date",
    addGoal: "Add Savings Goal", targetAmount: "Target Amount",
    paceCalculator: "Estimated Completion based on current pace:",
    paceWarning: "Increase net income to reach this goal.",
    saveBtn: "Save", noData: "No data yet."
  },
  he: {
    appTitle: "Nest Budget",
    greeting: "ברוכים הבאים, שלהב ואופל",
    tabDashboard: "דשבורד", tabTransactions: "תנועות", tabDebits: "הוראות קבע", tabSavings: "חסכונות",
    balance: "מאזן נטו", income: "סה״כ הכנסות", expenses: "סה״כ הוצאות",
    budgetLimit: "תקרת תקציב חודשית", spent: "בוזבז", remaining: "נותר",
    addTransaction: "הוסף תנועה (הכנסה/הוצאה)", type: "סוג", amount: "סכום", category: "קטגוריה", date: "תאריך", title: "תיאור",
    addIncome: "הכנסה", addExpense: "הוצאה",
    food: "מזון וסופר", transport: "תחבורה ורכב", bills: "חשבונות", entertainment: "פנאי ובילויים", other: "אחר",
    addDebit: "הוסף הוראת קבע", debitEnd: "תאריך סיום (תפוגה)",
    addGoal: "הוסף יעד חיסכון", targetAmount: "סכום יעד",
    paceCalculator: "צפי הגעה ליעד בקצב הנוכחי:",
    paceWarning: "הגדילו את ההכנסה הפנויה כדי להגיע ליעד.",
    saveBtn: "שמור", noData: "אין נתונים עדיין."
  },
  ar: {
    appTitle: "ميزانية العش", greeting: "مرحباً، شلهيف وأوبال",
    tabDashboard: "الرئيسية", tabTransactions: "المعاملات", tabDebits: "التزامات", tabSavings: "مدخرات",
    balance: "الرصيد الصافي", income: "الدخل", expenses: "المصروفات",
    budgetLimit: "ميزانية الشهر", spent: "أُنفق", remaining: "متبقي",
    addTransaction: "إضافة معاملة", type: "النوع", amount: "المبلغ", category: "الفئة", date: "التاريخ", title: "الوصف",
    addIncome: "دخل", addExpense: "مصروف", food: "طعام", transport: "مواصلات", bills: "فواتير", entertainment: "ترفيه", other: "أخرى",
    addDebit: "إضافة أمر مستديم", debitEnd: "تاريخ الانتهاء", addGoal: "هدف توفير", targetAmount: "المبلغ المستهدف",
    paceCalculator: "التاريخ المتوقع بناءً على المعدل الحالي:", paceWarning: "قم بزيادة الدخل للوصول للهدف.", saveBtn: "حفظ", noData: "لا توجد بيانات."
  },
  // (Placeholder for other 8 languages to keep code clean, they will fallback to English if missing)
  es: { greeting: "Bienvenido, Shalhev y Opal", appTitle: "Nest Budget", tabDashboard: "Panel", tabTransactions: "Transacciones", tabDebits: "Débitos", tabSavings: "Ahorros", balance: "Balance", income: "Ingresos", expenses: "Gastos", budgetLimit: "Límite", spent: "Gastado", remaining: "Restante", addTransaction: "Añadir", type: "Tipo", amount: "Monto", category: "Categoría", date: "Fecha", title: "Título", addIncome: "Ingreso", addExpense: "Gasto", food: "Comida", transport: "Transporte", bills: "Facturas", entertainment: "Ocio", other: "Otro", addDebit: "Añadir Débito", debitEnd: "Fin", addGoal: "Añadir Meta", targetAmount: "Monto Meta", paceCalculator: "Completado estimado:", paceWarning: "Aumente los ingresos.", saveBtn: "Guardar", noData: "Sin datos." }
};

export default function App() {
  const [lang, setLang] = useState('he'); // Default to Hebrew as requested context
  const [currency, setCurrency] = useState('ILS'); // Default to ILS
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // States for App Data (In a real app, this comes from a DB/LocalStorage)
  const [budgetLimit, setBudgetLimit] = useState(10000); // Base USD internal, but let's treat inputs natively for simplicity
  const [transactions, setTransactions] = useState([]);
  const [standingOrders, setStandingOrders] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);

  // Forms State
  const [txForm, setTxForm] = useState({ title: '', amount: '', type: 'expense', category: 'food', date: '' });
  const [soForm, setSoForm] = useState({ title: '', amount: '', endDate: '' });
  const [sgForm, setSgForm] = useState({ title: '', targetAmount: '' });

  const t = translations[lang] || translations.en;
  const isRtl = lang === 'he' || lang === 'ar';

  const formatMoney = (amountUSD) => {
    const converted = amountUSD * (exchangeRates[currency] || 1);
    return new Intl.NumberFormat(lang, { style: 'currency', currency, maximumFractionDigits: 0 }).format(converted);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Intl.DateTimeFormat(lang, { dateStyle: 'medium' }).format(new Date(dateStr));
  };

  // Calculations
  const rate = exchangeRates[currency] || 1;
  
  const totalIncomeUSD = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amountUSD, 0);
  const totalExpenseUSD = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amountUSD, 0);
  const totalDebitUSD = standingOrders.reduce((acc, curr) => acc + curr.amountUSD, 0);
  
  const netBalanceUSD = totalIncomeUSD - totalExpenseUSD - totalDebitUSD;
  const activeExpensesUSD = totalExpenseUSD + totalDebitUSD;
  
  const budgetLimitUSD = budgetLimit / rate;
  const budgetUsedPct = Math.min((activeExpensesUSD / (budgetLimitUSD || 1)) * 100, 100);

  // Category Breakdown
  const categoryTotals = transactions.filter(t => t.type === 'expense').reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amountUSD;
    return acc;
  }, {});

  // Handlers
  const handleAddTx = (e) => {
    e.preventDefault();
    setTransactions([{ ...txForm, id: Date.now(), amountUSD: parseFloat(txForm.amount) / rate }, ...transactions]);
    setTxForm({ title: '', amount: '', type: 'expense', category: 'food', date: '' });
  };

  const handleAddSO = (e) => {
    e.preventDefault();
    setStandingOrders([{ ...soForm, id: Date.now(), amountUSD: parseFloat(soForm.amount) / rate }, ...standingOrders]);
    setSoForm({ title: '', amount: '', endDate: '' });
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    setSavingsGoals([{ ...sgForm, id: Date.now(), targetAmountUSD: parseFloat(sgForm.targetAmount) / rate }, ...savingsGoals]);
    setSgForm({ title: '', targetAmount: '' });
  };

  // Savings Pace Calculator
  const getEstimatedDate = (targetAmountUSD) => {
    if (netBalanceUSD <= 0) return null; // Can't save if in minus
    const monthsNeeded = targetAmountUSD / netBalanceUSD;
    const date = new Date();
    date.setMonth(date.getMonth() + monthsNeeded);
    return date;
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; }
        body { background: #0b0f19; color: #f8fafc; padding-bottom: 120px; }
        .container { max-width: 1000px; margin: 0 auto; padding: 24px; }
        .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 24px; }
        .card { background: #151c2c; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; }
        
        .progress-bg { background: rgba(255,255,255,0.05); height: 12px; border-radius: 6px; overflow: hidden; margin-top: 12px; }
        .progress-fill { height: 100%; border-radius: 6px; transition: width 0.5s ease; }
        
        input, select { background: #0b0f19; border: 1px solid rgba(255,255,255,0.1); color: white; padding: 12px; border-radius: 10px; width: 100%; outline: none; margin-top: 6px; }
        input:focus, select:focus { border-color: #10b981; }
        button.submit { background: #10b981; color: #051610; font-weight: bold; padding: 14px; border: none; border-radius: 10px; width: 100%; cursor: pointer; margin-top: 16px; font-size: 1rem; }
        
        .floating-nav { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: rgba(21,28,44,0.9); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); padding: 8px; border-radius: 999px; display: flex; gap: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 100; white-space: nowrap; }
        html[dir="rtl"] .floating-nav { transform: translateX(50%); }
        .nav-btn { background: transparent; color: #94a3b8; border: none; padding: 10px 16px; border-radius: 999px; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 0.9rem; }
        .nav-btn.active { background: #10b981; color: #051610; }
        
        .list-item { display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .list-item:last-child { border-bottom: none; }
      `}</style>

      <div dir={isRtl ? 'rtl' : 'ltr'}>
        <header className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'linear-gradient(135deg, #10b981, #6366f1)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>N</div>
              {t.appTitle}
            </h1>
            <div style={{ color: '#94a3b8', marginTop: '6px', fontSize: '0.9rem' }}>{t.greeting}</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ width: 'auto', padding: '8px' }}>
              {Object.keys(exchangeRates).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ width: 'auto', padding: '8px' }}>
              <option value="he">עברית</option><option value="en">English</option><option value="ar">العربية</option><option value="es">Español</option>
            </select>
          </div>
        </header>

        <main className="container">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <>
              <div className="grid-2">
                <div className="card">
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{t.balance} (Free Cashflow)</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: netBalanceUSD >= 0 ? '#10b981' : '#f43f5e' }}>
                    {formatMoney(netBalanceUSD)}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '0.85rem' }}>
                    <div><span style={{ color: '#94a3b8' }}>{t.income}:</span> <span style={{ color: '#10b981' }}>{formatMoney(totalIncomeUSD)}</span></div>
                    <div><span style={{ color: '#94a3b8' }}>{t.expenses}:</span> <span style={{ color: '#f43f5e' }}>{formatMoney(activeExpensesUSD)}</span></div>
                  </div>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{t.budgetLimit}</div>
                    <input type="number" value={budgetLimit} onChange={e => setBudgetLimit(e.target.value)} style={{ width: '100px', padding: '6px', margin: 0 }} />
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '12px' }}>
                    {formatMoney(activeExpensesUSD)} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ {formatMoney(budgetLimitUSD)}</span>
                  </div>
                  <div className="progress-bg">
                    <div className="progress-fill" style={{ width: `${budgetUsedPct}%`, background: budgetUsedPct > 90 ? '#f43f5e' : (budgetUsedPct > 75 ? '#f59e0b' : '#6366f1') }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <span>{budgetUsedPct.toFixed(1)}% {t.spent}</span>
                    <span>{formatMoney(Math.max(0, budgetLimitUSD - activeExpensesUSD))} {t.remaining}</span>
                  </div>
                </div>
              </div>

              {/* Chart: Expense Breakdown */}
              <div className="card">
                <h3 style={{ marginBottom: '16px' }}>Expense Breakdown</h3>
                {Object.keys(categoryTotals).length === 0 ? <div style={{ color: '#94a3b8' }}>{t.noData}</div> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.entries(categoryTotals).sort((a,b) => b[1]-a[1]).map(([cat, amt]) => {
                      const pct = (amt / totalExpenseUSD) * 100;
                      return (
                        <div key={cat}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                            <span>{t[cat] || cat}</span>
                            <strong>{formatMoney(amt)}</strong>
                          </div>
                          <div className="progress-bg" style={{ height: '6px', marginTop: 0 }}>
                            <div className="progress-fill" style={{ width: `${pct}%`, background: '#6366f1' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === 'transactions' && (
            <div className="grid-2">
              <div className="card">
                <h3>{t.addTransaction}</h3>
                <form onSubmit={handleAddTx} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  <select value={txForm.type} onChange={e => setTxForm({...txForm, type: e.target.value})}>
                    <option value="expense">{t.addExpense}</option>
                    <option value="income">{t.addIncome}</option>
                  </select>
                  <div><label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.title}</label><input type="text" required value={txForm.title} onChange={e => setTxForm({...txForm, title: e.target.value})} /></div>
                  <div><label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.amount}</label><input type="number" required value={txForm.amount} onChange={e => setTxForm({...txForm, amount: e.target.value})} /></div>
                  {txForm.type === 'expense' && (
                    <div><label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.category}</label>
                      <select value={txForm.category} onChange={e => setTxForm({...txForm, category: e.target.value})}>
                        <option value="food">{t.food}</option><option value="transport">{t.transport}</option>
                        <option value="bills">{t.bills}</option><option value="entertainment">{t.entertainment}</option><option value="other">{t.other}</option>
                      </select>
                    </div>
                  )}
                  <div><label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.date}</label><input type="date" required value={txForm.date} onChange={e => setTxForm({...txForm, date: e.target.value})} /></div>
                  <button type="submit" className="submit">{t.saveBtn}</button>
                </form>
              </div>

              <div className="card">
                <h3>{t.tabTransactions}</h3>
                <div style={{ marginTop: '16px' }}>
                  {transactions.length === 0 ? <div style={{ color: '#94a3b8' }}>{t.noData}</div> : transactions.map(tx => (
                    <div key={tx.id} className="list-item">
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{tx.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{formatDate(tx.date)} {tx.type === 'expense' ? `• ${t[tx.category] || tx.category}` : ''}</div>
                      </div>
                      <div style={{ color: tx.type === 'income' ? '#10b981' : '#f8fafc', fontWeight: 'bold' }}>
                        {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amountUSD)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STANDING ORDERS TAB */}
          {activeTab === 'debits' && (
            <div className="grid-2">
              <div className="card">
                <h3>{t.addDebit}</h3>
                <form onSubmit={handleAddSO} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  <div><label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.title}</label><input type="text" required value={soForm.title} onChange={e => setSoForm({...soForm, title: e.target.value})} /></div>
                  <div><label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.amount} (Monthly)</label><input type="number" required value={soForm.amount} onChange={e => setSoForm({...soForm, amount: e.target.value})} /></div>
                  <div><label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.debitEnd}</label><input type="date" required value={soForm.endDate} onChange={e => setSoForm({...soForm, endDate: e.target.value})} /></div>
                  <button type="submit" className="submit">{t.saveBtn}</button>
                </form>
              </div>
              <div className="card">
                <h3>{t.tabDebits}</h3>
                <div style={{ marginTop: '16px' }}>
                  {standingOrders.length === 0 ? <div style={{ color: '#94a3b8' }}>{t.noData}</div> : standingOrders.map(so => (
                    <div key={so.id} className="list-item">
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{so.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.debitEnd}: {formatDate(so.endDate)}</div>
                      </div>
                      <div style={{ fontWeight: 'bold', color: '#f43f5e' }}>-{formatMoney(so.amountUSD)}/mo</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SAVINGS TAB */}
          {activeTab === 'savings' && (
            <div className="grid-2">
              <div className="card">
                <h3>{t.addGoal}</h3>
                <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  <div><label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.title}</label><input type="text" required value={sgForm.title} onChange={e => setSgForm({...sgForm, title: e.target.value})} /></div>
                  <div><label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.targetAmount}</label><input type="number" required value={sgForm.targetAmount} onChange={e => setSgForm({...sgForm, targetAmount: e.target.value})} /></div>
                  <button type="submit" className="submit">{t.saveBtn}</button>
                </form>
              </div>
              <div className="card">
                <h3>{t.tabSavings}</h3>
                <div style={{ marginTop: '16px' }}>
                  {savingsGoals.length === 0 ? <div style={{ color: '#94a3b8' }}>{t.noData}</div> : savingsGoals.map(sg => {
                    const estDate = getEstimatedDate(sg.targetAmountUSD);
                    return (
                      <div key={sg.id} className="list-item" style={{ display: 'block' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 'bold' }}>{sg.title}</span>
                          <span style={{ color: '#10b981', fontWeight: 'bold' }}>{formatMoney(sg.targetAmountUSD)}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                          <div style={{ marginBottom: '4px' }}>{t.paceCalculator}</div>
                          {estDate ? (
                            <strong style={{ color: '#6366f1' }}>{formatDate(estDate)}</strong>
                          ) : (
                            <strong style={{ color: '#f43f5e' }}>{t.paceWarning}</strong>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>

        <nav className="floating-nav">
          <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>{t.tabDashboard}</button>
          <button className={`nav-btn ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>{t.tabTransactions}</button>
          <button className={`nav-btn ${activeTab === 'debits' ? 'active' : ''}`} onClick={() => setActiveTab('debits')}>{t.tabDebits}</button>
          <button className={`nav-btn ${activeTab === 'savings' ? 'active' : ''}`} onClick={() => setActiveTab('savings')}>{t.tabSavings}</button>
        </nav>
      </div>
    </>
  );
}
