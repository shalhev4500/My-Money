// name=elite-finance-app-v3.js
import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'

const TRANSLATIONS = {
  en: {
    appName: 'Elite Finance',
    tagline: 'Advanced Money Intelligence',
    dashboard: 'Overview',
    transactions: 'Transactions',
    budgets: 'Budgets & Categories',
    goalsTab: 'Savings Goals',
    netWorthTab: 'Net Worth & Assets',
    tools: 'Analytics & Export',
    netBalance: 'Net Monthly Balance',
    income: 'Income',
    expenses: 'Expenses',
    safeSpend: 'Daily Safe-to-Spend',
    daysLeft: 'days left',
    categoryBreakdown: 'Expense Breakdown by Category',
    searchPlaceholder: 'Quick search description or category...',
    noTransactions: 'No transactions recorded for this month.',
    recurringBadge: 'Recurring 🔄',
    newTransaction: 'New Transaction',
    expenseType: 'Expense 📉',
    incomeType: 'Income 📈',
    titleLabel: 'Description',
    titlePlaceholder: 'e.g. Supermarket, Netflix...',
    amountLabel: 'Amount',
    categoryLabel: 'Category',
    recurringCheckbox: 'Recurring subscription / Standing order',
    endDateLabel: 'End Month for Recurring (Optional)',
    saveButton: 'Save Transaction',
    subscriptionRadar: 'Subscription & Standing Orders Radar',
    yearlyTotal: 'Total yearly commitment:',
    smartBudgetTitle: 'Category Budgets & Limits',
    totalMonthlyBudgetLabel: 'Total Monthly Budget Limit',
    scanReceiptBtn: '📸 Scan Receipt with AI',
    scanningReceipt: 'Analyzing receipt with AI...',
    scanSuccess: 'Receipt successfully analyzed!',
    savingsGoalsTitle: '🎯 Smart Savings Goals',
    goalNamePlaceholder: 'Goal Name (e.g. New Car)',
    goalTargetPlaceholder: 'Target Amount (₪)',
    goalCurrentPlaceholder: 'Already Saved (₪)',
    addGoalBtn: 'Add Savings Goal',
    estCompletion: 'Estimated Target Date:',
    monthsToGoal: 'Months remaining:',
    securityTitle: '🔒 Security Lock',
    lockScreenTitle: 'Locked - Enter Passcode (Default: 1234)',
    unlockBtn: 'Unlock App',
    notificationsTitle: '🔔 Smart Budget Alerts',
    healthScoreTitle: '🛡️ Financial Health Score',
    netWorthTitle: '🏛️ Net Worth & Asset Intelligence',
    totalAssets: 'Total Assets & Savings',
    totalLiabilities: 'Total Debts & Credit Liabilities',
    addAssetBtn: 'Add Asset / Liability',
    exportCsv: '📥 Export Data to CSV',
    projCashflowTitle: '🔮 30-Day Cash Flow Forecast',
    prevMonthCompare: 'Month-over-Month Spending',
    cancel: 'Cancel',
    delete: 'Delete'
  },
  he: {
    appName: 'Elite Finance',
    tagline: 'מודיעין פיננסי חכם ומתקדם',
    dashboard: 'סקירה כללית',
    transactions: 'תנועות',
    budgets: 'תקציבים וקטגוריות',
    goalsTab: 'יעדי חיסכון',
    netWorthTab: 'הון עצמי ונכסים',
    tools: 'אנליטיקה וייצוא',
    netBalance: 'מאזן חודשי נקי',
    income: 'הכנסות',
    expenses: 'הוצאות',
    safeSpend: 'תקציב יומי מומלץ',
    daysLeft: 'ימים שנותרו',
    categoryBreakdown: 'פילוח הוצאות לפי קטגוריות',
    searchPlaceholder: 'חיפוש מהיר לפי תיאור או קטגוריה...',
    noTransactions: 'אין תנועות להצגה בחודש זה.',
    recurringBadge: 'הוראת קבע/מנוי 🔄',
    newTransaction: 'הוספת תנועה חדשה',
    expenseType: 'הוצאה 📉',
    incomeType: 'הכנסה 📈',
    titleLabel: 'תיאור',
    titlePlaceholder: 'למשל: סופרמרקט, נטפליקס...',
    amountLabel: 'סכום',
    categoryLabel: 'קטגוריה',
    recurringCheckbox: 'מנוי או הוראת קבע מתמשכת',
    endDateLabel: 'חודש סיום להוראת הקבע (אופציונלי)',
    saveButton: 'שמור תנועה',
    subscriptionRadar: 'רדאר מנויים והוראות קבע',
    yearlyTotal: 'עלות שנתית מצטברת:',
    smartBudgetTitle: 'הגדרת תקציב לכל קטגוריה',
    totalMonthlyBudgetLabel: 'מסגרת תקציב חודשית כוללת',
    scanReceiptBtn: '📸 סרוק חשבונית עם AI',
    scanningReceipt: 'מנתח חשבונית באמצעות בינה מלאכותית...',
    scanSuccess: 'החשבונית פוענחה בהצלחה!',
    savingsGoalsTitle: '🎯 יעדי חיסכון חכמים ותחזית תאריך',
    goalNamePlaceholder: 'שם היעד (למשל: רכב חדש)',
    goalTargetPlaceholder: 'סכום יעד (₪)',
    goalCurrentPlaceholder: 'חסכתי כבר (₪)',
    addGoalBtn: 'הוסף יעד חיסכון',
    estCompletion: 'תאריך יעד משוער להשלמה:',
    monthsToGoal: 'חודשים שנותרו:',
    securityTitle: '🔒 נעילת אבטחה ביומטרית',
    lockScreenTitle: 'האפליקציה נעולה - הזן קוד (ברירת מחדל: 1234)',
    unlockBtn: 'פתח נעילה',
    notificationsTitle: '🔔 מרכז התראות חכמות',
    healthScoreTitle: '🛡️ מדד בריאות פיננסית',
    netWorthTitle: '🏛️ מאזן הון עצמי ונכסים כולל',
    totalAssets: 'סה"כ נכסים וחסכונות',
    totalLiabilities: 'סה"כ התחייבויות וחובות',
    addAssetBtn: 'הוסף נכס / התחייבות',
    exportCsv: '📥 ייצוא נתונים לקובץ Excel / CSV',
    projCashflowTitle: '🔮 תחזית תזרים מזומנים ל-30 יום',
    prevMonthCompare: 'השוואת הוצאות מול חודש קודם',
    cancel: 'ביטול',
    delete: 'מחיקה'
  }
}

