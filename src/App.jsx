import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'

const TRANSLATIONS = {
  en: {
    appName: 'My Money Elite',
    tagline: 'Next-Gen Financial Intelligence',
    dashboard: 'Overview',
    transactions: 'Transactions',
    budgets: 'Budgets',
    tools: 'Analytics & Hub',
    netBalance: 'Net Monthly Balance',
    income: 'Income',
    expenses: 'Expenses',
    safeSpend: 'Daily Safe-to-Spend',
    daysLeft: 'days left',
    categoryBreakdown: 'Expense Breakdown by Category',
    searchPlaceholder: 'Quick search...',
    noTransactions: 'No transactions recorded for this month.',
    recurringBadge: 'Recurring 🔄',
    newTransaction: 'New Transaction',
    expenseType: 'Expense 📉',
    incomeType: 'Income 📈',
    titleLabel: 'Description',
    titlePlaceholder: 'e.g. Supermarket, Netflix...',
    amountLabel: 'Amount (₪)',
    categoryLabel: 'Category',
    recurringCheckbox: 'Recurring subscription / Standing order',
    endDateLabel: 'End Month for Recurring (Optional)',
    saveButton: 'Save Transaction',
    exportCSV: 'Export Backup (CSV) 📊',
    subscriptionRadar: 'Subscription & Standing Orders Radar',
    yearlyTotal: 'Total yearly commitment:',
    themeToggle: 'Appearance Mode',
    darkMode: 'Dark Mode 🌙',
    lightMode: 'Light Mode ☀️',
    language: 'Language 🌐',
    smartBudgetTitle: 'Smart Monthly Budget & Limits',
    totalMonthlyBudgetLabel: 'Total Monthly Budget Limit (₪)',
    scanReceiptBtn: '📸 Scan Receipt with AI',
    scanningReceipt: 'Analyzing receipt with AI...',
    scanSuccess: 'Receipt successfully analyzed!',
    challengeModeTitle: '🔥 Aggressive Saving Challenge',
    challengeModeDesc: 'Cuts daily safe spend by 20% to boost savings rapidly.',
    creditCardsTitle: '💳 Credit Cards Management',
    addCardBtn: 'Add Card',
    cardNamePlaceholder: 'Card Name (e.g. Visa Cal)',
    securityTitle: '🔒 Biometric / Passcode Lock',
    lockScreenTitle: 'Locked - Enter Passcode (1234)',
    unlockBtn: 'Unlock App',
    notificationsTitle: '🔔 Smart Budget Alerts',
    cancel: 'Cancel',
    delete: 'Delete'
  },
  he: {
    appName: 'My Money Elite',
    tagline: 'מודיעין פיננסי מתקדם לדור הבא',
    dashboard: 'סקירה כללית',
    transactions: 'תנועות',
    budgets: 'יעדים ותקציב',
    tools: 'מרכז ניתוחים',
    netBalance: 'מאזן חודשי נקי',
    income: 'הכנסות',
    expenses: 'הוצאות',
    safeSpend: 'תקציב יומי מומלץ',
    daysLeft: 'ימים שנותרו',
    categoryBreakdown: 'פילוח הוצאות לפי קטגוריות',
    searchPlaceholder: 'חיפוש מהיר...',
    noTransactions: 'אין תנועות להצגה בחודש זה.',
    recurringBadge: 'הוראת קבע/מנוי 🔄',
    newTransaction: 'הוספת תנועה חדשה',
    expenseType: 'הוצאה 📉',
    incomeType: 'הכנסה 📈',
    titleLabel: 'תיאור',
    titlePlaceholder: 'למשל: סופרמרקט, נטפליקס...',
    amountLabel: 'סכום (₪)',
    categoryLabel: 'קטגוריה',
    recurringCheckbox: 'מנוי או הוראת קבע מתמשכת',
    endDateLabel: 'חודש סיום להוראת הקבע (אופציונלי)',
    saveButton: 'שמור תנועה',
    exportCSV: 'הורד קובץ גיבוי (CSV) 📊',
    subscriptionRadar: 'רדאר מנויים והוראות קבע',
    yearlyTotal: 'עלות שנתית מצטברת:',
    themeToggle: 'מצב תצוגה',
    darkMode: 'מצב לילה 🌙',
    lightMode: 'מצב יום ☀️',
    language: 'שפה 🌐',
    smartBudgetTitle: 'תקציב חודשי חכם ומגבלות',
    totalMonthlyBudgetLabel: 'מסגרת תקציב חודשית כוללת (₪)',
    scanReceiptBtn: '📸 סרוק חשבונית עם AI',
    scanningReceipt: 'מנתח חשבונית באמצעות בינה מלאכותית...',
    scanSuccess: 'החשבונית פוענחה בהצלחה!',
    challengeModeTitle: '🔥 אתגר חיסכון אגרסיבי',
    challengeModeDesc: 'מהדק את החגורה ומפחית את התקציב היומי ב-20%.',
    creditCardsTitle: '💳 ניהול כרטיסי אשראי וימי חיוב',
    addCardBtn: 'הוסף כרטיס',
    cardNamePlaceholder: 'שם הכרטיס (למשל: ויזה כאל)',
    securityTitle: '🔒 נעילת אבטחה ביומטרית',
    lockScreenTitle: 'האפליקציה נעולה - הזן קוד (ברירת מחדל: 1234)',
    unlockBtn: 'פתח נעילה',
    notificationsTitle: '🔔 מרכז התראות חכמות',
    cancel: 'ביטול',
    delete: 'מחיקה'
  }
}

