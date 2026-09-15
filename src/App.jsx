// name=elite-finance-app-v4.js
import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'

const TRANSLATIONS = {
  he: {
    appName: 'Elite Finance',
    tagline: 'מודיעין פיננסי חכם ומתקדם',
    dashboard: 'בית',
    chartsTab: 'תרשימים',
    transactions: 'תנועות',
    budgets: 'תקציבים',
    goalsTab: 'יעדים',
    netWorthTab: 'הון עצמי',
    tools: 'כלים',
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
    scanReceiptBtn: '📸 סרוק חשבונית עם AI',
    scanningReceipt: 'מנתח חשבונית...',
    scanSuccess: 'החשבונית פוענחה בהצלחה!',
    savingsGoalsTitle: '🎯 יעדי חיסכון חכמים',
    goalNamePlaceholder: 'שם היעד (למשל: רכב חדש)',
    goalTargetPlaceholder: 'סכום יעד (₪)',
    goalCurrentPlaceholder: 'חסכתי כבר (₪)',
    addGoalBtn: 'הוסף יעד חיסכון',
    estCompletion: 'תאריך יעד משוער:',
    monthsToGoal: 'חודשים שנותרו:',
    securityTitle: '🔒 נעילת אבטחה',
    lockScreenTitle: 'הזן קוד גישה (ברירת מחדל: 1234)',
    unlockBtn: 'פתח נעילה',
    healthScoreTitle: 'מדד בריאות פיננסית',
    netWorthTitle: '🏛️ מאזן הון עצמי ונכסים',
    addAssetBtn: 'הוסף נכס / התחייבות',
    exportCsv: '📥 ייצוא נתונים ל-CSV',
    prevMonthCompare: 'השוואת הוצאות מול חודש קודם',
    cancel: 'ביטול',
    delete: 'מחיקה'
  },
  en: {
    appName: 'Elite Finance',
    tagline: 'Advanced Money Intelligence',
    dashboard: 'Dashboard',
    chartsTab: 'Charts',
    transactions: 'Transactions',
    budgets: 'Budgets',
    goalsTab: 'Goals',
    netWorthTab: 'Net Worth',
    tools: 'Tools',
    netBalance: 'Net Monthly Balance',
    income: 'Income',
    expenses: 'Expenses',
    safeSpend: 'Daily Safe-to-Spend',
    daysLeft: 'days left',
    categoryBreakdown: 'Category Expense Breakdown',
    searchPlaceholder: 'Search transaction...',
    noTransactions: 'No transactions recorded.',
    recurringBadge: 'Recurring 🔄',
    newTransaction: 'New Transaction',
    expenseType: 'Expense 📉',
    incomeType: 'Income 📈',
    titleLabel: 'Description',
    titlePlaceholder: 'e.g. Grocery, Netflix...',
    amountLabel: 'Amount',
    categoryLabel: 'Category',
    recurringCheckbox: 'Recurring subscription',
    endDateLabel: 'End Month (Optional)',
    saveButton: 'Save Transaction',
    subscriptionRadar: 'Subscription Radar',
    yearlyTotal: 'Yearly Total:',
    smartBudgetTitle: 'Category Budgets',
    scanReceiptBtn: '📸 Scan Receipt',
    scanningReceipt: 'Scanning...',
    scanSuccess: 'Receipt analyzed!',
    savingsGoalsTitle: '🎯 Savings Goals',
    goalNamePlaceholder: 'Goal Name',
    goalTargetPlaceholder: 'Target Amount',
    goalCurrentPlaceholder: 'Current Saved',
    addGoalBtn: 'Add Goal',
    estCompletion: 'Estimated completion:',
    monthsToGoal: 'Months left:',
    securityTitle: '🔒 Security Passcode',
    lockScreenTitle: 'Enter Passcode (Default: 1234)',
    unlockBtn: 'Unlock',
    healthScoreTitle: 'Financial Health',
    netWorthTitle: '🏛️ Net Worth Intelligence',
    addAssetBtn: 'Add Asset / Debt',
    exportCsv: '📥 Export to CSV',
    prevMonthCompare: 'Month-over-Month Comparison',
    cancel: 'Cancel',
    delete: 'Delete'
  }
}

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

  // Transaction Form
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('מזון וסופר')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringEndDate, setRecurringEndDate] = useState('')

  // Asset Form
  const [assetName, setAssetName] = useState('')
  const [assetAmount, setAssetAmount] = useState('')
  const [assetType, setAssetType] = useState('asset')

  // Goal Form
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalTarget, setNewGoalTarget] = useState('')
  const [newGoalCurrent, setNewGoalCurrent] = useState('')

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
    const { data: txData } = await supabase.from('expenses').select('*').order('created_at', { ascending: false })
    if (txData) setTransactions(txData)

    const { data: goalData } = await supabase.from('savings_goals').select('*')
    if (goalData) setSavingsGoals(goalData)
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
      alert('שגיאה בשמירה: ' + error.message)
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
    const newAsset = { id: Date.now(), name: assetName.trim(), type: assetType, amount: parseFloat(assetAmount) }
    setAssetsList([...assetsList, newAsset])
    setAssetName('')
    setAssetAmount('')
  }

  function deleteAsset(id) {
    setAssetsList(assetsList.filter(a => a.id !== id))
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
    }, 1200)
  }

  const t = TRANSLATIONS[lang] || TRANSLATIONS.he
  const isRTL = lang === 'he'

  const formatMoney = (val) => {
    return `₪${Math.round(val).toLocaleString()}`
  }

  // Monthly Breakdown
  const monthTransactions = transactions.filter(tr => {
    const tDate = tr.created_at ? tr.created_at.slice(0, 7) : getCurrentMonthString()
    return tDate === selectedMonth
  })

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

  const expensesByCategory = Object.keys(categories).map(catName => {
    const total = monthTransactions
      .filter(tr => tr.category === catName && Number(tr.amount) < 0)
      .reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
    return { name: catName, total, ...categories[catName] }
  }).filter(cat => cat.total > 0)

  const totalCatExpense = expensesByCategory.reduce((sum, c) => sum + c.total, 0) || 1

  let healthScore = 88
  if (totalExpense > totalIncome && totalIncome > 0) healthScore = 48
  else if (totalExpense > totalCategoryLimits && totalCategoryLimits > 0) healthScore = 65
  else if (netBalance > 3000) healthScore = 96

  const filteredTransactions = monthTransactions.filter(tr => 
    tr.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (tr.category && tr.category.includes(searchTerm))
  )

  const bgApp = theme === 'dark' ? '#090d16' : '#f8fafc'
  const cardBg = theme === 'dark' ? '#121929' : '#ffffff'
  const textMain = theme === 'dark' ? '#f8fafc' : '#0f172a'
  const textMuted = theme === 'dark' ? '#94a3b8' : '#64748b'
  const borderColor = theme === 'dark' ? '#1e293b' : '#e2e8f0'
  const inputBg = theme === 'dark' ? '#0b111e' : '#f1f5f9'

  if (isLocked) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', background: bgApp, color: textMain, fontFamily: '-apple-system, sans-serif', direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={{ background: cardBg, padding: '36px 28px', borderRadius: '32px', width: '100%', border: `1px solid ${borderColor}`, textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
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
          <button
            onClick={() => { if (passcode === '1234' || passcode === '') setIsLocked(false); else alert('קוד שגוי (נסה 1234)'); }}
            style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#ffffff', border: 'none', padding: '16px 24px', borderRadius: '18px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', width: '100%', boxShadow: '0 10px 25px rgba(37,99,235,0.4)' }}
          >
            {t.unlockBtn}
          </button>
        </div>
      </div>
    )
  }

  // SVG Donut math
  let cumulativeAngle = 0
  const radius = 65
  const circumference = 2 * Math.PI * radius

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', padding: '16px 16px 120px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left', background: bgApp, color: textMain, boxSizing: 'border-box' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${borderColor}` }}>
        <div>
          <h1 style={{ color: textMain, margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' }}>MoneyClimb ⚡</h1>
          <span style={{ color: textMuted, fontSize: '11px', fontWeight: '600' }}>{t.tagline}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '8px 12px', borderRadius: '14px', cursor: 'pointer', fontSize: '13px' }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Month Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', background: cardBg, padding: '8px 14px', borderRadius: '18px', border: `1px solid ${borderColor}` }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: textMuted }}>חודש דוח:</span>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', outline: 'none', cursor: 'pointer' }}
        />
      </div>

      {/* TAB 1: DASHBOARD (MoneyClimb Clean Overview) */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Main Net Worth Banner */}
          <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '20px 22px', borderRadius: '26px', border: `1px solid ${borderColor}`, color: '#ffffff', boxShadow: '0 20px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700' }}>הון עצמי כולל (Net Worth)</span>
              <span style={{ background: healthScore > 75 ? '#10b98133' : '#f59e0b33', color: healthScore > 75 ? '#34d399' : '#fbbf24', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                בריאות: {healthScore}/100
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#38bdf8', margin: '8px 0 14px 0', letterSpacing: '-1px' }}>
              {formatMoney(netWorthTotal)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', borderTop: '1px solid #334155', paddingTop: '12px', fontSize: '12px' }}>
              <div>נכסים: <strong style={{ color: '#34d399' }}>{formatMoney(totalAssetsVal)}</strong></div>
              <div>חובות: <strong style={{ color: '#f87171' }}>-{formatMoney(totalLiabilitiesVal)}</strong></div>
            </div>
          </div>

          {/* 2x2 Grid Stats Widgets */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            
            {/* Income Card */}
            <div style={{ background: cardBg, padding: '16px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
              <div style={{ fontSize: '11px', color: textMuted, fontWeight: 'bold', marginBottom: '4px' }}>הכנסות החודש 📈</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#10b981' }}>+{formatMoney(totalIncome)}</div>
            </div>

            {/* Expenses Card */}
            <div style={{ background: cardBg, padding: '16px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
              <div style={{ fontSize: '11px', color: textMuted, fontWeight: 'bold', marginBottom: '4px' }}>הוצאות החודש 📉</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#ef4444' }}>-{formatMoney(totalExpense)}</div>
            </div>

            {/* Net Balance Card */}
            <div style={{ background: cardBg, padding: '16px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
              <div style={{ fontSize: '11px', color: textMuted, fontWeight: 'bold', marginBottom: '4px' }}>מאזן נקי ⚖️</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: netBalance >= 0 ? '#10b981' : '#ef4444' }}>{formatMoney(netBalance)}</div>
            </div>

            {/* Safe Daily Spend Card */}
            <div style={{ background: cardBg, padding: '16px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
              <div style={{ fontSize: '11px', color: textMuted, fontWeight: 'bold', marginBottom: '4px' }}>תקציב יומי בטוח 🛡️</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#3b82f6' }}>{formatMoney(dailySafeSpend)}</div>
            </div>
          </div>

          {/* Recent Activity Quick Preview */}
          <div style={{ background: cardBg, padding: '20px', borderRadius: '24px', border: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800' }}>תנועות אחרונות 💳</h3>
              <button onClick={() => setActiveTab('transactions')} style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>הצג הכל ←</button>
            </div>
            {monthTransactions.slice(0, 4).length === 0 ? (
              <p style={{ color: textMuted, fontSize: '12px', textAlign: 'center', margin: '12px 0' }}>{t.noTransactions}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {monthTransactions.slice(0, 4).map(tr => {
                  const isInc = Number(tr.amount) > 0
                  return (
                    <div key={tr.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: inputBg, padding: '10px 14px', borderRadius: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px' }}>{isInc ? '📈' : (categories[tr.category]?.icon || '📉')}</span>
                        <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{tr.title}</span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '900', color: isInc ? '#10b981' : textMain }}>
                        {isInc ? `+${formatMoney(tr.amount)}` : formatMoney(tr.amount)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CHARTS & ANALYTICS PAGE (MoneyClimb Styled Square Grid Cards) */}
      {activeTab === 'charts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Chart Card 1: Donut Expense Breakdown */}
          <div style={{ background: cardBg, padding: '20px', borderRadius: '24px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>📊 התפלגות הוצאות לפי קטגוריה</h3>
            {expensesByCategory.length === 0 ? (
              <p style={{ color: textMuted, fontSize: '12px', textAlign: 'center' }}>אין מספיק נתונים להצגת תרשים</p>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', margin: '14px 0' }}>
                  <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
                    {expensesByCategory.map((cat, idx) => {
                      const percentage = cat.total / totalCatExpense
                      const strokeDasharray = `${percentage * circumference} ${circumference}`
                      const strokeDashoffset = -cumulativeAngle * circumference
                      cumulativeAngle += percentage
                      return (
                        <circle
                          key={idx}
                          cx="75"
                          cy="75"
                          r={radius}
                          fill="transparent"
                          stroke={cat.color || '#3b82f6'}
                          strokeWidth="20"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          style={{ transition: 'stroke-dasharray 0.5s ease' }}
                        />
                      )
                    })}
                  </svg>
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: textMuted }}>סה"כ הוצאות</div>
                    <div style={{ fontSize: '15px', fontWeight: '900' }}>{formatMoney(totalExpense)}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                  {expensesByCategory.map((cat, idx) => (
                    <div key={idx} style={{ background: inputBg, padding: '8px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }}></span>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.icon} {cat.name}</span>
                      <span>{Math.round((cat.total / totalCatExpense) * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chart Card 2: Income vs Expense Visual Bar */}
          <div style={{ background: cardBg, padding: '20px', borderRadius: '24px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: '800' }}>⚖️ יחס הכנסות מול הוצאות</h3>
            {totalIncome === 0 && totalExpense === 0 ? (
              <p style={{ color: textMuted, fontSize: '12px', textAlign: 'center' }}>אין תנועות בחודש זה</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span>הכנסות ({formatMoney(totalIncome)})</span>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                      {Math.round((totalIncome / (totalIncome + totalExpense || 1)) * 100)}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '12px', background: inputBg, borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min((totalIncome / (totalIncome + totalExpense || 1)) * 100, 100)}%`, height: '100%', background: '#10b981', borderRadius: '6px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span>הוצאות ({formatMoney(totalExpense)})</span>
                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                      {Math.round((totalExpense / (totalIncome + totalExpense || 1)) * 100)}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '12px', background: inputBg, borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min((totalExpense / (totalIncome + totalExpense || 1)) * 100, 100)}%`, height: '100%', background: '#ef4444', borderRadius: '6px' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chart Card 3: Budget Usage Square Widgets */}
          <div style={{ background: cardBg, padding: '20px', borderRadius: '24px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: '800' }}>🎯 ניצול תקציב לפי קטגוריה</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {Object.keys(categories).map(catName => {
                const cat = categories[catName]
                const spent = monthTransactions.filter(tr => tr.category === catName && Number(tr.amount) < 0).reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
                const pct = cat.limit > 0 ? Math.min(Math.round((spent / cat.limit) * 100), 100) : 0
                return (
                  <div key={catName} style={{ background: inputBg, padding: '12px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>{cat.icon} {catName}</div>
                    <div style={{ fontSize: '11px', color: textMuted, marginBottom: '6px' }}>{formatMoney(spent)} / {formatMoney(cat.limit)}</div>
                    <div style={{ width: '100%', height: '6px', background: cardBg, borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: pct > 90 ? '#ef4444' : cat.color }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '14px 18px', borderRadius: '18px', fontSize: '13px', outline: 'none' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredTransactions.length === 0 ? (
              <div style={{ background: cardBg, padding: '36px', borderRadius: '24px', textAlign: 'center', color: textMuted, fontSize: '13px', border: `1px solid ${borderColor}` }}>
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
                        <div style={{ fontSize: '10px', color: textMuted }}>{tr.created_at ? tr.created_at.slice(0, 10) : ''}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '900', color: isInc ? '#10b981' : textMain }}>
                        {isInc ? `+${formatMoney(tr.amount)}` : formatMoney(tr.amount)}
                      </span>
                      <button onClick={() => deleteTransaction(tr.id)} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '14px' }}>✕</button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: BUDGETS */}
      {activeTab === 'budgets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: cardBg, padding: '20px', borderRadius: '24px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>{t.smartBudgetTitle} 🎯</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.keys(categories).map(catName => {
                const cat = categories[catName]
                const spent = monthTransactions.filter(tr => tr.category === catName && Number(tr.amount) < 0).reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
                const percentage = cat.limit > 0 ? Math.min(Math.round((spent / cat.limit) * 100), 100) : 0
                return (
                  <div key={catName} style={{ background: inputBg, padding: '12px 14px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{cat.icon} {catName}</span>
                      <input
                        type="number"
                        value={cat.limit}
                        onChange={(e) => setCategories({...categories, [catName]: {...cat, limit: parseFloat(e.target.value) || 0}})}
                        style={{ width: '80px', background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', outline: 'none', textAlign: 'center' }}
                      />
                    </div>
                    <div style={{ width: '100%', height: '8px', background: cardBg, borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: percentage > 90 ? '#ef4444' : cat.color }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NET WORTH */}
      {activeTab === 'networth' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: cardBg, padding: '20px', borderRadius: '24px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>{t.netWorthTitle}</h3>
            
            <form onSubmit={handleAddAsset} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px', background: inputBg, padding: '12px', borderRadius: '16px' }}>
              <input
                type="text"
                placeholder="שם הנכס או החוב"
                value={assetName}
                onChange={e => setAssetName(e.target.value)}
                style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '10px', fontSize: '12px', outline: 'none' }}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="number"
                  placeholder="סכום (₪)"
                  value={assetAmount}
                  onChange={e => setAssetAmount(e.target.value)}
                  style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '10px', fontSize: '12px', outline: 'none' }}
                  required
                />
                <select
                  value={assetType}
                  onChange={e => setAssetType(e.target.value)}
                  style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '10px', fontSize: '12px', outline: 'none' }}
                >
                  <option value="asset">נכס / חיסכון 📈</option>
                  <option value="liability">חוב / התחייבות 📉</option>
                </select>
              </div>
              <button type="submit" style={{ background: '#3b82f6', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>{t.addAssetBtn}</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {assetsList.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: inputBg, padding: '12px 14px', borderRadius: '14px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{item.name}</div>
                    <span style={{ fontSize: '10px', color: item.type === 'asset' ? '#10b981' : '#ef4444' }}>{item.type === 'asset' ? 'נכס' : 'חוב'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '900', color: item.type === 'asset' ? '#10b981' : '#ef4444' }}>
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

      {/* TAB 6: GOALS */}
      {activeTab === 'goals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: cardBg, padding: '20px', borderRadius: '24px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>{t.savingsGoalsTitle}</h3>
            
            <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px', background: inputBg, padding: '12px', borderRadius: '16px' }}>
              <input
                type="text"
                placeholder={t.goalNamePlaceholder}
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '10px', fontSize: '12px', outline: 'none' }}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="number"
                  placeholder={t.goalTargetPlaceholder}
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '10px', fontSize: '12px', outline: 'none' }}
                  required
                />
                <input
                  type="number"
                  placeholder={t.goalCurrentPlaceholder}
                  value={newGoalCurrent}
                  onChange={(e) => setNewGoalCurrent(e.target.value)}
                  style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '10px', fontSize: '12px', outline: 'none' }}
                />
              </div>
              <button type="submit" style={{ background: '#3b82f6', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>{t.addGoalBtn}</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {savingsGoals.map(goal => {
                const target = Number(goal.target_amount) || 1
                const current = Number(goal.current_amount) || 0
                const pct = Math.min(Math.round((current / target) * 100), 100)

                return (
                  <div key={goal.id} style={{ background: inputBg, padding: '14px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold' }}>🎯 {goal.title}</span>
                      <button onClick={() => deleteGoal(goal.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>{t.delete}</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: textMuted, marginBottom: '6px' }}>
                      <span>{formatMoney(current)} / {formatMoney(target)}</span>
                      <span style={{ fontWeight: 'bold', color: '#10b981' }}>{pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: cardBg, borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#10b981' }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: TOOLS */}
      {activeTab === 'tools' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: cardBg, padding: '20px', borderRadius: '24px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>ייצוא נתונים</h3>
            <button
              onClick={exportToCSV}
              style={{ width: '100%', background: '#10b981', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
            >
              {t.exportCsv}
            </button>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON (+) */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{ position: 'fixed', bottom: '85px', left: isRTL ? '20px' : 'auto', right: isRTL ? 'auto' : '20px', width: '60px', height: '60px', borderRadius: '30px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#ffffff', border: 'none', fontSize: '30px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 12px 25px rgba(37, 99, 235, 0.5)', cursor: 'pointer', zIndex: 99 }}
      >
        +
      </button>

      {/* BOTTOM NAVIGATION BAR */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: cardBg, borderTop: `1px solid ${borderColor}`, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '8px 2px 20px 2px', zIndex: 98, backdropFilter: 'blur(10px)' }}>
        {[
          { id: 'dashboard', label: t.dashboard, icon: '🏠' },
          { id: 'charts', label: t.chartsTab, icon: '📊' },
          { id: 'transactions', label: t.transactions, icon: '💳' },
          { id: 'budgets', label: t.budgets, icon: '🎯' },
          { id: 'networth', label: t.netWorthTab, icon: '🏛️' },
          { id: 'goals', label: t.goalsTab, icon: '🏆' },
          { id: 'tools', label: t.tools, icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ background: 'transparent', color: activeTab === tab.id ? '#3b82f6' : textMuted, border: 'none', padding: '4px 0', fontSize: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
          >
            <span style={{ fontSize: '16px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* MODAL FOR NEW TRANSACTION */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: cardBg, width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '28px', border: `1px solid ${borderColor}`, boxSizing: 'border-box' }}>
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

            <form onSubmit={addTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: inputBg, padding: '4px', borderRadius: '14px' }}>
                <button type="button" onClick={() => setType('expense')} style={{ background: type === 'expense' ? '#ef4444' : 'transparent', color: type === 'expense' ? '#ffffff' : textMuted, border: 'none', padding: '10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>{t.expenseType}</button>
                <button type="button" onClick={() => setType('income')} style={{ background: type === 'income' ? '#10b981' : 'transparent', color: type === 'income' ? '#ffffff' : textMuted, border: 'none', padding: '10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>{t.incomeType}</button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.titleLabel}</label>
                <input type="text" placeholder={t.titlePlaceholder} value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.amountLabel} (₪)</label>
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

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '14px', borderRadius: '14px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>{t.cancel}</button>
                <button type="submit" style={{ flex: 1, background: '#2563eb', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>{t.saveButton}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
