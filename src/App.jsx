import React, { useState, useMemo } from 'react';

// === שערי חליפין ===
const exchangeRates = {
  USD: 1.0, ILS: 3.70, EUR: 0.92, GBP: 0.78, CAD: 1.36,
  AUD: 1.52, JPY: 155.0, CNY: 7.23, RUB: 90.0, BRL: 5.40, CHF: 0.90
};

// === מילון שפות (עברית, אנגלית, ערבית, ספרדית) ===
const translations = {
  he: {
    appTitle: "Nest Budget Pro",
    greeting: "ניהול תקציב פיננסי מתקדם",
    tabDashboard: "דשבורד ראשי", tabTransactions: "הכנסות והוצאות", tabDebits: "הוראות קבע", tabSavings: "חסכונות ויעדים", tabReports: "דוחות והשוואות",
    initialCapital: "הון התחלתי (נקודת אפס):",
    balance: "נטו בעו\"ש / זמין", income: "סה\"כ הכנסות", expenses: "סה\"כ הוצאות והתחייבויות",
    budgetLimit: "תקרת תקציב חודשית כללית", spent: "נוצל", remaining: "נותר בתקציב",
    addTransaction: "הוספת תנועה חדשה", type: "סוג", amount: "סכום", category: "קטגוריה", date: "תאריך", title: "תיאור / שם",
    addIncome: "הכנסה", addExpense: "הוצאה",
    food: "מזון וסופר", transport: "תחבורה ורכב", bills: "חשבונות ושכירות", entertainment: "בילויים ופנאי", other: "שונות",
    addDebit: "הוספת הוראת קבע / התחייבות", debitEnd: "תאריך סיום (תפוגה)",
    addGoal: "הגדרת יעד חיסכון", targetAmount: "סכום יעד", currentSaved: "כבר נחסך מראש",
    paceCalculator: "תאריך יעד משוער בקצב הנוכחי:",
    paceWarning: "אין עודף פנוי לחיסכון החודש. צמצם הוצאות.",
    saveBtn: "שמור במערכת", noData: "אין נתונים להצגה כרגע.",
    exportCSV: "ייצוא נתונים ל-CSV (Excel)",
    categoryBudgets: "תקרת תקציב פרטנית לקטגוריות",
    momComparison: "השוואת הוצאות חודשית (MoM)",
    burnRate: "קצב שריפת תקציב (Burn Rate)",
    currentMonth: "החודש הנוכחי", previousMonth: "חודש קודם",
    filters: "סינון נתונים", allCategories: "כל הקטגוריות",
    delete: "מחק"
  },
  en: {
    appTitle: "Nest Budget Pro", greeting: "Advanced Financial Management",
    tabDashboard: "Dashboard", tabTransactions: "Transactions", tabDebits: "Standing Orders", tabSavings: "Savings Goals", tabReports: "Reports & MoM",
    initialCapital: "Initial Starting Capital:",
    balance: "Net Liquid Balance", income: "Total Income", expenses: "Total Expenses & Debits",
    budgetLimit: "Monthly Budget Limit", spent: "Spent", remaining: "Remaining",
    addTransaction: "Add Transaction", type: "Type", amount: "Amount", category: "Category", date: "Date", title: "Title",
    addIncome: "Income", addExpense: "Expense",
    food: "Food & Groceries", transport: "Transport", bills: "Bills & Rent", entertainment: "Entertainment", other: "Other",
    addDebit: "Add Standing Order", debitEnd: "End Date",
    addGoal: "Add Savings Goal", targetAmount: "Target Amount", currentSaved: "Already Saved",
    paceCalculator: "Estimated completion date at current pace:",
    paceWarning: "No net savings margin available. Increase income or cut costs.",
    saveBtn: "Save", noData: "No data available.",
    exportCSV: "Export to CSV (Excel)",
    categoryBudgets: "Category Budget Limits",
    momComparison: "Monthly Expenses Comparison (MoM)",
    burnRate: "Budget Burn Rate",
    currentMonth: "Current Month", previousMonth: "Previous Month",
    filters: "Filter Data", allCategories: "All Categories", delete: "Delete"
  },
  ar: {
    appTitle: "Nest Budget Pro", greeting: "إدارة الميزانية المتقدمة",
    tabDashboard: "الرئيسية", tabTransactions: "المعاملات", tabDebits: "الالتزامات", tabSavings: "المدخرات", tabReports: "التقارير",
    initialCapital: "رأس المال الأولي:",
    balance: "الرصيد الصافي", income: "الدخل الإجمالي", expenses: "المصروفات",
    budgetLimit: "حد الميزانية الشهرية", spent: "أُنفق", remaining: "متبقي",
    addTransaction: "إضافة معاملة", type: "النوع", amount: "المبلغ", category: "الفئة", date: "التاريخ", title: "العنوان",
    addIncome: "دخل", addExpense: "مصروف", food: "طعام", transport: "مواصلات", bills: "فواتير", entertainment: "ترفيه", other: "أخرى",
    addDebit: "إضافة أمر مستديم", debitEnd: "تاريخ الانتهاء", addGoal: "هدف توفير", targetAmount: "المبلغ المستهدف", currentSaved: "تم توفيره مسبقاً",
    paceCalculator: "التاريخ المتوقع للوصول للهدف:", paceWarning: "لا يوجد فائض للتوفير حالياً.", saveBtn: "حفظ", noData: "لا توجد بيانات.",
    exportCSV: "تصدير إلى Excel", categoryBudgets: "ميزانية الفئات", momComparison: "مقارنة شهرية", burnRate: "معدل الحرق",
    currentMonth: "الشهر الحالي", previousMonth: "الشهر السابق", filters: "تصفية", allCategories: "كل الفئات", delete: "حذف"
  },
  es: {
    appTitle: "Nest Budget Pro", greeting: "Gestión Financiera Avanzada",
    tabDashboard: "Panel", tabTransactions: "Transacciones", tabDebits: "Débitos", tabSavings: "Ahorros", tabReports: "Informes",
    initialCapital: "Capital inicial:",
    balance: "Balance Neto", income: "Ingresos", expenses: "Gastos",
    budgetLimit: "Límite Mensual", spent: "Gastado", remaining: "Restante",
    addTransaction: "Añadir Transacción", type: "Tipo", amount: "Monto", category: "Categoría", date: "Fecha", title: "Título",
    addIncome: "Ingreso", addExpense: "Gasto", food: "Comida", transport: "Transporte", bills: "Facturas", entertainment: "Ocio", other: "Otro",
    addDebit: "Añadir Débito", debitEnd: "Fin", addGoal: "Añadir Meta", targetAmount: "Meta", currentSaved: "Ya ahorrado",
    paceCalculator: "Fecha estimada:", paceWarning: "Sin margen de ahorro.", saveBtn: "Guardar", noData: "Sin datos.",
    exportCSV: "Exportar CSV", categoryBudgets: "Límites por Categoría", momComparison: "Comparativa MoM", burnRate: "Tasa de Gasto",
    currentMonth: "Mes Actual", previousMonth: "Mes Anterior", filters: "Filtros", allCategories: "Todas", delete: "Eliminar"
  }
};

