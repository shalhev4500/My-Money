import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const TRANSLATIONS = {
  en: {
    appName: 'My Money',
    tagline: 'Private Wealth & Household Finance',
    dashboard: 'Overview',
    transactions: 'Transactions',
    budgets: 'Budgets & Goals',
    tools: 'Tools & Analytics',
    netBalance: 'Net Monthly Balance',
    income: 'Income',
    expenses: 'Expenses',
    safeSpend: 'Daily Safe-to-Spend',
    daysLeft: 'days left',
    savingsGoal: 'Savings Goal',
    targetDate: 'Estimated Target Date',
    noTarget: 'Save consistently to calculate target date',
    goalReached: 'Goal Reached! 🎉',
    categoryBreakdown: 'Expense Breakdown by Category',
    searchPlaceholder: 'Quick search...',
    noTransactions: 'No transactions recorded for this month.',
    recurringBadge: 'Recurring 🔄',
    newTransaction: 'New Transaction',
    expenseType: 'Expense 📉',
    incomeType: 'Income 📈',
    titleLabel: 'Description',
    titlePlaceholder: 'e.g. Supermarket, Fuel...',
    amountLabel: 'Amount (₪)',
    categoryLabel: 'Category',
    recurringCheckbox: 'Recurring subscription / Fixed expense',
    saveButton: 'Save Transaction',
    exportCSV: 'Export Backup (CSV) 📊',
    subscriptionRadar: 'Subscription Radar',
    yearlyTotal: 'Total yearly commitment:',
    systemSettings: 'System Settings',
    themeToggle: 'Appearance Mode',
    darkMode: 'Dark Mode 🌙',
    lightMode: 'Light Mode ☀️',
    language: 'Language 🌐'
  },
  he: {
    appName: 'My Money',
    tagline: 'ניהול הון אישי וכלכלת בית',
    dashboard: 'סקירה כללית',
    transactions: 'תנועות',
    budgets: 'יעדים ותקציב',
    tools: 'כלים וניתוחים',
    netBalance: 'מאזן חודשי נקי',
    income: 'הכנסות',
    expenses: 'הוצאות',
    safeSpend: 'תקציב יומי מומלץ',
    daysLeft: 'ימים שנותרו',
    savingsGoal: 'יעד חיסכון',
    targetDate: 'תאריך הגעה משוער ליעד',
    noTarget: 'חסוך בעקביות כדי לחשב תאריך יעד',
    goalReached: 'היעד הושג בהצלחה! 🎉',
    categoryBreakdown: 'פילוח הוצאות לפי קטגוריות',
    searchPlaceholder: 'חיפוש מהיר...',
    noTransactions: 'אין תנועות להצגה בחודש זה.',
    recurringBadge: 'קבוע 🔄',
    newTransaction: 'הוספת תנועה חדשה',
    expenseType: 'הוצאה 📉',
    incomeType: 'הכנסה 📈',
    titleLabel: 'תיאור',
    titlePlaceholder: 'למשל: סופרמרקט, דלק...',
    amountLabel: 'סכום (₪)',
    categoryLabel: 'קטגוריה',
    recurringCheckbox: 'הוצאה קבועה / מנוי חודשי ברדאר',
    saveButton: 'שמור תנועה',
    exportCSV: 'הורד קובץ גיבוי (CSV) 📊',
    subscriptionRadar: 'רדאר מנויים והוצאות קבועות',
    yearlyTotal: 'עלות שנתית מצטברת:',
    systemSettings: 'הגדרות מערכת',
    themeToggle: 'מצב תצוגה',
    darkMode: 'מצב לילה 🌙',
    lightMode: 'מצב יום ☀️',
    language: 'שפה 🌐'
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

export default function App() {
  const [lang, setLang] = useState('he')
  const [theme, setTheme] = useState(() => localStorage.getItem('mymoney_theme') || 'dark')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [transactions, setTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('מזון וסופר')
  const [isRecurring, setIsRecurring] = useState(false)

  const [savingsGoalAmount, setSavingsGoalAmount] = useState(() => Number(localStorage.getItem('mymoney_savings_amount')) || 50000)
  const [savingsGoalName, setSavingsGoalName] = useState(() => localStorage.getItem('mymoney_savings_name') || 'חופשה / רכב / הגדלת הון ✈️')
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState(() => Number(localStorage.getItem('mymoney_monthly_budget')) || 9000)
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('mymoney_categories')
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
  })

  const getCurrentMonthString = () => new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString())

  useEffect(() => { localStorage.setItem('mymoney_theme', theme) }, [theme])
  useEffect(() => { localStorage.setItem('mymoney_savings_amount', savingsGoalAmount) }, [savingsGoalAmount])
  useEffect(() => { localStorage.setItem('mymoney_savings_name', savingsGoalName) }, [savingsGoalName])
  useEffect(() => { localStorage.setItem('mymoney_monthly_budget', monthlyBudgetLimit) }, [monthlyBudgetLimit])
  useEffect(() => { localStorage.setItem('mymoney_categories', JSON.stringify(categories)) }, [categories])

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
        is_recurring: type === 'expense' ? isRecurring : false
      }])
      .select()

    if (error) {
      alert('Error: ' + error.message)
    } else if (data) {
      setTransactions([data[0], ...transactions])
      setTitle('')
      setAmount('')
      setIsRecurring(false)
      setIsModalOpen(false)
    }
  }

  async function deleteTransaction(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) {
      setTransactions(transactions.filter(item => item.id !== id))
    }
  }

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en
  const isRTL = lang === 'he' || lang === 'ar'

  const monthTransactions = transactions.filter(tr => {
    const tDate = tr.created_at ? tr.created_at.slice(0, 7) : getCurrentMonthString()
    return tDate === selectedMonth
  })

  const totalIncome = monthTransactions.filter(tr => Number(tr.amount) > 0).reduce((sum, tr) => sum + Number(tr.amount), 0)
  const totalExpense = monthTransactions.filter(tr => Number(tr.amount) < 0).reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
  const netBalance = totalIncome - totalExpense

  let targetDateString = ''
  if (netBalance > 0) {
    const remainingToSave = Math.max(savingsGoalAmount - netBalance, 0)
    const monthsNeeded = Math.ceil(remainingToSave / netBalance)
    if (monthsNeeded <= 0) {
      targetDateString = t.goalReached
    } else {
      const futureDate = new Date()
      futureDate.setMonth(futureDate.getMonth() + monthsNeeded)
      targetDateString = futureDate.toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US', { month: 'long', year: 'numeric' })
    }
  } else {
    targetDateString = t.noTarget
  }

  const daysInMonth = new Date(selectedMonth.slice(0, 4), selectedMonth.slice(5, 7), 0).getDate()
  const currentDay = new Date().getDate()
  const daysRemaining = Math.max(daysInMonth - currentDay + 1, 1)
  const remainingBudgetMoney = Math.max(monthlyBudgetLimit - totalExpense, 0)
  const dailySafeSpend = Math.round(remainingBudgetMoney / daysRemaining)

  const recurringExpenses = monthTransactions.filter(tr => tr.is_recurring && Number(tr.amount) < 0)
  const totalRecurringMonthly = recurringExpenses.reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
  const totalRecurringYearly = totalRecurringMonthly * 12

  const expensesByCategory = Object.keys(categories).map(catName => {
    const total = monthTransactions
      .filter(tr => tr.category === catName && Number(tr.amount) < 0)
      .reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
    return { name: catName, total, ...categories[catName] }
  }).filter(cat => cat.total > 0)

  // יצירת גרף עוגה מבוסס SVG חכם ונקי
  let cumulativePercent = 0
  const svgSlices = expensesByCategory.map((cat, index) => {
    const percentage = totalExpense > 0 ? (cat.total / totalExpense) * 100 : 0
    const startAngle = (cumulativePercent / 100) * 360
    cumulativePercent += percentage
    const endAngle = (cumulativePercent / 100) * 360

    const x1 = 50 + 40 * Math.cos((Math.PI * (startAngle - 90)) / 180)
    const y1 = 50 + 40 * Math.sin((Math.PI * (startAngle - 90)) / 180)
    const x2 = 50 + 40 * Math.cos((Math.PI * (endAngle - 90)) / 180)
    const y2 = 50 + 40 * Math.sin((Math.PI * (endAngle - 90)) / 180)
    const largeArcFlag = percentage > 50 ? 1 : 0
    const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

    return <path key={index} d={pathData} fill={cat.color} stroke={theme === 'dark' ? '#1e293b' : '#ffffff'} strokeWidth="1.5" />
  })

  function exportToCSV() {
    const headers = "ID,Title,Amount,Category,Date,Recurring\n"
    const rows = transactions.map(tr => `${tr.id},"${tr.title}",${tr.amount},"${tr.category || ''}",${tr.created_at || ''},${tr.is_recurring || false}`).join("\n")
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `mymoney_export_${selectedMonth}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredTransactions = monthTransactions.filter(tr => tr.title.toLowerCase().includes(searchTerm.toLowerCase()) || (tr.category && tr.category.includes(searchTerm)))

  // עיצוב לפי מצב לילה / יום
  const bgApp = theme === 'dark' ? '#0b0f19' : '#f8fafc'
  const cardBg = theme === 'dark' ? '#131c31' : '#ffffff'
  const textMain = theme === 'dark' ? '#f1f5f9' : '#0f172a'
  const textMuted = theme === 'dark' ? '#94a3b8' : '#64748b'
  const borderColor = theme === 'dark' ? '#1e293b' : '#e2e8f0'
  const inputBg = theme === 'dark' ? '#090d16' : '#f1f5f9'

  return (
    <div style={{ maxWidth: '480px', margin: '15px auto', minHeight: '94vh', padding: '16px 16px 100px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left', background: bgApp, color: textMain, borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: `1px solid ${borderColor}`, position: 'relative', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${borderColor}` }}>
        <div>
          <h1 style={{ color: textMain, margin: '0 0 2px 0', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>{t.appName} 💼</h1>
          <span style={{ color: textMuted, fontSize: '11px', fontWeight: '500' }}>{t.tagline}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {/* כפתור החלפת תאורת לילה / יום */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ padding: '6px 10px', borderRadius: '10px', border: `1px solid ${borderColor}`, fontSize: '12px', background: cardBg, color: textMain, cursor: 'pointer', fontWeight: 'bold' }}
            title={theme === 'dark' ? 'עבור למצב יום' : 'עבור למצב לילה'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: '10px', border: `1px solid ${borderColor}`, fontSize: '11px', fontWeight: 'bold', background: cardBg, color: textMain, outline: 'none' }}
          />
        </div>
      </header>

      {/* 1. Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, padding: '20px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <span style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px', fontWeight: '600' }}>{t.netBalance}</span>
            <span style={{ fontSize: '30px', fontWeight: '900', color: netBalance >= 0 ? '#10b981' : '#ef4444', letterSpacing: '-1px' }}>
              ₪{netBalance.toLocaleString()}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px', paddingTop: '14px', borderTop: `1px solid ${borderColor}` }}>
              <div>
                <span style={{ fontSize: '11px', color: textMuted, display: 'block' }}>{t.income}</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#10b981' }}>+₪{totalIncome.toLocaleString()}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: textMuted, display: 'block' }}>{t.expenses}</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#ef4444' }}>-₪{totalExpense.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>💡 {t.safeSpend}</span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: textMain }}>₪{dailySafeSpend.toLocaleString()} <span style={{ fontSize: '11px', color: textMuted, fontWeight: 'normal' }}>/ ליום</span></span>
            </div>
            <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
              <span style={{ fontSize: '10px', color: textMuted, display: 'block' }}>{t.daysLeft}</span>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: textMain }}>{daysRemaining} ימים</span>
            </div>
          </div>

          {/* גרף עוגה ופילוח הוצאות */}
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, padding: '16px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '13px', margin: '0 0 12px 0', color: textMain, fontWeight: '700' }}>{t.categoryBreakdown}</h3>
            {expensesByCategory.length === 0 ? (
              <p style={{ textAlign: 'center', color: textMuted, fontSize: '11px', padding: '15px' }}>אין הוצאות רשומות לחודש זה</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '110px', height: '110px', flexShrink: '0' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    {svgSlices}
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, fontSize: '11px' }}>
                  {expensesByCategory.map(cat => (
                    <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }}></span>
                        <span style={{ color: textMuted }}>{cat.name}</span>
                      </span>
                      <strong style={{ color: textMain }}>₪{cat.total}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input 
            type="text" 
            placeholder={t.searchPlaceholder} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '14px', border: `1px solid ${borderColor}`, background: inputBg, color: textMain, outline: 'none', fontSize: '12px', boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
            {filteredTransactions.length === 0 ? (
              <p style={{ textAlign: 'center', color: textMuted, fontSize: '12px', padding: '30px' }}>{t.noTransactions}</p>
            ) : (
              filteredTransactions.map(tr => (
                <div key={tr.id} style={{ background: cardBg, padding: '12px 14px', borderRadius: '16px', border: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: textMain }}>{tr.title}</span>
                    <span style={{ fontSize: '10px', color: textMuted }}>{tr.category} {tr.is_recurring && `• ${t.recurringBadge}`}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: '800', fontSize: '14px', color: Number(tr.amount) > 0 ? '#10b981' : '#ef4444' }}>
                      {Number(tr.amount) > 0 ? `+₪${tr.amount}` : `-₪{Math.abs(tr.amount)}`}
                    </span>
                    <button onClick={() => deleteTransaction(tr.id)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '14px' }}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Budgets Tab */}
      {activeTab === 'budgets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: cardBg, padding: '16px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: '13px', margin: '0 0 14px 0', color: textMain, fontWeight: '700' }}>מעקב תקציב קטגוריות</h3>
            {Object.keys(categories).map(catName => {
              const catData = categories[catName]
              const totalSpent = monthTransactions
                .filter(tr => tr.category === catName && Number(tr.amount) < 0)
                .reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
              const percent = Math.min(Math.round((totalSpent / catData.limit) * 100), 100)

              return (
                <div key={catName} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                    <span>{catData.icon} {catName}</span>
                    <span style={{ fontWeight: 'bold' }}>₪{totalSpent} / ₪{catData.limit}</span>
                  </div>
                  <div style={{ background: inputBg, height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: catData.color, width: `${percent}%`, height: '100%', transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tools Tab */}
      {activeTab === 'tools' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: cardBg, padding: '16px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: '13px', margin: '0 0 10px 0', color: textMain, fontWeight: '700' }}>{t.subscriptionRadar}</h3>
            <p style={{ fontSize: '11px', color: textMuted, marginBottom: '12px' }}>{t.yearlyTotal} <strong style={{ color: textMain }}>₪{totalRecurringYearly.toLocaleString()}</strong></p>
            <button onClick={exportToCSV} style={{ width: '100%', background: '#10b981', color: '#fff', border: 'none', padding: '10px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
              {t.exportCSV}
            </button>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation with Floating Action Button (FAB) in Center */}
      <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: cardBg, borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0 16px 0', boxSizing: 'border-box', zIndex: 1000 }}>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'dashboard' ? '#3b82f6' : textMuted, fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flex: 1 }}
        >
          <span style={{ fontSize: '18px' }}>📊</span>
          <span>{t.dashboard}</span>
        </button>

        <button 
          onClick={() => setActiveTab('transactions')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'transactions' ? '#3b82f6' : textMuted, fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flex: 1 }}
        >
          <span style={{ fontSize: '18px' }}>💳</span>
          <span>{t.transactions}</span>
        </button>

        {/* Floating Plus Button (FAB) */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ position: 'absolute', top: '-22px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#ffffff', border: 'none', width: '50px', height: '50px', borderRadius: '50%', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
            title={t.newTransaction}
          >
            +
          </button>
        </div>

        <button 
          onClick={() => setActiveTab('budgets')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'budgets' ? '#3b82f6' : textMuted, fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flex: 1 }}
        >
          <span style={{ fontSize: '18px' }}>🎯</span>
          <span>{t.budgets}</span>
        </button>

        <button 
          onClick={() => setActiveTab('tools')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'tools' ? '#3b82f6' : textMuted, fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flex: 1 }}
        >
          <span style={{ fontSize: '18px' }}>🛠️</span>
          <span>{t.tools}</span>
        </button>
      </nav>

      {/* New Transaction Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ background: cardBg, padding: '22px', borderRadius: '24px', width: '90%', maxWidth: '360px', border: `1px solid ${borderColor}`, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: textMain, fontWeight: '800' }}>{t.newTransaction}</h3>
            <form onSubmit={addTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setType('expense')} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: type === 'expense' ? '#ef4444' : inputBg, color: type === 'expense' ? '#fff' : textMain, fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>{t.expenseType}</button>
                <button type="button" onClick={() => setType('income')} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: type === 'income' ? '#10b981' : inputBg, color: type === 'income' ? '#fff' : textMain, fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>{t.incomeType}</button>
              </div>
              <input type="text" placeholder={t.titlePlaceholder} value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: inputBg, color: textMain, outline: 'none', fontSize: '12px' }} />
              <input type="number" placeholder={t.amountLabel} value={amount} onChange={(e) => setAmount(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: inputBg, color: textMain, outline: 'none', fontSize: '12px' }} />
              
              {type === 'expense' && (
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: inputBg, color: textMain, outline: 'none', fontSize: '12px' }}>
                  {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: textMuted }}>
                <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} id="recCheck" />
                <label htmlFor="recCheck" style={{ cursor: 'pointer' }}>{t.recurringCheckbox}</label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>{t.saveButton}</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'transparent', color: textMuted, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>ביטול</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
