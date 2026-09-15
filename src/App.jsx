import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const INITIAL_CATEGORIES = {
  'מזון וסופר': { icon: '🛒', color: '#10b981', limit: 2500 },
  'שכירות ודיור': { icon: '🏠', color: '#3b82f6', limit: 4000 },
  'תחבורה ודלק': { icon: '⛽', color: '#f59e0b', limit: 1200 },
  'בילויים ופנאי': { icon: '🎉', color: '#ec4899', limit: 1000 },
  'חשבונות וארנונה': { icon: '💡', color: '#8b5cf6', limit: 900 },
  'שונות': { icon: '📦', color: '#64748b', limit: 500 }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'transactions' | 'budgets' | 'tools'
  const [transactions, setTransactions] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('מזון וסופר')
  const [isRecurring, setIsRecurring] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // שמירה וטעינה של הגדרות מתקדמות מה-localStorage
  const [savingsGoalAmount, setSavingsGoalAmount] = useState(() => {
    return Number(localStorage.getItem('mymoney_savings_amount')) || 50000
  })
  const [savingsGoalName, setSavingsGoalName] = useState(() => {
    return localStorage.getItem('mymoney_savings_name') || 'חופשת חלום ביעד אקזוטי ✈️'
  })
  const [hourlyWage, setHourlyWage] = useState(() => {
    return Number(localStorage.getItem('mymoney_hourly_wage')) || 60
  })
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState(() => {
    return Number(localStorage.getItem('mymoney_monthly_budget')) || 9000
  })
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('mymoney_categories')
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
  })

  const getCurrentMonthString = () => new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString())

  useEffect(() => {
    localStorage.setItem('mymoney_savings_amount', savingsGoalAmount)
  }, [savingsGoalAmount])

  useEffect(() => {
    localStorage.setItem('mymoney_savings_name', savingsGoalName)
  }, [savingsGoalName])

  useEffect(() => {
    localStorage.setItem('mymoney_hourly_wage', hourlyWage)
  }, [hourlyWage])

  useEffect(() => {
    localStorage.setItem('mymoney_monthly_budget', monthlyBudgetLimit)
  }, [monthlyBudgetLimit])

  useEffect(() => {
    localStorage.setItem('mymoney_categories', JSON.stringify(categories))
  }, [categories])

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
        category: type === 'expense' ? category : 'הכנסה',
        is_recurring: type === 'expense' ? isRecurring : false
      }])
      .select()

    if (error) {
      alert('שגיאה בשמירה: ' + error.message)
    } else if (data) {
      setTransactions([data[0], ...transactions])
      setTitle('')
      setAmount('')
      setIsRecurring(false)
    }
  }

  async function deleteTransaction(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) {
      setTransactions(transactions.filter(item => item.id !== id))
    }
  }

  const monthTransactions = transactions.filter(t => {
    const tDate = t.created_at ? t.created_at.slice(0, 7) : getCurrentMonthString()
    return tDate === selectedMonth
  })

  const totalIncome = monthTransactions.filter(t => Number(t.amount) > 0).reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpense = monthTransactions.filter(t => Number(t.amount) < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
  const netBalance = totalIncome - totalExpense

  const budgetPercentage = Math.min(Math.round((totalExpense / monthlyBudgetLimit) * 100), 100)
  let budgetColor = '#10b981' 
  if (budgetPercentage > 75) budgetColor = '#f59e0b' 
  if (budgetPercentage >= 100) budgetColor = '#ef4444' 

  // מנועי חישוב חכמים
  const recurringExpenses = monthTransactions.filter(t => t.is_recurring && Number(t.amount) < 0)
  const totalRecurringMonthly = recurringExpenses.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
  const totalRecurringYearly = totalRecurringMonthly * 12

  function getSmartAdvisorMessage() {
    if (totalExpense === 0 && totalIncome === 0) return 'ברוך הבא ל-My Money! התחל להזין תנועות כדי לאפשר למערכת לנתח את ההון שלך.'
    if (budgetPercentage >= 100) return '🚨 חריגה חמורה ממסגרת התקציב! נדרשת עצירה של הוצאות לא הכרחיות החודש.'
    if (budgetPercentage > 75) return '⚠️ שים לב: ניצלת מעל 75% מהתקציב הכללי. תכנן את ההוצאות שלך בזהירות.'
    if (netBalance > 0) return '🌟 כל הכבוד! אתה מייצר תזרים מזומנים חיובי שמקרב אותך ישירות ליעד החיסכון שלך.'
    return '💡 טיפ פיננסי: בדוק את רדאר המנויים וההוצאות הקבועות שלך כדי לאתר מקומות לקצץ.'
  }

  const expensesByCategory = Object.keys(categories).map(cat => {
    const total = monthTransactions
      .filter(t => t.category === cat && Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
    return { name: cat, total, ...categories[cat] }
  })

  function updateCategoryLimit(catName, newLimit) {
    setCategories(prev => ({
      ...prev,
      [catName]: { ...prev[catName], limit: Number(newLimit) || 0 }
    }))
  }

  const filteredTransactions = monthTransactions.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || (t.category && t.category.includes(searchTerm)))

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '32px', fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl', textAlign: 'right', background: '#0f172a', color: '#f8fafc', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', border: '1px solid #1e293b' }}>
      
      {/* כותרת ראשית ובורר חודשים */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#f8fafc', margin: '0 0 4px 0', fontSize: '28px', letterSpacing: '-0.5px' }}>My Money 💎</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px' }}>מערכת ניהול הון חכמה, שליטה בתקציב ומעקב יעדים אישיים</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #334155', fontSize: '13px', fontWeight: 'bold', background: '#1e293b', color: 'white', outline: 'none' }}
          />
        </div>
      </header>

      {/* פאנל לשוניות ניווט ראשי (Tabs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px', background: '#1e293b', padding: '6px', borderRadius: '14px', border: '1px solid #334155' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{ padding: '10px', borderRadius: '10px', border: 'none', background: activeTab === 'dashboard' ? '#3b82f6' : 'transparent', color: activeTab === 'dashboard' ? 'white' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' }}
        >
          📊 סקירה וגרפים
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          style={{ padding: '10px', borderRadius: '10px', border: 'none', background: activeTab === 'transactions' ? '#3b82f6' : 'transparent', color: activeTab === 'transactions' ? 'white' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' }}
        >
          💳 ניהול תנועות
        </button>
        <button
          onClick={() => setActiveTab('budgets')}
          style={{ padding: '10px', borderRadius: '10px', border: 'none', background: activeTab === 'budgets' ? '#3b82f6' : 'transparent', color: activeTab === 'budgets' ? 'white' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' }}
        >
          🎯 יעדים ותקציבים
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          style={{ padding: '10px', borderRadius: '10px', border: 'none', background: activeTab === 'tools' ? '#3b82f6' : 'transparent', color: activeTab === 'tools' ? 'white' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' }}
        >
          ⚡ כלים מתקדמים
        </button>
      </div>

      {/* ================= 1. סקירה וגרפים (Dashboard) ================= */}
      {activeTab === 'dashboard' && (
        <div>
          {/* יועץ פיננסי חכם */}
          <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #3b82f6', padding: '16px 20px', borderRadius: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '28px', background: '#1e293b', padding: '8px', borderRadius: '12px', border: '1px solid #334155' }}>🤖</span>
            <div>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#60a5fa', marginBottom: '3px' }}>אנליזה חכמה לחודש {selectedMonth}:</span>
              <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>{getSmartAdvisorMessage()}</p>
            </div>
          </div>

          {/* כרטיסי סיכום */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: '#1e293b', padding: '18px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>הכנסות בחודש</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#10b981' }}>₪{totalIncome.toLocaleString()}</span>
            </div>
            <div style={{ background: '#1e293b', padding: '18px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>הוצאות בחודש</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#ef4444' }}>₪{totalExpense.toLocaleString()}</span>
            </div>
            <div style={{ background: '#1e293b', padding: '18px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>מאזן נקי</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: netBalance >= 0 ? '#3b82f6' : '#f59e0b' }}>₪{netBalance.toLocaleString()}</span>
            </div>
          </div>

          {/* ייצוג ויזואלי של יעד החיסכון האישי */}
          <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)', padding: '20px', borderRadius: '16px', marginBottom: '20px', color: 'white', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '15px' }}>🎯 יעד חיסכון אישי: {savingsGoalName}</span>
              <span style={{ fontSize: '14px', fontWeight: '800' }}>₪{savingsGoalAmount.toLocaleString()}</span>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#e0f2fe' }}>
              💡 ניתן לעדכן את שם היעד והסכום בכל רגע בלשונית <b>"יעדים ותקציבים"</b>.
            </p>
          </div>

          {/* מד תקציב כללי */}
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#f8fafc' }}>📊 מסגרת תקציב כללית (₪{monthlyBudgetLimit.toLocaleString()})</span>
            </div>
            <div style={{ background: '#0f172a', borderRadius: '10px', height: '12px', width: '100%', overflow: 'hidden', marginBottom: '10px', border: '1px solid #334155' }}>
              <div style={{ background: budgetColor, width: `${budgetPercentage}%`, height: '100%', transition: 'width 0.5s ease' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
              <span>נוצלו: ₪{totalExpense.toLocaleString()} ({budgetPercentage}%)</span>
              <span>נותר במסגרת: ₪{Math.max(monthlyBudgetLimit - totalExpense, 0).toLocaleString()}</span>
            </div>
          </div>

          {/* פילוח הוצאות חזותי לפי קטגוריות */}
          <div style={{ background: '#1e293b', padding: '22px', borderRadius: '16px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: '0 0 16px 0' }}>📈 פילוח התפלגות הוצאות מול יעדים אישיים:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {expensesByCategory.map(cat => {
                const catPercentage = cat.limit > 0 ? Math.min(Math.round((cat.total / cat.limit) * 100), 100) : 0
                const shareOfTotal = totalExpense > 0 ? Math.round((cat.total / totalExpense) * 100) : 0
                return (
                  <div key={cat.name} style={{ background: '#0f172a', padding: '14px 16px', borderRadius: '12px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>
                        {cat.icon} {cat.name} <span style={{ fontSize: '11px', color: '#94a3b8', marginRight: '6px' }}>({shareOfTotal}% מההוצאות)</span>
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: cat.total > 0 ? '#ef4444' : '#94a3b8' }}>
                        ₪{cat.total.toLocaleString()} <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'normal' }}>/ יעד ₪{cat.limit.toLocaleString()}</span>
                      </span>
                    </div>
                    <div style={{ background: '#1e293b', borderRadius: '6px', height: '8px', width: '100%', overflow: 'hidden' }}>
                      <div style={{ background: cat.color, width: `${catPercentage}%`, height: '100%', transition: 'width 0.4s ease' }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. ניהול תנועות (Transactions) ================= */}
      {activeTab === 'transactions' && (
        <div>
          {/* טופס הוספה */}
          <form onSubmit={addTransaction} style={{ background: '#1e293b', padding: '22px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: '0 0 16px 0' }}>➕ הוספת תנועה חדשה</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setType('expense')}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: type === 'expense' ? '#ef4444' : '#0f172a', color: type === 'expense' ? 'white' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer' }}
              >
                הוצאה 📉
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: type === 'income' ? '#10b981' : '#0f172a', color: type === 'income' ? 'white' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer' }}
              >
                הכנסה 📈
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: type === 'expense' ? '1fr 1fr' : '1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>תיאור:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={type === 'expense' ? 'למשל: סופרמרקט, דלק...' : 'למשל: משכורת, פרילנס...'}
                  style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '10px', border: '1px solid #334155', fontSize: '13px', background: '#0f172a', color: 'white', outline: 'none' }}
                />
              </div>

              {type === 'expense' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>קטגוריה:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '10px', border: '1px solid #334155', fontSize: '13px', background: '#0f172a', color: 'white', outline: 'none' }}
                  >
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{categories[cat].icon} {cat}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>סכום (₪):</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '10px', border: '1px solid #334155', fontSize: '13px', background: '#0f172a', color: 'white', outline: 'none' }}
              />
            </div>

            {type === 'expense' && (
              <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  id="recurringCheck"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#3b82f6' }}
                />
                <label htmlFor="recurringCheck" style={{ fontSize: '13px', color: '#cbd5e1', cursor: 'pointer' }}>
                  🔄 זוהי הוצאה קבועה / מנוי חודשי (נכנס לרדאר המנויים)
                </label>
              </div>
            )}

            <button type="submit" style={{ width: '100%', background: type === 'expense' ? '#ef4444' : '#10b981', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
              {type === 'expense' ? 'הוסף הוצאה למערכת' : 'הוסף הכנסה למערכת'}
            </button>
          </form>

          {/* רשימה וחיפוש */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: 0 }}>התנועות בחודש {selectedMonth}:</h3>
            <input 
              type="text" 
              placeholder="🔍 חיפוש..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #334155', fontSize: '12px', width: '200px', background: '#1e293b', color: 'white', outline: 'none' }}
            />
          </div>

          {filteredTransactions.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '40px', background: '#1e293b', borderRadius: '16px', border: '1px solid #334155' }}>אין תנועות בחודש הנבחר. הוסף תנועה חדשה! 🚀</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredTransactions.map((item) => {
                const isIncome = Number(item.amount) > 0
                const catInfo = categories[item.category] || { icon: '📦', color: '#64748b' }
                const costInHours = !isIncome && hourlyWage > 0 ? (Math.abs(Number(item.amount)) / hourlyWage).toFixed(1) : null

                return (
                  <li key={item.id} style={{ background: '#1e293b', border: '1px solid #334155', padding: '14px 18px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '22px', background: '#0f172a', padding: '8px', borderRadius: '12px', border: '1px solid #334155' }}>{isIncome ? '💰' : catInfo.icon}</span>
                      <div>
                        <span style={{ fontWeight: '600', color: '#f8fafc', display: 'block', fontSize: '14px' }}>
                          {item.title} {item.is_recurring && <span style={{ fontSize: '11px', background: '#1e3a8a', color: '#60a5fa', padding: '2px 8px', borderRadius: '6px', marginRight: '8px', border: '1px solid #3b82f6' }}>קבוע 🔄</span>}
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          {item.category || 'כללי'} {costInHours && `• ⏳ עלה לך כ-${costInHours} שעות עבודה`}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '16px', color: isIncome ? '#10b981' : '#ef4444' }}>
                        {isIncome ? `+₪${Number(item.amount).toLocaleString()}` : `₪${Number(item.amount).toLocaleString()}`}
                      </span>
                      <button 
                        onClick={() => deleteTransaction(item.id)}
                        style={{ background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', cursor: 'pointer', fontSize: '14px', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="מחק"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {/* ================= 3. יעדים ותקציבים (Budgets & Goals) ================= */}
      {activeTab === 'budgets' && (
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
          <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: '0 0 8px 0' }}>🎯 ניהול יעדי חיסכון ומסגרות תקציב אישיות</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 20px 0' }}>הגדר את המטרה המדויקת שאליה אתה חוסך ואת התקציב לכל קטגוריה.</p>

          {/* הגדרת יעד חיסכון עם שם */}
          <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', color: '#60a5fa', margin: '0 0 12px 0' }}>✨ הגדרת מטרה לחיסכון:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '6px' }}>מה המטרה?</label>
                <input 
                  type="text" 
                  value={savingsGoalName} 
                  onChange={(e) => setSavingsGoalName(e.target.value)} 
                  placeholder="למשל: טיול לחו״ל, אוטו חדש..."
                  style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: 'white', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '6px' }}>סכום היעד (₪):</label>
                <input 
                  type="number" 
                  value={savingsGoalAmount} 
                  onChange={(e) => setSavingsGoalAmount(Number(e.target.value))} 
                  style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: 'white', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* מסגרת כללית ושכר שעתי */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '6px' }}>מסגרת תקציב כללית חודשית (₪):</label>
              <input 
                type="number" 
                value={monthlyBudgetLimit} 
                onChange={(e) => setMonthlyBudgetLimit(Number(e.target.value))} 
                style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: 'white', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '6px' }}>שכר שעתי משוער (לחישוב שעות עבודה):</label>
              <input 
                type="number" 
                value={hourlyWage} 
                onChange={(e) => setHourlyWage(Number(e.target.value))} 
                style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: 'white', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          </div>

          <h4 style={{ fontSize: '14px', color: '#f8fafc', margin: '0 0 12px 0' }}>יעדי הוצאה לפי קטגוריה:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.keys(categories).map(catName => {
              const cat = categories[catName]
              return (
                <div key={catName} style={{ background: '#0f172a', padding: '12px 16px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc' }}>
                    {cat.icon} {catName}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>יעד חודשי (₪):</span>
                    <input
                      type="number"
                      value={cat.limit}
                      onChange={(e) => updateCategoryLimit(catName, e.target.value)}
                      style={{ width: '100px', padding: '6px 10px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: 'white', fontWeight: 'bold', textAlign: 'center', outline: 'none' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ================= 4. כלים מתקדמים (Tools & Insights) ================= */}
      {activeTab === 'tools' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* רדאר מנויים רדומים */}
          <div style={{ background: '#1e293b', padding: '22px', borderRadius: '16px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: '0 0 8px 0' }}>📡 רדאר מנויים והוצאות קבועות</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px 0' }}>מציג את כל ההוצאות שסימנת כ"קבועות / הוראת קבע" החודש, וכמה הן עולות לך בשנה.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div style={{ background: '#0f172a', padding: '14px', borderRadius: '12px', border: '1px solid #334155', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>סך מנויים בחודש</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>₪{totalRecurringMonthly.toLocaleString()}</span>
              </div>
              <div style={{ background: '#0f172a', padding: '14px', borderRadius: '12px', border: '1px solid #334155', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>עלות שנתית מצטברת</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>₪{totalRecurringYearly.toLocaleString()}</span>
              </div>
            </div>

            {recurringExpenses.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', margin: 0 }}>אין מנויים או הוצאות קבועות רשומות בחודש זה. סמן תנועות כ"קבוע 🔄" בלשונית התנועות כדי לראות אותן כאן.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recurringExpenses.map(item => (
                  <li key={item.id} style={{ background: '#0f172a', padding: '10px 14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: '#f8fafc', fontWeight: '500' }}>{item.title}</span>
                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>₪{Math.abs(Number(item.amount)).toLocaleString()} / חודש</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* מחשבון שעות עבודה פסיכולוגי */}
          <div style={{ background: '#1e293b', padding: '22px', borderRadius: '16px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: '0 0 8px 0' }}>⏳ מחשבון פרספקטיבה (שעות עבודה)</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 14px 0' }}>
              לפי שכר של <b>₪{hourlyWage} לשעה</b> שהגדרת, כל הוצאה מתורגמת מיד לזמן החיים שלך שנדרש כדי לשלם עליה. ככה מקבלים החלטות צרכניות חכמות באמת!
            </p>
          </div>

        </div>
      )}

    </div>
  )
}