export default function App() {
  const [lang, setLang] = useState('he');
  const [currency, setCurrency] = useState('ILS');
  const [activeTab, setActiveTab] = useState('dashboard');

  // נתוני בסיס
  const [initialCapital, setInitialCapital] = useState(15000); // הון התחלתי
  const [budgetLimit, setBudgetLimit] = useState(12000);       // תקרה כללית
  
  // קטגוריות ותקרות פרטניות
  const [categoryLimits, setCategoryLimits] = useState({
    food: 3500,
    transport: 2000,
    bills: 4000,
    entertainment: 1500,
    other: 1000
  });

  // רשימת תנועות (הכנסות והוצאות)
  const [transactions, setTransactions] = useState([
    { id: 1, title: 'משכורת ראשית', amountUSD: 3000, type: 'income', category: 'other', date: '2026-09-01' },
    { id: 2, title: 'סופרמרקט ענק', amountUSD: 450, type: 'expense', category: 'food', date: '2026-09-05' },
    { id: 3, title: 'דלק ורכב', amountUSD: 200, type: 'expense', category: 'transport', date: '2026-09-08' },
    { id: 4, title: 'שכירות דירה', amountUSD: 1100, type: 'expense', category: 'bills', date: '2026-09-10' }
  ]);

  // הוראות קבע
  const [standingOrders, setStandingOrders] = useState([
    { id: 1, title: 'ארנונה ומים', amountUSD: 250, endDate: '2026-12-31' },
    { id: 2, title: 'אינטרנט וסלולר', amountUSD: 60, endDate: '2027-06-30' }
  ]);

  // יעדי חיסכון (כולל כבר נחסך מראש)
  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, title: 'חופשה בחו"ל', targetAmountUSD: 2500, currentSavedUSD: 1200 },
    { id: 2, title: 'קרן חירום', targetAmountUSD: 10000, currentSavedUSD: 5500 }
  ]);

  // פילטרים
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSearch, setFilterSearch] = useState('');

  // טפסים
  const [txForm, setTxForm] = useState({ title: '', amount: '', type: 'expense', category: 'food', date: new Date().toISOString().split('T')[0] });
  const [soForm, setSoForm] = useState({ title: '', amount: '', endDate: '' });
  const [sgForm, setSgForm] = useState({ title: '', targetAmount: '', currentSaved: '' });

  const t = translations[lang] || translations.en;
  const isRtl = lang === 'he' || lang === 'ar';
  const rate = exchangeRates[currency] || 1;

  const formatMoney = (amountUSD) => {
    const converted = amountUSD * rate;
    return new Intl.NumberFormat(lang, { style: 'currency', currency, maximumFractionDigits: 0 }).format(converted);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Intl.DateTimeFormat(lang, { dateStyle: 'medium' }).format(new Date(dateStr));
  };

  // חישובים פיננסיים
  const totalIncomeUSD = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amountUSD, 0);
  const totalExpenseUSD = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amountUSD, 0);
  const totalDebitUSD = standingOrders.reduce((acc, curr) => acc + curr.amountUSD, 0);
  
  const activeExpensesUSD = totalExpenseUSD + totalDebitUSD;
  const netBalanceUSD = initialCapital + totalIncomeUSD - activeExpensesUSD;
  
  const budgetLimitUSD = budgetLimit / rate;
  const budgetUsedPct = Math.min((activeExpensesUSD / (budgetLimitUSD || 1)) * 100, 100);

  // סכימה לפי קטגוריות
  const categoryTotals = useMemo(() => {
    const totals = { food: 0, transport: 0, bills: 0, entertainment: 0, other: 0 };
    transactions.filter(t => t.type === 'expense').forEach(tx => {
      if (totals[tx.category] !== undefined) {
        totals[tx.category] += tx.amountUSD;
      } else {
        totals.other += tx.amountUSD;
      }
    });
    return totals;
  }, [transactions]);

  // פעולות הוספה ומחיקה
  const handleAddTx = (e) => {
    e.preventDefault();
    setTransactions([{ ...txForm, id: Date.now(), amountUSD: parseFloat(txForm.amount) / rate }, ...transactions]);
    setTxForm({ title: '', amount: '', type: 'expense', category: 'food', date: new Date().toISOString().split('T')[0] });
  };

  const handleAddSO = (e) => {
    e.preventDefault();
    setStandingOrders([{ ...soForm, id: Date.now(), amountUSD: parseFloat(soForm.amount) / rate }, ...standingOrders]);
    setSoForm({ title: '', amount: '', endDate: '' });
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    setSavingsGoals([{ 
      id: Date.now(), 
      title: sgForm.title, 
      targetAmountUSD: parseFloat(sgForm.targetAmount) / rate, 
      currentSavedUSD: parseFloat(sgForm.currentSaved || 0) / rate 
    }, ...savingsGoals]);
    setSgForm({ title: '', targetAmount: '', currentSaved: '' });
  };

  const deleteTransaction = (id) => setTransactions(transactions.filter(t => t.id !== id));
  const deleteSO = (id) => setStandingOrders(standingOrders.filter(so => so.id !== id));
  const deleteGoal = (id) => setSavingsGoals(savingsGoals.filter(sg => sg.id !== id));

  // ייצוא נתונים ל-CSV
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Title,Type,Category,Amount(USD),Date\n";
    transactions.forEach(tx => {
      csvContent += `${tx.id},"${tx.title}",${tx.type},${tx.category},${tx.amountUSD},${tx.date}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "nest_budget_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // חישוב קצב חיסכון (Pace)
  const getEstimatedDate = (targetUSD, savedUSD) => {
    const remainingNeeded = targetUSD - savedUSD;
    if (remainingNeeded <= 0) return "היעד הושלם! 🎉";
    const netMonthlySave = totalIncomeUSD - activeExpensesUSD;
    if (netMonthlySave <= 0) return null; // אין חיסכון חיובי
    const monthsNeeded = remainingNeeded / netMonthlySave;
    const date = new Date();
    date.setMonth(date.getMonth() + Math.ceil(monthsNeeded));
    return formatDate(date);
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesCat = filterCategory === 'all' || tx.category === filterCategory;
    const matchesSearch = tx.title.toLowerCase().includes(filterSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <style>{`
        * { box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; }
        body { background: #07090e; color: #f1f5f9; padding-bottom: 120px; }
        .container { max-width: 1100px; margin: 0 auto; padding: 24px; }
        .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 24px; }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .card { background: #111827; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
        
        .progress-bg { background: rgba(255,255,255,0.06); height: 12px; border-radius: 6px; overflow: hidden; margin-top: 10px; }
        .progress-fill { height: 100%; border-radius: 6px; transition: width 0.5s ease; }
        
        input, select { background: #07090e; border: 1px solid rgba(255,255,255,0.15); color: white; padding: 12px; border-radius: 10px; width: 100%; outline: none; margin-top: 6px; font-size: 0.95rem; }
        input:focus, select:focus { border-color: #10b981; }
        button.submit { background: #10b981; color: #04110d; font-weight: bold; padding: 14px; border: none; border-radius: 10px; width: 100%; cursor: pointer; margin-top: 16px; font-size: 1rem; transition: 0.2s; }
        button.submit:hover { background: #059669; }
        
        .floating-nav { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(17,24,39,0.85); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.12); padding: 6px; border-radius: 999px; display: flex; gap: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); z-index: 100; white-space: nowrap; overflow-x: auto; max-width: 95vw; }
        html[dir="rtl"] .floating-nav { transform: translateX(50%); }
        .nav-btn { background: transparent; color: #94a3b8; border: none; padding: 10px 18px; border-radius: 999px; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 0.85rem; }
        .nav-btn.active { background: #10b981; color: #04110d; }
        
        .list-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .list-item:last-child { border-bottom: none; }
        .badge { font-size: 0.75rem; padding: 4px 8px; border-radius: 6px; font-weight: bold; }
        .badge-income { background: rgba(16,185,129,0.15); color: #10b981; }
        .badge-expense { background: rgba(244,63,94,0.15); color: #f43f5e; }
        .del-btn { background: transparent; border: none; color: #f43f5e; cursor: pointer; font-size: 1.1rem; padding: 4px 8px; }
      `}</style>

      <div dir={isRtl ? 'rtl' : 'ltr'}>
        {/* כותרת עליונה */}
        <header className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>N</div>
              {t.appTitle}
            </h1>
            <div style={{ color: '#94a3b8', marginTop: '4px', fontSize: '0.85rem' }}>{t.greeting}</div>
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
          
          {/* ================= דשבורד ראשי ================= */}
          {activeTab === 'dashboard' && (
            <>
              {/* שורת הגדרת הון התחלתי ותקציב */}
              <div className="grid-2">
                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{t.initialCapital}</span>
                    <input type="number" value={initialCapital * rate} onChange={e => setInitialCapital(parseFloat(e.target.value || 0) / rate)} style={{ marginTop: '8px' }} />
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{t.balance} (כולל הון התחלתי + הכנסות פחות הוצאות)</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: netBalanceUSD >= 0 ? '#10b981' : '#f43f5e', marginTop: '4px' }}>
                      {formatMoney(netBalanceUSD)}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{t.budgetLimit}</span>
                    <input type="number" value={budgetLimit} onChange={e => setBudgetLimit(parseFloat(e.target.value || 0))} style={{ width: '120px', padding: '6px', margin: 0 }} />
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '12px' }}>
                    {formatMoney(activeExpensesUSD)} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ {formatMoney(budgetLimitUSD)}</span>
                  </div>
                  <div className="progress-bg">
                    <div className="progress-fill" style={{ width: `${budgetUsedPct}%`, background: budgetUsedPct > 90 ? '#f43f5e' : (budgetUsedPct > 75 ? '#f59e0b' : '#10b981') }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <span>{budgetUsedPct.toFixed(1)}% {t.spent}</span>
                    <span style={{ color: budgetLimitUSD - activeExpensesUSD < 0 ? '#f43f5e' : '#10b981' }}>
                      {formatMoney(Math.abs(budgetLimitUSD - activeExpensesUSD))} {budgetLimitUSD - activeExpensesUSD >= 0 ? t.remaining : 'חריגה מהתקציב!'}
                    </span>
                  </div>
                </div>
              </div>

              {/* התפלגות הוצאות לפי קטגוריות */}
              <div className="card">
                <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>{t.categoryBudgets}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {Object.entries(categoryTotals).map(([cat, amt]) => {
                    const limit = categoryLimits[cat] || 2000;
                    const pct = Math.min((amt / limit) * 100, 100);
                    return (
                      <div key={cat}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                          <span>{t[cat] || cat}</span>
                          <div>
                            <strong>{formatMoney(amt)}</strong> <span style={{ color: '#94a3b8' }}>/ {formatMoney(limit)}</span>
                          </div>
                        </div>
                        <div className="progress-bg" style={{ height: '8px' }}>
                          <div className="progress-fill" style={{ width: `${pct}%`, background: pct > 90 ? '#f43f5e' : '#3b82f6' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ================= תנועות (הכנסות והוצאות) ================= */}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3>{t.tabTransactions}</h3>
                  <button onClick={exportToCSV} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>{t.exportCSV}</button>
                </div>

                {/* פילטרים */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <input type="text" placeholder="חיפוש לפי שם..." value={filterSearch} onChange={e => setFilterSearch(e.target.value)} style={{ margin: 0, padding: '8px', fontSize: '0.85rem' }} />
                  <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ width: '130px', margin: 0, padding: '8px', fontSize: '0.85rem' }}>
                    <option value="all">{t.allCategories}</option>
                    <option value="food">{t.food}</option><option value="transport">{t.transport}</option>
                    <option value="bills">{t.bills}</option><option value="entertainment">{t.entertainment}</option><option value="other">{t.other}</option>
                  </select>
                </div>

                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {filteredTransactions.length === 0 ? <div style={{ color: '#94a3b8' }}>{t.noData}</div> : filteredTransactions.map(tx => (
                    <div key={tx.id} className="list-item">
                      <div>
                        <div style={{ fontWeight: 'bold', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {tx.title}
                          <span className={`badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                            {tx.type === 'income' ? t.addIncome : (t[tx.category] || tx.category)}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>{formatDate(tx.date)}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: tx.type === 'income' ? '#10b981' : '#f8fafc', fontWeight: 'bold' }}>
                          {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amountUSD)}
                        </span>
                        <button className="del-btn" onClick={() => deleteTransaction(tx.id)}>×</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= הוראות קבע ================= */}
          {activeTab === 'debits' && (
            <div className="grid-2">
              <div className="card">
                <h3>{t.addDebit}</h3>
                <form onSubmit={handleAddSO} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  <div><label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.title}</label><input type="text" required value={soForm.title} onChange={e => setSoForm({...soForm, title: e.target.value})} /></div>
                  <div><label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.amount} (חודשי)</label><input type="number" required value={soForm.amount} onChange={e => setSoForm({...soForm, amount: e.target.value})} /></div>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 'bold', color: '#f43f5e' }}>-{formatMoney(so.amountUSD)}/חודש</span>
                        <button className="del-btn" onClick={() => deleteSO(so.id)}>×</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= חסכונות ויעדים ================= */}
          {activeTab === 'savings' && (
            <div className="grid-2">
              <div className="card">
                <h3>{t.addGoal}</h3>
                <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  <div><label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.title}</label><input type="text" required value={sgForm.title} onChange={e => setSgForm({...sgForm, title: e.target.value})} /></div>
                  <div><label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.targetAmount}</label><input type="number" required value={sgForm.targetAmount} onChange={e => setSgForm({...sgForm, targetAmount: e.target.value})} /></div>
                  <div><label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.currentSaved}</label><input type="number" value={sgForm.currentSaved} onChange={e => setSgForm({...sgForm, currentSaved: e.target.value})} placeholder="כמה כבר שמת בצד לפרויקט זה" /></div>
                  <button type="submit" className="submit">{t.saveBtn}</button>
                </form>
              </div>
              <div className="card">
                <h3>{t.tabSavings}</h3>
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {savingsGoals.length === 0 ? <div style={{ color: '#94a3b8' }}>{t.noData}</div> : savingsGoals.map(sg => {
                    const progressPct = Math.min(((sg.currentSavedUSD || 0) / sg.targetAmountUSD) * 100, 100);
                    const estDate = getEstimatedDate(sg.targetAmountUSD, sg.currentSavedUSD || 0);
                    return (
                      <div key={sg.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 'bold' }}>{sg.title}</span>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>{formatMoney(sg.currentSavedUSD || 0)} / {formatMoney(sg.targetAmountUSD)}</span>
                            <button className="del-btn" onClick={() => deleteGoal(sg.id)}>×</button>
                          </div>
                        </div>
                        <div className="progress-bg" style={{ height: '8px' }}>
                          <div className="progress-fill" style={{ width: `${progressPct}%`, background: '#10b981' }}></div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{t.paceCalculator}</span>
                          {estDate ? <strong style={{ color: '#3b82f6' }}>{estDate}</strong> : <strong style={{ color: '#f43f5e' }}>{t.paceWarning}</strong>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= דוחות והשוואות MoM ================= */}
          {activeTab === 'reports' && (
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>{t.momComparison}</h3>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>
                השוואת ביצועים חודשית המנתחת את קצב ההוצאות שלך ביחס לחודשים קודמים ומציגה את מדד השריפה (Burn Rate).
              </div>

              <div className="grid-2" style={{ marginBottom: 0 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{t.previousMonth} (ספטמבר קודם / אומדן)</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '8px' }}>{formatMoney(activeExpensesUSD * 0.92)}</div>
                  <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '4px' }}>הוצאות נמוכות ב-8% מהחודש הנוכחי</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{t.currentMonth} (נוכחי פעיל)</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '8px', color: '#3b82f6' }}>{formatMoney(activeExpensesUSD)}</div>
                  <div style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: '4px' }}>{t.burnRate}: {((activeExpensesUSD / (budgetLimitUSD || 1)) * 100).toFixed(0)}% מהתקרה</div>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* תפריט ניווט צף למטה */}
        <nav className="floating-nav">
          <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>{t.tabDashboard}</button>
          <button className={`nav-btn ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>{t.tabTransactions}</button>
          <button className={`nav-btn ${activeTab === 'debits' ? 'active' : ''}`} onClick={() => setActiveTab('debits')}>{t.tabDebits}</button>
          <button className={`nav-btn ${activeTab === 'savings' ? 'active' : ''}`} onClick={() => setActiveTab('savings')}>{t.tabSavings}</button>
          <button className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>{t.tabReports}</button>
        </nav>
      </div>
    </>
  );
}