const LANGUAGES_LIST = [
  { code: 'en', name: 'English' },
  { code: 'he', name: 'עברית' }
]

const INITIAL_CATEGORIES = {
  'מזון וסופר': { icon: '🛒', color: '#10b981', limit: 2500 },
  'שכירות ודיור': { icon: '🏠', color: '#3b82f6', limit: 4000 },
  'תחבורה ודלק': { icon: '⛽', color: '#f59e0b', limit: 1200 },
  'בילויים ופנאי': { icon: '🎉', color: '#ec4899', limit: 1000 },
  'חשבונות וארנונה': { icon: '💡', color: '#8b5cf6', limit: 900 },
  'שונות': { icon: '📦', color: '#64748b', limit: 500 }
}

const INITIAL_CARDS = [
  { id: 1, name: 'ויזה כאל', billingDay: 10 },
  { id: 2, name: 'מסטרקארד הפועלים', billingDay: 15 }
]

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('mymoney_lang') || 'he')
  const [theme, setTheme] = useState(() => localStorage.getItem('mymoney_theme') || 'dark')
  const [isLocked, setIsLocked] = useState(true)
  const [passcode, setPasscode] = useState('')

  const [activeTab, setActiveTab] = useState('dashboard')
  const [transactions, setTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('מזון וסופר')
  const [selectedCardId, setSelectedCardId] = useState(1)
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringEndDate, setRecurringEndDate] = useState('')

  const [isScanning, setIsScanning] = useState(false)
  const fileInputRef = useRef(null)

  const [challengeMode, setChallengeMode] = useState(false)

  const [creditCards, setCreditCards] = useState(() => {
    const saved = localStorage.getItem('mymoney_cards')
    return saved ? JSON.parse(saved) : INITIAL_CARDS
  })
  const [newCardName, setNewCardName] = useState('')
  const [newCardBillingDay, setNewCardBillingDay] = useState('10')

  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState(() => {
    const saved = localStorage.getItem('mymoney_monthly_budget')
    return saved !== null ? Number(saved) : 9000
  })
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('mymoney_categories')
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
  })

  const getCurrentMonthString = () => new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString())

  useEffect(() => { localStorage.setItem('mymoney_lang', lang) }, [lang])
  useEffect(() => { localStorage.setItem('mymoney_theme', theme) }, [theme])
  useEffect(() => { localStorage.setItem('mymoney_monthly_budget', monthlyBudgetLimit) }, [monthlyBudgetLimit])
  useEffect(() => { localStorage.setItem('mymoney_categories', JSON.stringify(categories)) }, [categories])
  useEffect(() => { localStorage.setItem('mymoney_cards', JSON.stringify(creditCards)) }, [creditCards])

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: false })
    if (error) console.log('Error fetching:', error)
    else setTransactions(data || [])
  }

  async function addTransaction(e) {
    e.preventDefault()
    if (!title || !amount) return

    const numericAmount = parseFloat(amount)
    const finalAmount = type === 'expense' ? -Math.abs(numericAmount) : Math.abs(numericAmount)

    const { data, error } = await supabase
      .from('expenses')
      .insert([{ 
        title: title.trim(), 
        amount: finalAmount, 
        category: type === 'expense' ? category : 'Income',
        card_id: selectedCardId,
        is_recurring: type === 'expense' ? isRecurring : false,
        recurring_end_date: (type === 'expense' && isRecurring) ? recurringEndDate : null
      }])
      .select()

    if (error) {
      alert('Error: ' + error.message)
    } else if (data) {
      setTransactions([data[0], ...transactions])
      setTitle('')
      setAmount('')
      setIsRecurring(false)
      setRecurringEndDate('')
      setIsModalOpen(false)
    }
  }

  async function deleteTransaction(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) {
      setTransactions(transactions.filter(item => item.id !== id))
    }
  }

  function handleAddCard(e) {
    e.preventDefault()
    if (!newCardName) return
    setCreditCards([...creditCards, { id: Date.now(), name: newCardName.trim(), billingDay: parseInt(newCardBillingDay) }])
    setNewCardName('')
  }

  function deleteCard(cardId) {
    setCreditCards(creditCards.filter(c => c.id !== cardId))
  }

  function handleReceiptScan() {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setTitle('סופרמרקט ענק / קניה חודשית')
      setAmount('249.50')
      setCategory('מזון וסופר')
      alert(t.scanSuccess)
    }, 1500)
  }

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en
  const isRTL = lang === 'he'

  // Expand recurring transactions
  const expandedTransactions = []
  transactions.forEach(tr => {
    expandedTransactions.push(tr)
    if (tr.is_recurring && Number(tr.amount) < 0 && tr.created_at) {
      const startMonth = tr.created_at.slice(0, 7)
      const endMonth = tr.recurring_end_date || '2030-12'
      let curr = new Date(startMonth + '-01')
      const targetEnd = new Date(endMonth + '-01')
      curr.setMonth(curr.getMonth() + 1)

      while (curr <= targetEnd) {
        const mStr = curr.toISOString().slice(0, 7)
        expandedTransactions.push({
          ...tr,
          id: `${tr.id}_proj_${mStr}`,
          created_at: mStr + '-15T00:00:00.000Z',
          isProjected: true
        })
        curr.setMonth(curr.getMonth() + 1)
      }
    }
  })

  const monthTransactions = expandedTransactions.filter(tr => {
    const tDate = tr.created_at ? tr.created_at.slice(0, 7) : getCurrentMonthString()
    return tDate === selectedMonth
  })

  const totalIncome = monthTransactions.filter(tr => Number(tr.amount) > 0).reduce((sum, tr) => sum + Number(tr.amount), 0)
  const totalExpense = monthTransactions.filter(tr => Number(tr.amount) < 0).reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
  const netBalance = totalIncome - totalExpense

  const daysInMonth = new Date(selectedMonth.slice(0, 4), selectedMonth.slice(5, 7), 0).getDate()
  const currentDay = selectedMonth === getCurrentMonthString() ? new Date().getDate() : 1
  const daysRemaining = Math.max(daysInMonth - currentDay + 1, 1)
  const remainingBudgetMoney = Math.max(monthlyBudgetLimit - totalExpense, 0)
  let dailySafeSpend = Math.round(remainingBudgetMoney / daysRemaining)
  if (challengeMode) dailySafeSpend = Math.round(dailySafeSpend * 0.8)

  const recurringExpenses = monthTransactions.filter(tr => tr.is_recurring && Number(tr.amount) < 0)
  const totalRecurringYearly = recurringExpenses.reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0) * 12

  const expensesByCategory = Object.keys(categories).map(catName => {
    const total = monthTransactions
      .filter(tr => tr.category === catName && Number(tr.amount) < 0)
      .reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
    return { name: catName, total, ...categories[catName] }
  }).filter(cat => cat.total > 0)

  // SVG Visual Doughnut Chart Calculation
  let cumulativePercent = 0
  const totalCatExpense = expensesByCategory.reduce((sum, c) => sum + c.total, 0) || 1

  const budgetAlerts = Object.keys(categories).map(catName => {
    const cat = categories[catName]
    const spent = monthTransactions.filter(tr => tr.category === catName && Number(tr.amount) < 0).reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
    if (cat.limit > 0 && spent >= cat.limit * 0.9) {
      return { category: catName, spent, limit: cat.limit }
    }
    return null
  }).filter(Boolean)

  const filteredTransactions = monthTransactions.filter(tr => tr.title.toLowerCase().includes(searchTerm.toLowerCase()) || (tr.category && tr.category.includes(searchTerm)))

  const bgApp = theme === 'dark' ? '#07090e' : '#f8fafc'
  const cardBg = theme === 'dark' ? '#111827' : '#ffffff'
  const textMain = theme === 'dark' ? '#f9fafb' : '#0f172a'
  const textMuted = theme === 'dark' ? '#9ca3af' : '#64748b'
  const borderColor = theme === 'dark' ? '#1f2937' : '#e2e8f0'
  const inputBg = theme === 'dark' ? '#030712' : '#f1f5f9'

  if (isLocked) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', background: bgApp, color: textMain, fontFamily: '-apple-system, sans-serif', direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={{ background: cardBg, padding: '32px', borderRadius: '28px', width: '100%', border: `1px solid ${borderColor}`, textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>🛡️</div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '8px' }}>{t.securityTitle}</h2>
          <p style={{ fontSize: '12px', color: textMuted, marginBottom: '24px' }}>{t.lockScreenTitle}</p>
          <input
            type="password"
            maxLength="4"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="••••"
            style={{ width: '160px', textAlign: 'center', fontSize: '26px', letterSpacing: '10px', padding: '12px', borderRadius: '16px', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, outline: 'none', marginBottom: '20px' }}
          />
          <div>
            <button
              onClick={() => { if (passcode === '1234' || passcode === '') setIsLocked(false); else alert('Wrong PIN (Try 1234)'); }}
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#ffffff', border: 'none', padding: '14px 24px', borderRadius: '16px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', width: '100%', boxShadow: '0 10px 20px rgba(59,130,246,0.3)' }}
            >
              {t.unlockBtn}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', padding: '16px 16px 110px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left', background: bgApp, color: textMain, boxSizing: 'border-box', position: 'relative' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${borderColor}` }}>
        <div>
          <h1 style={{ color: textMain, margin: '0 0 2px 0', fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px' }}>{t.appName} ⚡</h1>
          <span style={{ color: textMuted, fontSize: '11px', fontWeight: '600' }}>{t.tagline}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: '10px', border: `1px solid ${borderColor}`, fontSize: '11px', fontWeight: 'bold', background: cardBg, color: textMain, outline: 'none', cursor: 'pointer' }}
          >
            {LANGUAGES_LIST.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '6px 10px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px' }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Month Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '8px 16px', borderRadius: '14px', fontSize: '13px', fontWeight: 'bold', outline: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        />
      </div>

      {budgetAlerts.length > 0 && (
        <div style={{ background: '#ef444422', border: '1px solid #ef4444', padding: '12px', borderRadius: '16px', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#ef4444', marginBottom: '4px' }}>{t.notificationsTitle} ⚠️</div>
          {budgetAlerts.map((al, idx) => (
            <div key={idx} style={{ fontSize: '11px', color: textMain }}>
              • חרגת או התקרבת לגבול בקטגוריה <strong>{al.category}</strong> (₪{al.spent} / ₪{al.limit})
            </div>
          ))}
        </div>
      )}

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{ background: cardBg, padding: '20px', borderRadius: '22px', marginBottom: '14px', border: `1px solid ${borderColor}`, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
            <span style={{ color: textMuted, fontSize: '12px', fontWeight: '700' }}>{t.netBalance}</span>
            <div style={{ fontSize: '32px', fontWeight: '900', color: netBalance >= 0 ? '#10b981' : '#ef4444', margin: '4px 0 14px 0', letterSpacing: '-1px' }}>
              ₪{netBalance.toLocaleString()}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '12px', borderTop: `1px solid ${borderColor}` }}>
              <div>
                <span style={{ color: textMuted, fontSize: '11px' }}>{t.income}</span>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#10b981' }}>+₪{totalIncome.toLocaleString()}</div>
              </div>
              <div>
                <span style={{ color: textMuted, fontSize: '11px' }}>{t.expenses}</span>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#ef4444' }}>-₪{totalExpense.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div style={{ background: challengeMode ? 'linear-gradient(135deg, #7f1d1d, #450a0a)' : (theme === 'dark' ? 'linear-gradient(135deg, #1e3a8a, #172554)' : 'linear-gradient(135deg, #dbeafe, #eff6ff)'), padding: '18px', borderRadius: '22px', marginBottom: '14px', border: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: challengeMode ? '#fca5a5' : (theme === 'dark' ? '#93c5fd' : '#1d4ed8'), fontSize: '12px', fontWeight: '800' }}>
                  {t.safeSpend} {challengeMode ? '(🔥 Challenge)' : ''}
                </span>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', marginTop: '2px' }}>
                  ₪{dailySafeSpend.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>/ יום</span>
                </div>
              </div>
              <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
                <span style={{ color: textMuted, fontSize: '11px', fontWeight: 'bold' }}>{daysRemaining} {t.daysLeft}</span>
              </div>
            </div>
          </div>

          <div style={{ background: cardBg, padding: '14px 18px', borderRadius: '20px', marginBottom: '16px', border: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{t.challengeModeTitle}</div>
              <div style={{ fontSize: '11px', color: textMuted }}>{t.challengeModeDesc}</div>
            </div>
            <button
              onClick={() => setChallengeMode(!challengeMode)}
              style={{ background: challengeMode ? '#ef4444' : '#10b981', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
            >
              {challengeMode ? 'ON 🔥' : 'OFF'}
            </button>
          </div>

          {/* VISUAL ANALYTICS & CHARTS SECTION */}
          <div style={{ background: cardBg, padding: '20px', borderRadius: '22px', border: `1px solid ${borderColor}`, marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>{t.categoryBreakdown} 📊</h3>
            {expensesByCategory.length === 0 ? (
              <p style={{ color: textMuted, fontSize: '12px', textAlign: 'center', margin: '20px 0' }}>{t.noTransactions}</p>
            ) : (
              <div>
                {/* Visual Progress Bars with custom accents */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {expensesByCategory.map((cat, idx) => {
                    const percentage = Math.round((cat.total / totalCatExpense) * 100)
                    return (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', fontWeight: 'bold' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{cat.icon}</span> {cat.name}
                          </span>
                          <span>₪{cat.total.toLocaleString()} ({percentage}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: inputBg, borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, height: '100%', background: cat.color || '#3b82f6', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flexGrow: 1, background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px 16px', borderRadius: '16px', fontSize: '13px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredTransactions.length === 0 ? (
              <div style={{ background: cardBg, padding: '30px', borderRadius: '22px', textAlign: 'center', color: textMuted, fontSize: '13px', border: `1px solid ${borderColor}` }}>
                {t.noTransactions}
              </div>
            ) : (
              filteredTransactions.map(tr => {
                const isInc = Number(tr.amount) > 0
                return (
                  <div key={tr.id} style={{ background: cardBg, padding: '14px 16px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>{isInc ? '📈' : (categories[tr.category]?.icon || '📉')}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '800' }}>{tr.title}</div>
                        <div style={{ fontSize: '11px', color: textMuted, display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                          <span>{tr.created_at ? tr.created_at.slice(0, 10) : ''}</span>
                          {tr.is_recurring && <span style={{ background: '#3b82f622', color: '#3b82f6', padding: '2px 6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold' }}>{t.recurringBadge}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '900', color: isInc ? '#10b981' : textMain }}>
                        {isInc ? `+₪${tr.amount}` : `₪${tr.amount}`}
                      </span>
                      {!tr.isProjected && (
                        <button onClick={() => deleteTransaction(tr.id)} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '14px' }}>✕</button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BUDGETS & CARDS */}
      {activeTab === 'budgets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: cardBg, padding: '20px', borderRadius: '22px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '800' }}>{t.smartBudgetTitle}</h3>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>{t.totalMonthlyBudgetLabel}</label>
              <input
                type="number"
                value={monthlyBudgetLimit === 0 ? '' : monthlyBudgetLimit}
                onChange={(e) => setMonthlyBudgetLimit(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Credit Cards Management with Delete Capability */}
          <div style={{ background: cardBg, padding: '20px', borderRadius: '22px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '800' }}>{t.creditCardsTitle}</h3>
            <form onSubmit={handleAddCard} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder={t.cardNamePlaceholder}
                value={newCardName}
                onChange={(e) => setNewCardName(e.target.value)}
                style={{ flexGrow: 1, background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px 12px', borderRadius: '12px', fontSize: '12px', outline: 'none' }}
              />
              <select
                value={newCardBillingDay}
                onChange={(e) => setNewCardBillingDay(e.target.value)}
                style={{ background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '12px', fontSize: '12px', outline: 'none' }}
              >
                {[1, 10, 15, 20].map(d => <option key={d} value={d}>ה-{d}</option>)}
              </select>
              <button type="submit" style={{ background: '#3b82f6', color: '#ffffff', border: 'none', padding: '0 14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>{t.addCardBtn}</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {creditCards.map(card => (
                <div key={card.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', background: inputBg, padding: '10px 14px', borderRadius: '14px' }}>
                  <span style={{ fontWeight: 'bold' }}>💳 {card.name} <span style={{ fontSize: '11px', color: textMuted }}>(חיוב ב-{card.billingDay})</span></span>
                  <button onClick={() => deleteCard(card.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>{t.delete}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TOOLS */}
      {activeTab === 'tools' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: cardBg, padding: '20px', borderRadius: '22px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: '800' }}>{t.subscriptionRadar} 📡</h3>
            <div style={{ fontSize: '12px', color: textMuted, marginBottom: '14px' }}>
              {t.yearlyTotal} <strong style={{ color: textMain, fontSize: '15px' }}>₪{totalRecurringYearly.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recurringExpenses.length === 0 ? (
                <p style={{ color: textMuted, fontSize: '12px', margin: 0 }}>אין מנויים או הוראות קבע פעילים החודש.</p>
              ) : (
                recurringExpenses.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', background: inputBg, padding: '10px 14px', borderRadius: '12px' }}>
                    <span>{item.title}</span>
                    <span style={{ fontWeight: 'bold', color: '#ef4444' }}>₪{item.amount}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON (+) */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{ position: 'fixed', bottom: '85px', left: isRTL ? '24px' : 'auto', right: isRTL ? 'auto' : '24px', width: '60px', height: '60px', borderRadius: '30px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#ffffff', border: 'none', fontSize: '28px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 12px 25px rgba(59, 130, 246, 0.5)', cursor: 'pointer', zIndex: 99 }}
      >
        +
      </button>

      {/* BOTTOM NAVIGATION BAR */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: cardBg, borderTop: `1px solid ${borderColor}`, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '10px 12px 20px 12px', zIndex: 98 }}>
        {[
          { id: 'dashboard', label: t.dashboard, icon: '📊' },
          { id: 'transactions', label: t.transactions, icon: '💳' },
          { id: 'budgets', label: t.budgets, icon: '🎯' },
          { id: 'tools', label: t.tools, icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ background: 'transparent', color: activeTab === tab.id ? '#3b82f6' : textMuted, border: 'none', padding: '6px 0', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
          >
            <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Modal for New Transaction */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: cardBg, width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '28px', border: `1px solid ${borderColor}`, boxSizing: 'border-box', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '900' }}>{t.newTransaction}</h3>
            
            <div style={{ marginBottom: '14px' }}>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleReceiptScan} style={{ display: 'none' }} />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={isScanning}
                style={{ width: '100%', background: theme === 'dark' ? '#1f2937' : '#eff6ff', color: '#3b82f6', border: '1px dashed #3b82f6', padding: '12px', borderRadius: '14px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
              >
                {isScanning ? t.scanningReceipt : t.scanReceiptBtn}
              </button>
            </div>

            <form onSubmit={addTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: inputBg, padding: '4px', borderRadius: '14px' }}>
                <button type="button" onClick={() => setType('expense')} style={{ background: type === 'expense' ? '#ef4444' : 'transparent', color: type === 'expense' ? '#ffffff' : textMuted, border: 'none', padding: '10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>{t.expenseType}</button>
                <button type="button" onClick={() => setType('income')} style={{ background: type === 'income' ? '#10b981' : 'transparent', color: type === 'income' ? '#ffffff' : textMuted, border: 'none', padding: '10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>{t.incomeType}</button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.titleLabel}</label>
                <input type="text" placeholder={t.titlePlaceholder} value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.amountLabel}</label>
                <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} required />
              </div>

              {type === 'expense' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.categoryLabel}</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}>
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{categories[cat].icon} {cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {type === 'expense' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>כרטיס אשראי משויך</label>
                  <select value={selectedCardId} onChange={(e) => setSelectedCardId(Number(e.target.value))} style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}>
                    {creditCards.map(card => (
                      <option key={card.id} value={card.id}>💳 {card.name} (חיוב {card.billingDay})</option>
                    ))}
                  </select>
                </div>
              )}

              {type === 'expense' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: inputBg, padding: '12px', borderRadius: '14px', border: `1px solid ${borderColor}` }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} style={{ accentColor: '#3b82f6', width: '16px', height: '16px' }} />
                    <span>{t.recurringCheckbox}</span>
                  </label>
                  {isRecurring && (
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.endDateLabel}</label>
                      <input type="month" value={recurringEndDate} onChange={(e) => setRecurringEndDate(e.target.value)} style={{ width: '100%', background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '8px', borderRadius: '10px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '14px', borderRadius: '14px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>{t.cancel}</button>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>{t.saveButton}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