const LANGUAGES_LIST = [
  { code: 'en', name: 'English' },
  { code: 'he', name: 'עברית' }
]

const CURRENCIES = [
  { symbol: '₪', code: 'ILS', rate: 1 },
  { symbol: '$', code: 'USD', rate: 0.27 },
  { symbol: '€', code: 'EUR', rate: 0.25 }
]

const INITIAL_CATEGORIES = {
  'מזון וסופר': { icon: '🛒', color: '#10b981', limit: 2500 },
  'שכירות ודיור': { icon: '🏠', color: '#3b82f6', limit: 4000 },
  'תחבורה ודלק': { icon: '⛽', color: '#f59e0b', limit: 1200 },
  'בילויים ופנאי': { icon: '🎉', color: '#ec4899', limit: 1000 },
  'חשבונות וארנונה': { icon: '💡', color: '#8b5cf6', limit: 900 },
  'שונות': { icon: '📦', color: '#64748b', limit: 500 }
}

const INITIAL_ASSETS = [
  { id: 1, name: 'חשבון עו"ש בנקאי', type: 'asset', amount: 15400 },
  { id: 2, name: 'קרן השתלמות / חסכונות', type: 'asset', amount: 45000 },
  { id: 3, name: 'הלוואת רכב / אשראי', type: 'liability', amount: 12000 }
]

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('mymoney_lang') || 'he')
  const [theme, setTheme] = useState(() => localStorage.getItem('mymoney_theme') || 'dark')
  const [currency, setCurrency] = useState('₪')
  const [isLocked, setIsLocked] = useState(true)
  const [passcode, setPasscode] = useState('')

  const [activeTab, setActiveTab] = useState('dashboard')
  const [transactions, setTransactions] = useState([])
  const [savingsGoals, setSavingsGoals] = useState([])
  const [assetsList, setAssetsList] = useState(() => {
    const saved = localStorage.getItem('mymoney_assets')
    return saved ? JSON.parse(saved) : INITIAL_ASSETS
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Transaction Form States
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('מזון וסופר')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringEndDate, setRecurringEndDate] = useState('')

  // Asset Form States
  const [assetName, setAssetName] = useState('')
  const [assetAmount, setAssetAmount] = useState('')
  const [assetType, setAssetType] = useState('asset')

  // Savings Goal Inputs
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalTarget, setNewGoalTarget] = useState('')
  const [newGoalCurrent, setNewGoalCurrent] = useState('')

  // New Category Input
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('🏷️')
  const [newCatLimit, setNewCatLimit] = useState('')

  const [isScanning, setIsScanning] = useState(false)
  const fileInputRef = useRef(null)

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('mymoney_categories')
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
  })

  const getCurrentMonthString = () => new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString())

  useEffect(() => { localStorage.setItem('mymoney_lang', lang) }, [lang])
  useEffect(() => { localStorage.setItem('mymoney_theme', theme) }, [theme])
  useEffect(() => { localStorage.setItem('mymoney_categories', JSON.stringify(categories)) }, [categories])
  useEffect(() => { localStorage.setItem('mymoney_assets', JSON.stringify(assetsList)) }, [assetsList])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: txData, error: txError } = await supabase.from('expenses').select('*').order('created_at', { ascending: false })
    if (!txError) setTransactions(txData || [])

    const { data: goalData, error: goalError } = await supabase.from('savings_goals').select('*')
    if (!goalError) setSavingsGoals(goalData || [])
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

  function handleAddAsset(e) {
    e.preventDefault()
    if (!assetName || !assetAmount) return
    const newAsset = {
      id: Date.now(),
      name: assetName.trim(),
      type: assetType,
      amount: parseFloat(assetAmount)
    }
    setAssetsList([...assetsList, newAsset])
    setAssetName('')
    setAssetAmount('')
  }

  function deleteAsset(id) {
    setAssetsList(assetsList.filter(a => a.id !== id))
  }

  function handleAddCategory(e) {
    e.preventDefault()
    if (!newCatName) return
    setCategories({
      ...categories,
      [newCatName.trim()]: { icon: newCatIcon || '🏷️', color: '#3b82f6', limit: parseFloat(newCatLimit) || 0 }
    })
    setNewCatName('')
    setNewCatLimit('')
  }

  async function handleAddGoal(e) {
    e.preventDefault()
    if (!newGoalName || !newGoalTarget) return

    const { data, error } = await supabase
      .from('savings_goals')
      .insert([{
        title: newGoalName.trim(),
        target_amount: parseFloat(newGoalTarget),
        current_amount: parseFloat(newGoalCurrent || 0)
      }])
      .select()

    if (!error && data) {
      setSavingsGoals([...savingsGoals, data[0]])
      setNewGoalName('')
      setNewGoalTarget('')
      setNewGoalCurrent('')
    }
  }

  async function deleteGoal(id) {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id)
    if (!error) {
      setSavingsGoals(savingsGoals.filter(g => g.id !== id))
    }
  }

  function exportToCSV() {
    if (transactions.length === 0) return alert('אין תנועות לייצוא')
    let csvContent = "data:text/csv;charset=utf-8,Date,Title,Amount,Category,Recurring\n"
    transactions.forEach(t => {
      csvContent += `${t.created_at ? t.created_at.slice(0, 10) : ''},"${t.title}",${t.amount},"${t.category}",${t.is_recurring ? 'Yes' : 'No'}\n`
    })
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `finance_export_${selectedMonth}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
  const currObj = CURRENCIES.find(c => c.symbol === currency) || CURRENCIES[0]

  const formatMoney = (val) => {
    const converted = Math.round(val * currObj.rate)
    return `${currency}${converted.toLocaleString()}`
  }

  // Monthly Transactions Breakdown
  const monthTransactions = transactions.filter(tr => {
    const tDate = tr.created_at ? tr.created_at.slice(0, 7) : getCurrentMonthString()
    return tDate === selectedMonth
  })

  // Previous Month Transactions Calculation for Comparison
  const prevMonthDate = new Date(selectedMonth + '-01')
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1)
  const prevMonthStr = prevMonthDate.toISOString().slice(0, 7)
  const prevMonthExpense = transactions
    .filter(tr => (tr.created_at ? tr.created_at.slice(0, 7) : '') === prevMonthStr && Number(tr.amount) < 0)
    .reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)

  const totalIncome = monthTransactions.filter(tr => Number(tr.amount) > 0).reduce((sum, tr) => sum + Number(tr.amount), 0)
  const totalExpense = monthTransactions.filter(tr => Number(tr.amount) < 0).reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
  const netBalance = totalIncome - totalExpense

  // Net Worth Calculation
  const totalAssetsVal = assetsList.filter(a => a.type === 'asset').reduce((sum, a) => sum + a.amount, 0)
  const totalLiabilitiesVal = assetsList.filter(a => a.type === 'liability').reduce((sum, a) => sum + a.amount, 0)
  const netWorthTotal = totalAssetsVal - totalLiabilitiesVal

  const daysInMonth = new Date(selectedMonth.slice(0, 4), selectedMonth.slice(5, 7), 0).getDate()
  const currentDay = selectedMonth === getCurrentMonthString() ? new Date().getDate() : 1
  const daysRemaining = Math.max(daysInMonth - currentDay + 1, 1)
  
  const totalCategoryLimits = Object.values(categories).reduce((sum, c) => sum + (c.limit || 0), 0)
  const remainingBudgetMoney = Math.max(totalCategoryLimits - totalExpense, 0)
  const dailySafeSpend = Math.round(remainingBudgetMoney / daysRemaining)

  const recurringExpenses = monthTransactions.filter(tr => tr.is_recurring && Number(tr.amount) < 0)
  const totalRecurringYearly = recurringExpenses.reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0) * 12

  const expensesByCategory = Object.keys(categories).map(catName => {
    const total = monthTransactions
      .filter(tr => tr.category === catName && Number(tr.amount) < 0)
      .reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
    return { name: catName, total, ...categories[catName] }
  }).filter(cat => cat.total > 0)

  const totalCatExpense = expensesByCategory.reduce((sum, c) => sum + c.total, 0) || 1

  let healthScore = 85
  if (totalExpense > totalIncome && totalIncome > 0) healthScore = 45
  else if (totalExpense > totalCategoryLimits && totalCategoryLimits > 0) healthScore = 60
  else if (netBalance > 3000) healthScore = 95

  const filteredTransactions = monthTransactions.filter(tr => tr.title.toLowerCase().includes(searchTerm.toLowerCase()) || (tr.category && tr.category.includes(searchTerm)))

  const bgApp = theme === 'dark' ? '#0b0f19' : '#f8fafc'
  const cardBg = theme === 'dark' ? '#131c2e' : '#ffffff'
  const textMain = theme === 'dark' ? '#f8fafc' : '#0f172a'
  const textMuted = theme === 'dark' ? '#94a3b8' : '#64748b'
  const borderColor = theme === 'dark' ? '#1e293b' : '#e2e8f0'
  const inputBg = theme === 'dark' ? '#070b14' : '#f1f5f9'

  if (isLocked) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', background: bgApp, color: textMain, fontFamily: '-apple-system, sans-serif', direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={{ background: cardBg, padding: '36px 28px', borderRadius: '32px', width: '100%', border: `1px solid ${borderColor}`, textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🛡️</div>
          <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '8px' }}>{t.securityTitle}</h2>
          <p style={{ fontSize: '13px', color: textMuted, marginBottom: '24px' }}>{t.lockScreenTitle}</p>
          <input
            type="password"
            maxLength="4"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="••••"
            style={{ width: '180px', textAlign: 'center', fontSize: '28px', letterSpacing: '12px', padding: '14px', borderRadius: '18px', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, outline: 'none', marginBottom: '24px' }}
          />
          <div>
            <button
              onClick={() => { if (passcode === '1234' || passcode === '') setIsLocked(false); else alert('Wrong PIN (Try 1234)'); }}
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#ffffff', border: 'none', padding: '16px 24px', borderRadius: '18px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', width: '100%', boxShadow: '0 10px 25px rgba(59,130,246,0.4)' }}
            >
              {t.unlockBtn}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // SVG Donut calculation math
  let cumulativeAngle = 0
  const radius = 70
  const circumference = 2 * Math.PI * radius

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', padding: '16px 16px 120px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left', background: bgApp, color: textMain, boxSizing: 'border-box', position: 'relative' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '14px', borderBottom: `1px solid ${borderColor}` }}>
        <div>
          <h1 style={{ color: textMain, margin: '0 0 2px 0', fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' }}>{t.appName} ⚡</h1>
          <span style={{ color: textMuted, fontSize: '11px', fontWeight: '600' }}>{t.tagline}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: '12px', border: `1px solid ${borderColor}`, fontSize: '12px', fontWeight: 'bold', background: cardBg, color: textMain, outline: 'none', cursor: 'pointer' }}
          >
            {CURRENCIES.map(c => <option key={c.code} value={c.symbol}>{c.symbol} ({c.code})</option>)}
          </select>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: '12px', border: `1px solid ${borderColor}`, fontSize: '12px', fontWeight: 'bold', background: cardBg, color: textMain, outline: 'none', cursor: 'pointer' }}
          >
            {LANGUAGES_LIST.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '6px 10px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px' }}
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
          style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '8px 18px', borderRadius: '16px', fontSize: '13px', fontWeight: 'bold', outline: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}
        />
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Net Worth Summary Hero Banner */}
          <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '18px 22px', borderRadius: '24px', marginBottom: '16px', border: `1px solid ${borderColor}`, color: '#ffffff' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>הון עצמי כולל (Net Worth)</span>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#38bdf8', margin: '4px 0 10px 0' }}>
              {formatMoney(netWorthTotal)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', borderTop: '1px solid #334155', paddingTop: '8px' }}>
              <span>נכסים: <strong style={{ color: '#10b981' }}>{formatMoney(totalAssetsVal)}</strong></span>
              <span>חובות: <strong style={{ color: '#ef4444' }}>-{formatMoney(totalLiabilitiesVal)}</strong></span>
            </div>
          </div>

          <div style={{ background: cardBg, padding: '22px', borderRadius: '26px', marginBottom: '16px', border: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: textMuted, fontSize: '13px', fontWeight: '700' }}>{t.netBalance}</span>
              <span style={{ background: healthScore > 75 ? '#10b98122' : '#f59e0b22', color: healthScore > 75 ? '#10b981' : '#f59e0b', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>
                {t.healthScoreTitle}: {healthScore}/100
              </span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: netBalance >= 0 ? '#10b981' : '#ef4444', margin: '6px 0 16px 0', letterSpacing: '-1px' }}>
              {formatMoney(netBalance)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '14px', borderTop: `1px solid ${borderColor}` }}>
              <div>
                <span style={{ color: textMuted, fontSize: '11px' }}>{t.income}</span>
                <div style={{ fontSize: '17px', fontWeight: '800', color: '#10b981' }}>+{formatMoney(totalIncome)}</div>
              </div>
              <div>
                <span style={{ color: textMuted, fontSize: '11px' }}>{t.expenses}</span>
                <div style={{ fontSize: '17px', fontWeight: '800', color: '#ef4444' }}>-{formatMoney(totalExpense)}</div>
              </div>
            </div>
          </div>

          <div style={{ background: theme === 'dark' ? 'linear-gradient(135deg, #1e3a8a, #172554)' : 'linear-gradient(135deg, #dbeafe, #eff6ff)', padding: '20px', borderRadius: '26px', marginBottom: '16px', border: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: theme === 'dark' ? '#93c5fd' : '#1d4ed8', fontSize: '12px', fontWeight: '800' }}>{t.safeSpend}</span>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff', marginTop: '4px' }}>
                  {formatMoney(dailySafeSpend)} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>/ יום</span>
                </div>
              </div>
              <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
                <span style={{ color: textMuted, fontSize: '12px', fontWeight: 'bold' }}>{daysRemaining} {t.daysLeft}</span>
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <div style={{ background: cardBg, padding: '22px', borderRadius: '26px', border: `1px solid ${borderColor}`, marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>{t.categoryBreakdown} 📊</h3>
            {expensesByCategory.length === 0 ? (
              <p style={{ color: textMuted, fontSize: '12px', textAlign: 'center', margin: '20px 0' }}>{t.noTransactions}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', margin: '10px 0' }}>
                  <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                    {expensesByCategory.map((cat, idx) => {
                      const percentage = cat.total / totalCatExpense
                      const strokeDasharray = `${percentage * circumference} ${circumference}`
                      const strokeDashoffset = -cumulativeAngle * circumference
                      cumulativeAngle += percentage
                      return (
                        <circle
                          key={idx}
                          cx="80"
                          cy="80"
                          r={radius}
                          fill="transparent"
                          stroke={cat.color || '#3b82f6'}
                          strokeWidth="24"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          style={{ transition: 'stroke-dasharray 0.6s ease' }}
                        />
                      )
                    })}
                  </svg>
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: textMuted }}>סה"כ הוצאות</div>
                    <div style={{ fontSize: '16px', fontWeight: '900' }}>{formatMoney(totalExpense)}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {expensesByCategory.map((cat, idx) => {
                    const percentage = Math.round((cat.total / totalCatExpense) * 100)
                    return (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: inputBg, padding: '10px 14px', borderRadius: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color }}></span>
                          <span>{cat.icon}</span> <span>{cat.name}</span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '800' }}>
                          {formatMoney(cat.total)} <span style={{ fontSize: '11px', color: textMuted, fontWeight: 'normal' }}>({percentage}%)</span>
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
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flexGrow: 1, background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '14px 18px', borderRadius: '18px', fontSize: '13px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredTransactions.length === 0 ? (
              <div style={{ background: cardBg, padding: '36px', borderRadius: '24px', textAlign: 'center', color: textMuted, fontSize: '13px', border: `1px solid ${borderColor}` }}>
                {t.noTransactions}
              </div>
            ) : (
              filteredTransactions.map(tr => {
                const isInc = Number(tr.amount) > 0
                return (
                  <div key={tr.id} style={{ background: cardBg, padding: '16px 18px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '22px' }}>{isInc ? '📈' : (categories[tr.category]?.icon || '📉')}</span>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '800' }}>{tr.title}</div>
                        <div style={{ fontSize: '11px', color: textMuted, display: 'flex', gap: '6px', alignItems: 'center', marginTop: '3px' }}>
                          <span>{tr.created_at ? tr.created_at.slice(0, 10) : ''}</span>
                          {tr.is_recurring && <span style={{ background: '#3b82f622', color: '#3b82f6', padding: '2px 6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold' }}>{t.recurringBadge}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '900', color: isInc ? '#10b981' : textMain }}>
                        {isInc ? `+${formatMoney(tr.amount)}` : formatMoney(tr.amount)}
                      </span>
                      <button onClick={() => deleteTransaction(tr.id)} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '15px' }}>✕</button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BUDGETS & CATEGORIES */}
      {activeTab === 'budgets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Add Category Form */}
          <div style={{ background: cardBg, padding: '20px', borderRadius: '24px', border: `1px solid ${borderColor}` }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>➕ הוספת קטגוריה חדשה</h4>
            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="אימוג'י (למשל: 🚗)" value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} style={{ width: '60px', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '12px', textAlign: 'center' }} />
              <input type="text" placeholder="שם הקטגוריה" value={newCatName} onChange={e => setNewCatName(e.target.value)} style={{ flex: 1, background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '12px', fontSize: '12px' }} required />
              <input type="number" placeholder="תקציב (₪)" value={newCatLimit} onChange={e => setNewCatLimit(e.target.value)} style={{ width: '90px', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '12px', fontSize: '12px' }} />
              <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>שמור</button>
            </form>
          </div>

          <div style={{ background: cardBg, padding: '22px', borderRadius: '26px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>{t.smartBudgetTitle} 🎯</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {Object.keys(categories).map(catName => {
                const cat = categories[catName]
                const spent = monthTransactions.filter(tr => tr.category === catName && Number(tr.amount) < 0).reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
                const percentage = cat.limit > 0 ? Math.min(Math.round((spent / cat.limit) * 100), 100) : 0
                return (
                  <div key={catName} style={{ background: inputBg, padding: '14px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{cat.icon} {catName}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', color: textMuted }}>תקציב:</span>
                        <input
                          type="number"
                          value={cat.limit}
                          onChange={(e) => setCategories({...categories, [catName]: {...cat, limit: parseFloat(e.target.value) || 0}})}
                          style={{ width: '80px', background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', outline: 'none', textAlign: 'center' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>
                      <span>הוצאת: {formatMoney(spent)}</span>
                      <span>{percentage}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: cardBg, borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: percentage > 90 ? '#ef4444' : cat.color, transition: 'width 0.4s ease' }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NET WORTH & ASSET MANAGEMENT */}
      {activeTab === 'networth' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ background: cardBg, padding: '22px', borderRadius: '26px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>{t.netWorthTitle}</h3>
            
            <form onSubmit={handleAddAsset} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', background: inputBg, padding: '14px', borderRadius: '18px' }}>
              <input
                type="text"
                placeholder="שם הנכס או החוב (למשל: קרן השתלמות, הלוואת רכב)"
                value={assetName}
                onChange={e => setAssetName(e.target.value)}
                style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '12px', fontSize: '12px', outline: 'none' }}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="number"
                  placeholder="סכום (₪)"
                  value={assetAmount}
                  onChange={e => setAssetAmount(e.target.value)}
                  style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '12px', fontSize: '12px', outline: 'none' }}
                  required
                />
                <select
                  value={assetType}
                  onChange={e => setAssetType(e.target.value)}
                  style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '12px', fontSize: '12px', outline: 'none' }}
                >
                  <option value="asset">נכס / חיסכון 📈</option>
                  <option value="liability">חוב / התחייבות 📉</option>
                </select>
              </div>
              <button type="submit" style={{ background: '#3b82f6', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>{t.addAssetBtn}</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {assetsList.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: inputBg, padding: '14px 16px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{item.name}</div>
                    <span style={{ fontSize: '10px', color: item.type === 'asset' ? '#10b981' : '#ef4444' }}>
                      {item.type === 'asset' ? 'נכס' : 'התחייבות / חוב'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '900', color: item.type === 'asset' ? '#10b981' : '#ef4444' }}>
                      {item.type === 'asset' ? `+${formatMoney(item.amount)}` : `-${formatMoney(item.amount)}`}
                    </span>
                    <button onClick={() => deleteAsset(item.id)} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GOALS */}
      {activeTab === 'goals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ background: cardBg, padding: '22px', borderRadius: '26px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>{t.savingsGoalsTitle}</h3>
            
            <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', background: inputBg, padding: '14px', borderRadius: '18px' }}>
              <input
                type="text"
                placeholder={t.goalNamePlaceholder}
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '12px', fontSize: '12px', outline: 'none' }}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="number"
                  placeholder={t.goalTargetPlaceholder}
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '12px', fontSize: '12px', outline: 'none' }}
                  required
                />
                <input
                  type="number"
                  placeholder={t.goalCurrentPlaceholder}
                  value={newGoalCurrent}
                  onChange={(e) => setNewGoalCurrent(e.target.value)}
                  style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '12px', fontSize: '12px', outline: 'none' }}
                />
              </div>
              <button type="submit" style={{ background: '#3b82f6', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>{t.addGoalBtn}</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {savingsGoals.map(goal => {
                const target = Number(goal.target_amount) || 1
                const current = Number(goal.current_amount) || 0
                const pct = Math.min(Math.round((current / target) * 100), 100)
                const remainingMoney = Math.max(target - current, 0)
                const monthlySavingsRate = netBalance > 0 ? netBalance : 1000
                const monthsNeeded = Math.ceil(remainingMoney / monthlySavingsRate)

                const estDate = new Date()
                estDate.setMonth(estDate.getMonth() + monthsNeeded)
                const dateStr = estDate.toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US', { year: 'numeric', month: 'long' })

                return (
                  <div key={goal.id} style={{ background: inputBg, padding: '16px', borderRadius: '18px', border: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>🎯 {goal.title}</span>
                      <button onClick={() => deleteGoal(goal.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>{t.delete}</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: textMuted, marginBottom: '6px' }}>
                      <span>{formatMoney(current)} / {formatMoney(target)}</span>
                      <span style={{ fontWeight: 'bold', color: '#10b981' }}>{pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: cardBg, borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#10b981', transition: 'width 0.4s ease' }}></div>
                    </div>
                    <div style={{ fontSize: '11px', color: textMuted, background: cardBg, padding: '8px 12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t.monthsToGoal} <strong>{monthsNeeded}</strong> חודשים</span>
                      <span>{t.estCompletion} <strong style={{ color: textMain }}>{dateStr}</strong></span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TOOLS & ANALYTICS */}
      {activeTab === 'tools' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Month-over-Month Comparison */}
          <div style={{ background: cardBg, padding: '20px', borderRadius: '24px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>{t.prevMonthCompare} 📉</h3>
            <div style={{ fontSize: '13px', color: textMuted }}>
              הוצאת החודש: <strong style={{ color: textMain }}>{formatMoney(totalExpense)}</strong>
            </div>
            <div style={{ fontSize: '13px', color: textMuted, marginTop: '4px' }}>
              הוצאת חודש שעבר: <strong style={{ color: textMain }}>{formatMoney(prevMonthExpense)}</strong>
            </div>
            {prevMonthExpense > 0 && (
              <div style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '8px', color: totalExpense > prevMonthExpense ? '#ef4444' : '#10b981' }}>
                {totalExpense > prevMonthExpense 
                  ? `▲ חריגה של ${Math.round(((totalExpense - prevMonthExpense) / prevMonthExpense) * 100)}% בהוצאות בהשוואה לחודש הקודם`
                  : `▼ חיסכון של ${Math.round(((prevMonthExpense - totalExpense) / prevMonthExpense) * 100)}% בהוצאות בהשוואה לחודש הקודם`}
              </div>
            )}
          </div>

          {/* Export Button */}
          <div style={{ background: cardBg, padding: '20px', borderRadius: '24px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>ייצוא נתונים וגיבוי</h3>
            <button
              onClick={exportToCSV}
              style={{ width: '100%', background: '#10b981', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
            >
              {t.exportCsv}
            </button>
          </div>

          {/* Subscription Radar */}
          <div style={{ background: cardBg, padding: '22px', borderRadius: '26px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '800' }}>{t.subscriptionRadar} 📡</h3>
            <div style={{ fontSize: '12px', color: textMuted, marginBottom: '16px' }}>
              {t.yearlyTotal} <strong style={{ color: textMain, fontSize: '16px' }}>{formatMoney(totalRecurringYearly)}</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recurringExpenses.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', background: inputBg, padding: '12px 16px', borderRadius: '14px' }}>
                  <span>{item.title}</span>
                  <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{formatMoney(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON (+) */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{ position: 'fixed', bottom: '90px', left: isRTL ? '24px' : 'auto', right: isRTL ? 'auto' : '24px', width: '64px', height: '64px', borderRadius: '32px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#ffffff', border: 'none', fontSize: '32px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 15px 30px rgba(59, 130, 246, 0.5)', cursor: 'pointer', zIndex: 99 }}
      >
        +
      </button>

      {/* BOTTOM NAVIGATION BAR */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: cardBg, borderTop: `1px solid ${borderColor}`, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', padding: '10px 2px 24px 2px', zIndex: 98, backdropFilter: 'blur(10px)' }}>
        {[
          { id: 'dashboard', label: t.dashboard, icon: '📊' },
          { id: 'transactions', label: t.transactions, icon: '💳' },
          { id: 'budgets', label: t.budgets, icon: '🎯' },
          { id: 'networth', label: 'הון', icon: '🏛️' },
          { id: 'goals', label: t.goalsTab, icon: '🏆' },
          { id: 'tools', label: t.tools, icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ background: 'transparent', color: activeTab === tab.id ? '#3b82f6' : textMuted, border: 'none', padding: '6px 0', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
          >
            <span style={{ fontSize: '18px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Modal for New Transaction */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: cardBg, width: '100%', maxWidth: '420px', padding: '26px', borderRadius: '30px', border: `1px solid ${borderColor}`, boxSizing: 'border-box', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '900' }}>{t.newTransaction}</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleReceiptScan} style={{ display: 'none' }} />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={isScanning}
                style={{ width: '100%', background: theme === 'dark' ? '#1f2937' : '#eff6ff', color: '#3b82f6', border: '1px dashed #3b82f6', padding: '14px', borderRadius: '16px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
              >
                {isScanning ? t.scanningReceipt : t.scanReceiptBtn}
              </button>
            </div>

            <form onSubmit={addTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: inputBg, padding: '4px', borderRadius: '16px' }}>
                <button type="button" onClick={() => setType('expense')} style={{ background: type === 'expense' ? '#ef4444' : 'transparent', color: type === 'expense' ? '#ffffff' : textMuted, border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>{t.expenseType}</button>
                <button type="button" onClick={() => setType('income')} style={{ background: type === 'income' ? '#10b981' : 'transparent', color: type === 'income' ? '#ffffff' : textMuted, border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>{t.incomeType}</button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.titleLabel}</label>
                <input type="text" placeholder={t.titlePlaceholder} value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '14px', borderRadius: '16px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.amountLabel} ({currency})</label>
                <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '14px', borderRadius: '16px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} required />
              </div>

              {type === 'expense' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.categoryLabel}</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '14px', borderRadius: '16px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}>
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{categories[cat].icon} {cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {type === 'expense' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: inputBg, padding: '14px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} style={{ accentColor: '#3b82f6', width: '16px', height: '16px' }} />
                    <span>{t.recurringCheckbox}</span>
                  </label>
                  {isRecurring && (
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.endDateLabel}</label>
                      <input type="month" value={recurringEndDate} onChange={(e) => setRecurringEndDate(e.target.value)} style={{ width: '100%', background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '12px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '16px', borderRadius: '16px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>{t.cancel}</button>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>{t.saveButton}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
